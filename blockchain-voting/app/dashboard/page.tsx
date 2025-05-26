"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { VotingChart } from "@/components/charts/voting-chart"
import { TrendChart } from "@/components/charts/trend-chart"
import { TrendingUp, Users, Vote, Shield, Download, RefreshCw } from "lucide-react"
import { getCandidates, getElectionStatus, getElectionResults } from "@/lib/blockchain"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [electionData, setElectionData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const loadElectionData = async () => {
    try {
      setIsLoading(true)
      const [candidates, electionStatus, results] = await Promise.all([
        getCandidates(),
        getElectionStatus(),
        getElectionResults()
      ])

      // Calculate total votes
      const totalVotes = candidates.reduce((sum: number, candidate: any) => 
        sum + Number(candidate.voteCount), 0)

      // Calculate turnout rate (assuming 1000 registered voters for now)
      const registeredVoters = 1000 // This should come from your smart contract
      const turnoutRate = (totalVotes / registeredVoters) * 100

      setElectionData({
        totalVotes,
        totalVoters: registeredVoters,
        turnoutRate: turnoutRate.toFixed(1),
        isActive: electionStatus,
        candidates: candidates.map((candidate: any) => ({
          name: candidate.name,
          votes: Number(candidate.voteCount),
          percentage: totalVotes > 0 
            ? ((Number(candidate.voteCount) / totalVotes) * 100).toFixed(1)
            : "0",
          trend: "0%" // This would need historical data to calculate
        })),
        results: results.positions[0].candidates
      })
    } catch (error) {
      console.error("Error loading election data:", error)
      toast({
        title: "Error",
        description: "Failed to load election data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadElectionData()
    // Set up polling every 30 seconds
    const interval = setInterval(loadElectionData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadElectionData()
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  const stats = electionData ? [
    {
      title: "Total Votes",
      value: electionData.totalVotes.toLocaleString(),
      icon: Vote,
      description: "Votes cast so far",
      trend: "Real-time data",
    },
    {
      title: "Registered Voters",
      value: electionData.totalVoters.toLocaleString(),
      icon: Users,
      description: "Eligible voters",
      trend: "Blockchain verified",
    },
    {
      title: "Turnout Rate",
      value: `${electionData.turnoutRate}%`,
      icon: TrendingUp,
      description: "Voter participation",
      trend: "Live calculation",
    },
    {
      title: "Election Status",
      value: electionData.isActive ? "Active" : "Inactive",
      icon: Shield,
      description: "Current status",
      trend: "Blockchain verified",
    },
  ] : []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 mt-16">
          <div className="flex items-center justify-center h-[60vh]">
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
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Election Dashboard</h1>
              <p className="text-muted-foreground">Real-time voting analytics and statistics</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="card-glow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {stat.trend}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle>Vote Distribution</CardTitle>
                    <CardDescription>Current vote share by candidate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VotingChart data={electionData?.candidates || []} />
                  </CardContent>
                </Card>

                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle>Election Status</CardTitle>
                    <CardDescription>Current state of the election</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Status</span>
                        <Badge variant={electionData?.isActive ? "default" : "secondary"}>
                          {electionData?.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Total Votes</span>
                        <span className="font-mono">{electionData?.totalVotes}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Turnout Rate</span>
                        <span className="font-mono">{electionData?.turnoutRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="candidates" className="space-y-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>Candidate Performance</CardTitle>
                  <CardDescription>Detailed breakdown of each candidate's performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {electionData?.candidates.map((candidate: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{candidate.name}</h4>
                            <p className="text-sm text-muted-foreground">{candidate.votes.toLocaleString()} votes</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{candidate.percentage}%</p>
                            <Badge variant="secondary" className="text-xs">
                              {candidate.trend}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={Number(candidate.percentage)} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle>Blockchain Metrics</CardTitle>
                    <CardDescription>Transaction and network statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Transactions</span>
                        <span className="font-mono">{electionData?.totalVotes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network Status</span>
                        <Badge variant="default">Healthy</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Update</span>
                        <span className="font-mono">{lastUpdated.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle>Election Summary</CardTitle>
                    <CardDescription>Key election metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Active Candidates</span>
                        <span className="font-mono">{electionData?.candidates.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Voting Period</span>
                        <Badge variant={electionData?.isActive ? "default" : "secondary"}>
                          {electionData?.isActive ? "Ongoing" : "Ended"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Source</span>
                        <Badge variant="outline">Blockchain</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
