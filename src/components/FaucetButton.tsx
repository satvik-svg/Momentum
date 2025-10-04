'use client'

import { useAccount } from 'wagmi'
import { useUSDCBalance, useUSDCFaucet } from '@/lib/hooks'
import { formatUSDC } from '@/lib/contract-utils'
import { Button } from '@/components/ui/button'
import { Coins, CheckCircle, Loader2, Droplets } from 'lucide-react'
import { useState } from 'react'

export function FaucetButton() {
  const { address, isConnected } = useAccount()
  const { data: balance, isLoading: balanceLoading } = useUSDCBalance(address)
  const { getFaucetTokens, isLoading: faucetLoading, isSuccess } = useUSDCFaucet()
  const [justClaimed, setJustClaimed] = useState(false)

  const handleFaucet = () => {
    getFaucetTokens()
    setJustClaimed(true)
    setTimeout(() => setJustClaimed(false), 5000)
  }

  const currentBalance = balance ? Number(balance) / 1e6 : 0

  if (!isConnected) {
    return null
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Balance Display */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
        <div className="flex items-center gap-2 text-white">
          <Coins className="h-4 w-4" />
          <span className="text-sm font-medium">
            mUSDC Balance: {balanceLoading ? (
              <Loader2 className="h-3 w-3 animate-spin inline ml-1" />
            ) : (
              `$${formatUSDC((balance as bigint) || BigInt(0))}`
            )}
          </span>
        </div>
      </div>

      {/* Faucet Button */}
      <Button
        onClick={handleFaucet}
        disabled={faucetLoading || justClaimed}
        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 shadow-lg"
        size="lg"
      >
        {faucetLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Getting Tokens...
          </>
        ) : isSuccess || justClaimed ? (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            10,000 mUSDC Claimed!
          </>
        ) : (
          <>
            <Droplets className="h-4 w-4 mr-2" />
            Get 10,000 mUSDC (Free)
          </>
        )}
      </Button>

      <p className="text-xs text-white/80 text-center max-w-xs">
        Free test tokens for HeLa testnet. Use them to participate in prediction contests.
      </p>
    </div>
  )
}