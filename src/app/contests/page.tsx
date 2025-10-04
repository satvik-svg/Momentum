'use client'

import { ContestList } from '@/components/ContestList'
import { WalletConnect } from '@/components/WalletConnect'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { Zap, Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ContestsPage() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" asChild className="text-white/80 hover:text-white">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="h-8 w-8 text-violet-400" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Active Contests
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Join the crowd, stake on outcomes, and win together in these live prediction markets.
          </p>
        </motion.div>

        {/* Wallet Connection / Setup */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <WalletConnect />
          </motion.div>
        )}

        {/* Contest List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isConnected ? 0.2 : 0.4 }}
        >
          <ContestList title="🔥 Live Contests" />
        </motion.div>

        {/* Create Contest CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="p-8 bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-violet-800/30 rounded-2xl backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to create your own contest?
            </h3>
            <p className="text-gray-300 mb-6">
              Start a new prediction market and let the community decide the outcome.
            </p>
            <Link href="/admin">
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Contest
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}