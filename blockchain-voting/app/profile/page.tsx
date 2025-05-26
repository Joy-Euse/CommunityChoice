"use client"

import { useState } from "react"
import { useWeb3 } from "@/components/web3-provider"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, ExternalLink, Copy, CheckCircle, History } from "lucide-react"

// Mock voting history data
const votingHistory = [
  { position: "President", date: "2024-03-15" },
  { position: "Vice President", date: "2024-03-15" },
  { position: "Secretary", date: "2024-03-15" },
]

export default function ProfilePage() {
  const { isConnected, address } = useWeb3()
  const [copiedTx, setCopiedTx] = useState<string | null>(null)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTx(text)
    setTimeout(() => setCopiedTx(null), 2000)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>Please connect your wallet to view your profile</CardDescription>
            </CardHeader>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="card-glow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Wallet Profile</CardTitle>
                  <CardDescription className="font-mono">{formatAddress(address!)}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="stats" className="space-y-6">
            <TabsList>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="history">Voting History</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle>Voting Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Votes Cast</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Vote</span>
                        <span className="font-medium">2 days ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>Voting History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {votingHistory.map((vote, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <History className="h-4 w-4 text-muted-foreground" />
                          <span>{vote.position}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{vote.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
