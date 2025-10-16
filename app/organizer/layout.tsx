import Link from 'next/link'
import { Home, Calendar, Users, QrCode, BarChart } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/organizer/logout-button'

export default async function OrganizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold">GuestPulse</h2>
          <p className="text-gray-400 text-sm">Organizer Dashboard</p>
        </div>

        <nav className="mt-8 flex-1">
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

        {/* User info and logout at bottom */}
        <div className="p-6 border-t border-gray-800">
          <div className="text-sm text-gray-400 mb-3">{user.email}</div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
