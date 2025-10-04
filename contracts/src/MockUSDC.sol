// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev Simple ERC20 token to simulate USDC for testing
 * Features:
 * - 6 decimals (like real USDC)
 * - Mintable by anyone for testing
 * - Faucet function for easy testing
 */
contract MockUSDC is ERC20, Ownable {
    uint8 private constant DECIMALS = 6;
    
    constructor() ERC20("Mock USDC", "mUSDC") Ownable(msg.sender) {
        // Mint initial supply to deployer for testing
        _mint(msg.sender, 1000000 * 10**DECIMALS); // 1M USDC
    }
    
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }
    
    /**
     * @dev Faucet function - anyone can mint tokens for testing
     * @param amount Amount of tokens to mint (in wei, so 1000000 = 1 USDC)
     */
    function faucet(uint256 amount) external {
        require(amount <= 10000 * 10**DECIMALS, "Max 10,000 USDC per faucet call");
        _mint(msg.sender, amount);
    }
    
    /**
     * @dev Mint tokens to a specific address (owner only)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}