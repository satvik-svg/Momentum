// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/ContestFactory.sol";
import "../src/Contest.sol";
import "../src/MockUSDC.sol";

contract ContestFactoryTest is Test {
    ContestFactory public factory;
    MockUSDC public usdc;
    
    address public admin = makeAddr("admin");
    address public user1 = makeAddr("user1");
    address public nonAdmin = makeAddr("nonAdmin");
    
    function setUp() public {
        vm.prank(admin);
        usdc = new MockUSDC();
        
        vm.prank(admin);
        factory = new ContestFactory(address(usdc));
    }
    
    function testFactoryInitialization() public {
        assertEq(address(factory.stakingToken()), address(usdc));
        assertEq(factory.owner(), admin);
        assertEq(factory.getContestCount(), 0);
    }
    
    function testCreateContest() public {
        vm.prank(admin);
        address contestAddress = factory.createContest(
            "Will ETH hit $3000?",
            "Yes", 
            "No"
        );
        
        assertEq(factory.getContestCount(), 1);
        assertEq(factory.getContest(0), contestAddress);
        
        // Verify contest was created correctly
        Contest contest = Contest(contestAddress);
        assertEq(contest.question(), "Will ETH hit $3000?");
        assertEq(contest.optionA_text(), "Yes");
        assertEq(contest.optionB_text(), "No");
        assertEq(contest.endTime(), block.timestamp + 86400);
        assertEq(address(contest.stakingToken()), address(usdc));
        assertEq(contest.factory(), address(factory));
    }
    
    function testCreateMultipleContests() public {
        vm.startPrank(admin);
        
        address contest1 = factory.createContest("Question 1", "Yes", "No");
        address contest2 = factory.createContest("Question 2", "A", "B");
        address contest3 = factory.createContest("Question 3", "True", "False");
        
        vm.stopPrank();
        
        assertEq(factory.getContestCount(), 3);
        assertEq(factory.getContest(0), contest1);
        assertEq(factory.getContest(1), contest2);
        assertEq(factory.getContest(2), contest3);
        
        address[] memory allContests = factory.getAllContests();
        assertEq(allContests.length, 3);
        assertEq(allContests[0], contest1);
        assertEq(allContests[1], contest2);
        assertEq(allContests[2], contest3);
    }
    
    function testCreateContestNonAdminFails() public {
        vm.prank(nonAdmin);
        vm.expectRevert();
        factory.createContest("Question", "Yes", "No");
    }
    
    function testCreateContestEmptyQuestionFails() public {
        vm.prank(admin);
        vm.expectRevert(ContestFactory.EmptyQuestion.selector);
        factory.createContest("", "Yes", "No");
    }
    
    function testCreateContestEmptyOptionsFails() public {
        vm.prank(admin);
        vm.expectRevert(ContestFactory.EmptyOptions.selector);
        factory.createContest("Question", "", "No");
        
        vm.prank(admin);
        vm.expectRevert(ContestFactory.EmptyOptions.selector);
        factory.createContest("Question", "Yes", "");
    }
    
    function testGetContestOutOfBoundsFails() public {
        vm.expectRevert("Contest index out of bounds");
        factory.getContest(0);
        
        vm.prank(admin);
        factory.createContest("Question", "Yes", "No");
        
        vm.expectRevert("Contest index out of bounds");
        factory.getContest(1);
    }
    
    function testGetContestBatch() public {
        // Create 5 contests
        vm.startPrank(admin);
        for (uint i = 0; i < 5; i++) {
            factory.createContest(
                string(abi.encodePacked("Question ", vm.toString(i))),
                "Yes",
                "No"
            );
        }
        vm.stopPrank();
        
        // Get batch of 3 contests starting from index 1
        (
            address[] memory contests,
            string[] memory questions,
            uint256[] memory endTimes,
            bool[] memory isResolved
        ) = factory.getContestBatch(1, 3);
        
        assertEq(contests.length, 3);
        assertEq(questions.length, 3);
        assertEq(endTimes.length, 3);
        assertEq(isResolved.length, 3);
        
        assertEq(questions[0], "Question 1");
        assertEq(questions[1], "Question 2");
        assertEq(questions[2], "Question 3");
        
        for (uint i = 0; i < 3; i++) {
            assertFalse(isResolved[i]); // All should be unresolved
            assertEq(endTimes[i], block.timestamp + 86400); // All should have same end time
        }
    }
    
    function testGetContestBatchBoundaryConditions() public {
        // Create 3 contests
        vm.startPrank(admin);
        for (uint i = 0; i < 3; i++) {
            factory.createContest(
                string(abi.encodePacked("Question ", vm.toString(i))),
                "Yes", 
                "No"
            );
        }
        vm.stopPrank();
        
        // Request more than available
        (
            address[] memory contests,,,
        ) = factory.getContestBatch(1, 5); // Start at 1, request 5 (but only 2 available)
        
        assertEq(contests.length, 2); // Should return only what's available
        
        // Request from end
        (contests,,,) = factory.getContestBatch(3, 2); // Start beyond end
        assertEq(contests.length, 0); // Should return empty array
    }
    
    function testGetActiveContests() public {
        vm.startPrank(admin);
        
        // Create 3 contests
        address contest1 = factory.createContest("Q1", "Yes", "No");
        address contest2 = factory.createContest("Q2", "Yes", "No");  
        address contest3 = factory.createContest("Q3", "Yes", "No");
        
        vm.stopPrank();
        
        // All should be active initially
        address[] memory activeContests = factory.getActiveContests();
        assertEq(activeContests.length, 3);
        
        // Move time forward to end contest1
        vm.warp(block.timestamp + 86400 + 1);
        
        // Now only contest2 and contest3 should be active (they have later end times)
        // Actually, all contests created in same block have same end time, so none should be active
        activeContests = factory.getActiveContests();
        assertEq(activeContests.length, 0);
        
        // Create a new contest (will have new end time)
        vm.prank(admin);
        address contest4 = factory.createContest("Q4", "Yes", "No");
        
        activeContests = factory.getActiveContests();
        assertEq(activeContests.length, 1);
        assertEq(activeContests[0], contest4);
    }
    
    function testGetResolvedContests() public {
        vm.startPrank(admin);
        address contest1 = factory.createContest("Q1", "Yes", "No");
        address contest2 = factory.createContest("Q2", "Yes", "No");
        vm.stopPrank();
        
        // No contests resolved initially
        address[] memory resolvedContests = factory.getResolvedContests();
        assertEq(resolvedContests.length, 0);
        
        // Resolve contest1
        vm.warp(block.timestamp + 86400 + 1);
        Contest(contest1).resolve();
        
        // Now should have 1 resolved contest
        resolvedContests = factory.getResolvedContests();
        assertEq(resolvedContests.length, 1);
        assertEq(resolvedContests[0], contest1);
        
        // Resolve contest2
        Contest(contest2).resolve();
        
        // Now should have 2 resolved contests
        resolvedContests = factory.getResolvedContests();
        assertEq(resolvedContests.length, 2);
    }
    
    function testPlatformFeeCollection() public {
        // Create contest and add stakes
        vm.prank(admin);
        address contestAddress = factory.createContest("Q1", "Yes", "No");
        Contest contest = Contest(contestAddress);
        
        // Give users USDC and stake (admin needs to mint)
        vm.prank(admin);
        usdc.mint(user1, 1000 * 10**6);
        
        vm.prank(user1);
        usdc.approve(address(contest), 1000 * 10**6);
        vm.prank(user1);
        contest.stake(true, 1000 * 10**6);
        
        uint256 factoryBalanceBefore = usdc.balanceOf(address(factory));
        
        // Resolve contest to trigger fee collection
        vm.warp(block.timestamp + 86400 + 1);
        contest.resolve();
        
        uint256 factoryBalanceAfter = usdc.balanceOf(address(factory));
        uint256 expectedFee = (1000 * 10**6 * 2) / 100; // 2% of 1000 USDC
        
        assertEq(factoryBalanceAfter - factoryBalanceBefore, expectedFee);
    }
    
    function testWithdrawFees() public {
        // First collect some fees
        vm.prank(admin);
        address contestAddress = factory.createContest("Q1", "Yes", "No");
        Contest contest = Contest(contestAddress);
        
        vm.prank(admin);
        usdc.mint(user1, 1000 * 10**6);
        vm.prank(user1);
        usdc.approve(address(contest), 1000 * 10**6);
        vm.prank(user1);
        contest.stake(true, 1000 * 10**6);
        
        vm.warp(block.timestamp + 86400 + 1);
        contest.resolve();
        
        uint256 factoryBalance = usdc.balanceOf(address(factory));
        uint256 adminBalanceBefore = usdc.balanceOf(admin);
        
        // Withdraw fees
        vm.prank(admin);
        factory.withdrawFees(admin);
        
        uint256 adminBalanceAfter = usdc.balanceOf(admin);
        assertEq(adminBalanceAfter - adminBalanceBefore, factoryBalance);
        assertEq(usdc.balanceOf(address(factory)), 0);
    }
    
    function testWithdrawFeesNonAdminFails() public {
        vm.prank(nonAdmin);
        vm.expectRevert();
        factory.withdrawFees(nonAdmin);
    }
    
    function testWithdrawFeesWhenEmptyFails() public {
        vm.prank(admin);
        vm.expectRevert("No fees to withdraw");
        factory.withdrawFees(admin);
    }
    
    function testGetFactoryStats() public {
        (
            uint256 totalContests,
            uint256 activeContests,
            uint256 resolvedContests,
            uint256 totalFeesCollected,
            uint256 currentBalance
        ) = factory.getFactoryStats();
        
        // Initially everything should be 0
        assertEq(totalContests, 0);
        assertEq(activeContests, 0);
        assertEq(resolvedContests, 0);
        assertEq(totalFeesCollected, 0);
        assertEq(currentBalance, 0);
        
        // Create contests
        vm.startPrank(admin);
        address contest1 = factory.createContest("Q1", "Yes", "No");
        address contest2 = factory.createContest("Q2", "Yes", "No");
        vm.stopPrank();
        
        (totalContests, activeContests, resolvedContests,,) = factory.getFactoryStats();
        assertEq(totalContests, 2);
        assertEq(activeContests, 2);
        assertEq(resolvedContests, 0);
        
        // Resolve one contest
        vm.warp(block.timestamp + 86400 + 1);
        Contest(contest1).resolve();
        
        (totalContests, activeContests, resolvedContests,,) = factory.getFactoryStats();
        assertEq(totalContests, 2);
        assertEq(activeContests, 0); // Both expired
        assertEq(resolvedContests, 1);
    }
    
    function testContestCreatedEvent() public {
        vm.prank(admin);
        
        // Test that event is emitted (we can't predict the exact address)
        vm.recordLogs();
        
        factory.createContest("Test Question", "Option A", "Option B");
        
        Vm.Log[] memory logs = vm.getRecordedLogs();
        
        // Should have emitted one event
        assertEq(logs.length, 1);
        
        // Check that it's the ContestCreated event (topic0)
        assertEq(logs[0].topics[0], keccak256("ContestCreated(address,string,string,string,uint256,uint256)"));
    }
    
    function testUpdateContestDurationReverts() public {
        vm.prank(admin);
        vm.expectRevert("Duration is fixed at 24 hours for MVP");
        factory.updateContestDuration(172800); // 2 days
    }
}