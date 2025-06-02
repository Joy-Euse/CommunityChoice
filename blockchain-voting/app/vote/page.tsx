"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle2, Info, Loader2, Vote } from 'lucide-react'
import { castVote, getElectionData, checkVoterStatus } from "@/lib/blockchain"

interface Candidate {
  id: string
  name: string
  position: string
  party: string
  votes: number
}

interface Position {
  id: string
  title: string
  candidates: Candidate[]
}

export default function VotePage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [voted, setVoted] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [positions, setPositions] = useState<Position[]>([])
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({})
  const [activePosition, setActivePosition] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user has already voted
        const voterStatus = await checkVoterStatus()
        setHasVoted(voterStatus.hasVoted)

        // Get election data
        const data = await getElectionData()
        setPositions(data.positions)

        if (data.positions.length > 0) {
          setActivePosition(data.positions[0].id)
        }
      } catch (error) {
        console.error("Error fetching election data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleVote = async () => {
    setSubmitting(true)

    try {
      // Submit votes to blockchain
      await castVote(selectedCandidates)
      setVoted(true)
    } catch (error) {
      console.error("Error casting vote:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSelectCandidate = (positionId: string, candidateId: string) => {
    setSelectedCandidates({
      ...selectedCandidates,
      [positionId]: candidateId,
    })
  }

  const isFormComplete = () => {
    return positions.every((position) => selectedCandidates[position.id])
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
          <p>Loading election data...</p>
        </div>
      </div>
    )
  }

  if (hasVoted) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center">
              <Link href="/" className="mr-auto">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
            </div>
            <CardTitle className="text-2xl">Already Voted</CardTitle>
            <CardDescription>You have already cast your vote in this election</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold">Thank You For Voting!</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                Your vote has been recorded on the blockchain and cannot be changed.
              </p>
              <Link href="/results">
                <Button>View Results</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (voted) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center">
              <Link href="/" className="mr-auto">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
            </div>
            <CardTitle className="text-2xl">Vote Successful</CardTitle>
            <CardDescription>Your vote has been recorded on the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold">Thank You For Voting!</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                Your vote has been securely recorded. The transaction hash has been sent to your email for verification.
              </p>
              <Link href="/results">
                <Button>View Results</Button>
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-xs text-muted-foreground text-center">
              Transaction ID: 0x7f9e4b5c3d2a1b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6
            </p>
          </CardFooter>
        </Card>
      </div>
    )
  }
return (
  <div className="container py-12">
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full mb-10">
        <Link href="/" className="inline-block mb-5">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <img src="/images/unizik-logo.png" alt="UNIZIK Logo" className="h-10 w-auto" />
          <h1 className="text-3xl font-semibold text-gray-800">Cast Your Vote</h1>
        </div>
        <p className="text-sm text-gray-500">
          Select your preferred candidates for each position in the Student Council Election 2025
        </p>
      </div>

      <Alert className="mb-8 border border-blue-200 bg-blue-50 text-blue-800">
        <Info className="h-4 w-4" />
        <AlertTitle className="font-semibold">Important Information</AlertTitle>
        <AlertDescription className="text-sm">
          Your vote will be recorded on the Ethereum blockchain and cannot be changed once submitted. Make sure to
          review your choices before confirming.
        </AlertDescription>
      </Alert>

      <Card className="w-full shadow-sm border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">ZIKITESVOTE Election 2025</CardTitle>
          <CardDescription className="text-sm text-gray-500">Voting period: April 20 - April 25, 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activePosition} onValueChange={setActivePosition} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 bg-gray-100 p-1 rounded-md">
              {positions.slice(0, 3).map((position) => (
                <TabsTrigger
                  key={position.id}
                  value={position.id}
                  className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow"
                >
                  {position.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {positions.map((position) => (
              <TabsContent key={position.id} value={position.id} className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg text-gray-800">{position.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">Select one candidate for this position</p>
                  <RadioGroup
                    value={selectedCandidates[position.id] || ""}
                    onValueChange={(value) => handleSelectCandidate(position.id, value)}
                  >
                    {position.candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className={`flex items-center space-x-3 rounded-md border px-4 py-3 transition-colors ${
                          selectedCandidates[position.id] === candidate.id
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <RadioGroupItem value={candidate.id} id={candidate.id} />
                        <Label htmlFor={candidate.id} className="flex flex-col cursor-pointer w-full">
                          <span className="font-medium text-gray-800">{candidate.name}</span>
                          <span className="text-sm text-gray-500">{candidate.party}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col border-t pt-6 bg-gray-50">
          <Button
            onClick={handleVote}
            disabled={!isFormComplete() || submitting}
            className="w-full mb-4 text-white bg-emerald-600 hover:bg-emerald-700"
            size="lg"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Submit Vote"
            )}
          </Button>
          <p className="text-xs text-gray-500 text-center px-4">
            By submitting your vote, you confirm that you are eligible to vote in this election and that you are casting
            your vote of your own free will.
          </p>
        </CardFooter>
      </Card>
    </div>
  </div>
)

}
