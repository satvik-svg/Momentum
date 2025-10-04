'use client'

import { useActiveContests } from '@/lib/hooks'
import { RealContestCard } from './RealContestCard'
import { motion } from 'framer-motion'
import { AlertCircle, Loader2 } from 'lucide-react'

interface ContestListProps {
  title?: string
  showOnlyActive?: boolean
}

export function ContestList({ title = "Active Contests", showOnlyActive = true }: ContestListProps) {
  const { data: contests, isLoading, error } = useActiveContests()
  
  // Debug logging
  console.log('🎯 ContestList Debug:', {
    contests,
    isLoading,
    error: error?.message,
    contestsType: typeof contests,
    contestsIsArray: Array.isArray(contests),
    contestsLength: Array.isArray(contests) ? contests.length : 'not array'
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
        )}
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading contests...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
        )}
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
            <AlertCircle className="h-6 w-6" />
            <span>Error loading contests. Please try again.</span>
          </div>
        </div>
      </div>
    )
  }

  const contestsArray = Array.isArray(contests) ? contests : []
  
  if (!contests || contestsArray.length === 0) {
    return (
      <div className="space-y-6">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
        )}
        <div className="text-center py-12">
          <div className="text-gray-600 dark:text-gray-400">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">No contests available</h3>
            <p>Be the first to create a contest and start the momentum!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {title && (
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900 dark:text-gray-100"
        >
          {title}
          <span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-400">
            ({contestsArray.length} {contestsArray.length === 1 ? 'contest' : 'contests'})
          </span>
        </motion.h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contestsArray.map((contestAddress: string, index: number) => (
          <RealContestCard
            key={contestAddress}
            contestAddress={contestAddress as `0x${string}`}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}