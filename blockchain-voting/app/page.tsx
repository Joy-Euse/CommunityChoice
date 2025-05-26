"use client"

import { useEffect, useState } from "react"
import { useWeb3 } from "@/components/web3-provider"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CandidateCard } from "@/components/voting/candidate-card"
import { VoteStatus } from "@/components/voting/vote-status"
import { ElectionControls } from "@/components/admin/election-controls"
import { getCandidates, hasVoted, getElectionStatus } from "@/lib/blockchain"
import { useToast } from "@/components/ui/use-toast"

interface Candidate {
  id: string
  name: string
  voteCount: string
  position: string
  party: string
}

// Mock data for development
const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "John Doe",
    voteCount: "150",
    position: "President",
    party: "Party A"
  },
  {
    id: "2",
    name: "Jane Smith",
    voteCount: "120",
    position: "President",
    party: "Party B"
  },
  {
    id: "3",
    name: "Mike Johnson",
    voteCount: "140",
    position: "Vice President",
    party: "Party A"
  }
]

export default function HomePage() {
  const web3 = useWeb3()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [hasUserVoted, setHasUserVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isElectionActive, setIsElectionActive] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [web3.address])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [candidatesData, voted, electionStatus] = await Promise.all([
        getCandidates(),
        web3.address ? hasVoted(web3.address) : false,
        getElectionStatus()
      ])

      // Map the blockchain data to include position and party
      const mappedCandidates: Candidate[] = candidatesData.map((candidate, index) => ({
        ...candidate,
        position: mockCandidates[index]?.position || "Unknown Position",
        party: mockCandidates[index]?.party || "Independent"
      }))

      setCandidates(mappedCandidates)
      setHasUserVoted(voted)
      setIsElectionActive(electionStatus)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load election data",
        variant: "destructive",
      })
      // Fallback to mock data in case of error
      setCandidates(mockCandidates)
    } finally {
      setIsLoading(false)
    }
  }

  if (!web3.isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>Please connect your wallet to participate in the election</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={web3.connect}>Connect Wallet</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Vote chain's Election</h1>
              <p className="text-muted-foreground">
                {!isElectionActive 
                  ? "This election is currently inactive."
                  : hasUserVoted
                    ? "You have already cast your vote in this election."
                    : "Cast your vote for your preferred candidate."}
              </p>
            </div>
            <ElectionControls />
          </div>

          {hasUserVoted && <VoteStatus />}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                id={candidate.id}
                name={candidate.name}
                voteCount={candidate.voteCount}
                position={candidate.position}
                party={candidate.party}
                disabled={!isElectionActive || hasUserVoted}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
