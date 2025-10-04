'use client'

import { useAccount } from 'wagmi'
import { useCanClaim, useCalculateWinnings, useClaim } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatUSDC } from '@/lib/contract-utils'
import { Trophy, Gift, Loader2, CheckCircle } from 'lucide-react'

interface ClaimButtonProps {
  contestAddress: `0x${string}`
  isResolved: boolean
  winnerIsA?: boolean
  optionA: string
  optionB: string
}

export function ClaimButton({ 
  contestAddress, 
  isResolved, 
  winnerIsA, 
  optionA, 
  optionB 
}: ClaimButtonProps) {
  const { address } = useAccount()
  const { data: canClaim, isLoading: claimCheckLoading } = useCanClaim(contestAddress, address)
  const { data: winnings, isLoading: winningsLoading } = useCalculateWinnings(contestAddress, address)
  const { claim, isLoading: claimLoading, isSuccess: claimSuccess } = useClaim()

  const handleClaim = () => {
    claim(contestAddress)
  }

  if (!isResolved) {
    return null
  }

  if (!address) {
    return (
      <Card className="border-gray-300 dark:border-gray-600">
        <CardContent className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Connect your wallet to check if you won
          </p>
        </CardContent>
      </Card>
    )
  }

  if (claimCheckLoading || winningsLoading) {
    return (
      <Card className="border-violet-200 dark:border-violet-800">
        <CardContent className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-violet-600" />
          <p className="text-gray-600 dark:text-gray-400">
            Checking your winnings...
          </p>
        </CardContent>
      </Card>
    )
  }

  const userCanClaim = Boolean(canClaim)
  const userWinnings = (winnings as bigint) || BigInt(0)
  const winningOption = winnerIsA ? optionA : optionB
  const winningText = winnerIsA ? 'A' : 'B'

  if (!userCanClaim || userWinnings === BigInt(0)) {
    return (
      <Card className="border-gray-300 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Trophy className="h-5 w-5" />
            Contest Resolved
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Winner: Option {winningText}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              "{winningOption}"
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              You didn't win this time, but thanks for participating!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
          <Trophy className="h-5 w-5" />
          Congratulations! You Won!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Winner: Option {winningText}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              "{winningOption}"
            </p>
          </div>
          
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-800 dark:text-green-200 font-medium">
                Your Winnings
              </span>
            </div>
            <p className="text-3xl font-bold text-green-800 dark:text-green-200">
              ${formatUSDC(userWinnings)}
            </p>
          </div>
        </div>

        <Button
          onClick={handleClaim}
          disabled={claimLoading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
          size="lg"
        >
          {claimLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Claiming Winnings...
            </>
          ) : claimSuccess ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Winnings Claimed!
            </>
          ) : (
            <>
              <Gift className="h-5 w-5 mr-2" />
              Claim Your Winnings
            </>
          )}
        </Button>

        {claimSuccess && (
          <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200 text-center">
              🎉 Congratulations! Your winnings have been transferred to your wallet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}