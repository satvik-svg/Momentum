/**
 * Utility functions for Hella network management
 */

export const HELLA_NETWORK_CONFIG = {
  chainId: '0xa2d08', // 666888 in hex
  chainName: 'Hella Testnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.helachain.com'],
  blockExplorerUrls: ['https://testnet-blockexplorer.helachain.com'],
}

/**
 * Switch to Hella network in MetaMask
 * If the network doesn't exist, it will be added automatically
 */
export const switchToHellaNetwork = async (): Promise<boolean> => {
  if (!window.ethereum) {
    alert('MetaMask is not installed. Please install MetaMask to continue.')
    return false
  }

  try {
    // Try to switch to Hella network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: HELLA_NETWORK_CONFIG.chainId }],
    })
    return true
  } catch (switchError: any) {
    // If network doesn't exist (error code 4902), add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [HELLA_NETWORK_CONFIG],
        })
        return true
      } catch (addError) {
        console.error('Failed to add Hella network:', addError)
        return false
      }
    } else {
      console.error('Failed to switch to Hella network:', switchError)
      return false
    }
  }
}

/**
 * Add Hella testnet token to MetaMask
 */
export const addHellaTokenToWallet = async (tokenAddress: string, symbol: string = 'mUSDC', decimals: number = 6) => {
  if (!window.ethereum) {
    alert('MetaMask is not installed. Please install MetaMask to continue.')
    return false
  }

  try {
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: symbol,
          decimals: decimals,
        },
      },
    })
    return true
  } catch (error) {
    console.error('Failed to add token to wallet:', error)
    return false
  }
}

/**
 * Check if user is on Hella network
 */
export const isOnHellaNetwork = (chainId: number): boolean => {
  return chainId === 666888
}

/**
 * Get network display name from chain ID
 */
export const getNetworkName = (chainId: number): string => {
  switch (chainId) {
    case 666888:
      return 'Hella Testnet'
    case 1:
      return 'Ethereum Mainnet'
    case 11155111:
      return 'Sepolia Testnet'
    case 8453:
      return 'Base Mainnet'
    case 84532:
      return 'Base Sepolia'
    default:
      return `Unknown Network (${chainId})`
  }
}