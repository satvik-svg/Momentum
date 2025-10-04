'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Twitter, MessageCircle, Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-violet-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Momentum
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The social staking protocol. Predict the crowd, stake your conviction, win together.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              🚀 Built at Hackathon
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/" className="hover:text-violet-600 transition-colors">Live Contests</Link></li>
              <li><Link href="/#history" className="hover:text-violet-600 transition-colors">Contest History</Link></li>
              <li><Link href="/admin" className="hover:text-violet-600 transition-colors">Create Contest</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Community</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-violet-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-violet-600 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-violet-600 transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Connect</h3>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-600 dark:text-gray-400 hover:text-violet-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-600 dark:text-gray-400 hover:text-violet-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-600 dark:text-gray-400 hover:text-violet-600 transition-colors"
              >
                <Github className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © 2024 Momentum. Built on Hella testnet for demonstration purposes.
            </p>
            <div className="flex space-x-6 text-xs text-gray-500 dark:text-gray-500">
              <a href="#" className="hover:text-violet-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-violet-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-violet-600 transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}