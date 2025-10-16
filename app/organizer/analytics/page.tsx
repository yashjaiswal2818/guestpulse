import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, TrendingUp, Users, Calendar, Award } from 'lucide-react'

export default async function AnalyticsPage() {
    // Fetch all events and registrations
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false })

    const { data: allRegistrations } = await supabase
        .from('registrations')
        .select('*')

    // Calculate overall metrics
    const totalEvents = events?.length || 0
    const totalRegistrations = allRegistrations?.length || 0
    const totalCheckedIn = allRegistrations?.filter(r => r.checked_in).length || 0
    const overallShowRate = totalRegistrations > 0
        ? Math.round((totalCheckedIn / totalRegistrations) * 100)
        : 0

    // Calculate event-level metrics
    const eventMetrics = await Promise.all(
        (events || []).slice(0, 10).map(async (event) => {
            const { data: registrations } = await supabase
                .from('registrations')
                .select('*')
                .eq('event_id', event.id)

            const total = registrations?.length || 0
            const checkedIn = registrations?.filter(r => r.checked_in).length || 0
            const confirmed = registrations?.filter(r => r.attendance === 'yes').length || 0

            return {
                event,
                total,
                checkedIn,
                confirmed,
                showRate: confirmed > 0 ? Math.round((checkedIn / confirmed) * 100) : 0,
                isPast: new Date(event.date) < new Date(),
            }
        })
    )

    const pastEvents = eventMetrics.filter(e => e.isPast)
    const avgShowRate = pastEvents.length > 0
        ? Math.round(pastEvents.reduce((sum, e) => sum + e.showRate, 0) / pastEvents.length)
        : 0

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-gray-600 mt-1">
                    Track attendance patterns and performance across all events
                </p>
            </div>

            {/* Overall Stats */}
            <div className="grid md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEvents}</div>
                        <p className="text-xs text-muted-foreground">
                            All time
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalRegistrations}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all events
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Show Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallShowRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            {totalCheckedIn} / {totalRegistrations} attended
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Show Rate</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgShowRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            Past events average
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Event Performance Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Event Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {eventMetrics.length > 0 ? (
                            <div className="space-y-3">
                                {eventMetrics.map(({ event, total, checkedIn, confirmed, showRate, isPast }) => (
                                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold">{event.name}</h3>
                                                {!isPast && (
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        Upcoming
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {new Date(event.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                                {event.location && ` • ${event.location}`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-8 text-sm">
                                            <div className="text-center">
                                                <p className="text-gray-500 text-xs">Registered</p>
                                                <p className="font-semibold">{total}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-gray-500 text-xs">Confirmed</p>
                                                <p className="font-semibold">{confirmed}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-gray-500 text-xs">Checked In</p>
                                                <p className="font-semibold">{checkedIn}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-gray-500 text-xs">Show Rate</p>
                                                <p className={`font-semibold ${showRate >= 80 ? 'text-green-600' :
                                                        showRate >= 60 ? 'text-yellow-600' :
                                                            'text-red-600'
                                                    }`}>
                                                    {showRate}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <BarChart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No events yet</p>
                                <p className="text-sm mt-1">Create your first event to see analytics</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Coming Soon Features */}
            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
                            <h3 className="font-semibold text-sm mb-1">Attendance Trends</h3>
                            <p className="text-xs text-gray-600">Track show rates over time with charts</p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                            <Users className="w-6 h-6 text-green-600 mb-2" />
                            <h3 className="font-semibold text-sm mb-1">Commitment Scores</h3>
                            <p className="text-xs text-gray-600">See guest reliability rankings</p>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-lg">
                            <Calendar className="w-6 h-6 text-purple-600 mb-2" />
                            <h3 className="font-semibold text-sm mb-1">Predictive Analytics</h3>
                            <p className="text-xs text-gray-600">AI-powered attendance predictions</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
