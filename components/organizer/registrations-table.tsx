'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Download, Search, CheckCircle, XCircle } from 'lucide-react'
import { Registration } from '@/lib/types/database'

interface RegistrationsTableProps {
    registrations: Registration[]
    eventId: string
}

export default function RegistrationsTable({
    registrations,
    eventId
}: RegistrationsTableProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredRegistrations = registrations.filter(reg =>
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.team_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const exportCSV = () => {
        const headers = ['Name', 'Email', 'Status', 'Team', 'Meal', 'Dietary', 'Checked In']
        const rows = filteredRegistrations.map(r => [
            r.name,
            r.email,
            r.attendance,
            r.team_name || '',
            r.meal_preference || '',
            r.dietary_restrictions || '',
            r.checked_in ? 'Yes' : 'No'
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `registrations-${eventId}.csv`
        a.click()
    }

    return (
        <div className="space-y-4">
            {/* Search and Export */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search by name, email, or team..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button onClick={exportCSV} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Meal</TableHead>
                            <TableHead>Checked In</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRegistrations.map((registration) => (
                            <TableRow key={registration.id}>
                                <TableCell className="font-medium">
                                    {registration.name}
                                </TableCell>
                                <TableCell>{registration.email}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            registration.attendance === 'yes' ? 'default' :
                                                registration.attendance === 'maybe' ? 'secondary' :
                                                    'destructive'
                                        }
                                    >
                                        {registration.attendance}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {registration.team_name && (
                                        <Badge variant="outline">{registration.team_name}</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {registration.meal_preference}
                                </TableCell>
                                <TableCell>
                                    {registration.checked_in ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-gray-300" />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <p className="text-sm text-gray-600">
                Showing {filteredRegistrations.length} of {registrations.length} registrations
            </p>
        </div>
    )
}