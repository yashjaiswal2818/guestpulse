'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function APITestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function testGetEvent() {
    setLoading(true)
    try {
      const res = await fetch('/api/events/cornell-hackathon-2025')
      const data = await res.json()
      setResult(data)
    } catch (error) {
      setResult({ error: String(error) })
    }
    setLoading(false)
  }

  async function testRSVP() {
    setLoading(true)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: '0c10cd2c-ac85-412b-906a-0236bc6bba23', // Replace with actual event ID from Supabase
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          attendance: 'yes',
          mealPreference: 'Vegetarian',
          teamName: 'Test Team',
        }),
      })
      const data = await res.json()
      setResult(data)
    } catch (error) {
      setResult({ error: String(error) })
    }
    setLoading(false)
  }

  async function testCheckIn() {
    setLoading(true)
    try {
      const res = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCode: 'QR_SARAH_001', // Using seed data QR code
        }),
      })
      const data = await res.json()
      setResult(data)
    } catch (error) {
      setResult({ error: String(error) })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
      
      <div className="space-y-4 mb-8">
        <Button onClick={testGetEvent} disabled={loading}>
          Test GET Event
        </Button>
        <Button onClick={testRSVP} disabled={loading} variant="secondary">
          Test RSVP Submission
        </Button>
        <Button onClick={testCheckIn} disabled={loading} variant="outline">
          Test Check-In (Sarah Chen)
        </Button>
      </div>

      {result && (
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  )
}