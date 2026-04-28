'use client'

import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts'

type Point = { date: string; revenue: number; orders: number }

interface Props {
  type?: 'line' | 'bar'
  period: '7days' | '30days' | '12months'
  metric?: 'revenue' | 'orders'
  height?: number
}

export default function RevenueChart({
  type = 'line',
  period,
  metric = 'revenue',
  height = 300,
}: Props) {
  const [data, setData] = useState<Point[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/revenue?period=${period}`)
      .then((r) => r.json())
      .then((d) => setData(d.data ?? []))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [period])

  if (loading) {
    return (
      <div
        className="flex animate-pulse items-center justify-center rounded-2xl bg-parchment text-warmgray"
        style={{ height }}
      >
        Loading chart…
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-parchment text-warmgray" style={{ height }}>
        No data yet
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        {type === 'line' ? (
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#E5DCC0" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#8B7355" fontSize={11} />
            <YAxis stroke="#8B7355" fontSize={11} />
            <Tooltip
              contentStyle={{
                background: '#FDF8F0',
                border: '1px solid #2D5016',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: number) => (metric === 'revenue' ? `₹${v.toLocaleString('en-IN')}` : v)}
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke="#2D5016"
              strokeWidth={2.5}
              dot={{ fill: '#C8860A', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#E5DCC0" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#8B7355" fontSize={11} />
            <YAxis stroke="#8B7355" fontSize={11} />
            <Tooltip
              contentStyle={{
                background: '#FDF8F0',
                border: '1px solid #2D5016',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey={metric} fill="#C8860A" radius={[6, 6, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
