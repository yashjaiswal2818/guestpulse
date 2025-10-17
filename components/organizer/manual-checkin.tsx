'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Loader2, CheckCircle, User } from 'lucide-react'
import { Registration } from '@/lib/types/database'

interface ManualCheckInProps {
    eventId: string
    onCheckIn?: () => void
}

export default function ManualCheckIn({ eventId, onCheckIn }: ManualCheckInProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [results, setResults] = useState<Registration[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [checkingIn, setCheckingIn] = useState<string | null>(null)

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.length >= 2) {
                performSearch()
            } else {
                setResults([])
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchTerm, eventId])

    const performSearch = async () => {
        setIsSearching(true)
        try {
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .eq('event_id', eventId)
                .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
                .limit(10)

            if (!error && data) {
                setResults(data as Registration[])
            }
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setIsSearching(false)
        }
    }

    const handleCheckIn = async (registration: Registration) => {
        setCheckingIn(registration.id)

        try {
            const response = await fetch('/api/check-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    qrCode: registration.qr_code,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                // Update the registration in the results
                setResults(prev =>
                    prev.map(r =>
                        r.id === registration.id
                            ? { ...r, checked_in: true, checked_in_at: new Date().toISOString() }
                            : r
                    )
                )

                // Call onCheckIn callback if provided and not already checked in
                if (onCheckIn && !data.alreadyCheckedIn) {
                    onCheckIn()
                }

                alert(data.message || 'Successfully checked in!')
            } else {
                throw new Error(data.error || 'Check-in failed')
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to check in')
        } finally {
            setCheckingIn(null)
        }
    }

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 text-lg"
                        />
                    </div>
                    {isSearching && (
                        <p className="text-sm text-gray-500 mt-2">Searching...</p>
                    )}
                </CardContent>
            </Card>

            {/* Search Results */}
            {results.length > 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">
                            Search Results ({results.length})
                        </h3>
                        <div className="space-y-3">
                            {results.map((registration) => (
                                <div
                                    key={registration.id}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{registration.name}</p>
                                            <p className="text-sm text-gray-600">{registration.email}</p>
                                            {registration.team_name && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Team: {registration.team_name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    registration.attendance === 'yes'
                                                        ? 'default'
                                                        : registration.attendance === 'maybe'
                                                            ? 'secondary'
                                                            : 'destructive'
                                                }
                                            >
                                                {registration.attendance}
                                            </Badge>
                                            {registration.checked_in && (
                                                <Badge className="bg-green-100 text-green-800">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Checked In
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleCheckIn(registration)}
                                        disabled={registration.checked_in || checkingIn === registration.id}
                                        size="sm"
                                        className="ml-4"
                                    >
                                        {checkingIn === registration.id ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Checking in...
                                            </>
                                        ) : registration.checked_in ? (
                                            'Already Checked In'
                                        ) : (
                                            'Check In'
                                        )}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {searchTerm.length >= 2 && !isSearching && results.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-gray-500">No guests found matching "{searchTerm}"</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Try searching by full name or email address
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Search Prompt */}
            {searchTerm.length < 2 && (
                <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                        <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">Start typing to search for guests</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Enter at least 2 characters
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}




