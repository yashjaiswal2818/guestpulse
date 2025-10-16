import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
    try {
        // Get all registrations with teams
        const { data: registrations, error } = await supabase
            .from('registrations')
            .select('team_name, checked_in')
            .not('team_name', 'is', null)

        if (error) throw error

        // Group by team and calculate check-in rate
        const teamStats: { [key: string]: { total: number; checkedIn: number } } = {}

        registrations?.forEach((reg) => {
            if (reg.team_name) {
                if (!teamStats[reg.team_name]) {
                    teamStats[reg.team_name] = { total: 0, checkedIn: 0 }
                }
                teamStats[reg.team_name].total++
                if (reg.checked_in) {
                    teamStats[reg.team_name].checkedIn++
                }
            }
        })

        // Convert to chart format with percentage
        const chartData = Object.entries(teamStats)
            .map(([team, stats]) => ({
                team,
                percentage: stats.total > 0
                    ? Math.round((stats.checkedIn / stats.total) * 100)
                    : 0,
                total: stats.total,
                checkedIn: stats.checkedIn
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 10) // Top 10 teams

        return NextResponse.json(chartData)
    } catch (error) {
        console.error('Team analytics error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch team data' },
            { status: 500 }
        )
    }
}
