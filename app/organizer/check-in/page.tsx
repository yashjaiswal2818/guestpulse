'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import QRScanner from '@/components/organizer/qr-scanner'
import ManualCheckIn from '@/components/organizer/manual-checkin'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ArrowLeft, QrCode, Search } from 'lucide-react'

export default function CheckInPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const eventId = searchParams.get('event')
    const [checkInCount, setCheckInCount] = useState(0)

    const handleCheckIn = () => {
        setCheckInCount(prev => prev + 1)
    }

    if (!eventId) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-gray-500 mb-4">No event selected for check-in</p>
                        <Button asChild>
                            <Link href="/organizer/events">
                                View Events
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {eventId && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/organizer/events/${eventId}`)}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Event
                        </Button>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">Event Check-in</h1>
                        <p className="text-gray-600">Check in guests via QR code or manual search</p>
                    </div>
                </div>
                <Card className="px-6 py-3">
                    <p className="text-sm text-gray-600">Checked in today</p>
                    <p className="text-3xl font-bold">{checkInCount}</p>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="qr" className="space-y-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="qr">
                        <QrCode className="w-4 h-4 mr-2" />
                        QR Scanner
                    </TabsTrigger>
                    <TabsTrigger value="manual">
                        <Search className="w-4 h-4 mr-2" />
                        Manual Search
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="qr" className="space-y-4">
                    <QRScanner eventId={eventId} onCheckIn={handleCheckIn} />

                    {/* QR Instructions */}
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-semibold mb-3">How to use QR Scanner:</h3>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                                <li>Click "Start Scanning" to activate your camera</li>
                                <li>Point your camera at the guest's QR code</li>
                                <li>Wait for the success sound and confirmation</li>
                                <li>The guest will be automatically checked in</li>
                            </ol>
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-900">
                                <strong>Tip:</strong> For best results, ensure good lighting and hold the QR code steady.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="manual" className="space-y-4">
                    <ManualCheckIn eventId={eventId} onCheckIn={handleCheckIn} />

                    {/* Manual Search Instructions */}
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-semibold mb-3">How to use Manual Search:</h3>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                                <li>Type the guest's name or email in the search box</li>
                                <li>Find the guest in the search results</li>
                                <li>Click "Check In" to mark them as attended</li>
                                <li>The check-in will be recorded instantly</li>
                            </ol>
                            <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-900">
                                <strong>Note:</strong> Use manual search if the QR code is not working or unavailable.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
