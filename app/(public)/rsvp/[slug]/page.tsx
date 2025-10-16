import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import RSVPForm from '@/components/public/rsvp-form'
import { Card } from '@/components/ui/card'
import { Calendar, MapPin, Users } from 'lucide-react'

export default async function RSVPPage({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}) {
  // Await params in Next.js 15
  const { slug } = await params

  // Fetch event data
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !event) {
    notFound()
  }

  // Fetch current registration count
  const { count } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event.id)
    .eq('attendance', 'yes')

  const spotsLeft = event.capacity - (count || 0)
  const isPastEvent = new Date(event.date) < new Date()
  const isFull = spotsLeft <= 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {event.name}
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{event.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>
                {spotsLeft > 0 
                  ? `${spotsLeft} spots left` 
                  : 'Event is full'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="md:col-span-2 space-y-6">
            {event.description && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-3">About this event</h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {event.description}
                </p>
              </Card>
            )}

            {/* RSVP Form */}
            {!isPastEvent && !isFull ? (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Register for this event</h2>
                <RSVPForm eventId={event.id} eventSlug={event.slug} />
              </Card>
            ) : isPastEvent ? (
              <Card className="p-6 bg-gray-50">
                <p className="text-center text-gray-600">
                  This event has already taken place.
                </p>
              </Card>
            ) : (
              <Card className="p-6 bg-yellow-50 border-yellow-200">
                <p className="text-center text-yellow-800">
                  Sorry, this event is full.
                </p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Event Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Date & Time</p>
                  <p className="font-medium">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="font-medium">
                    {new Date(event.date).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                
                {event.location && (
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-gray-500">Capacity</p>
                  <p className="font-medium">
                    {count || 0} / {event.capacity} registered
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}