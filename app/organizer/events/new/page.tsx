'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NewEventPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            date: formData.get('date') as string,
            location: formData.get('location') as string,
            capacity: parseInt(formData.get('capacity') as string) || 500,
            organizer_email: formData.get('organizer_email') as string,
        }

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create event')
            }

            // Redirect to the new event page
            router.push(`/organizer/events/${result.id}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/organizer/events">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Events
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Create New Event</h1>
                    <p className="text-gray-600">Set up a new event and start collecting RSVPs</p>
                </div>
            </div>

            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Event Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                placeholder="e.g., Cornell Hackathon 2025"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={4}
                                placeholder="Tell guests about your event..."
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date & Time *</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="datetime-local"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input
                                    id="capacity"
                                    name="capacity"
                                    type="number"
                                    defaultValue={500}
                                    min={1}
                                    placeholder="500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                placeholder="e.g., Gates Hall, Cornell University"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="organizer_email">Organizer Email</Label>
                            <Input
                                id="organizer_email"
                                name="organizer_email"
                                type="email"
                                placeholder="organizer@cornell.edu"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit" disabled={isSubmitting} className="flex-1">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating Event...
                                    </>
                                ) : (
                                    'Create Event'
                                )}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/organizer/events">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Info Box */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <p className="text-sm text-blue-900">
                        <strong>What happens next?</strong> After creating your event, you'll receive a unique RSVP page link that you can share with guests. They'll be able to register and receive QR codes for check-in.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
