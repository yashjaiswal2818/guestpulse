import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const eventId = searchParams.get('eventId')

        if (!eventId) {
            return NextResponse.json(
                { error: 'eventId is required' },
                { status: 400 }
            )
        }

        // Fetch event details
        const { data: event } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single()

        // Fetch all registrations for this event
        const { data: registrations, error } = await supabase
            .from('registrations')
            .select('*')
            .eq('event_id', eventId)
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        // Create CSV content
        const headers = [
            'Name',
            'Email',
            'Attendance Status',
            'Team Name',
            'Meal Preference',
            'Dietary Restrictions',
            'QR Code',
            'Checked In',
            'Check-in Time',
            'Registered At',
        ]

        const rows = (registrations || []).map((reg) => [
            reg.name,
            reg.email,
            reg.attendance,
            reg.team_name || '',
            reg.meal_preference || '',
            reg.dietary_restrictions || '',
            reg.qr_code,
            reg.checked_in ? 'Yes' : 'No',
            reg.checked_in_at
                ? new Date(reg.checked_in_at).toLocaleString()
                : '',
            new Date(reg.created_at).toLocaleString(),
        ])

        // Escape CSV values
        const escapeCsv = (value: string) => {
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                return `"${value.replace(/"/g, '""')}"`
            }
            return value
        }

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.map(escapeCsv).join(',')),
        ].join('\n')

        // Create filename with event name and date
        const eventName = event?.name || 'event'
        const safeEventName = eventName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        const date = new Date().toISOString().split('T')[0]
        const filename = `${safeEventName}_registrations_${date}.csv`

        // Return CSV file
        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        })
    } catch (error) {
        console.error('Export error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

