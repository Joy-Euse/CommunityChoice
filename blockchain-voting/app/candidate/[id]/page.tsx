"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/hooks/use-web3"
import { ArrowLeft, Vote, Share2, ExternalLink, TrendingUp, Users, Calendar, Award } from "lucide-react"

// Mock candidate data - replace with actual blockchain data
const mockCandidateData = {
  1: {
    id: 1,
    name: "Alice Johnson",
    description: "Experienced leader focused on transparency and innovation in governance.",
    longDescription:
      "Alice Johnson brings over 15 years of experience in public service and technology. She has been a vocal advocate for digital rights, climate action, and educational reform. Her vision includes implementing blockchain-based transparency measures in government operations and creating sustainable economic policies for the future.",
    voteCount: 1247,
    image: "/placeholder.svg?height=400&width=400",
    party: "Progressive Alliance",
    platform: ["Digital Rights", "Climate Action", "Education Reform", "Healthcare Access", "Economic Innovation"],
    experience: [
      "Former City Council Member (2018-2022)",
      "Technology Policy Advisor (2015-2018)",
      "Community Organizer (2010-2015)",
    ],
    education: ["Master's in Public Policy - Harvard University", "Bachelor's in Computer Science - MIT"],
    endorsements: ["Tech Workers Union", "Environmental Coalition", "Education Alliance"],
    socialMedia: {
      twitter: "@alicejohnson",
      linkedin: "alice-johnson-policy",
      website: "https://alicejohnson.vote",
    },
  },
}

export default function CandidatePage() {
  const params = useParams()
  const candidateId = Number.parseInt(params.id as string)
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const { isConnected, connect } = useWeb3()
  const { toast } = useToast()

  const candidate = mockCandidateData[candidateId as keyof typeof mockCandidateData]

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Candidate Not Found</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/">
                <Button>Back to Candidates</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const handleVote = async () => {
    if (!isConnected) {
      try {
        await connect()
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Please connect your wallet to vote",
          variant: "destructive",
        })
        return
      }
    }

    setIsVoting(true)
    try {
      // Simulate voting transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Vote Cast Successfully!",
        description: `Your vote for ${candidate.name} has been recorded on the blockchain.`,
      })
      setHasVoted(true)
    } catch (error) {
      toast({
        title: "Voting Failed",
        description: "There was an error casting your vote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
    }
  }

  const shareCandidate = () => {
    if (navigator.share) {
      navigator.share({
        title: `Vote for ${candidate.name}`,
        text: candidate.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Candidate link copied to clipboard",
      })
    }
  }

  const votePercentage = (candidate.voteCount / 4038) * 100

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-block mb-6">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Candidates</span>
            </Button>
          </Link>

          {/* Hero Section */}
          <Card className="card-glow mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <Avatar className="h-48 w-48 mx-auto mb-6">
                    <AvatarImage src={candidate.image || "/placeholder.svg"} alt={candidate.name} />
                    <AvatarFallback className="text-4xl">
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center space-y-4">
                    <Button onClick={handleVote} disabled={hasVoted || isVoting} size="lg" className="w-full">
                      {isVoting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Voting...
                        </>
                      ) : hasVoted ? (
                        "Already Voted"
                      ) : (
                        <>
                          <Vote className="h-4 w-4 mr-2" />
                          Vote for {candidate.name}
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={shareCandidate} className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Candidate
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">{candidate.name}</h1>
                    <Badge variant="outline" className="mb-4">
                      {candidate.party}
                    </Badge>
                    <p className="text-lg text-muted-foreground">{candidate.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{candidate.voteCount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Votes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{votePercentage.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Vote Share</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">#1</div>
                      <div className="text-sm text-muted-foreground">Current Rank</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Vote Progress</span>
                      <span className="text-sm font-bold">{votePercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={votePercentage} className="h-3" />
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Leading candidate</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>+5.2% today</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <Tabs defaultValue="about" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="platform">Platform</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="endorsements">Endorsements</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>About {candidate.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{candidate.longDescription}</p>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        Education
                      </h4>
                      <ul className="space-y-2">
                        {candidate.education.map((edu, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {edu}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3 flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Connect
                      </h4>
                      <div className="space-y-2">
                        <a
                          href={`https://twitter.com/${candidate.socialMedia.twitter.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-blue-500 hover:underline"
                        >
                          {candidate.socialMedia.twitter}
                        </a>
                        <a
                          href={candidate.socialMedia.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-blue-500 hover:underline"
                        >
                          Official Website
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="platform" className="space-y-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>Policy Platform</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidate.platform.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>Professional Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidate.experience.map((exp, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <span>{exp}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="endorsements" className="space-y-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>Endorsements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidate.endorsements.map((endorsement, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{endorsement}</span>
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
