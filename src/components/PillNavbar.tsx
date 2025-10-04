'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useState } from 'react'

export function PillNavbar() {
  const [activeItem, setActiveItem] = useState('/')

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/contests', label: 'View Contests' },
    { href: '/admin', label: 'Admin' },
  ]

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] sm:w-auto"
    >
      <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-full px-3 sm:px-6 py-2 sm:py-3 shadow-2xl">
        <div className="flex items-center justify-between sm:space-x-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-violet-400" />
            </motion.div>
            <span className="text-white font-bold text-base sm:text-lg">Momentum</span>
          </Link>

          {/* Navigation Pills */}
          <div className="hidden sm:flex items-center space-x-2 relative">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActiveItem(item.href)}
                className="relative px-3 sm:px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors duration-200"
              >
                {activeItem === item.href && (
                  <motion.div
                    layoutId="pill"
                    className="absolute inset-0 bg-white/20 rounded-full"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <select 
              value={activeItem}
              onChange={(e) => {
                setActiveItem(e.target.value)
                window.location.href = e.target.value
              }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              {navItems.map((item) => (
                <option key={item.href} value={item.href} className="bg-slate-800 text-white">
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Wallet Connect */}
          <div className="flex-shrink-0">
            <div className="scale-75 sm:scale-100">
              <ConnectButton 
                accountStatus="address"
                chainStatus="icon"
                showBalance={false}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}