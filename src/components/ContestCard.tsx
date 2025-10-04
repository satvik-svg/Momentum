'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CountdownTimer } from '@/components/CountdownTimer'
import { Contest } from '@/lib/mockData'
import { formatUSDC } from '@/lib/utils'
import { TrendingUp, Users, Eye } from 'lucide-react'

interface ContestCardProps {
  contest: Contest
  index?: number
}

export function ContestCard({ contest, index = 0 }: ContestCardProps) {
  const totalStaked = (contest.totalStakedOnA || 0) + (contest.totalStakedOnB || 0)
  const isLive = contest.status === 'live'
  const isRevealed = contest.status === 'revealed'

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
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isLive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : isRevealed 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {isLive ? '🔴 Live' : isRevealed ? '✅ Revealed' : '⏸ Ended'}
            </div>
            {isLive && (
              <CountdownTimer 
                endTime={contest.endTime} 
                className="text-xs"
              />
            )}
          </div>
          <CardTitle className="text-lg leading-tight text-gray-900 dark:text-gray-100">
            {contest.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Options Preview */}
          <div className="space-y-2">
            <div className={`p-3 rounded-lg border-2 transition-colors ${
              isRevealed && contest.winnerIsA 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' 
                : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  A: {contest.optionA}
                </span>
                {isRevealed && contest.winnerIsA && (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                )}
              </div>
            </div>
            <div className={`p-3 rounded-lg border-2 transition-colors ${
              isRevealed && !contest.winnerIsA 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' 
                : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  B: {contest.optionB}
                </span>
                {isRevealed && !contest.winnerIsA && (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>
                  {isLive ? '?' : formatUSDC(totalStaked)}
                </span>
              </div>
            </div>
            
            <Link href={`/contest/${contest.address}`}>
              <Button variant="gradient" size="sm" className="shadow-md">
                <Eye className="h-4 w-4 mr-2" />
                View Contest
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}