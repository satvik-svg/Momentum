// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";

contract MinimalDeployScript is Script {
    function run() external {
        vm.startBroadcast();
        
        MockUSDC token = new MockUSDC();
        console.log("MockUSDC deployed at:", address(token));
        
        vm.stopBroadcast();
    }
}