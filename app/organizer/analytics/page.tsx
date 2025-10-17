import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { ShowRateChart, AttendanceByHourChart, RSVPBreakdownChart, TeamPerformanceChart } from '@/components/organizer/analytics-charts'

export default async function AnalyticsPage() {
    const supabase = await createClient()

    // Check authentication
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch data from analytics APIs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const [showRateData, hourlyData, rsvpData, teamData] = await Promise.all([
        fetch(`${baseUrl}/api/analytics/show-rate`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
        fetch(`${baseUrl}/api/analytics/hourly`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
        fetch(`${baseUrl}/api/analytics/rsvp-breakdown`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
        fetch(`${baseUrl}/api/analytics/teams`, { cache: 'no-store' }).then(r => r.json()).catch(() => [])
    ])

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                <p className="text-muted-foreground">
                    Insights to improve your events
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <ShowRateChart data={showRateData} />
                <AttendanceByHourChart data={hourlyData} />
                <RSVPBreakdownChart data={rsvpData} />
                <TeamPerformanceChart data={teamData} />
            </div>
        </div>
    )
}
