import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function EventsListPage() {
  const supabase = await createClient()
  
  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all events for this user with registration counts
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', user.id)
    .order('date', { ascending: false })

  // Get registration counts for each event
  const eventsWithCounts = await Promise.all(
    (events || []).map(async (event) => {
      const { count } = await supabase
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
        registrationCount: count || 0,
        checkedInCount: checkedInCount || 0,
      }
    })
  )

  const upcomingEvents = eventsWithCounts.filter(
    e => new Date(e.date) >= new Date()
  )
  const pastEvents = eventsWithCounts.filter(
    e => new Date(e.date) < new Date()
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button>Create Event</Button>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        <div className="grid gap-4">
          {upcomingEvents.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No upcoming events
              </CardContent>
            </Card>
          ) : (
            upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{event.name}</CardTitle>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.registrationCount} / {event.capacity} registered
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">Upcoming</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link href={`/organizer/events/${event.id}`}>
                      <Button size="sm">Manage</Button>
                    </Link>
                    <Link href={`/organizer/check-in?event=${event.id}`}>
                      <Button size="sm" variant="outline">
                        Check-in
                      </Button>
                    </Link>
                    <Link href={`/rsvp/${event.slug}`} target="_blank">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        RSVP Page
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Events</h2>
          <div className="grid gap-4">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-75">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(event.date).toLocaleDateString()} •
                        {event.checkedInCount} attended
                      </p>
                    </div>
                    <Badge variant="outline">Past</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={`/organizer/events/${event.id}`}>
                    <Button size="sm" variant="outline">View Report</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}