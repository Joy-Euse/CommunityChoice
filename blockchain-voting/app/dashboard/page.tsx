"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { VotingChart } from "@/components/charts/voting-chart"
import { 
  TrendingUp, Users, Vote, Shield, Download, RefreshCw, 
  Bell, Clock, ChevronRight, FileText, BarChart3, 
  ArrowUpRight, ArrowDownRight, Filter
} from "lucide-react"
import { getCandidates, getElectionStatus, getElectionResults } from "@/lib/blockchain"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [electionData, setElectionData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [timeFilter, setTimeFilter] = useState("all")
  const [showNotifications, setShowNotifications] = useState(true)

  const loadElectionData = async () => {
    try {
      setIsLoading(true)
      const [candidates, electionStatus, results] = await Promise.all([
        getCandidates(),
        getElectionStatus(),
        getElectionResults()
      ])

      const totalVotes = candidates.reduce((sum: number, candidate: any) => 
        sum + Number(candidate.voteCount), 0)

      const registeredVoters = 1000 
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
          trend: "0%"
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
    <main className="container mx-auto px-6 py-10 mt-20">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center text-sm text-muted-foreground">
          <a href="/" className="hover:text-primary">Home</a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>Dashboard</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Election Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time voting analytics and statistics</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {timeFilter === 'all' ? 'All Time' : 
                   timeFilter === 'hour' ? 'Last Hour' : 
                   timeFilter === 'day' ? 'Today' : 'This Week'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTimeFilter('all')}>All Time</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('hour')}>Last Hour</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('day')}>Today</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('week')}>This Week</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" 
              onClick={() => setShowNotifications(!showNotifications)}>
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {showNotifications && (
          <Alert>
            <AlertDescription className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="card-glow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
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
            <TabsTrigger value="live-results">Live Results</TabsTrigger>
            <TabsTrigger value="voter-analytics">Voter Analytics</TabsTrigger>
            <TabsTrigger value="security">Security & Blockchain</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Vote Distribution</CardTitle>
                  <CardDescription>Current vote share by candidate</CardDescription>
                </CardHeader>
                <CardContent>
                  <VotingChart data={electionData?.candidates || []} />
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Quick Stats</CardTitle>
                  <CardDescription>Key metrics at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Election Phase</span>
                      <Badge variant={electionData?.isActive ? "default" : "secondary"}>
                        {electionData?.isActive ? "Voting Active" : "Voting Closed"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Participation Rate</span>
                      <div className="flex items-center">
                        <span className="font-mono mr-2">{electionData?.turnoutRate}%</span>
                        {Number(electionData?.turnoutRate) > 50 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Time Remaining</span>
                      <span className="font-mono">2d 14h 35m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="live-results" className="space-y-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Candidate Rankings</CardTitle>
                <CardDescription>Live vote counts and rankings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {electionData?.candidates.map((candidate: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`/candidates/candidate-${index + 1}.jpg`} alt={candidate.name} />
                          <AvatarFallback>{candidate.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{candidate.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {candidate.votes.toLocaleString()} votes
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{candidate.percentage}%</p>
                              <div className="flex items-center gap-1">
                                <Badge variant="secondary" className="text-xs">
                                  {candidate.trend}
                                </Badge>
                                {Number(candidate.trend) > 0 ? (
                                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                                ) : (
                                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                                )}
                              </div>
                            </div>
                          </div>
                          <Progress value={Number(candidate.percentage)} className="h-2 mt-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voter-analytics" className="space-y-6">
            {/* Add other tab contents similarly */}
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Add other tab contents similarly */}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  </div>
)

}
