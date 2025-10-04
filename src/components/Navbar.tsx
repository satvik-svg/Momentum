'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Zap, Home, Clock, Award, Settings } from 'lucide-react'
import { NavbarFaucetButton } from './NavbarFaucetButton'

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Zap className="h-8 w-8 text-violet-600" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Momentum
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>
            <Link href="/#live">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Live</span>
              </Button>
            </Link>
            <Link href="/#history">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>History</span>
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            </Link>
          </div>

          {/* Wallet Connect */}
          <div className="flex items-center space-x-4">
            <NavbarFaucetButton />
            <ConnectButton 
              accountStatus="address"
              chainStatus="icon"
              showBalance={false}
            />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}