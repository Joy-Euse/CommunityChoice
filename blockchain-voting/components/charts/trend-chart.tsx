"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TrendChartProps {
  data: Array<{
    hour: string
    votes: number
  }>
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="votes" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
