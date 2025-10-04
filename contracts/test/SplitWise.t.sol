// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "forge-std/Test.sol";
import "../src/SplitWise.sol";

contract SplitWiseTest is Test {
    SplitWise splitwise;
    address alice = address(1);
    address bob = address(2);

    function setUp() public {
        splitwise = new SplitWise();
    }

    function testAddExpense() public {
        vm.prank(alice);
        splitwise.addExpense(bob, 100);

        vm.prank(alice);
        int256 balance = splitwise.checkBalance(bob);
        assertEq(balance, 100);
    }

    function testCheckBalance() public {
        vm.prank(alice);
        splitwise.addExpense(bob, 200);
        
        vm.prank(alice);
        int256 aliceBalance = splitwise.checkBalance(bob);
        assertEq(aliceBalance, 200);
        
        vm.prank(bob);
        int256 bobBalance = splitwise.checkBalance(alice);
        assertEq(bobBalance, -200);
    }

    function testClearDebt() public {
        vm.prank(alice);
        splitwise.addExpense(bob, 100);
        
        vm.prank(alice);
        splitwise.clearDebt(bob, 50);
        
        vm.prank(alice);
        int256 balance = splitwise.checkBalance(bob);
        assertEq(balance, 50);
    }
}