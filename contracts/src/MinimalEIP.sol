// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Minimal {
    uint256 public number;
    
    constructor() {
        number = 123;
    }
    
    function setNumber(uint256 _number) public {
        number = _number;
    }
}