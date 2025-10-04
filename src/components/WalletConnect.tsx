'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { TokenSetup } from './TokenSetup'
import { Card, CardContent } from '@/components/ui/card'
import { Wallet } from 'lucide-react'

export function WalletConnect() {
  const { isConnected, address } = useAccount()

  if (!isConnected) {
    return (
      <Card className="border-2 border-dashed border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            Connect your wallet to start participating in prediction markets and stake on outcomes.
          </p>
          <ConnectButton />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Wallet Connected
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {address && `${address.slice(0, 6)}...${address.slice(-4)}`}
          </p>
        </div>
        <ConnectButton />
      </div>
      
      <TokenSetup />
    </div>
  )
}