/**
 * Custom hooks for Momentum contract interactions
 * Provides easy-to-use hooks for all contract operations
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useWatchContractEvent } from 'wagmi'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { 
  MOCK_USDC_ADDRESS, 
  CONTEST_FACTORY_ADDRESS,
  MOCK_USDC_ABI,
  CONTEST_FACTORY_ABI,
  CONTEST_ABI,
  formatUSDC,
  parseUSDC,
  type ContestInfo,
  type UserStakes,
  type FactoryStats,
  type WinningOption
} from '../../contracts/abis/contracts'

// Hook for reading MockUSDC balance
export function useUSDCBalance(address?: `0x${string}`) {
  return useReadContract({
    address: MOCK_USDC_ADDRESS,
    abi: MOCK_USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  })
}

// Hook for reading USDC allowance
export function useUSDCAllowance(owner?: `0x${string}`, spender?: `0x${string}`) {
  return useReadContract({
    address: MOCK_USDC_ADDRESS,
    abi: MOCK_USDC_ABI,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    query: {
      enabled: !!(owner && spender),
      refetchInterval: 5000,
    }
  })
}

// Hook for USDC faucet
export function useUSDCFaucet() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const getFaucetTokens = () => {
    writeContract({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: 'faucet',
    })
  }

  return {
    getFaucetTokens,
    isLoading: isPending || isLoading,
    isSuccess,
    hash
  }
}

// Hook for USDC approval
export function useUSDCApproval() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const approve = (spender: `0x${string}`, amount: bigint) => {
    writeContract({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: 'approve',
      args: [spender, amount],
    })
  }

  return {
    approve,
    isLoading: isPending || isLoading,
    isSuccess,
    hash
  }
}

// Hook for getting all contests
export function useAllContests() {
  return useReadContract({
    address: CONTEST_FACTORY_ADDRESS,
    abi: CONTEST_FACTORY_ABI,
    functionName: 'getAllContests',
    query: {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  })
}

// Hook for getting active contests
export function useActiveContests() {
  const result = useReadContract({
    address: CONTEST_FACTORY_ADDRESS,
    abi: CONTEST_FACTORY_ABI,
    functionName: 'getActiveContests',
    query: {
      refetchInterval: 15000, // Refetch every 15 seconds
    }
  })
  
  // Debug logging
  console.log('🏭 useActiveContests Debug:', {
    contractAddress: CONTEST_FACTORY_ADDRESS,
    data: result.data,
    isLoading: result.isLoading,
    error: result.error?.message,
    status: result.status
  })
  
  return result
}

// Hook for getting factory stats
export function useFactoryStats() {
  const { data, ...rest } = useReadContract({
    address: CONTEST_FACTORY_ADDRESS,
    abi: CONTEST_FACTORY_ABI,
    functionName: 'getFactoryStats',
    query: {
      refetchInterval: 30000,
    }
  })

  const stats: FactoryStats | undefined = data && Array.isArray(data) ? {
    totalContests: data[0] as bigint,
    activeContests: data[1] as bigint,
    resolvedContests: data[2] as bigint,
    totalFeesCollected: data[3] as bigint
  } : undefined

  return {
    data: stats,
    ...rest
  }
}

// Hook for creating contests (admin only)
export function useCreateContest() {
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract({
    mutation: {
      onSuccess: (data) => {
        console.log('✅ Transaction submitted successfully!')
        console.log('Transaction hash:', data)
      },
      onError: (error) => {
        console.error('❌ Transaction submission failed:', error)
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          cause: error.cause
        })
      }
    }
  })
  
  const { isLoading, isSuccess, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  })

  const createContest = (question: string, optionA: string, optionB: string) => {
    try {
      console.log('🚀 Starting contract write...')
      console.log('📍 Contract address:', CONTEST_FACTORY_ADDRESS)
      console.log('📝 Function args:', { question, optionA, optionB })
      console.log('⏳ Calling writeContract...')
      
      writeContract({
        address: CONTEST_FACTORY_ADDRESS,
        abi: CONTEST_FACTORY_ABI,
        functionName: 'createContest',
        args: [question, optionA, optionB],
      })
      
      console.log('✨ Contract write call completed')
    } catch (error) {
      console.error('💥 Error in createContest function:', error)
      throw error
    }
  }

  // Log state changes
  console.log('🔍 Hook state:', {
    hash,
    isPending,
    isLoading,
    isSuccess,
    writeError: writeError?.message,
    receiptError: receiptError?.message
  })

  return {
    createContest,
    isLoading: isPending || isLoading,
    isSuccess,
    hash,
    error: writeError || receiptError
  }
}

// Hook for getting contest information
export function useContestInfo(contestAddress?: `0x${string}`) {
  const { data: question } = useReadContract({
    address: contestAddress,
    abi: CONTEST_ABI,
    functionName: 'question',
    query: { enabled: !!contestAddress }
  })

  const { data: optionA } = useReadContract({
    address: contestAddress,
    abi: CONTEST_ABI,
    functionName: 'optionA_text',
    query: { enabled: !!contestAddress }
  })

  const { data: optionB } = useReadContract({
    address: contestAddress,
    abi: CONTEST_ABI,
    functionName: 'optionB_text',
    query: { enabled: !!contestAddress }
  })

  const { data: endTime } = useReadContract({
    address: contestAddress,
    abi: CONTEST_ABI,
    functionName: 'endTime',
    query: { enabled: !!contestAddress }
  })

  const { data: isResolved } = useReadContract({
    address: contestAddress,
    abi: CONTEST_ABI,
    functionName: 'isResolved',
    query: { enabled: !!contestAddress, refetchInterval: 5000 }
  })

  const { data: winnerIsA } = useReadContract({
    address: contestAddress,
    abi: CONTEST_ABI,
    functionName: 'winnerIsA',
    query: { enabled: !!contestAddress && !!isResolved }
  })

  const { data: totalStakedOnA } = useReadContract({
    address: contestAddress,
    abi: CONTEST_ABI,
    functionName: 'totalStakedOnA',
    query: { enabled: !!contestAddress, refetchInterval: 10000 }
  })

  const { data: totalStakedOnB } = useReadContract({
    address: contestAddress,
    abi: CONTEST_ABI,
    functionName: 'totalStakedOnB',
    query: { enabled: !!contestAddress, refetchInterval: 10000 }
  })

  const { data: totalPool } = useReadContract({
    address: contestAddress,
    abi: CONTEST_ABI,
    functionName: 'getTotalPool',
    query: { enabled: !!contestAddress, refetchInterval: 10000 }
  })

  return {
    question,
    optionA,
    optionB,
    endTime,
    isResolved,
    winnerIsA,
    totalStakedOnA,
    totalStakedOnB,
    totalPool,
    isActive: endTime ? (endTime as bigint) > BigInt(Math.floor(Date.now() / 1000)) && !isResolved : false,
    timeRemaining: endTime ? (endTime as bigint) - BigInt(Math.floor(Date.now() / 1000)) : BigInt(0)
  }
}

// Hook for getting user stakes in a contest
export function useUserStakes(contestAddress?: `0x${string}`, userAddress?: `0x${string}`) {
  const { data, ...rest } = useReadContract({
    address: contestAddress,
    abi: CONTEST_ABI,
    functionName: 'getUserStakes',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!(contestAddress && userAddress),
      refetchInterval: 10000,
    }
  })

  const stakes: UserStakes | undefined = data && Array.isArray(data) ? {
    onA: data[0] as bigint,
    onB: data[1] as bigint,
    total: data[2] as bigint
  } : undefined

  return {
    data: stakes,
    ...rest
  }
}

// Hook for checking if user can claim winnings
export function useCanClaim(contestAddress?: `0x${string}`, userAddress?: `0x${string}`) {
  return useReadContract({
    address: contestAddress,
    abi: CONTEST_ABI,
    functionName: 'isWinner',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!(contestAddress && userAddress),
      refetchInterval: 5000,
    }
  })
}

// Hook for calculating potential winnings
export function useCalculateWinnings(contestAddress?: `0x${string}`, userAddress?: `0x${string}`) {
  return useReadContract({
    address: contestAddress,
    abi: CONTEST_ABI,
    functionName: 'calculateWinnings',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!(contestAddress && userAddress),
      refetchInterval: 10000,
    }
  })
}

// Hook for staking in contests
export function useStake() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const stake = (contestAddress: `0x${string}`, forA: boolean, amount: bigint) => {
    writeContract({
      address: contestAddress,
      abi: CONTEST_ABI,
      functionName: 'stake',
      args: [forA, amount],
    })
  }

  return {
    stake,
    isLoading: isPending || isLoading,
    isSuccess,
    hash
  }
}

// Hook for claiming winnings
export function useClaim() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const claim = (contestAddress: `0x${string}`) => {
    writeContract({
      address: contestAddress,
      abi: CONTEST_ABI,
      functionName: 'claim',
    })
  }

  return {
    claim,
    isLoading: isPending || isLoading,
    isSuccess,
    hash
  }
}

// Hook for real-time contest updates using polling
export function useContestUpdates(contestAddress?: `0x${string}`) {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    if (!contestAddress) return

    const interval = setInterval(() => {
      // Invalidate relevant queries to force refetch
      queryClient.invalidateQueries({ 
        queryKey: ['readContract', { address: contestAddress }] 
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [contestAddress, queryClient])
}

// Hook for watching contract events
export function useContestEvents(contestAddress?: `0x${string}`) {
  const [events, setEvents] = useState<any[]>([])

  useWatchContractEvent({
    address: contestAddress,
    abi: CONTEST_ABI,
    eventName: 'Staked',
    onLogs(logs) {
      setEvents(prev => [...prev, ...logs])
    },
  })

  useWatchContractEvent({
    address: contestAddress,
    abi: CONTEST_ABI,
    eventName: 'ContestResolved',
    onLogs(logs) {
      setEvents(prev => [...prev, ...logs])
    },
  })

  useWatchContractEvent({
    address: contestAddress,
    abi: CONTEST_ABI,
    eventName: 'WinningsClaimed',
    onLogs(logs) {
      setEvents(prev => [...prev, ...logs])
    },
  })

  return events
}