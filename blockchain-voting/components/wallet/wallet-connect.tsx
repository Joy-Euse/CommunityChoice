"use client"

import { useWeb3 } from "@/components/web3-provider"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function WalletConnect() {
  const web3 = useWeb3()

  if (!web3.isConnected) {
    return (
      <Button onClick={web3.connect} variant="outline" size="sm" className="gap-2">
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wallet className="w-4 h-4" />
          {web3.address?.slice(0, 6)}...{web3.address?.slice(-4)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex flex-col items-start">
          <span className="text-xs text-muted-foreground">Address</span>
          <span className="text-sm font-medium">{web3.address}</span>
        </DropdownMenuItem>
        {web3.balance && (
          <DropdownMenuItem className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground">Balance</span>
            <span className="text-sm font-medium">{web3.balance} ETH</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={web3.disconnect} className="text-red-500">
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
