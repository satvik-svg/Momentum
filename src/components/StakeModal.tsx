'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, DollarSign, Wallet, CheckCircle, Loader2 } from 'lucide-react'
import { formatUSDC } from '@/lib/utils'

interface StakeModalProps {
  isOpen: boolean
  onClose: () => void
  option: string
  optionLabel: string
  isOptionA: boolean
}

export function StakeModal({ isOpen, onClose, option, optionLabel, isOptionA }: StakeModalProps) {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [isStaked, setIsStaked] = useState(false)

  const handleApprove = async () => {
    setIsLoading(true)
    // Simulate approval transaction
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsApproved(true)
    setIsLoading(false)
  }

  const handleStake = async () => {
    setIsLoading(true)
    // Simulate staking transaction
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsStaked(true)
    setIsLoading(false)
    
    // Close modal after success
    setTimeout(() => {
      onClose()
      setIsStaked(false)
      setIsApproved(false)
      setAmount('')
    }, 2000)
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
      setIsStaked(false)
      setIsApproved(false)
      setAmount('')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-2 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    Stake on Option {option}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className={`p-3 rounded-lg border-2 ${
                  isOptionA 
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700' 
                    : 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700'
                }`}>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {optionLabel}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {isStaked ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Stake Successful!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      You've staked {formatUSDC(parseFloat(amount) || 0)} on this option.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Amount Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Stake Amount (USDC)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          min="0"
                          step="0.01"
                          disabled={isLoading}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Minimum stake: $1.00
                      </p>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      {[10, 25, 50, 100].map((value) => (
                        <Button
                          key={value}
                          variant="outline"
                          size="sm"
                          onClick={() => setAmount(value.toString())}
                          disabled={isLoading}
                          className="text-xs"
                        >
                          ${value}
                        </Button>
                      ))}
                    </div>

                    {/* Wallet Balance */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Your USDC Balance:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          $1,250.00
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {!isApproved ? (
                        <Button
                          onClick={handleApprove}
                          disabled={!amount || parseFloat(amount) < 1 || isLoading}
                          className="w-full"
                          size="lg"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <Wallet className="h-4 w-4 mr-2" />
                              Approve USDC
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={handleStake}
                          disabled={!amount || parseFloat(amount) < 1 || isLoading}
                          variant="stake"
                          className="w-full"
                          size="lg"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Staking...
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-4 w-4 mr-2" />
                              Stake {formatUSDC(parseFloat(amount) || 0)}
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Info */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Stakes are locked until the contest ends. Winners share the losing side's pot.
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}