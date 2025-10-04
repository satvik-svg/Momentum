// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MockUSDC.sol";

contract MockUSDCTest is Test {
    MockUSDC public usdc;
    address public owner = makeAddr("owner");
    address public user = makeAddr("user");
    
    function setUp() public {
        vm.prank(owner);
        usdc = new MockUSDC();
    }
    
    function testInitialization() public {
        assertEq(usdc.name(), "Mock USDC");
        assertEq(usdc.symbol(), "mUSDC");
        assertEq(usdc.decimals(), 6);
        assertEq(usdc.owner(), owner);
        assertEq(usdc.totalSupply(), 1000000 * 10**6); // 1M USDC
        assertEq(usdc.balanceOf(owner), 1000000 * 10**6);
    }
    
    function testFaucet() public {
        uint256 faucetAmount = 100 * 10**6; // 100 USDC
        
        vm.prank(user);
        usdc.faucet(faucetAmount);
        
        assertEq(usdc.balanceOf(user), faucetAmount);
    }
    
    function testFaucetMaxLimit() public {
        uint256 maxAmount = 10000 * 10**6; // 10k USDC
        
        vm.prank(user);
        usdc.faucet(maxAmount);
        
        assertEq(usdc.balanceOf(user), maxAmount);
    }
    
    function testFaucetExceedsLimitFails() public {
        uint256 excessiveAmount = 10001 * 10**6; // Over 10k USDC
        
        vm.prank(user);
        vm.expectRevert("Max 10,000 USDC per faucet call");
        usdc.faucet(excessiveAmount);
    }
    
    function testMintOwnerOnly() public {
        uint256 mintAmount = 1000 * 10**6;
        
        vm.prank(owner);
        usdc.mint(user, mintAmount);
        
        assertEq(usdc.balanceOf(user), mintAmount);
    }
    
    function testMintNonOwnerFails() public {
        uint256 mintAmount = 1000 * 10**6;
        
        vm.prank(user);
        vm.expectRevert();
        usdc.mint(user, mintAmount);
    }
    
    function testTransfer() public {
        uint256 transferAmount = 100 * 10**6;
        
        vm.prank(owner);
        usdc.transfer(user, transferAmount);
        
        assertEq(usdc.balanceOf(user), transferAmount);
        assertEq(usdc.balanceOf(owner), 1000000 * 10**6 - transferAmount);
    }
    
    function testApproveAndTransferFrom() public {
        uint256 amount = 100 * 10**6;
        
        // Owner approves user to spend tokens
        vm.prank(owner);
        usdc.approve(user, amount);
        
        assertEq(usdc.allowance(owner, user), amount);
        
        // User transfers from owner to themselves
        vm.prank(user);
        usdc.transferFrom(owner, user, amount);
        
        assertEq(usdc.balanceOf(user), amount);
        assertEq(usdc.allowance(owner, user), 0); // Allowance consumed
    }
}