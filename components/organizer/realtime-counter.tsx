'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function RealtimeCounter({ eventId }: { eventId: string }) {
    const [stats, setStats] = useState({
        registered: 0,
        checkedIn: 0,
        lastCheckIn: null as string | null
    })

    useEffect(() => {
        // Initial fetch
        fetchStats()

        // Subscribe to changes
        const channel = supabase
            .channel('registrations')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'registrations',
                    filter: `event_id=eq.${eventId}`
                },
                (payload) => {
                    console.log('Change received!', payload)
                    fetchStats() // Refetch stats on any change
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [eventId])

    const fetchStats = async () => {
        const { data: registrations } = await supabase
            .from('registrations')
            .select('*')
            .eq('event_id', eventId)

        if (registrations) {
            setStats({
                registered: registrations.length,
                checkedIn: registrations.filter(r => r.checked_in).length,
                lastCheckIn: registrations
                    .filter(r => r.checked_in_at)
                    .sort((a, b) => new Date(b.checked_in_at!).getTime() - new Date(a.checked_in_at!).getTime())[0]?.name || null
            })
        }
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Registered</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.registered}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Checked In</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        {stats.checkedIn}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.registered > 0
                            ? `${Math.round((stats.checkedIn / stats.registered) * 100)}% show rate`
                            : '0% show rate'
                        }
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Last Check-in</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm font-medium truncate">
                        {stats.lastCheckIn || 'No check-ins yet'}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

