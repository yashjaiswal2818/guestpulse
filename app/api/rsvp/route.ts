import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { nanoid } from 'nanoid'
import { z } from 'zod'

// Validation schema
const rsvpSchema = z.object({
    eventId: z.string().uuid(),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    attendance: z.enum(['yes', 'no', 'maybe']),
    mealPreference: z.string().optional(),
    dietaryRestrictions: z.string().optional(),
    teamName: z.string().optional(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        console.log('RSVP API received:', body)

        // Validate input
        const validatedData = rsvpSchema.parse(body)

        const {
            eventId,
            name,
            email,
            attendance,
            mealPreference,
            dietaryRestrictions,
            teamName,
        } = validatedData

        // Check if already registered
        const { data: existing } = await supabase
            .from('registrations')
            .select('id')
            .eq('event_id', eventId)
            .eq('email', email)
            .single()

        if (existing) {
            return NextResponse.json(
                { error: 'You have already registered for this event. Check your email for your confirmation.' },
                { status: 409 }
            )
        }

        // Generate unique QR code
        const qrCode = `QR_${nanoid(12).toUpperCase()}`

        // Insert registration
        const { data: registration, error: insertError } = await supabase
            .from('registrations')
            .insert({
                event_id: eventId,
                name,
                email,
                attendance,
                meal_preference: mealPreference || null,
                dietary_restrictions: dietaryRestrictions || null,
                team_name: teamName || null,
                qr_code: qrCode,
            })
            .select()
            .single()

        if (insertError) {
            console.error('Insert error:', insertError)
            return NextResponse.json(
                { error: 'Failed to create registration' },
                { status: 500 }
            )
        }

        // Initialize commitment score for new user
        const { error: scoreError } = await supabase.rpc(
            'calculate_commitment_score',
            { user_email: email }
        )

        if (scoreError) {
            console.error('Score calculation error:', scoreError)
            // Don't fail the request, just log it
        }

        return NextResponse.json({
            success: true,
            registration,
            qrCode,
        }, { status: 201 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.issues)
            return NextResponse.json(
                { error: 'Validation failed', details: error.issues },
                { status: 400 }
            )
        }

        console.error('RSVP error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}