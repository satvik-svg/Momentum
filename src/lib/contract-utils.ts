/**
 * Contract utilities and helper functions
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format time remaining in human readable format
export function formatTimeRemaining(seconds: bigint): string {
  const totalSeconds = Number(seconds)
  
  if (totalSeconds <= 0) return "Ended"
  
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

// Format USDC amounts
export const formatUSDC = (amount: bigint): string => {
  return (Number(amount) / 1e6).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Parse USDC amounts from string input
export const parseUSDC = (amount: string): bigint => {
  return BigInt(Math.floor(parseFloat(amount) * 1e6))
}

// Calculate winning percentage for display
export function calculateWinningPercentage(winningPool: bigint, totalPool: bigint): number {
  if (totalPool === BigInt(0)) return 0
  return Number((winningPool * BigInt(100)) / totalPool)
}

// Calculate potential ROI
export function calculateROI(userStake: bigint, totalUserSide: bigint, totalOtherSide: bigint): number {
  if (totalUserSide === BigInt(0)) return 0
  
  const platformFee = (totalUserSide + totalOtherSide) * BigInt(2) / BigInt(100) // 2% fee
  const netPool = totalUserSide + totalOtherSide - platformFee
  const userShare = userStake * netPool / totalUserSide
  const roi = Number((userShare - userStake) * BigInt(100) / userStake)
  
  return roi
}

// Truncate address for display
export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (address.length <= startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

// Check if user is admin
export function isAdmin(address?: string): boolean {
  const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS?.toLowerCase() || "0x8b189BE61dc48428bb4b85A60520550670406Eeb".toLowerCase()
  return address?.toLowerCase() === adminAddress
}

// Format contest question for display
export function formatContestQuestion(question: string, maxLength = 80): string {
  if (question.length <= maxLength) return question
  return question.slice(0, maxLength - 3) + "..."
}

// Get contest status
export function getContestStatus(isResolved: boolean, endTime: bigint): 'active' | 'ended' | 'resolved' {
  if (isResolved) return 'resolved'
  if (endTime <= BigInt(Math.floor(Date.now() / 1000))) return 'ended'
  return 'active'
}

// Format large numbers
export function formatLargeNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toString()
}

// Validate stake amount
export function validateStakeAmount(amount: string, balance: bigint, minStake: bigint = BigInt(1000000)): {
  isValid: boolean
  error?: string
} {
  const amountNum = parseFloat(amount)
  
  if (isNaN(amountNum) || amountNum <= 0) {
    return { isValid: false, error: "Please enter a valid amount" }
  }
  
  const amountBigInt = parseUSDC(amount)
  
  if (amountBigInt < minStake) {
    return { isValid: false, error: `Minimum stake is $${formatUSDC(minStake)}` }
  }
  
  if (amountBigInt > balance) {
    return { isValid: false, error: "Insufficient balance" }
  }
  
  return { isValid: true }
}

// Get time until contest ends
export function getTimeUntilEnd(endTime: bigint): {
  timeRemaining: bigint
  isEnded: boolean
  isEndingSoon: boolean // less than 1 hour
} {
  const now = BigInt(Math.floor(Date.now() / 1000))
  const timeRemaining = endTime > now ? endTime - now : BigInt(0)
  const isEnded = timeRemaining === BigInt(0)
  const isEndingSoon = timeRemaining > BigInt(0) && timeRemaining < BigInt(3600) // 1 hour
  
  return {
    timeRemaining,
    isEnded,
    isEndingSoon
  }
}