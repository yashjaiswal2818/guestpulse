import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
    try {
        // Get all check-ins with timestamps
        const { data: registrations, error } = await supabase
            .from('registrations')
            .select('checked_in_at')
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
