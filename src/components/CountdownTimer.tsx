'use client'

import { useState, useEffect } from 'react'
import { formatTimeLeft } from '@/lib/utils'
import { Clock } from 'lucide-react'

interface CountdownTimerProps {
  endTime: number
  className?: string
}

export function CountdownTimer({ endTime, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(endTime))
  const [isEnded, setIsEnded] = useState(endTime <= Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = formatTimeLeft(endTime)
      setTimeLeft(newTimeLeft)
      setIsEnded(endTime <= Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Clock className={`h-4 w-4 ${isEnded ? 'text-red-500' : 'text-amber-500'}`} />
      <span className={`font-medium ${isEnded ? 'text-red-500' : 'text-amber-500'}`}>
        {timeLeft}
      </span>
    </div>
  )
}