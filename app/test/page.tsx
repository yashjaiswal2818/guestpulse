import { supabase } from '@/lib/supabase'

export default async function TestPage() {
  // Fetch the event
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('slug', 'cornell-hackathon-2025')
    .single()

  // Fetch registrations
  const { data: registrations, error: regError } = await supabase
    .from('registrations')
    .select('*')
    .eq('event_id', event?.id || '')

  if (eventError || regError) {
    return <div className="p-8 text-red-500">Error: {eventError?.message || regError?.message}</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Event</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Name:</strong> {event?.name}</p>
          <p><strong>Date:</strong> {new Date(event?.date || '').toLocaleDateString()}</p>
          <p><strong>Location:</strong> {event?.location}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Registrations ({registrations?.length})</h2>
        <div className="space-y-2">
          {registrations?.slice(0, 5).map((reg) => (
            <div key={reg.id} className="bg-gray-100 p-3 rounded">
              <p><strong>{reg.name}</strong> - {reg.email}</p>
              <p className="text-sm text-gray-600">
                {reg.attendance} | {reg.meal_preference} 
                {reg.team_name && ` | Team: ${reg.team_name}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}