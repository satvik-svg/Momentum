'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Zap, ArrowRight, Play, Trophy, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { FaucetButton } from '@/components/FaucetButton'

// Dynamically import LiquidEther to avoid SSR issues
const LiquidEther = dynamic(() => import('@/components/LiquidEtherBackground'), {
  ssr: false,
})

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Liquid Ether Background - Only on Homepage */}
      <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-24 sm:pt-28 md:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
             
              
              {/* Platform Name */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6 sm:mb-8"
              >
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Momentum
                </span>
              </motion.h1>
              
              {/* Tagline */}
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white/90 mb-4 sm:mb-6"
              >
                Play the Crowd
              </motion.h2>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-8 sm:mb-12"
            >
              <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto">
                A decentralized game of social consensus. Stake on outcomes, predict the crowd, win together.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto mb-8 sm:mb-12">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-center"
                >
                  <div className="p-3 sm:p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Stake</h3>
                  <p className="text-xs sm:text-sm text-white/70">Choose your side and stake mUSDC</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="text-center"
                >
                  <div className="p-3 sm:p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Predict</h3>
                  <p className="text-xs sm:text-sm text-white/70">Guess what the crowd will choose</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="text-center"
                >
                  <div className="p-3 sm:p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                    <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Win</h3>
                  <p className="text-xs sm:text-sm text-white/70">Winners share the pot</p>
                </motion.div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
            >
              <Button 
                asChild
                size="xl" 
                className="group bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-violet-500/25 border-0 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
              >
                <Link href="/contests">
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" />
                  View Live Contests
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                size="xl"
                className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
              >
                <Link href="/admin">
                  <Trophy className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                  Create Contest
                </Link>
              </Button>
            </motion.div>

            {/* Faucet Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mt-6 sm:mt-8"
            >
              <FaucetButton />
            </motion.div>

            {/* Quick Contests Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-8 sm:mt-12"
            >
              <p className="text-white/60 text-sm sm:text-base mb-4">
                🔥 Active contests happening now
              </p>
              <Link href="/contests">
                <Button 
                  variant="ghost" 
                  className="text-white/80 hover:text-white hover:bg-white/10 text-sm"
                >
                  See all contests <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
    </div>
  )
}
