import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// Helper to check if string is a UUID
function isUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(str)
}

// GET /api/events/[id] - Fetch single event by ID or slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        
        // Await params in Next.js 15
        const { id: identifier } = await params
        const isId = isUUID(identifier)

        // Get authenticated user
        const {
            data: { user },
        } = await supabase.auth.getUser()

        // Query by ID or slug
        const query = supabase
            .from('events')
            .select('*')

        if (isId) {
            query.eq('id', identifier)
        } else {
            query.eq('slug', identifier)
        }

        // If user is authenticated, filter by organizer_id (for organizer dashboard)
        // Public RSVP pages don't need this check
        if (user && request.headers.get('x-organizer-request') === 'true') {
            query.eq('organizer_id', user.id)
        }

        const { data: event, error } = await query.single()

        if (error || !event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            )
        }

        // Fetch registrations for this event
        const { data: registrations } = await supabase
            .from('registrations')
            .select('*')
            .eq('event_id', event.id)
            .order('created_at', { ascending: false })

        // Calculate stats
        const stats = {
            total: registrations?.length || 0,
            confirmed: registrations?.filter(r => r.attendance === 'yes').length || 0,
            maybe: registrations?.filter(r => r.attendance === 'maybe').length || 0,
            declined: registrations?.filter(r => r.attendance === 'no').length || 0,
            checkedIn: registrations?.filter(r => r.checked_in).length || 0,
        }

        // Group registrations by team
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
    } catch (error) {
        console.error('Error fetching event:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PATCH /api/events/[id] - Update event details (only works with UUID)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        
        // Check authentication
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Await params in Next.js 15
        const { id: identifier } = await params

        // Only allow updates by ID
        if (!isUUID(identifier)) {
            return NextResponse.json(
                { error: 'Event updates require ID, not slug' },
                { status: 400 }
            )
        }

        // Verify user owns this event
        const { data: existingEvent } = await supabase
            .from('events')
            .select('organizer_id')
            .eq('id', identifier)
            .single()

        if (!existingEvent || existingEvent.organizer_id !== user.id) {
            return NextResponse.json(
                { error: 'Unauthorized: You do not own this event' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const { name, description, date, location, capacity, organizer_email } = body

        const updateData: any = {}
        if (name !== undefined) updateData.name = name
        if (description !== undefined) updateData.description = description
        if (date !== undefined) updateData.date = date
        if (location !== undefined) updateData.location = location
        if (capacity !== undefined) updateData.capacity = capacity
        if (organizer_email !== undefined) updateData.organizer_email = organizer_email

        const { data, error } = await supabase
            .from('events')
            .update(updateData)
            .eq('id', identifier)
            .eq('organizer_id', user.id)
            .select()
            .single()

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ event: data })
    } catch (error) {
        console.error('Error updating event:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE /api/events/[id] - Delete event and cascade to registrations (only works with UUID)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        
        // Check authentication
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Await params in Next.js 15
        const { id: identifier } = await params

        // Only allow deletes by ID
        if (!isUUID(identifier)) {
            return NextResponse.json(
                { error: 'Event deletion requires ID, not slug' },
                { status: 400 }
            )
        }

        // Verify user owns this event
        const { data: existingEvent } = await supabase
            .from('events')
            .select('organizer_id')
            .eq('id', identifier)
            .single()

        if (!existingEvent || existingEvent.organizer_id !== user.id) {
            return NextResponse.json(
                { error: 'Unauthorized: You do not own this event' },
                { status: 403 }
            )
        }

        // First delete all registrations for this event
        const { error: regError } = await supabase
            .from('registrations')
            .delete()
            .eq('event_id', identifier)

        if (regError) {
            console.error('Error deleting registrations:', regError)
            return NextResponse.json(
                { error: 'Failed to delete event registrations' },
                { status: 500 }
            )
        }

        // Then delete the event
        const { error: eventError } = await supabase
            .from('events')
            .delete()
            .eq('id', identifier)
            .eq('organizer_id', user.id)

        if (eventError) {
            return NextResponse.json(
                { error: eventError.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Event and all registrations deleted successfully',
        })
    } catch (error) {
        console.error('Error deleting event:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
