'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
    const [loading, setLoading] = useState(true)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const particles: Array<{
            x: number
            y: number
            vx: number
            vy: number
            size: number
            opacity: number
        }> = []

        // Create particles
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2,
                opacity: Math.random() * 0.5
            })
        }

        // Animation loop
        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            particles.forEach(particle => {
                particle.x += particle.vx
                particle.y += particle.vy

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(147, 51, 234, ${particle.opacity})`
                ctx.fill()
            })

            requestAnimationFrame(animate)
        }

        animate()

        // Complete after 3 seconds
        setTimeout(() => {
            setLoading(false)
            setTimeout(onComplete, 500)
        }, 3000)
    }, [onComplete])

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-50 bg-black"
            >
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0"
                />

                {/* Content overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        {/* Animated logo */}
                        <motion.div
                            animate={{
                                rotateY: [0, 360],
                            }}
                            transition={{
                                duration: 3,
                                ease: "easeInOut"
                            }}
                            className="inline-block mb-6"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform-gpu perspective-1000">
                                <span className="text-3xl font-bold text-white">G</span>
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4"
                        >
                            GuestPulse
                        </motion.h1>

                        {/* Loading bar */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                            className="w-48 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto origin-left"
                        />

                        {/* Status */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 1, 0] }}
                            transition={{
                                duration: 3,
                                times: [0, 0.2, 0.8, 1]
                            }}
                            className="mt-6 text-purple-300/60 text-sm"
                        >
                            {loading ? 'Preparing magic...' : 'Ready to launch'}
                        </motion.p>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

