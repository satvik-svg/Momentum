// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Contest.sol";
import "../src/ContestFactory.sol";
import "../src/MockUSDC.sol";

contract ContestTest is Test {
    Contest public contest;
    ContestFactory public factory;
    MockUSDC public usdc;
    
    address public admin = makeAddr("admin");
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");
    address public user3 = makeAddr("user3");
    
    uint256 public constant CONTEST_DURATION = 86400; // 24 hours
    uint256 public constant MIN_STAKE = 1000000; // $1 in USDC (6 decimals)
    
    function setUp() public {
        // Deploy contracts
        vm.startPrank(admin);
        usdc = new MockUSDC();
        factory = new ContestFactory(address(usdc));
        
        // Create a test contest
        address contestAddress = factory.createContest(
            "Will ETH hit $3000 this week?",
            "Yes",
            "No"
        );
        contest = Contest(contestAddress);
        
        // Give users some USDC for testing (admin needs to mint)
        usdc.mint(user1, 10000 * 10**6); // 10k USDC
        usdc.mint(user2, 10000 * 10**6); // 10k USDC
        usdc.mint(user3, 10000 * 10**6); // 10k USDC
        vm.stopPrank();
    }
    
    function testContestInitialization() public {
        assertEq(contest.question(), "Will ETH hit $3000 this week?");
        assertEq(contest.optionA_text(), "Yes");
        assertEq(contest.optionB_text(), "No");
        assertEq(contest.endTime(), block.timestamp + CONTEST_DURATION);
        assertEq(address(contest.stakingToken()), address(usdc));
        assertEq(contest.factory(), address(factory));
        assertFalse(contest.isResolved());
    }
    
    function testStakeOptionA() public {
        uint256 stakeAmount = 100 * 10**6; // $100
        
        vm.startPrank(user1);
        usdc.approve(address(contest), stakeAmount);
        contest.stake(true, stakeAmount); // Stake on Option A
        vm.stopPrank();
        
        assertEq(contest.stakesA(user1), stakeAmount);
        assertEq(contest.stakesB(user1), 0);
        assertEq(contest.totalStakedOnA(), stakeAmount);
        assertEq(contest.totalStakedOnB(), 0);
    }
    
    function testStakeOptionB() public {
        uint256 stakeAmount = 50 * 10**6; // $50
        
        vm.startPrank(user2);
        usdc.approve(address(contest), stakeAmount);
        contest.stake(false, stakeAmount); // Stake on Option B
        vm.stopPrank();
        
        assertEq(contest.stakesA(user2), 0);
        assertEq(contest.stakesB(user2), stakeAmount);
        assertEq(contest.totalStakedOnA(), 0);
        assertEq(contest.totalStakedOnB(), stakeAmount);
    }
    
    function testMultipleStakes() public {
        uint256 stakeAmount1 = 100 * 10**6; // $100
        uint256 stakeAmount2 = 200 * 10**6; // $200
        
        // User1 stakes twice on Option A
        vm.startPrank(user1);
        usdc.approve(address(contest), stakeAmount1 + stakeAmount2);
        contest.stake(true, stakeAmount1);
        contest.stake(true, stakeAmount2);
        vm.stopPrank();
        
        assertEq(contest.stakesA(user1), stakeAmount1 + stakeAmount2);
        assertEq(contest.totalStakedOnA(), stakeAmount1 + stakeAmount2);
    }
    
    function testStakeMinimumAmount() public {
        vm.startPrank(user1);
        usdc.approve(address(contest), MIN_STAKE);
        contest.stake(true, MIN_STAKE); // Exactly $1
        vm.stopPrank();
        
        assertEq(contest.stakesA(user1), MIN_STAKE);
    }
    
    function testStakeBelowMinimumFails() public {
        uint256 belowMinimum = MIN_STAKE - 1;
        
        vm.startPrank(user1);
        usdc.approve(address(contest), belowMinimum);
        
        vm.expectRevert(Contest.MinimumStakeNotMet.selector);
        contest.stake(true, belowMinimum);
        vm.stopPrank();
    }
    
    function testStakeAfterEndTimeFails() public {
        // Move time forward past end time
        vm.warp(block.timestamp + CONTEST_DURATION + 1);
        
        vm.startPrank(user1);
        usdc.approve(address(contest), MIN_STAKE);
        
        vm.expectRevert(Contest.ContestEnded.selector);
        contest.stake(true, MIN_STAKE);
        vm.stopPrank();
    }
    
    function testStakeWithoutApprovalFails() public {
        vm.startPrank(user1);
        // Don't approve tokens
        
        vm.expectRevert(Contest.InsufficientAllowance.selector);
        contest.stake(true, MIN_STAKE);
        vm.stopPrank();
    }
    
    function testResolveBeforeEndTimeFails() public {
        vm.expectRevert(Contest.ContestNotEnded.selector);
        contest.resolve();
    }
    
    function testResolveOptionAWins() public {
        // Set up stakes: A gets more
        uint256 stakeA = 1000 * 10**6; // $1000
        uint256 stakeB = 500 * 10**6;  // $500
        
        vm.prank(user1);
        usdc.approve(address(contest), stakeA);
        vm.prank(user1);
        contest.stake(true, stakeA);
        
        vm.prank(user2);
        usdc.approve(address(contest), stakeB);
        vm.prank(user2);
        contest.stake(false, stakeB);
        
        // Move time forward and resolve
        vm.warp(block.timestamp + CONTEST_DURATION + 1);
        contest.resolve();
        
        assertTrue(contest.isResolved());
        assertTrue(contest.winnerIsA()); // A should win (more stakes)
    }
    
    function testResolveOptionBWins() public {
        // Set up stakes: B gets more
        uint256 stakeA = 300 * 10**6; // $300
        uint256 stakeB = 700 * 10**6; // $700
        
        vm.prank(user1);
        usdc.approve(address(contest), stakeA);
        vm.prank(user1);
        contest.stake(true, stakeA);
        
        vm.prank(user2);
        usdc.approve(address(contest), stakeB);
        vm.prank(user2);
        contest.stake(false, stakeB);
        
        // Move time forward and resolve
        vm.warp(block.timestamp + CONTEST_DURATION + 1);
        contest.resolve();
        
        assertTrue(contest.isResolved());
        assertFalse(contest.winnerIsA()); // B should win (more stakes)
    }
    
    function testResolveTieGoesToA() public {
        // Set up equal stakes
        uint256 stakeAmount = 500 * 10**6; // $500 each
        
        vm.prank(user1);
        usdc.approve(address(contest), stakeAmount);
        vm.prank(user1);
        contest.stake(true, stakeAmount);
        
        vm.prank(user2);
        usdc.approve(address(contest), stakeAmount);
        vm.prank(user2);
        contest.stake(false, stakeAmount);
        
        // Move time forward and resolve
        vm.warp(block.timestamp + CONTEST_DURATION + 1);
        contest.resolve();
        
        assertTrue(contest.isResolved());
        assertTrue(contest.winnerIsA()); // Tie goes to A (>= condition)
    }
    
    function testResolveAlreadyResolvedFails() public {
        vm.warp(block.timestamp + CONTEST_DURATION + 1);
        contest.resolve();
        
        vm.expectRevert(Contest.ContestAlreadyResolved.selector);
        contest.resolve();
    }
    
    function testClaimBeforeResolutionFails() public {
        vm.expectRevert(Contest.ContestNotResolved.selector);
        contest.claim();
    }
    
    function testClaimWithoutStakeFails() public {
        // Resolve contest without user3 staking
        vm.warp(block.timestamp + CONTEST_DURATION + 1);
        contest.resolve();
        
        vm.prank(user3);
        vm.expectRevert(Contest.NoStakeOnWinningSide.selector);
        contest.claim();
    }
    
    function testClaimTwiceFails() public {
        uint256 stakeAmount = 100 * 10**6;
        
        // User1 stakes and wins
        vm.prank(user1);
        usdc.approve(address(contest), stakeAmount);
        vm.prank(user1);
        contest.stake(true, stakeAmount);
        
        vm.warp(block.timestamp + CONTEST_DURATION + 1);
        contest.resolve();
        
        // First claim should work
        vm.prank(user1);
        contest.claim();
        
        // Second claim should fail
        vm.prank(user1);
        vm.expectRevert(Contest.AlreadyClaimed.selector);
        contest.claim();
    }
    
    function testProportionalDistribution() public {
        // Setup: A gets 1000, B gets 500, A wins
        uint256 user1Stake = 600 * 10**6; // User1: $600 on A
        uint256 user2Stake = 400 * 10**6; // User2: $400 on A  
        uint256 user3Stake = 500 * 10**6; // User3: $500 on B (loses)
        
        vm.prank(user1);
        usdc.approve(address(contest), user1Stake);
        vm.prank(user1);
        contest.stake(true, user1Stake);
        
        vm.prank(user2);
        usdc.approve(address(contest), user2Stake);
        vm.prank(user2);
        contest.stake(true, user2Stake);
        
        vm.prank(user3);
        usdc.approve(address(contest), user3Stake);
        vm.prank(user3);
        contest.stake(false, user3Stake);
        
        uint256 user1BalanceBefore = usdc.balanceOf(user1);
        uint256 user2BalanceBefore = usdc.balanceOf(user2);
        
        // Resolve contest
        vm.warp(block.timestamp + CONTEST_DURATION + 1);
        contest.resolve();
        
        // Check calculations
        uint256 user1Expected = contest.calculateWinnings(user1);
        uint256 user2Expected = contest.calculateWinnings(user2);
        
        // User1 claims
        vm.prank(user1);
        contest.claim();
        
        // User2 claims
        vm.prank(user2);
        contest.claim();
        
        uint256 user1BalanceAfter = usdc.balanceOf(user1);
        uint256 user2BalanceAfter = usdc.balanceOf(user2);
        
        assertEq(user1BalanceAfter - user1BalanceBefore, user1Expected);
        assertEq(user2BalanceAfter - user2BalanceBefore, user2Expected);
        
        // Verify proportional distribution
        // User1 had 60% of winning stakes, User2 had 40%
        assertTrue(user1Expected > user2Expected); // User1 should get more
        
        // Total winnings should be close to total pool minus platform fee
        uint256 totalPool = 1500 * 10**6;
        uint256 platformFee = (totalPool * 2) / 100; // 2% fee
        uint256 expectedTotal = totalPool - platformFee;
        
        assertApproxEqAbs(user1Expected + user2Expected, expectedTotal, 1); // Allow 1 wei rounding
    }
    
    function testPlatformFeeCollection() public {
        uint256 stakeA = 1000 * 10**6;
        uint256 stakeB = 500 * 10**6;
        uint256 totalPool = stakeA + stakeB;
        uint256 expectedFee = (totalPool * 2) / 100; // 2%
        
        // Setup stakes
        vm.prank(user1);
        usdc.approve(address(contest), stakeA);
        vm.prank(user1);
        contest.stake(true, stakeA);
        
        vm.prank(user2);
        usdc.approve(address(contest), stakeB);
        vm.prank(user2);
        contest.stake(false, stakeB);
        
        uint256 factoryBalanceBefore = usdc.balanceOf(address(factory));
        
        // Resolve to trigger fee collection
        vm.warp(block.timestamp + CONTEST_DURATION + 1);
        contest.resolve();
        
        uint256 factoryBalanceAfter = usdc.balanceOf(address(factory));
        assertEq(factoryBalanceAfter - factoryBalanceBefore, expectedFee);
    }
    
    function testGetContestInfo() public {
        (bool isActive, bool isResolved, uint256 totalPool, uint256 timeRemaining) = contest.getContestInfo();
        
        assertTrue(isActive);
        assertFalse(isResolved);
        assertEq(totalPool, 0);
        assertEq(timeRemaining, CONTEST_DURATION);
        
        // Add stakes
        uint256 stake = 100 * 10**6;
        vm.prank(user1);
        usdc.approve(address(contest), stake);
        vm.prank(user1);
        contest.stake(true, stake);
        
        (isActive, isResolved, totalPool, timeRemaining) = contest.getContestInfo();
        assertTrue(isActive);
        assertFalse(isResolved);
        assertEq(totalPool, stake);
        
        // After resolution
        vm.warp(block.timestamp + CONTEST_DURATION + 1);
        contest.resolve();
        
        (isActive, isResolved, totalPool, timeRemaining) = contest.getContestInfo();
        assertFalse(isActive);
        assertTrue(isResolved);
        assertEq(timeRemaining, 0);
    }
    
    function testGetUserStakes() public {
        uint256 stakeA = 100 * 10**6;
        uint256 stakeB = 50 * 10**6;
        
        vm.startPrank(user1);
        usdc.approve(address(contest), stakeA + stakeB);
        contest.stake(true, stakeA);
        contest.stake(false, stakeB);
        vm.stopPrank();
        
        (uint256 userStakeA, uint256 userStakeB, uint256 totalStake) = contest.getUserStakes(user1);
        
        assertEq(userStakeA, stakeA);
        assertEq(userStakeB, stakeB);
        assertEq(totalStake, stakeA + stakeB);
    }
    
    function testIsWinner() public {
        uint256 stakeA = 1000 * 10**6;
        uint256 stakeB = 500 * 10**6;
        
        vm.prank(user1);
        usdc.approve(address(contest), stakeA);
        vm.prank(user1);
        contest.stake(true, stakeA); // User1 on A
        
        vm.prank(user2);
        usdc.approve(address(contest), stakeB);
        vm.prank(user2);
        contest.stake(false, stakeB); // User2 on B
        
        // Before resolution
        assertFalse(contest.isWinner(user1));
        assertFalse(contest.isWinner(user2));
        
        // After resolution (A wins)
        vm.warp(block.timestamp + CONTEST_DURATION + 1);
        contest.resolve();
        
        assertTrue(contest.isWinner(user1)); // Winner
        assertFalse(contest.isWinner(user2)); // Loser
        assertFalse(contest.isWinner(user3)); // No stake
    }
}