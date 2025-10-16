import Link from 'next/link'
import { Home, Calendar, Users, QrCode, BarChart } from 'lucide-react'

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold">GuestPulse</h2>
          <p className="text-gray-400 text-sm">Organizer Dashboard</p>
        </div>

        <nav className="mt-8">
          <Link href="/organizer" className="flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors">
            <Home className="w-5 h-5" />
            <span>Overview</span>
          </Link>
          <Link href="/organizer/events" className="flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors">
            <Calendar className="w-5 h-5" />
            <span>Events</span>
          </Link>
          <Link href="/organizer/check-in" className="flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors">
            <QrCode className="w-5 h-5" />
            <span>Check-in</span>
          </Link>
          <Link href="/organizer/analytics" className="flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors">
            <BarChart className="w-5 h-5" />
            <span>Analytics</span>
          </Link>
        </nav>
      </div>

      <div className="flex-1 bg-gray-50">
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}
