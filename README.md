# Momentum - Play the Crowd

A decentralized social staking protocol built on Hella testnet. Predict outcomes, stake your conviction, and win together.

## 🚀 Features

- **Social Consensus**: Predict crowd behavior, not just facts
- **Hidden Stakes**: Fair competition with stakes revealed only after contests end
- **Instant Settlement**: Winners automatically share the losing side's pot
- **Wallet Integration**: Seamless connection with RainbowKit and wagmi
- **Modern UI**: Built with Next.js, Tailwind CSS, and Framer Motion

## 🛠 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Wallet**: wagmi, RainbowKit, viem
- **UI Components**: Radix UI, Lucide icons
- **Network**: Hella testnet

## 🎯 How It Works

1. **Stake**: Choose your side and stake USDC on the outcome
2. **Wait**: Stakes are hidden until the contest ends to keep things fair
3. **Win**: The side with more stake wins, and winners share the losing side's pot

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/                 # Contest creation page
│   ├── contest/[address]/     # Individual contest pages
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Homepage
├── components/
│   ├── ui/                    # Base UI components
│   ├── ContestCard.tsx        # Contest display card
│   ├── CountdownTimer.tsx     # Real-time countdown
│   ├── Footer.tsx             # Site footer
│   ├── Navbar.tsx             # Navigation bar
│   ├── providers.tsx          # Wallet and query providers
│   └── StakeModal.tsx         # Staking interface
└── lib/
    ├── mockData.ts            # Demo contest data
    ├── utils.ts               # Utility functions
    └── wagmi.ts               # Wallet configuration
```

## 🚦 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Connect your wallet:**
   - Use MetaMask or any wallet supported by RainbowKit
   - Switch to Hella testnet network
   - Get test USDC from a faucet

## 🌟 Key Pages

### Homepage (`/`)
- Hero section with animated branding
- Live contests with hidden stakes
- Contest history with revealed results
- Real-time stats and community metrics

### Contest Detail (`/contest/[address]`)
- Full contest view with question and options
- Staking interface with approval flow
- Real-time countdown timer
- Results and claiming interface
- Discussion sidebar (placeholder)

### Admin Panel (`/admin`)
- Contest creation form
- Platform statistics
- Community guidelines
- Contest deployment to blockchain

## 🎨 Design Features

- **Dark/Light Mode**: Automatic theme switching
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Framer Motion for delightful interactions
- **Gradient Accents**: Modern violet/purple color scheme
- **Loading States**: Comprehensive feedback during transactions

## 🔗 Wallet Configuration

The app is configured for Hella testnet with these settings:

- **Network**: Hella testnet (Chain ID: 666888)
- **RPC**: Automatic through wagmi
- **Mock USDC**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

## 📊 Contest Mechanics

### Staking Phase
- Users can stake USDC on either option
- Stakes are hidden from public view
- Minimum stake: $1.00 USDC
- Approval required before staking

### Resolution Phase
- Contest automatically resolves when time expires
- Winning side determined by total staked amount
- No external oracles needed - pure social consensus

### Claiming Phase
- Winners can claim their original stake + share of losing pot
- Proportional distribution based on stake size
- Immediate settlement, no waiting periods

## 🎮 Demo Features

The current version includes:

- **5 Mock Contests**: Mix of live and resolved contests
- **Realistic Data**: Believable stakes and user counts
- **Working UI**: Full staking flow with loading states
- **Confetti**: Celebration animations for winners
- **Responsive Design**: Works on all device sizes

## 🔮 Future Enhancements

### Smart Contracts
- Contest factory for creating new contests
- Individual contest contracts with escrow
- Automatic resolution based on stake totals
- Gas-optimized claiming mechanisms

### Social Features
- Real-time chat for each contest
- User profiles and reputation
- Social sharing and referrals
- Leaderboards and achievements

### Advanced Features
- Multi-option contests (not just binary)
- Time-weighted staking (early bird bonuses)
- Contest categories and filtering
- Mobile app with push notifications

## 🛡 Security Considerations

- All transactions require user confirmation
- Stakes are locked until contest resolution
- No admin controls over contest outcomes
- Transparent on-chain resolution

## 📱 Mobile Experience

The app is fully responsive with:
- Touch-optimized interfaces
- Mobile-friendly modals
- Gesture-based navigation
- Progressive web app capabilities

## 🎯 Target Audience

- **Crypto Enthusiasts**: Love on-chain games and DeFi
- **Prediction Market Users**: Familiar with Polymarket, Augur
- **Social Gamers**: Enjoy competitive prediction games
- **DeFi Users**: Want yield opportunities beyond liquidity provision

## 💡 Contest Ideas

Great contests for Momentum:

**Tech & Crypto:**
- "Will Ethereum 2.0 ship before Q2 2024?"
- "Will ChatGPT-5 be released this year?"
- "Will Base become the #2 Ethereum L2?"

**Pop Culture:**
- "Will the next Marvel movie score >85% on Rotten Tomatoes?"
- "Will Taylor Swift announce tour dates for 2024?"

**Business & Economy:**
- "Will Tesla stock hit $300 before year-end?"
- "Will any AI company IPO for >$50B valuation?"

## 🤝 Contributing

This is a hackathon project showcasing the potential of social consensus mechanisms. Future development will focus on:

1. Smart contract deployment
2. Real user testing
3. Community building
4. Mobile optimization

## 📄 License

Built for demonstration purposes. The concept of social staking and crowd prediction is open for the community to build upon.

## 🚀 Deployment

Ready to deploy on:
- **Vercel**: Automatic deployments from Git
- **Netlify**: Static site hosting
- **Hella testnet**: Testnet smart contracts
- **Base Mainnet**: Production ready (future)

---

**Built with ❤️ for the future of social consensus**
