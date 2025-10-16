import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
    try {
        // Update the Cornell Hackathon 2025 event to November 15, 2025
        const { data, error } = await supabase
            .from('events')
            .update({
                date: '2025-11-15T19:30:00.000Z'
            })
            .eq('slug', 'cornell-hackathon-2025')
            .select()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: 'Event date updated successfully',
            event: data
        })
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

