"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"]

interface VotingChartProps {
  data: Array<{
    name: string
    votes: number
    percentage: number
  }>
}

export function VotingChart({ data }: VotingChartProps) {
  const chartData = data.map((item) => ({
    name: item.name,
    value: item.votes,
    percentage: item.percentage,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percentage }) => `${name}: ${percentage}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
