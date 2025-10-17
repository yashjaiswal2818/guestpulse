import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Query all registrations for this email
        const { data: registrations, error } = await supabase
            .from('registrations')
            .select('*')
            .eq('email', email)

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        // Calculate commitment score
        const totalRegistered = registrations?.length || 0
        const totalCheckedIn = registrations?.filter(r => r.checked_in).length || 0
        const confirmedYes = registrations?.filter(r => r.attendance === 'yes').length || 0

        // Calculate score percentage (0-100)
        // Score based on check-in rate of confirmed events
        let score = 0
        if (confirmedYes > 0) {
            score = Math.round((totalCheckedIn / confirmedYes) * 100)
        }

        // Determine tier
        let tier: 'green' | 'yellow' | 'red' = 'green'
        if (score < 50) {
            tier = 'red'
        } else if (score < 80) {
            tier = 'yellow'
        }

        return NextResponse.json({
            email,
            totalRegistered,
            totalCheckedIn,
            confirmedYes,
            score,
            tier,
            showRate: confirmedYes > 0 ? `${Math.round((totalCheckedIn / confirmedYes) * 100)}%` : 'N/A',
        })
    } catch (error) {
        console.error('Commitment score error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}




