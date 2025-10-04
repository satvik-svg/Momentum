'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CountdownTimer } from '@/components/CountdownTimer'
import { useContestInfo } from '@/lib/hooks'
import { formatUSDC, formatTimeRemaining, getContestStatus, formatContestQuestion } from '@/lib/contract-utils'
import { TrendingUp, Users, Eye, Clock, DollarSign } from 'lucide-react'

interface RealContestCardProps {
  contestAddress: `0x${string}`
  index?: number
}

export function RealContestCard({ contestAddress, index = 0 }: RealContestCardProps) {
  const contestInfo = useContestInfo(contestAddress)
  const {
    question,
    optionA,
    optionB,
    endTime,
    isResolved,
    winnerIsA,
    totalStakedOnA,
    totalStakedOnB,
    totalPool,
    isActive,
    timeRemaining
  } = contestInfo
  
  // Debug logging
  console.log(`🃏 RealContestCard Debug (${contestAddress}):`, {
    contestAddress,
    hasQuestion: !!question,
    hasOptions: !!(optionA && optionB),
    question: typeof question === 'string' ? question.slice(0, 50) + '...' : question,
    optionA: typeof optionA === 'string' ? optionA.slice(0, 20) + '...' : optionA,
    optionB: typeof optionB === 'string' ? optionB.slice(0, 20) + '...' : optionB,
    isActive,
    totalPool: totalPool?.toString()
  })

  if (!question || !optionA || !optionB) {
    return (
      <Card className="h-full animate-pulse">
        <CardHeader className="pb-4">
          <div className="h-4 bg-gray-200 rounded w-16 mb-3"></div>
          <div className="h-6 bg-gray-200 rounded w-full"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
          <div className="flex justify-between items-center pt-4 mt-4 border-t">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalStakedA = (totalStakedOnA as bigint) || BigInt(0)
  const totalStakedB = (totalStakedOnB as bigint) || BigInt(0)
  const totalStaked = totalStakedA + totalStakedB
  const contestEndTime = (endTime as bigint) || BigInt(0)
  const contestIsResolved = Boolean(isResolved)
  const contestWinnerIsA = Boolean(winnerIsA)
  
  const status = getContestStatus(contestIsResolved, contestEndTime)
  
  const optionAPercentage = totalStaked > BigInt(0) 
    ? Number(totalStakedA * BigInt(100) / totalStaked) 
    : 50
  
  const optionBPercentage = totalStaked > BigInt(0) 
    ? Number(totalStakedB * BigInt(100) / totalStaked) 
    : 50

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-violet-200 dark:hover:border-violet-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
              status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : status === 'resolved'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {status === 'active' && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
              {status === 'active' ? 'Live' : status === 'resolved' ? 'Resolved' : 'Ended'}
            </div>
            {isActive && timeRemaining && (
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                {formatTimeRemaining(timeRemaining)}
              </div>
            )}
          </div>
          <CardTitle className="text-lg leading-tight text-gray-900 dark:text-gray-100">
            {formatContestQuestion(question as string)}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Options Preview with Progress Bars */}
          <div className="space-y-3">
            <div className={`p-3 rounded-lg border-2 transition-all duration-300 ${
              contestIsResolved && contestWinnerIsA 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700 shadow-md' 
                : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-800'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex-1 mr-2">
                  A: {optionA as string}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {optionAPercentage.toFixed(1)}%
                  </span>
                  {contestIsResolved && contestWinnerIsA && (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    contestIsResolved && contestWinnerIsA 
                      ? 'bg-green-500' 
                      : 'bg-gradient-to-r from-violet-500 to-purple-500'
                  }`}
                  style={{ width: `${optionAPercentage}%` }}
                />
              </div>
            </div>
            
            <div className={`p-3 rounded-lg border-2 transition-all duration-300 ${
              contestIsResolved && !contestWinnerIsA 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700 shadow-md' 
                : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-800'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex-1 mr-2">
                  B: {optionB as string}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {optionBPercentage.toFixed(1)}%
                  </span>
                  {contestIsResolved && !contestWinnerIsA && (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    contestIsResolved && !contestWinnerIsA 
                      ? 'bg-green-500' 
                      : 'bg-gradient-to-r from-pink-500 to-red-500'
                  }`}
                  style={{ width: `${optionBPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">
                  ${formatUSDC((totalPool as bigint) || BigInt(0))}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>
                  {Number(totalStakedOnA || 0) + Number(totalStakedOnB || 0) > 0 ? 'Active' : 'New'}
                </span>
              </div>
            </div>
            
            <Link href={`/contest/${contestAddress}`}>
              <Button variant="default" size="sm" className="shadow-md bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                <Eye className="h-4 w-4 mr-2" />
                {status === 'active' ? 'Stake Now' : 'View'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}