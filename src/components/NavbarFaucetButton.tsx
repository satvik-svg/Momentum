'use client'

import { useAccount } from 'wagmi'
import { useUSDCFaucet } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, Droplets } from 'lucide-react'
import { useState } from 'react'

export function NavbarFaucetButton() {
  const { isConnected } = useAccount()
  const { getFaucetTokens, isLoading: faucetLoading, isSuccess } = useUSDCFaucet()
  const [justClaimed, setJustClaimed] = useState(false)

  const handleFaucet = () => {
    getFaucetTokens()
    setJustClaimed(true)
    setTimeout(() => setJustClaimed(false), 3000)
  }

  if (!isConnected) {
    return null
  }

  return (
    <Button
      onClick={handleFaucet}
      disabled={faucetLoading || justClaimed}
      variant="outline"
      size="sm"
      className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 hidden md:flex"
    >
      {faucetLoading ? (
        <>
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          <span className="text-xs">Getting...</span>
        </>
      ) : isSuccess || justClaimed ? (
        <>
          <CheckCircle className="h-3 w-3 mr-1" />
          <span className="text-xs">Claimed!</span>
        </>
      ) : (
        <>
          <Droplets className="h-3 w-3 mr-1" />
          <span className="text-xs">Get mUSDC</span>
        </>
      )}
    </Button>
  )
}