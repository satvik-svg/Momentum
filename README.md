# Momentum

A decentralized social prediction protocol built on HeLa blockchain that enables users to create prediction contests, stake cryptocurrency on outcomes, and earn rewards based on collective intelligence.

## Overview

Momentum transforms traditional prediction markets by combining social engagement with blockchain transparency. The platform allows users to create contests on any topic, stake USDC tokens on their preferred outcomes, and automatically distributes rewards to winners through smart contracts.

## Key Features

- **Decentralized Contest Creation**: Users can create prediction contests on any topic with customizable parameters
- **Stake-Based Voting**: Participants stake USDC tokens on their predicted outcomes
- **Automated Settlement**: Smart contracts handle reward distribution based on staking patterns
- **Transparent Results**: All transactions and outcomes are recorded immutably on HeLa blockchain
- **Social Interface**: Community-driven platform with real-time engagement

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with responsive design
- **Web3 Integration**: Wagmi v2, RainbowKit, Viem
- **UI Components**: Custom components with Radix UI primitives
- **State Management**: React hooks with blockchain state synchronization

### Smart Contracts
- **Network**: HeLa Testnet (Chain ID: 666888)
- **Language**: Solidity 0.8.20
- **Development**: Foundry framework
- **Testing**: Comprehensive test suite with Forge

### Deployed Contracts
- **MockUSDC**: `0xa6559C3496c50fd09Cffbc36946E3278A909B18e`
- **ContestFactory**: `0x4452262C3c480F0B759f119489354c4D1ae5f8d8`

## Project Structure

```
├── src/
│   ├── app/                   # Next.js app router
│   │   ├── admin/            # Contest management interface
│   │   ├── contest/[address]/ # Individual contest pages
│   │   └── contests/         # Contest listing
│   ├── components/           # React components
│   │   ├── ui/              # Base UI components
│   │   └── *.tsx            # Feature-specific components
│   └── lib/                 # Utility functions and configurations
├── contracts/               # Smart contract development
│   ├── src/                # Solidity contracts
│   ├── script/             # Deployment scripts
│   ├── test/               # Contract tests
│   └── abis/               # Generated ABIs and addresses
└── public/                 # Static assets
```

## Installation and Setup

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- HeLa testnet HLUSD tokens for transactions

### Frontend Development
1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/satvik-svg/Momentum.git
   cd Momentum
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   # Update with your contract addresses and configuration
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Smart Contract Development
1. **Navigate to contracts directory:**
   ```bash
   cd contracts
   ```

2. **Install Foundry dependencies:**
   ```bash
   forge install
   ```

3. **Compile contracts:**
   ```bash
   forge build
   ```

4. **Run tests:**
   ```bash
   forge test
   ```

5. **Deploy to HeLa testnet:**
   ```bash
   forge script script/Deploy.s.sol --rpc-url $HELLA_RPC_URL --broadcast
   ```

## Network Configuration

### HeLa Testnet Setup
Add HeLa testnet to your wallet with these parameters:
- **Network Name**: HeLa Testnet
- **RPC URL**: https://testnet-rpc.helachain.com
- **Chain ID**: 666888
- **Currency Symbol**: HLUSD
- **Block Explorer**: https://testnet-blockexplorer.helachain.com

## Application Features

### Core Functionality
- **Contest Creation**: Admin interface for deploying new prediction contests
- **Staking Interface**: Users can stake USDC tokens on preferred outcomes
- **Real-time Updates**: Live contest status and countdown timers
- **Reward Distribution**: Automated payout system for winners
- **Transaction History**: Complete audit trail of all activities

### User Interface
- **Responsive Design**: Optimized for desktop and mobile devices
- **Web3 Integration**: Seamless wallet connection and transaction handling
- **Modern UI**: Clean, professional interface with intuitive navigation
- **Loading States**: Comprehensive feedback during blockchain interactions

## Smart Contract Architecture

### ContestFactory Contract
- Manages contest creation and administration
- Handles admin permissions and contest validation
- Tracks all deployed contests

### Contest Contract
- Individual contest logic and state management
- Handles staking, resolution, and reward distribution
- Implements secure escrow mechanism

### MockUSDC Contract
- ERC-20 token for testing and demonstration
- Faucet functionality for obtaining test tokens
- Standard token interface for staking operations

## Security Features

- **Smart Contract Audited Logic**: Secure handling of funds and contest resolution
- **User Confirmation Required**: All transactions require explicit user approval
- **Transparent Operations**: All activities recorded on blockchain
- **No Admin Backdoors**: Contest outcomes determined by community staking

## Development Workflow

### Testing
```bash
# Frontend tests
npm test

# Smart contract tests
cd contracts && forge test

# Integration tests
npm run test:integration
```

### Deployment
```bash
# Frontend deployment
npm run build
npm run start

# Smart contract deployment
cd contracts && forge script script/Deploy.s.sol --broadcast
```

## API Integration

The application integrates with:
- **HeLa Blockchain**: Direct smart contract interaction
- **IPFS**: Decentralized storage for contest metadata
- **Web3 Wallets**: MetaMask and other compatible wallets
## Use Cases

### Prediction Markets
- **Technology**: Software release dates, adoption metrics, performance benchmarks
- **Finance**: Market movements, economic indicators, cryptocurrency trends
- **Politics**: Election outcomes, policy decisions, approval ratings
- **Entertainment**: Award show winners, box office performance, streaming metrics
- **Sports**: Game outcomes, season performance, player statistics

### Business Applications
- **Market Research**: Consumer preference prediction and trend analysis
- **Risk Assessment**: Crowdsourced probability estimation for business decisions
- **Product Launch**: Community sentiment analysis and success prediction
- **Investment Decisions**: Collective intelligence for portfolio management

## Contributing

### Development Guidelines
1. Fork the repository and create a feature branch
2. Follow TypeScript and Solidity best practices
3. Include comprehensive tests for new features
4. Update documentation for any API changes
5. Submit pull request with detailed description

### Code Standards
- **Frontend**: ESLint configuration with TypeScript strict mode
- **Smart Contracts**: Solidity style guide compliance
- **Testing**: Minimum 80% code coverage requirement
- **Documentation**: Inline comments and README updates

## Roadmap

### Phase 1: Core Platform (Current)
- Basic contest creation and staking functionality
- HeLa testnet deployment and testing
- User interface and Web3 integration

### Phase 2: Enhanced Features
- Multi-option contests beyond binary choices
- Advanced reward mechanisms and incentive structures
- Mobile application development

### Phase 3: Scaling and Optimization
- Mainnet deployment with security audits
- Cross-chain compatibility and bridge integration
- Advanced analytics and reporting features

## Support and Documentation

### Getting Help
- **Technical Issues**: Create GitHub issues with detailed reproduction steps
- **General Questions**: Join community discussions and forums
- **Security Concerns**: Report via responsible disclosure process

### Additional Resources
- **Smart Contract Documentation**: Detailed API reference and examples
- **Frontend Component Library**: Reusable UI components and patterns
- **Development Tutorials**: Step-by-step guides for common tasks

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

Built with modern Web3 technologies and deployed on HeLa blockchain infrastructure. The project demonstrates the potential of decentralized prediction markets and community-driven consensus mechanisms.

For more information, visit the project repository or contact the development team.
