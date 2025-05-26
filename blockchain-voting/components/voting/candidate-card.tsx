"use client"

import { useState } from "react"
import { useWeb3 } from "@/components/web3-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"
import { vote } from "@/lib/blockchain"
import { useToast } from "@/components/ui/use-toast"

interface CandidateCardProps {
  id: string
  name: string
  voteCount: string
  position: string
  party: string
  disabled?: boolean
}

export function CandidateCard({ id, name, voteCount, position, party, disabled }: CandidateCardProps) {
  const web3 = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleVote = async () => {
    if (!web3.isConnected) {
      await web3.connect()
      return
    }

    try {
      setIsLoading(true)
      const tx = await vote(id)
      toast({
        title: "Success",
        description: "Your vote has been recorded",
      })
    } catch (error: any) {
      console.error("Error voting:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to cast vote",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const shareVote = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "I voted in the blockchain election!",
          text: `I just voted for ${name} for ${position} in the blockchain election. Join me in making a difference!`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    }
  }

  return (
    <Card className="card-glow card-hover">
      <CardHeader>
        <CardTitle className="gradient-text">{name}</CardTitle>
        <CardDescription>{position} • {party}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-2xl font-bold">{voteCount}</span>
          </div>
          <span className="text-sm text-muted-foreground">votes</span>
        </div>
        <div className="flex gap-2">
          <Button
            className="button-hover flex-1"
            onClick={handleVote}
            disabled={isLoading || disabled}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Processing...</span>
              </div>
            ) : (
              "Vote"
            )}
          </Button>
          <Button variant="outline" onClick={shareVote}>
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
