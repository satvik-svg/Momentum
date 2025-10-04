'use client'

import { useAccount } from 'wagmi'
import { useUSDCBalance, useUSDCFaucet } from '@/lib/hooks'
import { formatUSDC } from '@/lib/contract-utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Coins, ExternalLink, CheckCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { MOCK_USDC_ADDRESS } from '../../contracts/abis/contracts'

export function TokenSetup() {
  const { address } = useAccount()
  const { data: balance, isLoading: balanceLoading } = useUSDCBalance(address)
  const { getFaucetTokens, isLoading: faucetLoading, isSuccess } = useUSDCFaucet()
  const [showTokenAdded, setShowTokenAdded] = useState(false)

  const addTokenToWallet = async () => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: MOCK_USDC_ADDRESS,
            symbol: 'mUSDC',
            decimals: 6,
            image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
          },
        },
      })
      setShowTokenAdded(true)
      setTimeout(() => setShowTokenAdded(false), 3000)
    } catch (error) {
      console.error('Failed to add token:', error)
    }
  }

  const handleFaucet = () => {
    getFaucetTokens()
  }

  const currentBalance = balance ? Number(balance) / 1e6 : 0
  const hasTokens = currentBalance > 0

  return (
    <Card className="border-violet-200 dark:border-violet-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-violet-600" />
          Test Token Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance Display */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your mUSDC Balance
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {balanceLoading ? (
                <Loader2 className="h-6 w-6 animate-spin inline" />
              ) : (
                `$${formatUSDC((balance as bigint) || BigInt(0))}`
              )}
            </p>
          </div>
          {hasTokens && (
            <CheckCircle className="h-8 w-8 text-green-500" />
          )}
        </div>

        {/* Step 1: Add Token */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Step 1: Add mUSDC Token to Wallet
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add the Mock USDC token to your wallet to see your balance.
          </p>
          <Button
            onClick={addTokenToWallet}
            variant="outline"
            className="w-full justify-between"
            disabled={showTokenAdded}
          >
            <span>{showTokenAdded ? 'Token Added!' : 'Add mUSDC Token'}</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Step 2: Get Test Tokens */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Step 2: Get Test Tokens
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get 10,000 mUSDC tokens for testing. You can do this multiple times.
          </p>
          <Button
            onClick={handleFaucet}
            disabled={faucetLoading}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            {faucetLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Getting Tokens...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Tokens Received!
              </>
            ) : (
              'Get 10,000 mUSDC'
            )}
          </Button>
        </div>

        {/* Token Info */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            <strong>Contract:</strong> {MOCK_USDC_ADDRESS}
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
            This is a test token on Hella testnet for demonstration purposes only.
          </p>
        </div>

        {/* Ready State */}
        {hasTokens && (
          <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Ready to participate!</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              You can now stake on contests and participate in prediction markets.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}