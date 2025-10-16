import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, Users, CheckCircle, Clock, Plus, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function OrganizerDashboard() {
  // Fetch all events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  // Get today's and upcoming events
  const today = new Date()
  const upcomingEvents = events?.filter(e => new Date(e.date) >= today) || []
  const todayEvents = upcomingEvents.filter(e => {
    const eventDate = new Date(e.date)
    return eventDate.toDateString() === today.toDateString()
  })

  // Fetch all registrations for stats
  const { data: allRegistrations } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })

  // Calculate overall stats
  const totalRegistrations = allRegistrations?.length || 0
  const totalCheckedIn = allRegistrations?.filter(r => r.checked_in).length || 0
  const recentRegistrations = allRegistrations?.slice(0, 5) || []

  // Get event-specific stats
  const eventStats = await Promise.all(
    (todayEvents || []).map(async (event) => {
      const { count: totalCount } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id)

      const { count: checkedInCount } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id)
        .eq('checked_in', true)

      return {
        ...event,
        totalCount: totalCount || 0,
        checkedInCount: checkedInCount || 0,
      }
    })
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <Button asChild>
          <Link href="/organizer/events/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingEvents.length} upcoming
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
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCheckedIn}</div>
            <p className="text-xs text-muted-foreground">
              {totalRegistrations > 0 ? Math.round((totalCheckedIn / totalRegistrations) * 100) : 0}% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Happening now
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventStats.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{event.name}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                      {event.location && ` • ${event.location}`}
                    </p>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span className="text-gray-600">
                        {event.checkedInCount}/{event.totalCount} checked in
                      </span>
                      {event.totalCount > 0 && (
                        <span className="text-green-600">
                          {Math.round((event.checkedInCount / event.totalCount) * 100)}% attendance
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/organizer/check-in?event=${event.id}`}>
                        Check-in
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/organizer/events/${event.id}`}>
                        Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity & Upcoming Events */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Registrations</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/organizer/events">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentRegistrations.length > 0 ? (
              <div className="space-y-3">
                {recentRegistrations.map((reg) => {
                  const event = events?.find(e => e.id === reg.event_id)
                  return (
                    <div key={reg.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{reg.name}</p>
                        <p className="text-xs text-gray-600">{event?.name}</p>
                      </div>
                      <Badge variant={reg.attendance === 'yes' ? 'default' : 'secondary'}>
                        {reg.attendance}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent registrations</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Events</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/organizer/events">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingEvents.slice(0, 5).length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.name}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/organizer/events/${event.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No upcoming events</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
