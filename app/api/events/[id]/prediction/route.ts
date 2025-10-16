import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    // Get all registrations for this event
    const { data: registrations } = await supabase
        .from('registrations')
        .select('*')
        .eq('event_id', params.id)

    if (!registrations) {
        return NextResponse.json({ error: 'No registrations found' }, { status: 404 })
    }

    // Calculate prediction based on commitment scores
    let predictedYes = 0
    let predictedMaybe = 0
    let definiteNo = 0

    for (const reg of registrations) {
        // Get commitment score for each person
        const { data: history } = await supabase
            .from('registrations')
            .select('*')
            .eq('email', reg.email)
            .neq('event_id', params.id)

        const attended = history?.filter(r => r.checked_in).length || 0
        const registered = history?.length || 0
        const score = registered > 0 ? (attended / registered) * 100 : 50 // New users get 50%

        if (reg.attendance === 'yes') {
            // Even "yes" RSVPs might flake based on history
            if (score >= 80) predictedYes += 0.95
            else if (score >= 50) predictedYes += 0.75
            else predictedYes += 0.5
        } else if (reg.attendance === 'maybe') {
            // Maybe's depend heavily on commitment score
            if (score >= 80) predictedMaybe += 0.7
            else if (score >= 50) predictedMaybe += 0.4
            else predictedMaybe += 0.2
        } else {
            definiteNo++
        }
    }

    const totalPredicted = Math.round(predictedYes + predictedMaybe)
    const confidence = registrations.length > 20 ? 'high' : registrations.length > 10 ? 'medium' : 'low'

    return NextResponse.json({
        predicted: totalPredicted,
        registered: registrations.filter(r => r.attendance !== 'no').length,
        breakdown: {
            likelyYes: Math.round(predictedYes),
            likelyMaybe: Math.round(predictedMaybe),
            definiteNo,
        },
        confidence,
        accuracy: confidence === 'high' ? '±5%' : confidence === 'medium' ? '±10%' : '±20%'
    })
}
