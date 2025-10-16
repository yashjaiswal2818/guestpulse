'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, UserPlus, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Activity {
    id: string
    type: 'registration' | 'checkin' | 'update'
    name: string
    action: string
    timestamp: Date
}

export function LiveActivityFeed({ eventId }: { eventId: string }) {
    const [activities, setActivities] = useState<Activity[]>([])

    // Simulate real-time updates (replace with Supabase realtime later)
    useEffect(() => {
        // Fetch initial activities
        fetchActivities()

        // Poll for updates every 5 seconds
        const interval = setInterval(fetchActivities, 5000)
        return () => clearInterval(interval)
    }, [eventId])

    const fetchActivities = async () => {
        // Fetch recent activities from your API
        // For now, using mock data
        setActivities([
            {
                id: '1',
                type: 'checkin',
                name: 'John Doe',
                action: 'checked in',
                timestamp: new Date(Date.now() - 60000)
            },
            {
                id: '2',
                type: 'registration',
                name: 'Jane Smith',
                action: 'registered (Yes)',
                timestamp: new Date(Date.now() - 120000)
            },
            {
                id: '3',
                type: 'update',
                name: 'Bob Wilson',
                action: 'changed to Maybe',
                timestamp: new Date(Date.now() - 300000)
            }
        ])
    }

    const getIcon = (type: Activity['type']) => {
        switch (type) {
            case 'checkin': return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'registration': return <UserPlus className="h-4 w-4 text-blue-500" />
            case 'update': return <Clock className="h-4 w-4 text-yellow-500" />
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Live Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {activities.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No activity yet...</p>
                    ) : (
                        activities.map(activity => (
                            <div key={activity.id} className="flex items-start gap-3 text-sm">
                                {getIcon(activity.type)}
                                <div className="flex-1">
                                    <span className="font-medium">{activity.name}</span>
                                    <span className="text-muted-foreground"> {activity.action}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

