// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";
import "../src/ContestFactory.sol";

/**
 * @title Deploy Script for Momentum Contracts
 * @dev Deploys MockUSDC and ContestFactory to Hella testnet
 * 
 * Usage:
 * forge script script/Deploy.s.sol:DeployScript --rpc-url $HELLA_RPC_URL --private-key $PRIVATE_KEY --broadcast
 * 
 * Or using named network:
 * forge script script/Deploy.s.sol:DeployScript --rpc-url hella --private-key $PRIVATE_KEY --broadcast
 */
contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy MockUSDC token
        MockUSDC mockUSDC = new MockUSDC();
        console.log("MockUSDC deployed at:", address(mockUSDC));
        
        // Deploy ContestFactory
        ContestFactory factory = new ContestFactory(address(mockUSDC));
        console.log("ContestFactory deployed at:", address(factory));
        
        // Optional: Create a sample contest for testing
        address sampleContestAddress = factory.createContest(
            "Will ETH reach $3000 this week?",
            "Yes",
            "No"
        );
        console.log("Sample contest created at:", sampleContestAddress);
        
        // Optional: Mint some initial tokens for testing
        mockUSDC.mint(msg.sender, 100000 * 10**6); // 100k USDC to deployer
        console.log("Minted 100,000 USDC to deployer:", msg.sender);
        
        vm.stopBroadcast();
        
        // Log deployment summary
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Network: Hella Testnet");
        console.log("Deployer:", msg.sender);
        console.log("MockUSDC:", address(mockUSDC));
        console.log("ContestFactory:", address(factory));
        console.log("Sample Contest:", sampleContestAddress);
        console.log("\n=== NEXT STEPS ===");
        console.log("1. Update frontend with contract addresses");
        console.log("2. Add Hella network to MetaMask");
        console.log("3. Add MockUSDC address to MetaMask");
        console.log("4. Use MockUSDC.faucet() to get test tokens");
        console.log("5. Create contests via ContestFactory.createContest()");
    }
}