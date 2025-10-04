// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";

/**
 * @title Simple Deploy Script for MockUSDC only
 * @dev Deploy just MockUSDC first to test
 */
contract SimpleDeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy MockUSDC token
        MockUSDC mockUSDC = new MockUSDC();
        console.log("MockUSDC deployed at:", address(mockUSDC));
        
        // Mint some initial tokens for testing
        mockUSDC.mint(msg.sender, 100000 * 10**6); // 100k USDC to deployer
        console.log("Minted 100,000 USDC to deployer:", msg.sender);
        
        vm.stopBroadcast();
        
        console.log("\n=== SIMPLE DEPLOYMENT SUMMARY ===");
        console.log("Network: Hella Testnet");
        console.log("Deployer:", msg.sender);
        console.log("MockUSDC:", address(mockUSDC));
    }
}