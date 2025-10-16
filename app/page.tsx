import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, QrCode, Users, BarChart, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Stop Guessing Event Attendance
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              GuestPulse helps college organizations manage RSVPs, track attendance,
              and predict no-shows with smart commitment scoring.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/organizer">
                  Organizer Dashboard
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/rsvp/cornell-hackathon-2025">
                  See Demo RSVP
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need for Event Success
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <QrCode className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">QR Check-in</h3>
              <p className="text-gray-600 text-sm">
                Lightning-fast check-ins with QR codes. Works offline too.
              </p>
            </Card>

            <Card className="p-6">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Team Management</h3>
              <p className="text-gray-600 text-sm">
                Let teams register together and check in as a group.
              </p>
            </Card>

            <Card className="p-6">
              <BarChart className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Smart Predictions</h3>
              <p className="text-gray-600 text-sm">
                AI-powered attendance predictions based on past behavior.
              </p>
            </Card>

            <Card className="p-6">
              <CheckCircle className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Commitment Score</h3>
              <p className="text-gray-600 text-sm">
                Track guest reliability with our unique scoring system.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Create Your Event</h3>
                <p className="text-gray-600">
                  Set up your event details and get a custom RSVP page in seconds.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Share RSVP Link</h3>
                <p className="text-gray-600">
                  Send your beautiful RSVP page to guests. They register in under 60 seconds.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Track & Check-in</h3>
                <p className="text-gray-600">
                  Monitor RSVPs in real-time and check in guests with QR codes at the door.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Analyze & Improve</h3>
                <p className="text-gray-600">
                  Get insights on attendance patterns and improve future events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Revolutionize Your Events?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Join Cornell organizations already using GuestPulse
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/organizer">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}