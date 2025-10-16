'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2, Camera, CameraOff } from 'lucide-react'

interface QRScannerProps {
    eventId: string
    onCheckIn?: () => void
}

export default function QRScanner({ eventId, onCheckIn }: QRScannerProps) {
    const [scanning, setScanning] = useState(false)
    const [result, setResult] = useState<{
        success: boolean
        message: string
        registration?: any
    } | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const scannerRef = useRef<Html5Qrcode | null>(null)

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(console.error)
            }
        }
    }, [])

    const startScanning = async () => {
        try {
            const scanner = new Html5Qrcode('qr-reader')
            scannerRef.current = scanner

            await scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                async (decodedText) => {
                    if (!isProcessing) {
                        await handleScan(decodedText)
                    }
                },
                (errorMessage) => {
                    // Ignore errors silently
                }
            )

            setScanning(true)
        } catch (err) {
            console.error('Failed to start scanner:', err)
            setResult({
                success: false,
                message: 'Failed to access camera. Please check permissions.',
            })
        }
    }

    const stopScanning = async () => {
        if (scannerRef.current) {
            await scannerRef.current.stop()
            scannerRef.current = null
        }
        setScanning(false)
    }

    const handleScan = async (qrCode: string) => {
        setIsProcessing(true)
        setResult(null)

        try {
            const response = await fetch('/api/check-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    qrCode: qrCode,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                // Play success sound
                const audio = new Audio('/check-in-success.mp3')
                audio.play().catch(() => { })

                // Vibrate if supported
                if (navigator.vibrate) {
                    navigator.vibrate(200)
                }

                setResult({
                    success: true,
                    message: data.alreadyCheckedIn
                        ? `${data.registration.name} was already checked in`
                        : `Successfully checked in ${data.registration.name}!`,
                    registration: data.registration,
                })

                // Call onCheckIn callback if provided and not already checked in
                if (onCheckIn && !data.alreadyCheckedIn) {
                    onCheckIn()
                }
            } else {
                setResult({
                    success: false,
                    message: data.error || 'Check-in failed',
                })
            }
        } catch (error) {
            setResult({
                success: false,
                message: 'Network error. Please try again.',
            })
        } finally {
            setIsProcessing(false)
            // Clear result after 3 seconds
            setTimeout(() => setResult(null), 3000)
        }
    }

    return (
        <div className="space-y-4">
            {/* Scanner Area */}
            <Card className="overflow-hidden">
                <div className="relative bg-black" style={{ minHeight: '400px' }}>
                    {scanning ? (
                        <>
                            <div id="qr-reader" className="w-full" />
                            {isProcessing && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white">
                                <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                <p>Camera not active</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Control Buttons */}
            <div className="flex gap-2">
                {!scanning ? (
                    <Button onClick={startScanning} className="flex-1" size="lg">
                        <Camera className="h-5 w-5 mr-2" />
                        Start Scanning
                    </Button>
                ) : (
                    <Button onClick={stopScanning} variant="destructive" className="flex-1" size="lg">
                        <CameraOff className="h-5 w-5 mr-2" />
                        Stop Scanning
                    </Button>
                )}
            </div>

            {/* Result Alert */}
            {result && (
                <Alert variant={result.success ? 'success' : 'destructive'}>
                    {result.success ? (
                        <CheckCircle className="h-4 w-4" />
                    ) : (
                        <XCircle className="h-4 w-4" />
                    )}
                    <AlertDescription className="font-medium">
                        {result.message}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}
