import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import QRCodeDisplay from '@/components/public/qr-code-display'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { id: string }
}) {
  if (!searchParams.id) {
    notFound()
  }

  // Fetch registration
  const { data: registration, error: regError } = await supabase
    .from('registrations')
    .select('*')
    .eq('id', searchParams.id)
    .single()

  if (regError || !registration) {
    notFound()
  }

  // Fetch event
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', registration.event_id)
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        {/* Success Message */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            You're all set!
          </h1>
          <p className="text-gray-600">
            Your registration for {event?.name} has been confirmed.
          </p>
        </div>

        {/* Registration Details */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Registration Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{registration.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{registration.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <Badge variant={
                registration.attendance === 'yes' ? 'default' :
                registration.attendance === 'maybe' ? 'secondary' : 'destructive'
              }>
                {registration.attendance}
              </Badge>
            </div>
            {registration.team_name && (
              <div className="flex justify-between">
                <span className="text-gray-600">Team:</span>
                <span className="font-medium">{registration.team_name}</span>
              </div>
            )}
          </div>
        </Card>

        {/* QR Code */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Your Check-in QR Code</h2>
          <p className="text-gray-600 mb-6">
            Show this QR code at the event for quick check-in
          </p>
          <QRCodeDisplay 
            value={registration.qr_code} 
            name={registration.name}
          />
        </Card>

        {/* Next Steps */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>A confirmation email has been sent to {registration.email}</p>
          <p className="mt-2">
            Save this page or take a screenshot of your QR code
          </p>
        </div>
      </div>
    </div>
  )
}