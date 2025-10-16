'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download, Search, Check, X, Clock } from 'lucide-react'
import { Registration } from '@/lib/types/database'
import { CommitmentBadge } from './commitment-badge'

interface GuestListProps {
    registrations: Registration[]
}

export default function GuestList({ registrations }: GuestListProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredRegistrations = registrations.filter(reg =>
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.team_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const exportCSV = () => {
        const headers = ['Name', 'Email', 'Status', 'Team', 'Meal', 'Dietary', 'Checked In', 'QR Code']
        const rows = registrations.map(r => [
            r.name,
            r.email,
            r.attendance,
            r.team_name || '',
            r.meal_preference || '',
            r.dietary_restrictions || '',
            r.checked_in ? 'Yes' : 'No',
            r.qr_code,
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `guests_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

    return (
        <div>
            {/* Search and Export */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search by name, email, or team..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button onClick={exportCSV} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            {/* Guest Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Meal</TableHead>
                            <TableHead>Check-in</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRegistrations.map((reg) => (
                            <TableRow key={reg.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{reg.name}</span>
                                        <CommitmentBadge email={reg.email} />
                                    </div>
                                </TableCell>
                                <TableCell>{reg.email}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            reg.attendance === 'yes' ? 'default' :
                                                reg.attendance === 'maybe' ? 'secondary' : 'destructive'
                                        }
                                    >
                                        {reg.attendance === 'yes' && <Check className="w-3 h-3 mr-1" />}
                                        {reg.attendance === 'maybe' && <Clock className="w-3 h-3 mr-1" />}
                                        {reg.attendance === 'no' && <X className="w-3 h-3 mr-1" />}
                                        {reg.attendance}
                                    </Badge>
                                </TableCell>
                                <TableCell>{reg.team_name || '-'}</TableCell>
                                <TableCell>{reg.meal_preference || '-'}</TableCell>
                                <TableCell>
                                    {reg.checked_in ? (
                                        <Badge className="bg-green-100 text-green-800">
                                            <Check className="w-3 h-3 mr-1" />
                                            Checked In
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">Pending</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Empty State */}
            {filteredRegistrations.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    {searchTerm ? 'No guests found matching your search' : 'No registrations yet'}
                </div>
            )}
        </div>
    )
}