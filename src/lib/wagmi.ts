'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { createConfig, http } from 'wagmi'
import { defineChain } from 'viem'

// Define Hella chain
const hellaTestnet = defineChain({
  id: 666888, // Hella testnet chain ID
  name: 'HeLa Testnet',
  network: 'hela-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HLUSD',
    symbol: 'HLUSD',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.helachain.com'],
    },
    public: {
      http: ['https://testnet-rpc.helachain.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HeLa Explorer',
      url: 'https://testnet-blockexplorer.helachain.com',
    },
  },
  testnet: true,
})

// Environment variables with fallbacks
const hellaRpcUrl = process.env.NEXT_PUBLIC_HELLA_RPC_URL || 'https://testnet-rpc.helachain.com'
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID'

export const config = getDefaultConfig({
  appName: 'Momentum',
  projectId: walletConnectProjectId,
  chains: [hellaTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
})

// Alternative config using createConfig for more control
export const wagmiConfig = createConfig({
  chains: [hellaTestnet],
  transports: {
    [hellaTestnet.id]: http(hellaRpcUrl, {
      pollingInterval: 4_000, // Poll every 4 seconds
    }),
  },
})

// Contract addresses from environment
export const mockUSDCAddress = process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS as `0x${string}` || '0xa6559C3496c50fd09Cffbc36946E3278A909B18e'
export const contestFactoryAddress = process.env.NEXT_PUBLIC_CONTEST_FACTORY_ADDRESS as `0x${string}` || '0x4452262C3c480F0B759f119489354c4D1ae5f8d8'
export const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS as `0x${string}` || '0x8b189BE61dc48428bb4b85A60520550670406Eeb'