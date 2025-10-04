'use client'

import React from 'react'
import { useChainId } from 'wagmi'
import { switchToHellaNetwork, isOnHellaNetwork } from '@/lib/network-utils'
import { Button } from '@/components/ui/button'

interface NetworkSwitchButtonProps {
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export function NetworkSwitchButton({ className, variant = 'outline' }: NetworkSwitchButtonProps) {
  const chainId = useChainId()
  const [isSwitching, setIsSwitching] = React.useState(false)

  if (isOnHellaNetwork(chainId)) {
    return null // Don't show button if already on correct network
  }

  const handleSwitchNetwork = async () => {
    setIsSwitching(true)
    try {
      const success = await switchToHellaNetwork()
      if (success) {
        // Network switched successfully
        console.log('Successfully switched to Hella network')
      }
    } catch (error) {
      console.error('Failed to switch network:', error)
    } finally {
      setIsSwitching(false)
    }
  }

  return (
    <Button
      onClick={handleSwitchNetwork}
      disabled={isSwitching}
      variant={variant}
      className={className}
    >
      {isSwitching ? 'Switching...' : 'Switch to Hella Network'}
    </Button>
  )
}

export default NetworkSwitchButton