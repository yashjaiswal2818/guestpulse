'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// Individual chart components for analytics page
export function ShowRateChart({ data }: { data: any }) {
  const chartData = Array.isArray(data) ? data : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Show Rate Trends</CardTitle>
        <CardDescription>Predicted vs actual attendance over time</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No data available yet. Create events and collect RSVPs to see trends.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="event" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function AttendanceByHourChart({ data }: { data: any }) {
  const chartData = Array.isArray(data) ? data : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check-in by Hour</CardTitle>
        <CardDescription>Peak check-in times across all events</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No check-in data yet. Check in guests to see hourly patterns.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function RSVPBreakdownChart({ data }: { data: any }) {
  // Ensure data is always an array
  const chartData = Array.isArray(data) && data.length > 0 ? data : [
    { name: 'Yes', value: 0, color: '#10b981' },
    { name: 'Maybe', value: 0, color: '#f59e0b' },
    { name: 'No', value: 0, color: '#ef4444' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>RSVP Distribution</CardTitle>
        <CardDescription>Overall response breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label
            >
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function TeamPerformanceChart({ data }: { data: any }) {
  const chartData = Array.isArray(data) ? data : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Show Rates</CardTitle>
        <CardDescription>Attendance by team across all events</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No team data yet. Register guests with team names to see performance.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="team" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="showRate" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

// Quick analytics component for event page
export function QuickStats({ eventId }: { eventId: string }) {
  // Fetch data and render charts
  const mockData = {
    hourly: [
      { hour: '6pm', count: 5 },
      { hour: '6:30pm', count: 15 },
      { hour: '7pm', count: 35 },
      { hour: '7:30pm', count: 42 },
      { hour: '8pm', count: 45 },
    ],
    rsvp: [
      { name: 'Yes', value: 65, color: '#10b981' },
      { name: 'Maybe', value: 25, color: '#f59e0b' },
      { name: 'No', value: 10, color: '#ef4444' },
    ]
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Check-in Timeline</CardTitle>
          <CardDescription>When people arrived</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockData.hourly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>RSVP Breakdown</CardTitle>
          <CardDescription>Response distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={mockData.rsvp}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {mockData.rsvp.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
