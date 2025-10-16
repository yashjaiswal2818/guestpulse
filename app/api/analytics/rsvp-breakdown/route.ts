import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
    try {
        // Get all registrations
        const { data: registrations, error } = await supabase
            .from('registrations')
            .select('attendance')

        if (error) throw error

        // Count by attendance status
        const counts = {
            yes: 0,
            maybe: 0,
            no: 0
        }

        registrations?.forEach((reg) => {
            if (reg.attendance in counts) {
                counts[reg.attendance as keyof typeof counts]++
            }
        })

        // Convert to chart format
        const chartData = [
            { name: 'Yes', value: counts.yes },
            { name: 'Maybe', value: counts.maybe },
            { name: 'No', value: counts.no }
        ]

        return NextResponse.json(chartData)
    } catch (error) {
        console.error('RSVP breakdown error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch RSVP data' },
            { status: 500 }
        )
    }
}
