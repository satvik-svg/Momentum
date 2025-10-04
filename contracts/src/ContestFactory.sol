// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Contest.sol";

/**
 * @title ContestFactory
 * @dev Factory contract to create and manage multiple Contest instances
 * 
 * Features:
 * - Only admin can create contests
 * - Tracks all created contests
 * - Collects platform fees from resolved contests
 * - Provides view functions for frontend integration
 */
contract ContestFactory is Ownable {
    // ===== STATE VARIABLES =====
    IERC20 public immutable stakingToken;  // USDC token address
    address[] public allContests;          // Array of all contest addresses
    
    // Platform fee collection
    uint256 public collectedFees;          // Total fees collected
    
    // Contest settings
    uint256 public constant CONTEST_DURATION = 86400; // 24 hours in seconds
    
    // ===== EVENTS =====
    event ContestCreated(
        address indexed contestAddress,
        string question,
        string optionA,
        string optionB,
        uint256 endTime,
        uint256 contestIndex
    );
    
    event FeesWithdrawn(address indexed to, uint256 amount);
    
    // ===== ERRORS =====
    error EmptyQuestion();
    error EmptyOptions();
    error WithdrawFailed();
    
    constructor(address _stakingToken) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
    }
    
    /**
     * @dev Create a new contest (admin only)
     * @param _question The contest question
     * @param _optionA Text for Option A
     * @param _optionB Text for Option B
     * @return contestAddress Address of the newly created contest
     */
    function createContest(
        string memory _question,
        string memory _optionA,
        string memory _optionB
    ) external onlyOwner returns (address contestAddress) {
        // Validate inputs
        if (bytes(_question).length == 0) revert EmptyQuestion();
        if (bytes(_optionA).length == 0 || bytes(_optionB).length == 0) revert EmptyOptions();
        
        // Calculate end time (24 hours from now)
        uint256 endTime = block.timestamp + CONTEST_DURATION;
        
        // Deploy new contest
        Contest newContest = new Contest(
            address(stakingToken),
            endTime,
            _question,
            _optionA,
            _optionB,
            address(this)  // Factory receives platform fees
        );
        
        contestAddress = address(newContest);
        
        // Store contest address
        allContests.push(contestAddress);
        
        emit ContestCreated(
            contestAddress,
            _question,
            _optionA,
            _optionB,
            endTime,
            allContests.length - 1
        );
    }
    
    /**
     * @dev Get all contest addresses
     * @return Array of all contest addresses
     */
    function getAllContests() external view returns (address[] memory) {
        return allContests;
    }
    
    /**
     * @dev Get total number of contests created
     * @return Number of contests
     */
    function getContestCount() external view returns (uint256) {
        return allContests.length;
    }
    
    /**
     * @dev Get contest address by index
     * @param index Index of the contest
     * @return Contest address
     */
    function getContest(uint256 index) external view returns (address) {
        require(index < allContests.length, "Contest index out of bounds");
        return allContests[index];
    }
    
    /**
     * @dev Get multiple contest details for frontend display
     * @param startIndex Starting index
     * @param count Number of contests to fetch
     * @return contests Array of contest addresses
     * @return questions Array of contest questions  
     * @return endTimes Array of contest end times
     * @return isResolved Array of resolution status
     */
    function getContestBatch(uint256 startIndex, uint256 count) 
        external 
        view 
        returns (
            address[] memory contests,
            string[] memory questions,
            uint256[] memory endTimes,
            bool[] memory isResolved
        ) 
    {
        uint256 endIndex = startIndex + count;
        if (endIndex > allContests.length) {
            endIndex = allContests.length;
        }
        
        uint256 actualCount = endIndex - startIndex;
        
        contests = new address[](actualCount);
        questions = new string[](actualCount);
        endTimes = new uint256[](actualCount);
        isResolved = new bool[](actualCount);
        
        for (uint256 i = 0; i < actualCount; i++) {
            address contestAddr = allContests[startIndex + i];
            Contest contest = Contest(contestAddr);
            
            contests[i] = contestAddr;
            questions[i] = contest.question();
            endTimes[i] = contest.endTime();
            isResolved[i] = contest.isResolved();
        }
    }
    
    /**
     * @dev Get active contests (not yet ended)
     * @return activeContests Array of active contest addresses
     */
    function getActiveContests() external view returns (address[] memory activeContests) {
        // First pass: count active contests
        uint256 activeCount = 0;
        for (uint256 i = 0; i < allContests.length; i++) {
            Contest contest = Contest(allContests[i]);
            if (block.timestamp < contest.endTime()) {
                activeCount++;
            }
        }
        
        // Second pass: populate array
        activeContests = new address[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < allContests.length; i++) {
            Contest contest = Contest(allContests[i]);
            if (block.timestamp < contest.endTime()) {
                activeContests[currentIndex] = allContests[i];
                currentIndex++;
            }
        }
    }
    
    /**
     * @dev Get resolved contests
     * @return resolvedContests Array of resolved contest addresses
     */
    function getResolvedContests() external view returns (address[] memory resolvedContests) {
        // First pass: count resolved contests
        uint256 resolvedCount = 0;
        for (uint256 i = 0; i < allContests.length; i++) {
            Contest contest = Contest(allContests[i]);
            if (contest.isResolved()) {
                resolvedCount++;
            }
        }
        
        // Second pass: populate array
        resolvedContests = new address[](resolvedCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < allContests.length; i++) {
            Contest contest = Contest(allContests[i]);
            if (contest.isResolved()) {
                resolvedContests[currentIndex] = allContests[i];
                currentIndex++;
            }
        }
    }
    
    /**
     * @dev Withdraw collected platform fees (admin only)
     * @param to Address to send fees to
     */
    function withdrawFees(address to) external onlyOwner {
        uint256 balance = stakingToken.balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");
        
        bool success = stakingToken.transfer(to, balance);
        if (!success) revert WithdrawFailed();
        
        collectedFees += balance;
        
        emit FeesWithdrawn(to, balance);
    }
    
    /**
     * @dev Withdraw platform fees to owner (simplified version)
     * Essential function for fee collection
     */
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = stakingToken.balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");
        
        bool success = stakingToken.transfer(owner(), balance);
        if (!success) revert WithdrawFailed();
        
        collectedFees += balance;
        
        emit FeesWithdrawn(owner(), balance);
    }
    
    /**
     * @dev Get current platform fee balance
     * @return Current USDC balance in factory (unclaimed fees)
     */
    function getPlatformFeeBalance() external view returns (uint256) {
        return stakingToken.balanceOf(address(this));
    }
    
    /**
     * @dev Transfer factory ownership (emergency function)
     * @param newOwner Address of the new owner
     */
    function transferFactoryOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        transferOwnership(newOwner);
    }
    
    /**
     * @dev Get factory statistics
     * @return totalContests Total number of contests created
     * @return activeContests Number of active contests
     * @return resolvedContests Number of resolved contests
     * @return totalFeesCollected Total platform fees collected
     * @return currentBalance Current USDC balance (unclaimed fees)
     */
    function getFactoryStats() external view returns (
        uint256 totalContests,
        uint256 activeContests,
        uint256 resolvedContests,
        uint256 totalFeesCollected,
        uint256 currentBalance
    ) {
        totalContests = allContests.length;
        totalFeesCollected = collectedFees;
        currentBalance = stakingToken.balanceOf(address(this));
        
        // Count active and resolved
        for (uint256 i = 0; i < allContests.length; i++) {
            Contest contest = Contest(allContests[i]);
            if (contest.isResolved()) {
                resolvedContests++;
            } else if (block.timestamp < contest.endTime()) {
                activeContests++;
            }
        }
    }
    
    /**
     * @dev Emergency function to update contest duration (admin only)
     * Note: Only affects future contests, not existing ones
     * Currently disabled for MVP - duration is fixed at 24 hours
     */
    function updateContestDuration(uint256 /* newDuration */) external view onlyOwner {
        // This would require making CONTEST_DURATION not constant
        // For now, it's fixed at 24 hours for simplicity
        // Could be implemented with a state variable if needed
        revert("Duration is fixed at 24 hours for MVP");
    }
}