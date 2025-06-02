"use client"

import { useState } from "react"
import { useWeb3 } from "@/components/web3-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"
import { vote } from "@/lib/blockchain"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CandidateCardProps {
  id: string
  name: string
  voteCount: string
  position: string
  party: string
  image?: string
  disabled?: boolean
}

export function CandidateCard({ id, name, voteCount, position, party, image, disabled }: CandidateCardProps) {
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
    <Card className="card-glow card-hover transform transition-all duration-200 hover:scale-[1.01]">
      <CardHeader className="pb-2">
        <div className="flex flex-col items-center text-center gap-3">
          <Avatar className="h-24 w-24 rounded-full ring-2 ring-primary/20">
            <AvatarImage src={image || "/placeholder.svg"} alt={name} className="object-cover" />
            <AvatarFallback className="text-2xl">
              {name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-xl gradient-text">{name}</CardTitle>
            <CardDescription>{position} • {party}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{voteCount}</span>
            </div>
            <span className="text-sm text-muted-foreground">total votes</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            className="w-full button-hover"
            onClick={handleVote}
            disabled={isLoading || disabled}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Processing...</span>
              </div>
            ) : (
              "Vote"
            )}
          </Button>
          <Button variant="outline" onClick={shareVote} className="w-full">
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
