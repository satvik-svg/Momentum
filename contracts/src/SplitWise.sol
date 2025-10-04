// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SplitWise {
    mapping(address => mapping(address => int256)) public debts;

    event ExpenseAdded(address indexed payer, address indexed to, uint256 amount);
    event DebtCleared(address indexed from, address indexed to, uint256 amount);

    // Record an expense
    function addExpense(address friend, uint256 amount) public {
        debts[friend][msg.sender] -= int256(amount);
        debts[msg.sender][friend] += int256(amount);

        emit ExpenseAdded(msg.sender, friend, amount);
    }

    // Check balance between two friends
    function checkBalance(address friend) public view returns (int256) {
        return debts[msg.sender][friend];
    }

    // Clear a debt
    function clearDebt(address friend, uint256 amount) public {
        require(debts[msg.sender][friend] >= int256(amount), "Not enough debt!");
        debts[msg.sender][friend] -= int256(amount);
        debts[friend][msg.sender] += int256(amount);

        emit DebtCleared(msg.sender, friend, amount);
    }
}
