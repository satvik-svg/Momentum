## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

# Momentum - Social Prediction Market Contracts

A decentralized game of social consensus where users stake USDC on binary outcomes. Winners are determined by which option attracts the most capital, and they share the rewards proportionally.

## 🚀 Quick Start

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js & npm (for frontend integration)
- MetaMask wallet
- Hella testnet ETH (contact Hella team for testnet tokens)

### Environment Setup

1. **Clone and setup:**
```bash
git clone <your-repo>
cd momentum-contracts
cp .env.example .env
```

2. **Configure `.env` file:**
```bash
HELLA_RPC_URL=https://testnet-rpc.hella.network
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Deploy to Hella

```bash
# Deploy contracts
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $HELLA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast

# Verify deployment
forge script script/VerifyDeployment.s.sol:VerifyDeploymentScript \
  --rpc-url $HELLA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

## 📋 Contract Architecture

### Core Contracts

1. **MockUSDC.sol** - ERC20 token simulating USDC for testing
2. **Contest.sol** - Individual contest with binary prediction logic
3. **ContestFactory.sol** - Factory for creating and managing contests

### Key Features

- ✅ **24-hour contest duration**
- ✅ **$1 minimum stake requirement**
- ✅ **2% platform fee**
- ✅ **Proportional prize distribution**
- ✅ **Factory pattern for unlimited contests**
- ✅ **Comprehensive test coverage**

## 🎮 How It Works

### For Users:

1. **Get test USDC**: Call `MockUSDC.faucet(10000000000)` to get 10,000 USDC
2. **Find contests**: Query `ContestFactory.getAllContests()`
3. **Stake on outcome**: Approve USDC and call `Contest.stake(true/false, amount)`
4. **Wait for resolution**: Contest ends after 24 hours
5. **Resolve contest**: Anyone can call `Contest.resolve()`
6. **Claim winnings**: Winners call `Contest.claim()`

### For Admins:

1. **Create contests**: Call `ContestFactory.createContest(question, optionA, optionB)`
2. **Collect fees**: Call `ContestFactory.withdrawFees(address)`

## 🧪 Testing

```bash
# Run all tests
forge test

# Run specific test file
forge test --match-contract ContestTest

# Run with verbose output
forge test -vvv

# Generate gas report
forge test --gas-report
```

## 📊 Contract Addresses (Hella Testnet)

After deployment, update these addresses:

```
MockUSDC: 0x...
ContestFactory: 0x...
```

## 🔧 Development

### Build
```bash
forge build
```

### Test Coverage
```bash
forge coverage
```

### Format Code
```bash
forge fmt
```

## 🌐 Frontend Integration

### Contract ABIs

After compilation, ABIs are available in:
- `out/MockUSDC.sol/MockUSDC.json`
- `out/Contest.sol/Contest.json`
- `out/ContestFactory.sol/ContestFactory.json`

### Key Functions for Frontend

#### MockUSDC
```javascript
// Get test tokens
await mockUSDC.faucet(ethers.parseUnits("1000", 6)); // 1000 USDC

// Check balance
const balance = await mockUSDC.balanceOf(userAddress);

// Approve contest to spend tokens
await mockUSDC.approve(contestAddress, stakeAmount);
```

#### ContestFactory
```javascript
// Get all contests
const contests = await factory.getAllContests();

// Create contest (admin only)
await factory.createContest("Question?", "Option A", "Option B");

// Get contest details batch
const [addresses, questions, endTimes, resolved] = await factory.getContestBatch(0, 10);
```

#### Contest
```javascript
// Get contest info
const [isActive, isResolved, totalPool, timeRemaining] = await contest.getContestInfo();

// Stake on option A (true) or B (false)
await contest.stake(true, ethers.parseUnits("10", 6)); // $10 on A

// Check if user is winner
const isWinner = await contest.isWinner(userAddress);

// Calculate potential winnings
const winnings = await contest.calculateWinnings(userAddress);

// Claim winnings (winners only)
await contest.claim();
```

## 🎯 Example Usage

### Create and Participate in Contest

```javascript
// 1. Admin creates contest
const tx1 = await factory.createContest(
  "Will ETH hit $3000 this week?",
  "Yes",
  "No"
);
const receipt = await tx1.wait();
const contestAddress = receipt.logs[0].args.contestAddress;

// 2. User gets contest instance
const contest = new ethers.Contract(contestAddress, ContestABI, signer);

// 3. User gets test USDC
await mockUSDC.faucet(ethers.parseUnits("1000", 6));

// 4. User stakes on "Yes"
await mockUSDC.approve(contestAddress, ethers.parseUnits("50", 6));
await contest.stake(true, ethers.parseUnits("50", 6));

// 5. Wait 24 hours, then resolve
// (In real app, this would be automated or done by users)
await contest.resolve();

// 6. Winner claims prize
if (await contest.isWinner(userAddress)) {
  await contest.claim();
}
```

## 🔒 Security Features

- ✅ **Reentrancy protection** on stake/claim functions
- ✅ **Access control** for admin functions
- ✅ **Input validation** for all parameters
- ✅ **Safe math** with Solidity 0.8.20
- ✅ **Comprehensive tests** covering edge cases

## 📈 Gas Estimates

| Function | Gas Cost |
|----------|----------|
| Create Contest | ~900k gas |
| Stake | ~100k gas |
| Resolve | ~50k gas |
| Claim | ~80k gas |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Run tests: `forge test`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ using Foundry and OpenZeppelin**
