'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function UpdateEventPage() {
    const [result, setResult] = useState<string>('')
    const [loading, setLoading] = useState(false)

    async function updateEvent() {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/update-event-date', {
                method: 'POST',
            })
            const data = await response.json()
            setResult(JSON.stringify(data, null, 2))
        } catch (error) {
            setResult(`Error: ${error}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Update Event Date</h1>
            <p className="mb-4 text-gray-600">
                This will update the Cornell Hackathon 2025 event to November 15, 2025
            </p>

            <Button onClick={updateEvent} disabled={loading}>
                {loading ? 'Updating...' : 'Update Event Date'}
            </Button>

            {result && (
                <Card className="mt-6 p-4">
                    <pre className="text-sm">{result}</pre>
                </Card>
            )}
        </div>
    )
}

