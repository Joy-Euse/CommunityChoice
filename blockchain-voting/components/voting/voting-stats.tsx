"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Clock, Shield } from "lucide-react"

interface Candidate {
  id: number
  name: string
  voteCount: number
}

interface VotingStatsProps {
  candidates: Candidate[]
}

export function VotingStats({ candidates }: VotingStatsProps) {
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0)
  const leadingCandidate = candidates.reduce((prev, current) => (prev.voteCount > current.voteCount ? prev : current))

  const stats = [
    {
      title: "Total Votes Cast",
      value: totalVotes.toLocaleString(),
      icon: Users,
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Leading Candidate",
      value: leadingCandidate.name,
      icon: TrendingUp,
      change: `${leadingCandidate.voteCount} votes`,
      changeType: "neutral" as const,
    },
    {
      title: "Time Remaining",
      value: "2 days",
      icon: Clock,
      change: "48 hours left",
      changeType: "neutral" as const,
    },
    {
      title: "Blockchain Security",
      value: "100%",
      icon: Shield,
      change: "Immutable",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <Badge variant={stat.changeType === "positive" ? "default" : "secondary"} className="mt-2">
                {stat.change}
              </Badge>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
