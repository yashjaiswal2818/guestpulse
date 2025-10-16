import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, UserCheck } from 'lucide-react'
import { Registration } from '@/lib/types/database'

interface TeamsListProps {
    teams: Record<string, Registration[]>
}

export default function TeamsList({ teams }: TeamsListProps) {
    const teamEntries = Object.entries(teams).sort((a, b) => b[1].length - a[1].length)

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teamEntries.map(([teamName, members]) => {
                const checkedInCount = members.filter(m => m.checked_in).length
                const allCheckedIn = checkedInCount === members.length
                const someCheckedIn = checkedInCount > 0

                return (
                    <Card
                        key={teamName}
                        className={`
              ${allCheckedIn ? 'border-green-500 bg-green-50' : ''}
              ${someCheckedIn && !allCheckedIn ? 'border-yellow-500 bg-yellow-50' : ''}
            `}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="truncate">{teamName}</span>
                                <Badge variant="secondary">
                                    <Users className="w-3 h-3 mr-1" />
                                    {members.length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {members.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between text-sm">
                                        <span className="truncate">{member.name}</span>
                                        {member.checked_in && (
                                            <UserCheck className="w-4 h-4 text-green-600" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Check-in Progress */}
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Check-in Progress</span>
                                    <span>{checkedInCount}/{members.length}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${allCheckedIn ? 'bg-green-500' :
                                            someCheckedIn ? 'bg-yellow-500' : 'bg-gray-300'
                                            }`}
                                        style={{ width: `${(checkedInCount / members.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}