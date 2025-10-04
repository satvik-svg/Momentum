'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { 
  useCreateContest, 
  useFactoryStats,
  useActiveContests,
  /*useWithdrawPlatformFees*/
} from '@/lib/hooks'
import { formatUSDC, isAdmin } from '@/lib/contract-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { WalletConnect } from '@/components/WalletConnect'
import { 
  Plus, 
  Shield, 
  TrendingUp, 
  Users, 
  DollarSign,
  CheckCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { ADMIN_ADDRESS } from '../../../contracts/abis/contracts'

export default function AdminPage() {
  const { address, isConnected, chain } = useAccount()
  const [formData, setFormData] = useState({
    question: '',
    optionA: '',
    optionB: ''
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const { data: factoryStats } = useFactoryStats()
  const { createContest, isLoading: isCreating, isSuccess: isCreated, error: createError, hash } = useCreateContest()
  
  // Test contract connectivity
  const { data: activeContests, error: contractReadError } = useActiveContests()
  
  console.log('📊 Contract read test:', {
    factoryStats,
    activeContests,
    contractReadError: contractReadError?.message
  })

  // Debug wallet connection
  console.log('🔗 Wallet connection status:', {
    address,
    isConnected,
    chainId: chain?.id,
    chainName: chain?.name,
    isCorrectChain: chain?.id === 11155111 // Sepolia
  })

  const isUserAdmin = isAdmin(address)

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.question.trim()) {
      errors.question = 'Question is required'
    } else if (formData.question.length < 10) {
      errors.question = 'Question must be at least 10 characters'
    } else if (formData.question.length > 200) {
      errors.question = 'Question must be less than 200 characters'
    }

    if (!formData.optionA.trim()) {
      errors.optionA = 'Option A is required'
    } else if (formData.optionA.length < 3) {
      errors.optionA = 'Option A must be at least 3 characters'
    } else if (formData.optionA.length > 100) {
      errors.optionA = 'Option A must be less than 100 characters'
    }

    if (!formData.optionB.trim()) {
      errors.optionB = 'Option B is required'
    } else if (formData.optionB.length < 3) {
      errors.optionB = 'Option B must be at least 3 characters'
    } else if (formData.optionB.length > 100) {
      errors.optionB = 'Option B must be less than 100 characters'
    }

    if (formData.optionA.trim() === formData.optionB.trim()) {
      errors.optionA = 'Options must be different'
      errors.optionB = 'Options must be different'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleCreateContest = async () => {
    console.log('handleCreateContest called!')
    console.log('Form data:', formData)
    console.log('Current user address:', address)
    console.log('Is admin?', isUserAdmin)
    
    if (!validateForm()) {
      console.log('Form validation failed')
      return
    }

    console.log('Calling createContest with:', {
      question: formData.question.trim(),
      optionA: formData.optionA.trim(),
      optionB: formData.optionB.trim()
    })

    try {
      createContest(
        formData.question.trim(),
        formData.optionA.trim(),
        formData.optionB.trim()
      )
      console.log('CreateContest call initiated')
    } catch (error) {
      console.error('Error creating contest:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      question: '',
      optionA: '',
      optionB: ''
    })
    setFormErrors({})
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-violet-400 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Admin Panel
            </h1>
            <p className="text-gray-300">
              Connect your wallet to access admin functions
            </p>
          </div>
          <WalletConnect />
        </div>
      </div>
    )
  }

  if (!isUserAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Access Denied
            </h1>
            <p className="text-gray-300 mb-6">
              Only administrators can access this page.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Admin address: {ADMIN_ADDRESS}
            </p>
            <Link href="/contests">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Contests
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" asChild className="text-white/80 hover:text-white mb-6">
            <Link href="/contests">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contests
            </Link>
          </Button>

          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-violet-400 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 mt-2">
              Create contests and manage the platform
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-violet-200 dark:border-violet-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-violet-600" />
                    Platform Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {factoryStats ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Total Contests</span>
                        <span className="font-semibold">{Number(factoryStats.totalContests)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Active Contests</span>
                        <span className="font-semibold text-green-600">{Number(factoryStats.activeContests)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Resolved Contests</span>
                        <span className="font-semibold text-blue-600">{Number(factoryStats.resolvedContests)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-gray-600 dark:text-gray-400">Fees Collected</span>
                        <span className="font-semibold text-violet-600">
                          ${formatUSDC(factoryStats.totalFeesCollected)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-violet-600" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Loading stats...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Create Contest Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-violet-200 dark:border-violet-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-violet-600" />
                    Create New Contest
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create a new prediction market that will run for 24 hours
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Question */}
                  <div className="space-y-2">
                    <Label htmlFor="question">Contest Question *</Label>
                    <Textarea
                      id="question"
                      placeholder="e.g., Will Bitcoin reach $70,000 by the end of this week?"
                      value={formData.question}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('question', e.target.value)}
                      className={`min-h-[80px] ${formErrors.question ? 'border-red-300 dark:border-red-700' : ''}`}
                      maxLength={200}
                    />
                    <div className="flex justify-between items-center">
                      {formErrors.question && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {formErrors.question}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 ml-auto">
                        {formData.question.length}/200
                      </p>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="optionA">Option A *</Label>
                      <Input
                        id="optionA"
                        placeholder="e.g., Yes, it will reach $70k"
                        value={formData.optionA}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('optionA', e.target.value)}
                        className={formErrors.optionA ? 'border-red-300 dark:border-red-700' : ''}
                        maxLength={100}
                      />
                      {formErrors.optionA && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {formErrors.optionA}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="optionB">Option B *</Label>
                      <Input
                        id="optionB"
                        placeholder="e.g., No, it will stay below $70k"
                        value={formData.optionB}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('optionB', e.target.value)}
                        className={formErrors.optionB ? 'border-red-300 dark:border-red-700' : ''}
                        maxLength={100}
                      />
                      {formErrors.optionB && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {formErrors.optionB}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contest Duration Info */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Contest Duration</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Contests automatically run for <strong>24 hours</strong> from creation. 
                      After 24 hours, the contest can be resolved based on which option has more money staked.
                    </p>
                  </div>

                  {/* Network Check */}
                  {chain?.id !== 11155111 && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Wrong Network</span>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Please switch to <strong>Sepolia Testnet</strong>. Currently connected to: {chain?.name || 'Unknown'}
                      </p>
                    </div>
                  )}

                  {/* Wallet Setup Info */}
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Wallet Requirements</span>
                    </div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <p>• Connected to: <strong>{chain?.name || 'No network'}</strong> {chain?.id === 11155111 ? '✅' : '❌'}</p>
                      <p>• Address: <code className="text-xs bg-yellow-100 dark:bg-yellow-900 px-1 rounded break-all">{address || 'Not connected'}</code></p>
                      <p>• Admin status: <strong>{isUserAdmin ? 'Yes ✅' : 'No ❌'}</strong></p>
                      <p>• Contract read test: <strong>{contractReadError ? 'Failed ❌' : activeContests ? 'Working ✅' : 'Loading...'}</strong></p>
                      <p>• Factory stats: <strong>{factoryStats ? `${factoryStats.totalContests.toString()} contests ✅` : 'Loading...'}</strong></p>
                      <p>• Ensure you have <strong>Sepolia ETH</strong> for gas fees</p>
                      <p>• Check browser console for detailed error messages</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={() => {
                        console.log('Create Contest button clicked!')
                        handleCreateContest()
                      }}
                      disabled={isCreating || !formData.question || !formData.optionA || !formData.optionB}
                      className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Contest...
                        </>
                      ) : isCreated ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Contest Created!
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Contest
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      disabled={isCreating}
                    >
                      Reset
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={async () => {
                        console.log('🧪 Testing wallet connection...')
                        try {
                          // Test if wallet can be accessed
                          if (window.ethereum) {
                            const accounts = await window.ethereum.request({ method: 'eth_accounts' })
                            console.log('📱 Wallet accounts:', accounts)
                            console.log('🏦 Current account matches:', accounts[0]?.toLowerCase() === address?.toLowerCase())
                          }
                        } catch (error) {
                          console.error('❌ Wallet test failed:', error)
                        }
                      }}
                      size="sm"
                    >
                      Test Wallet
                    </Button>
                  </div>

                  {hash && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 mb-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="font-medium">Transaction Submitted</span>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Transaction Hash: <code className="text-xs bg-blue-100 dark:bg-blue-900 px-1 rounded">{hash}</code>
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Waiting for confirmation...
                      </p>
                    </div>
                  )}

                  {isCreated && (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        🎉 Contest created successfully! It will appear in the active contests list within a few moments.
                      </p>
                      {hash && (
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          Transaction: <code className="text-xs bg-green-100 dark:bg-green-900 px-1 rounded">{hash}</code>
                        </p>
                      )}
                    </div>
                  )}

                  {createError && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Error Creating Contest</span>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {createError?.message || 'An error occurred while creating the contest. Please try again.'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}