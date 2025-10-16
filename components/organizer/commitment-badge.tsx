'use client'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'

interface CommitmentBadgeProps {
  email: string
  showScore?: boolean
}

export function CommitmentBadge({ email, showScore = true }: CommitmentBadgeProps) {
  const [data, setData] = useState<{
    score: number
    tier: 'reliable' | 'moderate' | 'risky' | 'new'
    eventsAttended: number
    eventsRegistered: number
  } | null>(null)

  useEffect(() => {
    fetch('/api/commitment-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
      .then(res => res.json())
      .then(setData)
      .catch(() => setData(null))
  }, [email])

  if (!data) {
    return <Badge variant="outline">New Guest</Badge>
  }

  const getVariant = () => {
    if (data.tier === 'reliable') return 'default'
    if (data.tier === 'moderate') return 'secondary' 
    if (data.tier === 'risky') return 'destructive'
    return 'outline'
  }

  const getEmoji = () => {
    if (data.tier === 'reliable') return '🟢'
    if (data.tier === 'moderate') return '🟡'
    if (data.tier === 'risky') return '🔴'
    return '🆕'
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getVariant()} className="gap-1">
        {getEmoji()} {showScore && `${data.score}%`}
      </Badge>
      {data.eventsRegistered > 0 && (
        <span className="text-xs text-muted-foreground">
          {data.eventsAttended}/{data.eventsRegistered} events
        </span>
      )}
    </div>
  )
}

