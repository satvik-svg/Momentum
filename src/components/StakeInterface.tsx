'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useUSDCBalance, useUSDCAllowance, useUSDCApproval, useStake } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { 
  formatUSDC, 
  parseUSDC, 
  validateStakeAmount, 
  calculateROI 
} from '@/lib/contract-utils'
import { ArrowRight, Loader2, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'
import { MOCK_USDC_ADDRESS } from '../../contracts/abis/contracts'

interface StakeInterfaceProps {
  contestAddress: `0x${string}`
  optionA: string
  optionB: string
  totalStakedOnA: bigint
  totalStakedOnB: bigint
  isActive: boolean
  isResolved: boolean
}

export function StakeInterface({
  contestAddress,
  optionA,
  optionB,
  totalStakedOnA,
  totalStakedOnB,
  isActive,
  isResolved
}: StakeInterfaceProps) {
  const { address } = useAccount()
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null)
  const [stakeAmount, setStakeAmount] = useState('')
  const [showApproval, setShowApproval] = useState(false)

  const { data: balance } = useUSDCBalance(address)
  const { data: allowance } = useUSDCAllowance(address, contestAddress)
  const { approve, isLoading: approvalLoading, isSuccess: approvalSuccess } = useUSDCApproval()
  const { stake, isLoading: stakeLoading, isSuccess: stakeSuccess } = useStake()

  const userBalance = (balance as bigint) || BigInt(0)
  const userAllowance = (allowance as bigint) || BigInt(0)
  const stakeAmountBigInt = stakeAmount ? parseUSDC(stakeAmount) : BigInt(0)
  const needsApproval = stakeAmountBigInt > userAllowance

  const validation = validateStakeAmount(stakeAmount, userBalance)

  // Debug logging
    console.log('💰 StakeInterface Debug:', {
    address,
    balance,
    stakeAmount,
    formattedBalance: balance ? formatUSDC(balance) : 'N/A',
    mockUSDCAddress: MOCK_USDC_ADDRESS,
    contestAddress,
    validationResult: validateStakeAmount(stakeAmount, balance),
    chainId: window.ethereum?.chainId,
    networkId: window.ethereum?.networkVersion
  })
  const isValidAmount = validation.isValid && stakeAmount !== ''

  // Calculate potential ROI
  const potentialROI = selectedOption && stakeAmountBigInt > BigInt(0) ? 
    calculateROI(
      stakeAmountBigInt,
      selectedOption === 'A' ? totalStakedOnA + stakeAmountBigInt : totalStakedOnB + stakeAmountBigInt,
      selectedOption === 'A' ? totalStakedOnB : totalStakedOnA
    ) : 0

  const handleApprove = () => {
    if (stakeAmountBigInt > BigInt(0)) {
      approve(contestAddress, stakeAmountBigInt)
    }
  }

  const handleStake = () => {
    if (selectedOption && stakeAmountBigInt > BigInt(0)) {
      stake(contestAddress, selectedOption === 'A', stakeAmountBigInt)
    }
  }

  if (!isActive || isResolved) {
    return (
      <Card className="border-gray-300 dark:border-gray-600">
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {isResolved ? 'This contest has been resolved' : 'This contest has ended'}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!address) {
    return (
      <Card className="border-violet-200 dark:border-violet-800">
        <CardContent className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Connect your wallet to stake on this contest
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-violet-200 dark:border-violet-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-violet-600" />
          Place Your Stake
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Balance: ${formatUSDC(userBalance)}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Option Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Choose Your Side</Label>
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant={selectedOption === 'A' ? 'default' : 'outline'}
              className={`p-4 h-auto text-left justify-start ${
                selectedOption === 'A' 
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700' 
                  : 'hover:border-violet-300 dark:hover:border-violet-700'
              }`}
              onClick={() => setSelectedOption('A')}
            >
              <div className="flex-1">
                <p className="font-medium">Option A</p>
                <p className="text-sm opacity-90">{optionA}</p>
                <p className="text-xs opacity-75 mt-1">
                  Pool: ${formatUSDC(totalStakedOnA)}
                </p>
              </div>
            </Button>
            
            <Button
              variant={selectedOption === 'B' ? 'default' : 'outline'}
              className={`p-4 h-auto text-left justify-start ${
                selectedOption === 'B' 
                  ? 'bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700' 
                  : 'hover:border-pink-300 dark:hover:border-pink-700'
              }`}
              onClick={() => setSelectedOption('B')}
            >
              <div className="flex-1">
                <p className="font-medium">Option B</p>
                <p className="text-sm opacity-90">{optionB}</p>
                <p className="text-xs opacity-75 mt-1">
                  Pool: ${formatUSDC(totalStakedOnB)}
                </p>
              </div>
            </Button>
          </div>
        </div>

        {/* Amount Input */}
        {selectedOption && (
          <div className="space-y-2">
            <Label htmlFor="stake-amount">Stake Amount (mUSDC)</Label>
            <div className="relative">
              <Input
                id="stake-amount"
                type="number"
                placeholder="0.00"
                value={stakeAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStakeAmount(e.target.value)}
                className={`pr-16 ${!validation.isValid && stakeAmount ? 'border-red-300 dark:border-red-700' : ''}`}
                step="0.01"
                min="0"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                mUSDC
              </div>
            </div>
            {!validation.isValid && stakeAmount && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {validation.error}
              </p>
            )}
            
            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              {[25, 50, 100].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setStakeAmount(amount.toString())}
                  disabled={parseUSDC(amount.toString()) > userBalance}
                >
                  ${amount}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStakeAmount(formatUSDC(userBalance))}
                disabled={userBalance === BigInt(0)}
              >
                Max
              </Button>
            </div>
          </div>
        )}

        {/* ROI Display */}
        {selectedOption && isValidAmount && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-200">
                Potential ROI:
              </span>
              <span className={`font-medium ${potentialROI > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {potentialROI > 0 ? '+' : ''}{potentialROI.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Based on current pool distribution
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {selectedOption && isValidAmount && (
          <div className="space-y-3">
            {needsApproval && !approvalSuccess ? (
              <Button
                onClick={handleApprove}
                disabled={approvalLoading}
                className="w-full"
                variant="outline"
              >
                {approvalLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    Approve ${stakeAmount} mUSDC
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleStake}
                disabled={stakeLoading || needsApproval}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                {stakeLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Staking...
                  </>
                ) : stakeSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Stake Placed!
                  </>
                ) : (
                  `Stake $${stakeAmount} on Option ${selectedOption}`
                )}
              </Button>
            )}
            
            {approvalSuccess && needsApproval && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Approval successful! You can now stake.
              </p>
            )}
          </div>
        )}

        {/* Instructions */}
        {!selectedOption && (
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>Select an option above to place your stake</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}