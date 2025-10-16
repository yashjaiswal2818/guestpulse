'use client'

import QRCode from 'react-qr-code'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface QRCodeDisplayProps {
  value: string
  name: string
}

export default function QRCodeDisplay({ value, name }: QRCodeDisplayProps) {
  const downloadQR = () => {
    const svg = document.getElementById('qr-code')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      
      const downloadLink = document.createElement('a')
      downloadLink.download = `${name.replace(/\s+/g, '_')}_QR.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white p-4 rounded-lg">
        <QRCode
          id="qr-code"
          value={value}
          size={200}
          level="H"
        />
      </div>
      <div className="text-center">
        <p className="font-mono text-sm text-gray-600 mb-2">{value}</p>
        <Button onClick={downloadQR} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download QR Code
        </Button>
      </div>
    </div>
  )
}