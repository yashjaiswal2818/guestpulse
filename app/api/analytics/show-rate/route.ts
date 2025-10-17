import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
    try {
        const supabase = await createClient()

        // Check authentication
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get all events for this user with their registrations
        const { data: events, error } = await supabase
            .from('events')
            .select('id, name, date')
            .eq('organizer_id', user.id)
            .order('date', { ascending: true })
            .limit(10)

        if (error) throw error

        // Calculate show rate for each event
        const chartData = await Promise.all(
            (events || []).map(async (event) => {
                const { data: registrations } = await supabase
                    .from('registrations')
                    .select('attendance, checked_in')
                    .eq('event_id', event.id)

                const registered = registrations?.filter(r => r.attendance === 'yes').length || 0
                const attended = registrations?.filter(r => r.checked_in).length || 0

                return {
                    date: new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    }),
                    registered,
                    attended,
                    name: event.name
                }
            })
        )

        return NextResponse.json(chartData)
    } catch (error) {
        console.error('Show rate analytics error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch show rate data' },
            { status: 500 }
        )
    }
}
