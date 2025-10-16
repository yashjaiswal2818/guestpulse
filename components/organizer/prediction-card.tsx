'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users } from 'lucide-react'

export function PredictionCard({ eventId }: { eventId: string }) {
    const [prediction, setPrediction] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/events/${eventId}/prediction`)
            .then(res => res.json())
            .then(data => {
                setPrediction(data)
                setLoading(false)
            })
    }, [eventId])

    if (loading) {
        return <Card><CardContent className="pt-6">Loading prediction...</CardContent></Card>
    }

    const showRate = Math.round((prediction.predicted / prediction.registered) * 100)
    const color = showRate >= 70 ? 'text-green-600' : showRate >= 50 ? 'text-yellow-600' : 'text-red-600'

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Attendance Prediction
                </CardTitle>
                <CardDescription>
                    Based on historical attendance patterns
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="text-3xl font-bold">
                            <span className={color}>{prediction.predicted}</span>
                            <span className="text-muted-foreground text-xl font-normal"> / {prediction.registered}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Expected {showRate}% show rate {prediction.accuracy}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center p-2 bg-green-50 rounded">
                            <div className="font-semibold text-green-700">{prediction.breakdown.likelyYes}</div>
                            <div className="text-xs text-green-600">Likely Yes</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-50 rounded">
                            <div className="font-semibold text-yellow-700">{prediction.breakdown.likelyMaybe}</div>
                            <div className="text-xs text-yellow-600">From Maybes</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-semibold text-gray-700">{prediction.breakdown.definiteNo}</div>
                            <div className="text-xs text-gray-600">Not Coming</div>
                        </div>
                    </div>

                    <Badge variant={
                        prediction.confidence === 'high' ? 'default' :
                            prediction.confidence === 'medium' ? 'secondary' :
                                'outline'
                    }>
                        {prediction.confidence} confidence
                    </Badge>

                    <p className="text-xs text-muted-foreground">
                        💡 Tip: {prediction.confidence !== 'high' ?
                            'Get more registrations for better predictions' :
                            'This prediction is based on significant data'}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

