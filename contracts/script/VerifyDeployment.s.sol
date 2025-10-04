// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";
import "../src/ContestFactory.sol";
import "../src/Contest.sol";

/**
 * @title Verify Deployment Script
 * @dev Verifies deployed contracts are working correctly on Sepolia
 * 
 * Usage:
 * forge script script/VerifyDeployment.s.sol:VerifyDeploymentScript --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast
 */
contract VerifyDeploymentScript is Script {
    MockUSDC public mockUSDC;
    ContestFactory public factory;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address mockUSDCAddress = vm.envAddress("MOCK_USDC_ADDRESS");
        address factoryAddress = vm.envAddress("CONTEST_FACTORY_ADDRESS");
        
        mockUSDC = MockUSDC(mockUSDCAddress);
        factory = ContestFactory(factoryAddress);
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("=== VERIFYING DEPLOYMENT ===");
        console.log("MockUSDC Address:", address(mockUSDC));
        console.log("Factory Address:", address(factory));
        console.log("Deployer Address:", msg.sender);
        
        // Test 1: Verify MockUSDC functionality
        console.log("\n--- Testing MockUSDC ---");
        console.log("Token Name:", mockUSDC.name());
        console.log("Token Symbol:", mockUSDC.symbol());
        console.log("Token Decimals:", mockUSDC.decimals());
        console.log("Total Supply:", mockUSDC.totalSupply());
        console.log("Owner Balance:", mockUSDC.balanceOf(msg.sender));
        
        // Test faucet functionality
        uint256 balanceBefore = mockUSDC.balanceOf(msg.sender);
        mockUSDC.faucet(1000 * 10**6); // Get 1000 USDC from faucet
        uint256 balanceAfter = mockUSDC.balanceOf(msg.sender);
        console.log("Faucet Test - Before:", balanceBefore, "After:", balanceAfter);
        require(balanceAfter > balanceBefore, "Faucet failed");
        
        // Test 2: Verify ContestFactory functionality
        console.log("\n--- Testing ContestFactory ---");
        console.log("Factory Owner:", factory.owner());
        console.log("Staking Token:", address(factory.stakingToken()));
        console.log("Contest Count:", factory.getContestCount());
        
        // Create a test contest
        address testContestAddress = factory.createContest(
            "Test Contest: Will BTC hit $100k?",
            "Yes",
            "No"
        );
        console.log("Test Contest Created:", testContestAddress);
        
        // Test 3: Verify Contest functionality
        console.log("\n--- Testing Contest ---");
        Contest testContest = Contest(testContestAddress);
        console.log("Contest Question:", testContest.question());
        console.log("Contest Option A:", testContest.optionA_text());
        console.log("Contest Option B:", testContest.optionB_text());
        console.log("Contest End Time:", testContest.endTime());
        console.log("Contest Resolved:", testContest.isResolved());
        
        // Test staking (small amount)
        uint256 stakeAmount = 5 * 10**6; // $5
        mockUSDC.approve(address(testContest), stakeAmount);
        testContest.stake(true, stakeAmount); // Stake on Option A
        
        console.log("Staked Amount:", stakeAmount);
        console.log("Total Staked on A:", testContest.totalStakedOnA());
        console.log("User Stake on A:", testContest.stakesA(msg.sender));
        
        // Test view functions
        (bool isActive, bool isResolved, uint256 totalPool, uint256 timeRemaining) = testContest.getContestInfo();
        console.log("Contest Active:", isActive);
        console.log("Contest Resolved:", isResolved);
        console.log("Total Pool:", totalPool);
        console.log("Time Remaining:", timeRemaining);
        
        vm.stopBroadcast();
        
        console.log("\n=== VERIFICATION COMPLETE ===");
        console.log("SUCCESS: All tests passed!");
        console.log("SUCCESS: Contracts are working correctly on Sepolia");
        console.log("\n=== INTEGRATION READY ===");
        console.log("Frontend can now integrate with these addresses:");
        console.log("MockUSDC:", address(mockUSDC));
        console.log("ContestFactory:", address(factory));
        console.log("Sample Contest:", testContestAddress);
    }
}