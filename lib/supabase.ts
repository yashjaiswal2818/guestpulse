import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper types
export type Event = {
  id: string
  slug: string
  name: string
  description: string | null
  date: string
  location: string | null
  capacity: number
  organizer_email: string | null
  created_at: string
}

export type Registration = {
  id: string
  event_id: string
  name: string
  email: string
  attendance: 'yes' | 'no' | 'maybe'
  meal_preference: string | null
  dietary_restrictions: string | null
  team_name: string | null
  qr_code: string
  checked_in: boolean
  checked_in_at: string | null
  created_at: string
}