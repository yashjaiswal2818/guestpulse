'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  )
}