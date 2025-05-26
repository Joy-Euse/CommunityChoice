"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, Download, ExternalLink, RefreshCw } from "lucide-react"
import { getElectionResults } from "@/lib/blockchain"

interface Candidate {
  id: string
  name: string
  position: string
  party: string
  votes: number
  percentage: number
}

interface Position {
  id: string
  title: string
  candidates: Candidate[]
  totalVotes: number
}

export default function ResultsPage() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [positions, setPositions] = useState<Position[]>([])
  const [activePosition, setActivePosition] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const results = await getElectionResults()
      setPositions(results.positions)

      if (results.positions.length > 0) {
        setActivePosition(results.positions[0].id)
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching results:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchResults()
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col items-center max-w-4xl mx-auto">
        <div className="w-full mb-8">
          <Link href="/" className="inline-block mb-4">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <img src="/images/unizik-logo.png" alt="UNIZIK Logo" className="h-10 w-auto" />
            <h1 className="text-3xl font-bold">Election Results</h1>
          </div>
          <p className="text-muted-foreground">Live results for the Student Council Election 2025</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>ZIKITESVOTE Election 2025</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
                  <p>Loading election results...</p>
                </div>
              </div>
            ) : (
              <Tabs value={activePosition} onValueChange={setActivePosition} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  {positions.slice(0, 3).map((position) => (
                    <TabsTrigger key={position.id} value={position.id}>
                      {position.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {positions.map((position) => (
                  <TabsContent key={position.id} value={position.id} className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">{position.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">Total votes: {position.totalVotes}</p>
                      <div className="space-y-4">
                        {position.candidates.map((candidate) => (
                          <div key={candidate.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{candidate.name}</p>
                                <p className="text-sm text-muted-foreground">{candidate.party}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{candidate.votes} votes</p>
                                <p className="text-sm text-muted-foreground">{candidate.percentage.toFixed(1)}%</p>
                              </div>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width: `${candidate.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
            <div className="mt-8 pt-4 border-t">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Results are verified on the Ethereum blockchain</p>
                <Link href="#" className="text-sm text-emerald-600 hover:underline flex items-center">
                  View on Etherscan
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
