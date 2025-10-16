'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    attendance: z.enum(['yes', 'no', 'maybe']),
    meal_preference: z.string().optional(),
    dietary_restrictions: z.string().optional(),
    hasTeam: z.boolean(),
    team_name: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface RSVPFormProps {
    eventId: string
    eventSlug: string
}

export default function RSVPForm({ eventId, eventSlug }: RSVPFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showTeamInput, setShowTeamInput] = useState(false)

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            attendance: 'yes',
            meal_preference: '',
            dietary_restrictions: '',
            hasTeam: false,
            team_name: '',
        },
    })

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)

        try {
            const payload = {
                eventId: eventId,
                name: data.name,
                email: data.email,
                attendance: data.attendance,
                mealPreference: data.meal_preference || undefined,
                dietaryRestrictions: data.dietary_restrictions || undefined,
                teamName: data.hasTeam && data.team_name ? data.team_name : undefined,
            }

            console.log('Submitting RSVP with payload:', payload)
            console.log('Event ID type:', typeof eventId, 'Value:', eventId)

            const response = await fetch('/api/rsvp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const result = await response.json()

            if (!response.ok) {
                // Show detailed validation errors if available
                if (result.details) {
                    const errors = result.details.map((d: any) => d.message).join(', ')
                    throw new Error(`Validation error: ${errors}`)
                }
                throw new Error(result.error || 'Failed to register')
            }

            // Redirect to success page with QR code
            router.push(`/rsvp/${eventSlug}/success?id=${result.registration.id}`)
        } catch (error) {
            console.error('Form submission error:', error)
            alert(error instanceof Error ? error.message : 'Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Email Field */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="john@cornell.edu" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Attendance Field */}
                <FormField
                    control={form.control}
                    name="attendance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Will you attend?</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="yes" id="yes" />
                                        <Label htmlFor="yes">Yes, I'll be there!</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="maybe" id="maybe" />
                                        <Label htmlFor="maybe">Maybe</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="no" />
                                        <Label htmlFor="no">No, can't make it</Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Meal Preference */}
                <FormField
                    control={form.control}
                    name="meal_preference"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meal Preference</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your meal preference" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                    <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                                    <SelectItem value="vegan">Vegan</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Dietary Restrictions */}
                <FormField
                    control={form.control}
                    name="dietary_restrictions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dietary Restrictions (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Any allergies or special dietary requirements..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Team Registration */}
                <FormField
                    control={form.control}
                    name="hasTeam"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                        field.onChange(checked)
                                        setShowTeamInput(checked as boolean)
                                    }}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    I'm registering as part of a team
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                {/* Team Name (conditional) */}
                {showTeamInput && (
                    <FormField
                        control={form.control}
                        name="team_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Team Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your team name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Registering...
                        </>
                    ) : (
                        'Complete Registration'
                    )}
                </Button>
            </form>
        </Form>
    )
}