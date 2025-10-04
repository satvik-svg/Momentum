'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Lock } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { formatEther } from 'viem'
import { StakeInterface } from '@/components/StakeInterface'
import { ClaimButton } from '@/components/ClaimButton'
import { TokenSetup } from '@/components/TokenSetup'
import DiagnosticInfo from '@/components/DiagnosticInfo'
import { useContestInfo, useUserStakes, useUSDCBalance } from '@/lib/hooks'
import { useAccount } from 'wagmi'

// Helper function to get contest status
function getContestStatus(isActive: boolean, isResolved: boolean) {
  if (isResolved) {
    return {
      label: '✅ Resolved',
      color: 'bg-green-100 text-green-800',
      textColor: 'text-green-400'
    }
  } else if (isActive) {
    return {
      label: '🔴 Active',
      color: 'bg-green-100 text-green-800',
      textColor: 'text-green-400'
    }
  } else {
    return {
      label: '⏸ Ended',
      color: 'bg-gray-100 text-gray-800',
      textColor: 'text-gray-400'
    }
  }
}

export default function ContestDetailPage() {
  const params = useParams()
  const contestAddress = params.address as `0x${string}`
  const { address } = useAccount()

  // Fetch contest data using our custom hooks
  const {
    question,
    optionA,
    optionB,
    isActive,
    isResolved,
    totalPool,
    totalStakedOnA,
    totalStakedOnB,
    timeRemaining,
    winnerIsA
  } = useContestInfo(contestAddress)

  const userStakesQuery = useUserStakes(contestAddress)
  const userStakes = userStakesQuery.data
  
  // Check user's mUSDC balance
  const { data: balance } = useUSDCBalance(address)
  const userBalance = (balance as bigint) || BigInt(0)

  // Debug logging
  console.log('🎯 Contest Detail Debug:', {
    contestAddress,
    address,
    question,
    optionA,
    optionB,
    isActive,
    isResolved,
    totalPool: totalPool?.toString(),
    userStakes,
    userBalance: userBalance.toString(),
    hasLowBalance: userBalance < BigInt(1000000)
  })

  // Loading state
  if (!question || !optionA || !optionB) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="h-32 bg-gray-700 rounded"></div>
                  <div className="h-32 bg-gray-700 rounded"></div>
                </div>
                <div className="h-64 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const contestStatus = getContestStatus(isActive || false, isResolved || false)
  const totalStakedA = totalStakedOnA || BigInt(0)
  const totalStakedB = totalStakedOnB || BigInt(0)
  const total = totalPool || BigInt(0)
  
  const percentageA = total > 0 ? Number((totalStakedA * BigInt(100)) / total) : 0
  const percentageB = total > 0 ? Number((totalStakedB * BigInt(100)) / total) : 0

  // Calculate derived values
  const isLive = isActive && !isResolved
  const winner = winnerIsA === true ? 0 : winnerIsA === false ? 1 : undefined
  const canClaim = isResolved && userStakes && (
    (winner === 0 && userStakes.onA > 0) || 
    (winner === 1 && userStakes.onB > 0)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <DiagnosticInfo />
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 text-purple-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contests
            </Link>
          </motion.div>

          {/* Contest Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                contestStatus.color
              }`}>
                {contestStatus.label}
              </div>
              
              {timeRemaining && timeRemaining > 0 && (
                <div className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300">
                  {Math.floor(Number(timeRemaining) / (24 * 60 * 60))}d {Math.floor((Number(timeRemaining) % (24 * 60 * 60)) / (60 * 60))}h remaining
                </div>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {question}
            </h1>
            
            <p className="text-gray-400 text-sm">
              Contest: {contestAddress}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Options */}
            <div className="space-y-6">
              {/* Option A */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border ${
                  isResolved && winner === 0 
                    ? 'border-green-500 bg-green-900/20' 
                    : 'border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-blue-400">Option A</h3>
                  {isResolved && winner === 0 && (
                    <div className="text-green-400 text-sm font-medium">Winner!</div>
                  )}
                </div>
                
                <p className="text-white mb-4">{optionA}</p>
                
                {!isActive ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Staked:</span>
                      <span className="text-white">{formatEther(totalStakedA)} mUSDC</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Percentage:</span>
                      <span className="text-white">{percentageA.toFixed(1)}%</span>
                    </div>
                    {userStakes && userStakes.onA > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Your Stake:</span>
                        <span className="text-purple-400">{formatEther(userStakes.onA)} mUSDC</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    <div className="flex items-center justify-center mb-2">
                      <Lock className="h-4 w-4 mr-2" />
                      <span>Stakes Hidden During Contest</span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Option B */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border ${
                  isResolved && winner === 1 
                    ? 'border-green-500 bg-green-900/20' 
                    : 'border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-purple-400">Option B</h3>
                  {isResolved && winner === 1 && (
                    <div className="text-green-400 text-sm font-medium">Winner!</div>
                  )}
                </div>
                
                <p className="text-white mb-4">{optionB}</p>
                
                {!isActive ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Staked:</span>
                      <span className="text-white">{formatEther(totalStakedB)} mUSDC</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Percentage:</span>
                      <span className="text-white">{percentageB.toFixed(1)}%</span>
                    </div>
                    {userStakes && userStakes.onB > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Your Stake:</span>
                        <span className="text-purple-400">{formatEther(userStakes.onB)} mUSDC</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    <div className="flex items-center justify-center mb-2">
                      <Lock className="h-4 w-4 mr-2" />
                      <span>Stakes Hidden During Contest</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Contest Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Contest Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Pool:</span>
                    <span className="text-white font-medium">{formatEther(total)} mUSDC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status:</span>
                    <span className={`font-medium ${contestStatus.textColor}`}>
                      {contestStatus.label}
                    </span>
                  </div>
                  {timeRemaining !== undefined && timeRemaining > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Time Left:</span>
                      <span className="text-white font-medium">
                        {Math.floor(Number(timeRemaining) / (24 * 60 * 60))}d {Math.floor((Number(timeRemaining) % (24 * 60 * 60)) / (60 * 60))}h
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Stake Interface */}
              {isActive && optionA && optionB && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <StakeInterface 
                    contestAddress={contestAddress}
                    optionA={optionA}
                    optionB={optionB}
                    totalStakedOnA={totalStakedA}
                    totalStakedOnB={totalStakedB}
                    isActive={isActive || false}
                    isResolved={isResolved || false}
                  />
                </motion.div>
              )}

              {/* Token Setup - Show when user has low balance */}
              {isActive && address && userBalance < BigInt(1000000) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <TokenSetup />
                </motion.div>
              )}

              {/* Claim Interface */}
              {isResolved && optionA && optionB && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ClaimButton 
                    contestAddress={contestAddress}
                    isResolved={isResolved}
                    winnerIsA={winnerIsA}
                    optionA={optionA}
                    optionB={optionB}
                  />
                </motion.div>
              )}

              {/* Your Stakes Summary */}
              {userStakes && (userStakes.onA > 0 || userStakes.onB > 0) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-purple-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-700"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Your Stakes</h3>
                  <div className="space-y-3">
                    {userStakes.onA > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Option A:</span>
                        <span className="text-blue-400 font-medium">{formatEther(userStakes.onA)} mUSDC</span>
                      </div>
                    )}
                    {userStakes.onB > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Option B:</span>
                        <span className="text-purple-400 font-medium">{formatEther(userStakes.onB)} mUSDC</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Staked:</span>
                        <span className="text-white font-medium">
                          {formatEther(userStakes.onA + userStakes.onB)} mUSDC
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


