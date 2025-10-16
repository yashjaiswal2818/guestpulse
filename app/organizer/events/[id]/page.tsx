import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import GuestList from '@/components/organizer/guest-list'
import EventStats from '@/components/organizer/event-stats'
import TeamsList from '@/components/organizer/teams-list'
import { PredictionCard } from '@/components/organizer/prediction-card'
import { QuickStats } from '@/components/organizer/analytics-charts'
import { LiveActivityFeed } from '@/components/organizer/live-feed'
import { TeamPerformance } from '@/components/organizer/team-performance'
import { Button } from '@/components/ui/button'
import { Download, ExternalLink, QrCode } from 'lucide-react'
import Link from 'next/link'

export default async function EventDashboard({
  params
}: {
  params: Promise<{ id: string }>
}) {
  // Await params in Next.js 15
  const { id } = await params

  // Fetch event
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Fetch registrations
  const { data: registrations } = await supabase
    .from('registrations')
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: false })

  const stats = {
    total: registrations?.length || 0,
    confirmed: registrations?.filter(r => r.attendance === 'yes').length || 0,
    maybe: registrations?.filter(r => r.attendance === 'maybe').length || 0,
    declined: registrations?.filter(r => r.attendance === 'no').length || 0,
    checkedIn: registrations?.filter(r => r.checked_in).length || 0,
  }

  // Group registrations by team
  const teams = registrations?.reduce((acc, reg) => {
    if (!reg.team_name) return acc
    if (!acc[reg.team_name]) {
      acc[reg.team_name] = []
    }
    acc[reg.team_name].push(reg)
    return acc
  }, {} as Record<string, typeof registrations>)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
            <p className="text-gray-600 mt-1">
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
            {event.location && (
              <p className="text-gray-600">📍 {event.location}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/rsvp/${event.slug}`} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                View RSVP Page
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/organizer/check-in?event=${event.id}`}>
                <QrCode className="w-4 h-4 mr-2" />
                Check-in Mode
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <EventStats stats={stats} capacity={event.capacity} />

      {/* Prediction and Live Feed */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <PredictionCard eventId={id} />
        <LiveActivityFeed eventId={id} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="guests" className="mt-8">
        <TabsList>
          <TabsTrigger value="guests">
            All Guests ({registrations?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="teams">
            Teams ({Object.keys(teams || {}).length})
          </TabsTrigger>
          <TabsTrigger value="dietary">
            Dietary Preferences
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guests" className="mt-6">
          <GuestList registrations={registrations || []} />
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <TeamsList teams={teams || {}} />
        </TabsContent>

        <TabsContent value="dietary" className="mt-6">
          <DietaryPreferences registrations={registrations || []} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="space-y-6">
            <QuickStats eventId={id} />
            <TeamPerformance eventId={id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Dietary Preferences Component
function DietaryPreferences({ registrations }: { registrations: any[] }) {
  const mealCounts = registrations.reduce((acc, reg) => {
    if (reg.meal_preference) {
      acc[reg.meal_preference] = (acc[reg.meal_preference] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const restrictions = registrations
    .filter(r => r.dietary_restrictions)
    .map(r => ({
      name: r.name,
      restriction: r.dietary_restrictions,
    }))

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Meal Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(mealCounts).map(([meal, count]) => (
              <div key={meal} className="flex justify-between">
                <span className="capitalize">{meal}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dietary Restrictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {restrictions.length > 0 ? (
              restrictions.map((r, i) => (
                <div key={i} className="text-sm">
                  <span className="font-medium">{r.name}:</span>
                  <span className="text-gray-600 ml-2">{r.restriction}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No dietary restrictions reported</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}