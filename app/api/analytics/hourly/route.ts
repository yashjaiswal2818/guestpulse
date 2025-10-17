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

        // Get user's events
        const { data: events } = await supabase
            .from('events')
            .select('id')
            .eq('organizer_id', user.id)

        const eventIds = events?.map(e => e.id) || []

        // Get all check-ins for user's events with timestamps
        const { data: registrations, error } = await supabase
            .from('registrations')
            .select('checked_in_at')
            .in('event_id', eventIds)
            .eq('checked_in', true)
            .not('checked_in_at', 'is', null)

        if (error) throw error

        // Group by hour
        const hourlyCount: { [key: string]: number } = {}

        registrations?.forEach((reg) => {
            if (reg.checked_in_at) {
                const hour = new Date(reg.checked_in_at).getHours()
                const hourLabel = `${hour}:00`
                hourlyCount[hourLabel] = (hourlyCount[hourLabel] || 0) + 1
            }
        })

        // Convert to chart format
        const chartData = Object.entries(hourlyCount)
            .map(([hour, count]) => ({
                hour,
                count
            }))
            .sort((a, b) => {
                const hourA = parseInt(a.hour.split(':')[0])
                const hourB = parseInt(b.hour.split(':')[0])
                return hourA - hourB
            })

        return NextResponse.json(chartData)
    } catch (error) {
        console.error('Hourly analytics error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch hourly data' },
            { status: 500 }
        )
    }
}
