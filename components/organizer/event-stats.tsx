'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, UserCheck, UserX, Clock, TrendingUp } from 'lucide-react'

interface EventStatsProps {
    stats: {
        total: number
        confirmed: number
        maybe: number
        declined: number
        checkedIn: number
    }
    capacity: number
}

export default function EventStats({ stats, capacity }: EventStatsProps) {
    const attendanceRate = stats.confirmed > 0
        ? Math.round((stats.checkedIn / stats.confirmed) * 100)
        : 0

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">
                        {capacity - stats.total} spots remaining
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                    <UserCheck className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.confirmed}</div>
                    <p className="text-xs text-muted-foreground">
                        Will attend
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Maybe</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.maybe}</div>
                    <p className="text-xs text-muted-foreground">
                        Undecided
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Checked In</CardTitle>
                    <UserCheck className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.checkedIn}</div>
                    <p className="text-xs text-muted-foreground">
                        Already arrived
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{attendanceRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        Of confirmed guests
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export function PredictedAttendance({ eventId }: { eventId: string }) {
    const [prediction, setPrediction] = useState<{
        predicted: number
        registered: number
        confidence: string
    } | null>(null)

    useEffect(() => {
        // Calculate based on commitment scores
        fetch(`/api/events/${eventId}/prediction`)
            .then(res => res.json())
            .then(data => setPrediction(data))
    }, [eventId])

    if (!prediction) return null

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Predicted Attendance
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {prediction.predicted}/{prediction.registered}
                </div>
                <p className="text-xs text-muted-foreground">
                    {Math.round((prediction.predicted / prediction.registered) * 100)}% show rate
                </p>
                <div className="mt-2">
                    <Badge variant={
                        prediction.confidence === 'high' ? 'default' :
                            prediction.confidence === 'medium' ? 'secondary' : 'outline'
                    }>
                        {prediction.confidence} confidence
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}