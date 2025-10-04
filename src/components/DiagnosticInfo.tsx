'use client'

import { useAccount, useChainId } from 'wagmi'
import { MOCK_USDC_ADDRESS } from '../../contracts/abis/contracts'
import { useUSDCBalance } from '@/lib/hooks'

export default function DiagnosticInfo() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: balance, isLoading, error, isError } = useUSDCBalance(address)

  if (!isConnected) return null

  return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
      <h3 className="text-red-400 font-bold mb-2">🔍 Diagnostic Information</h3>
      <div className="space-y-1 text-sm">
        <div><strong>Connected Wallet:</strong> {address}</div>
        <div><strong>Chain ID:</strong> {chainId} {chainId === 666888 ? '✅ (Hella)' : '❌ (Wrong Network!)'}</div>
        <div><strong>mUSDC Contract:</strong> {MOCK_USDC_ADDRESS}</div>
        <div><strong>Balance Loading:</strong> {isLoading ? '⏳ Loading...' : '✅ Complete'}</div>
        <div><strong>Balance Error:</strong> {isError ? `❌ ${error?.message}` : '✅ No Error'}</div>
        <div><strong>Raw Balance:</strong> {balance?.toString() || 'undefined'}</div>
        <div><strong>Formatted Balance:</strong> {balance ? (Number(balance) / 1000000).toFixed(2) : '0.00'} mUSDC</div>
        
        {chainId !== 666888 && (
          <div className="text-red-400 mt-2">
            ⚠️ <strong>Wrong Network!</strong> Please switch to Hella Testnet in MetaMask
          </div>
        )}
        
        {chainId === 11155111 && balance === BigInt(0) && (
          <div className="text-yellow-400 mt-2">
            ⚠️ <strong>Zero Balance Detected!</strong> The contract shows 0 mUSDC. This could mean:
            <ul className="ml-4 mt-1">
              <li>• Your MetaMask shows a different token than our contract</li>
              <li>• You need to add the correct mUSDC token to your wallet</li>
              <li>• You need to get test tokens from our faucet</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}