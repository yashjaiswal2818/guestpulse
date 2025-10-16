'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Users, Trophy, TrendingDown } from 'lucide-react'

interface Team {
    id: string
    name: string
    members: number
    checkedIn: number
    percentage: number
}

export function TeamPerformance({ eventId }: { eventId: string }) {
    // Fetch team data
    const teams: Team[] = [
        { id: '1', name: 'Alpha Squad', members: 6, checkedIn: 6, percentage: 100 },
        { id: '2', name: 'Beta Team', members: 5, checkedIn: 4, percentage: 80 },
        { id: '3', name: 'Gamma Group', members: 4, checkedIn: 2, percentage: 50 },
        { id: '4', name: 'Delta Force', members: 5, checkedIn: 0, percentage: 0 },
    ]

    const getStatusColor = (percentage: number) => {
        if (percentage === 100) return 'text-green-600 bg-green-50'
        if (percentage >= 75) return 'text-yellow-600 bg-yellow-50'
        if (percentage > 0) return 'text-orange-600 bg-orange-50'
        return 'text-gray-400 bg-gray-50'
    }

    const getIcon = (percentage: number) => {
        if (percentage === 100) return <Trophy className="h-4 w-4" />
        if (percentage === 0) return <TrendingDown className="h-4 w-4" />
        return <Users className="h-4 w-4" />
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {teams.map(team => (
                        <div key={team.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1 rounded ${getStatusColor(team.percentage)}`}>
                                        {getIcon(team.percentage)}
                                    </div>
                                    <span className="font-medium">{team.name}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {team.checkedIn}/{team.members} members
                                </span>
                            </div>
                            <Progress value={team.percentage} className="h-2" />
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900 font-medium">Team Check-in Leader</p>
                    <p className="text-xs text-blue-700 mt-1">
                        🏆 Alpha Squad - 100% attendance
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

