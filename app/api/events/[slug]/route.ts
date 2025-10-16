import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/events/[slug] - Get single event with registrations
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  // Fetch event
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (eventError || !event) {
    return NextResponse.json(
      { error: 'Event not found' },
      { status: 404 }
    )
  }

  // Fetch registrations for this event
  const { data: registrations, error: regError } = await supabase
    .from('registrations')
    .select('*')
    .eq('event_id', event.id)
    .order('created_at', { ascending: false })

  if (regError) {
    return NextResponse.json(
      { error: regError.message },
      { status: 500 }
    )
  }

  // Calculate stats
  const stats = {
    total: registrations?.length || 0,
    confirmed: registrations?.filter(r => r.attendance === 'yes').length || 0,
    maybe: registrations?.filter(r => r.attendance === 'maybe').length || 0,
    declined: registrations?.filter(r => r.attendance === 'no').length || 0,
    checkedIn: registrations?.filter(r => r.checked_in).length || 0,
  }

  // Group by team
  const teams = registrations?.reduce((acc, reg) => {
    if (!reg.team_name) return acc
    if (!acc[reg.team_name]) {
      acc[reg.team_name] = []
    }
    acc[reg.team_name].push(reg)
    return acc
  }, {} as Record<string, typeof registrations>)

  return NextResponse.json({
    event,
    registrations,
    stats,
    teams,
  })
}