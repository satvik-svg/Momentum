// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Contest
 * @dev Individual contest contract for binary prediction markets
 * 
 * Key Features:
 * - 24-hour duration contests
 * - $1 minimum stake requirement  
 * - 2% platform fee on total pool
 * - Proportional prize distribution to winners
 * - Winner determined by which option has more total stakes
 * 
 * Flow:
 * 1. Users stake USDC on Option A or B during contest period
 * 2. After endTime, anyone can call resolve() to determine winner
 * 3. Winners call claim() to receive: original stake + proportional share of losing pool
 */
contract Contest is ReentrancyGuard {
    // ===== IMMUTABLE VARIABLES =====
    IERC20 public immutable stakingToken;  // USDC token address
    uint256 public immutable endTime;      // When contest ends (timestamp)
    address public immutable factory;      // Factory contract address
    
    // Contest details
    string public question;         // "Will ETH hit $3000 this week?"
    string public optionA_text;     // "Yes"  
    string public optionB_text;     // "No"
    
    // ===== STATE VARIABLES =====
    uint256 public totalStakedOnA;        // Total USDC staked on Option A
    uint256 public totalStakedOnB;        // Total USDC staked on Option B
    
    // User stakes tracking
    mapping(address => uint256) public stakesA;  // user => amount staked on A
    mapping(address => uint256) public stakesB;  // user => amount staked on B
    mapping(address => bool) public hasClaimed;  // user => has claimed winnings
    
    // Contest resolution
    bool public isResolved;     // Has contest been resolved?
    bool public winnerIsA;      // True if A wins, False if B wins
    
    // Platform fee (2%)
    uint256 public constant PLATFORM_FEE_PERCENT = 2;
    uint256 public constant MIN_STAKE = 1000000; // $1 in USDC (6 decimals)
    
    // ===== EVENTS =====
    event Staked(address indexed user, bool forOptionA, uint256 amount);
    event Resolved(bool winnerIsA, uint256 totalPool, uint256 platformFee);
    event Claimed(address indexed winner, uint256 amount);
    
    // ===== ERRORS =====
    error ContestEnded();
    error ContestNotEnded();
    error ContestAlreadyResolved();
    error ContestNotResolved();
    error MinimumStakeNotMet();
    error NoStakeOnWinningSide();
    error AlreadyClaimed();
    error TransferFailed();
    error InsufficientAllowance();
    
    constructor(
        address _stakingToken,
        uint256 _endTime,
        string memory _question,
        string memory _optionA,
        string memory _optionB,
        address _factory
    ) {
        stakingToken = IERC20(_stakingToken);
        endTime = _endTime;
        question = _question;
        optionA_text = _optionA;
        optionB_text = _optionB;
        factory = _factory;
    }
    
    /**
     * @dev Stake USDC on either Option A (true) or Option B (false)
     * @param _forA True to stake on Option A, false for Option B
     * @param _amount Amount of USDC to stake (must be >= $1)
     */
    function stake(bool _forA, uint256 _amount) external nonReentrant {
        if (block.timestamp >= endTime) revert ContestEnded();
        if (_amount < MIN_STAKE) revert MinimumStakeNotMet();
        
        // Check allowance and transfer tokens
        if (stakingToken.allowance(msg.sender, address(this)) < _amount) {
            revert InsufficientAllowance();
        }
        
        bool success = stakingToken.transferFrom(msg.sender, address(this), _amount);
        if (!success) revert TransferFailed();
        
        // Update stakes
        if (_forA) {
            stakesA[msg.sender] += _amount;
            totalStakedOnA += _amount;
        } else {
            stakesB[msg.sender] += _amount;
            totalStakedOnB += _amount;
        }
        
        emit Staked(msg.sender, _forA, _amount);
    }
    
    /**
     * @dev Resolve the contest by determining which option has more stakes
     * Can be called by anyone after endTime
     */
    function resolve() external {
        if (block.timestamp < endTime) revert ContestNotEnded();
        if (isResolved) revert ContestAlreadyResolved();
        
        isResolved = true;
        
        // Winner is determined by which option has more total stakes
        winnerIsA = totalStakedOnA >= totalStakedOnB;
        
        uint256 totalPool = totalStakedOnA + totalStakedOnB;
        uint256 platformFee = (totalPool * PLATFORM_FEE_PERCENT) / 100;
        
        // Transfer platform fee to factory
        if (platformFee > 0) {
            stakingToken.transfer(factory, platformFee);
        }
        
        emit Resolved(winnerIsA, totalPool, platformFee);
    }
    
    /**
     * @dev Claim winnings if you staked on the winning option
     * Winners get: original stake + proportional share of losing pool (after platform fee)
     */
    function claim() external nonReentrant {
        if (!isResolved) revert ContestNotResolved();
        if (hasClaimed[msg.sender]) revert AlreadyClaimed();
        
        uint256 userStake;
        uint256 totalWinningStakes;
        
        // Check if user is a winner and get their stake
        if (winnerIsA) {
            userStake = stakesA[msg.sender];
            totalWinningStakes = totalStakedOnA;
        } else {
            userStake = stakesB[msg.sender];
            totalWinningStakes = totalStakedOnB;
        }
        
        if (userStake == 0) revert NoStakeOnWinningSide();
        
        // Mark as claimed to prevent reentrancy
        hasClaimed[msg.sender] = true;
        
        // Calculate winnings
        uint256 winnings = calculateWinnings(msg.sender);
        
        // Transfer winnings
        bool success = stakingToken.transfer(msg.sender, winnings);
        if (!success) revert TransferFailed();
        
        emit Claimed(msg.sender, winnings);
    }
    
    /**
     * @dev Calculate total winnings for a user (original stake + share of losing pool)
     * @param user Address to calculate winnings for
     * @return Total amount user can claim
     */
    function calculateWinnings(address user) public view returns (uint256) {
        if (!isResolved) return 0;
        
        uint256 userStake;
        uint256 totalWinningStakes;
        uint256 totalLosingStakes;
        
        if (winnerIsA) {
            userStake = stakesA[user];
            totalWinningStakes = totalStakedOnA;
            totalLosingStakes = totalStakedOnB;
        } else {
            userStake = stakesB[user];
            totalWinningStakes = totalStakedOnB;
            totalLosingStakes = totalStakedOnA;
        }
        
        if (userStake == 0 || totalWinningStakes == 0) return 0;
        
        // Calculate platform fee on total pool
        uint256 totalPool = totalStakedOnA + totalStakedOnB;
        uint256 platformFee = (totalPool * PLATFORM_FEE_PERCENT) / 100;
        
        // Total pool after platform fee deduction
        uint256 totalPoolAfterFee = totalPool - platformFee;
        
        // User gets proportional share of the entire pool after fee
        uint256 userWinnings = (userStake * totalPoolAfterFee) / totalWinningStakes;
        
        return userWinnings;
    }
    
    /**
     * @dev Check if a user is a winner (staked on winning option)
     * @param user Address to check
     * @return True if user is a winner
     */
    function isWinner(address user) external view returns (bool) {
        if (!isResolved) return false;
        
        if (winnerIsA) {
            return stakesA[user] > 0;
        } else {
            return stakesB[user] > 0;
        }
    }
    
    /**
     * @dev Get contest status and basic info
     * @return _isActive Whether contest is still accepting stakes
     * @return _isResolved Whether contest has been resolved
     * @return _totalPool Total amount staked across both options
     * @return _timeRemaining Seconds until contest ends (0 if ended)
     */
    function getContestInfo() external view returns (
        bool _isActive,
        bool _isResolved,
        uint256 _totalPool,
        uint256 _timeRemaining
    ) {
        _isActive = block.timestamp < endTime;
        _isResolved = isResolved;
        _totalPool = totalStakedOnA + totalStakedOnB;
        _timeRemaining = block.timestamp >= endTime ? 0 : endTime - block.timestamp;
    }
    
    /**
     * @dev Get a user's total stakes across both options
     * @param user Address to check
     * @return stakeOnA Amount staked on Option A
     * @return stakeOnB Amount staked on Option B
     * @return totalStake Total amount staked by user
     */
    function getUserStakes(address user) external view returns (
        uint256 stakeOnA,
        uint256 stakeOnB,
        uint256 totalStake
    ) {
        stakeOnA = stakesA[user];
        stakeOnB = stakesB[user];
        totalStake = stakeOnA + stakeOnB;
    }
}