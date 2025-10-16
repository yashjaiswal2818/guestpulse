import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrCode, memberIds } = body

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code is required' },
        { status: 400 }
      )
    }

    // Check if it's a team check-in (memberIds provided)
    if (memberIds && Array.isArray(memberIds)) {
      // Team check-in: Update multiple registrations
      const { data, error } = await supabase
        .from('registrations')
        .update({
          checked_in: true,
          checked_in_at: new Date().toISOString(),
        })
        .in('id', memberIds)
        .select()

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        checkedIn: data,
        count: data.length,
      })
    }

    // Individual check-in: Find by QR code
    const { data: registration, error: findError } = await supabase
      .from('registrations')
      .select('*')
      .eq('qr_code', qrCode)
      .single()

    if (findError || !registration) {
      return NextResponse.json(
        { error: 'Invalid QR code or registration not found' },
        { status: 404 }
      )
    }

    // Check if already checked in
    if (registration.checked_in) {
      return NextResponse.json({
        success: true,
        alreadyCheckedIn: true,
        registration,
        message: `${registration.name} was already checked in at ${new Date(registration.checked_in_at!).toLocaleTimeString()}`,
      })
    }

    // Update check-in status
    const { data: updated, error: updateError } = await supabase
      .from('registrations')
      .update({
        checked_in: true,
        checked_in_at: new Date().toISOString(),
      })
      .eq('id', registration.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      registration: updated,
      message: `Successfully checked in ${updated.name}`,
    })

  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}