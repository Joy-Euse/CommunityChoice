"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getVotedCandidate, getCandidates } from "@/lib/blockchain"
import { useWeb3 } from "@/components/web3-provider"

export function VoteStatus() {
  const [votedFor, setVotedFor] = useState<number | null>(null)
  const [candidateName, setCandidateName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const web3 = useWeb3()

  useEffect(() => {
    const checkVoteStatus = async () => {
      if (!web3.address) return

      try {
        setIsLoading(true)
        const votedCandidateId = await getVotedCandidate(web3.address)
        setVotedFor(Number(votedCandidateId))

        // Get candidate name
        const candidates = await getCandidates()
        const candidate = candidates.find(c => c.id === votedCandidateId.toString())
        if (candidate) {
          setCandidateName(candidate.name)
        }
      } catch (error) {
        console.error("Error checking vote status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkVoteStatus()
  }, [web3.address])

  if (!web3.address || !votedFor) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Vote</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">You voted for:</p>
            <p className="text-lg font-bold">{candidateName}</p>
            <p className="text-sm text-muted-foreground">
              Candidate ID: {votedFor}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 