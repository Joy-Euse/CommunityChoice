"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ethers } from "ethers"

export interface Web3ContextType {
  isConnected: boolean
  address: string | null
  account: string | null
  balance: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

export const Web3Context = createContext<Web3ContextType>({
  isConnected: false,
  address: null,
  account: null,
  balance: null,
  connect: async () => {},
  disconnect: () => {},
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  useEffect(() => {
    checkConnection()
    setupEventListeners()

    return () => {
      removeEventListeners()
    }
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          setIsConnected(true)
          setAddress(accounts[0].address)
          // Get balance
          const balance = await provider.getBalance(accounts[0].address)
          setBalance(ethers.formatEther(balance))
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const setupEventListeners = () => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
    }
  }

  const removeEventListeners = () => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum.removeListener("chainChanged", handleChainChanged)
    }
  }

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsConnected(false)
      setAddress(null)
      setBalance(null)
    } else {
      setIsConnected(true)
      setAddress(accounts[0])
      // Update balance when account changes
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(accounts[0])
        setBalance(ethers.formatEther(balance))
      }
    }
  }

  const handleChainChanged = () => {
    window.location.reload()
  }

  const connect = async () => {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed")
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      if (accounts.length > 0) {
        setIsConnected(true)
        setAddress(accounts[0])
        // Get balance after connecting
        const balance = await provider.getBalance(accounts[0])
        setBalance(ethers.formatEther(balance))
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error)
      throw error
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance(null)
  }

  return (
    <Web3Context.Provider value={{ 
      isConnected, 
      address, 
      account: address, // For backward compatibility
      balance,
      connect, 
      disconnect 
    }}>
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}
