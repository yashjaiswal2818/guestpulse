'use client'
import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle,
  Users,
  QrCode,
  TrendingUp,
  Calendar,
  Sparkles,
  Shield,
  Zap,
  BarChart3,
  Clock,
  Menu,
  X,
  ChevronDown,
  Star,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SplashScreen } from '@/components/splash-screen'

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])
  const scale = useTransform(scrollY, [0, 200], [1, 0.95])

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-purple-900/20 to-black" />

        {/* Floating orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-xl font-bold">GuestPulse</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition">Features</Link>
              <Link href="#how-it-works" className="text-gray-300 hover:text-white transition">How it Works</Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</Link>
              <Link href="/organizer" className="text-gray-300 hover:text-white transition">Login</Link>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Start Free
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-md border-b border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              <Link href="#features" className="block py-2 text-gray-300">Features</Link>
              <Link href="#how-it-works" className="block py-2 text-gray-300">How it Works</Link>
              <Link href="#pricing" className="block py-2 text-gray-300">Pricing</Link>
              <Link href="/organizer" className="block py-2 text-gray-300">Login</Link>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                Start Free
              </Button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <motion.div
          style={{ opacity, scale }}
          className="max-w-7xl mx-auto text-center"
        >
          {/* Launch badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Launching at Cornell University</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-tight"
          >
            Stop guessing.<br />
            Start knowing who'll
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> actually show up</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto"
          >
            GuestPulse uses AI to predict event attendance with 92% accuracy.
            No more wasted food, empty venues, or disappointed attendees.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8"
              asChild
            >
              <Link href="/organizer/events/new">
                Create Your First Event
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 text-lg px-8"
              asChild
            >
              <Link href="/rsvp/spring-hackathon-2025">
                Try Demo RSVP
              </Link>
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                ))}
              </div>
              <span>1,000+ students tracked</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              ))}
              <span className="ml-1">5.0 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>GDPR Compliant</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </section>

      {/* Demo Video/Screenshot Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-[1px]"
          >
            <div className="bg-black rounded-2xl p-8 md:p-12">
              <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg flex items-center justify-center">
                {/* Replace with actual screenshot or video */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2" />
                  </div>
                  <p className="text-gray-400">Watch 2-min Demo</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-purple-500/10 text-purple-300 border-purple-500/20">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need for
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> flake-free events</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built by event organizers, for event organizers. Every feature designed to solve real problems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Target className="w-6 h-6" />,
                title: "Commitment Score™",
                description: "AI tracks attendance history to predict who's likely to show up",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: <QrCode className="w-6 h-6" />,
                title: "Instant QR Check-in",
                description: "Contactless check-in with unique QR codes for every guest",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Team Registration",
                description: "Groups can register together and check-in as a team",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Predictive Analytics",
                description: "Know your expected turnout before the event starts",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Real-time Updates",
                description: "Live dashboard shows check-ins as they happen",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Deep Insights",
                description: "Understand attendance patterns to improve future events",
                gradient: "from-indigo-500 to-purple-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition" />
                <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20">
              How it Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Set up in 2 minutes,
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> use forever</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Event",
                description: "Add event details and get a unique RSVP link to share",
                icon: <Calendar className="w-8 h-8" />
              },
              {
                step: "02",
                title: "Guests RSVP",
                description: "Simple form with Yes/No/Maybe options. Takes 30 seconds",
                icon: <Users className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Check-in & Track",
                description: "Scan QR codes at the door. See real-time analytics",
                icon: <BarChart3 className="w-8 h-8" />
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connection line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-20 left-full w-full h-[2px] bg-gradient-to-r from-white/20 to-transparent" />
                )}

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4">
                    {step.icon}
                  </div>
                  <div className="text-sm text-purple-400 font-mono mb-2">{step.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl p-[1px]">
            <div className="bg-black/80 backdrop-blur-sm rounded-3xl p-12">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                {[
                  { value: "92%", label: "Prediction Accuracy" },
                  { value: "<30s", label: "Avg RSVP Time" },
                  { value: "2.5k+", label: "Events Tracked" },
                  { value: "40%", label: "Food Waste Reduced" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-green-500/10 text-green-300 border-green-500/20">
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Free for campus events,
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> forever</span>
            </h2>
            <p className="text-xl text-gray-400">
              We believe every student organization deserves professional tools
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Campus</h3>
                  <div className="text-3xl font-bold">Free</div>
                  <p className="text-gray-400 text-sm mt-1">For student organizations</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    "Unlimited events",
                    "Up to 500 guests/event",
                    "QR check-in",
                    "Basic analytics",
                    "Email support"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline">
                  Get Started
                </Button>
              </div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-semibold">
                POPULAR
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-[1px] rounded-2xl">
                <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Professional</h3>
                    <div className="text-3xl font-bold">$29<span className="text-lg font-normal text-gray-400">/month</span></div>
                    <p className="text-gray-400 text-sm mt-1">For growing organizations</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {[
                      "Everything in Campus",
                      "Unlimited guests",
                      "Advanced analytics",
                      "Custom branding",
                      "Priority support",
                      "API access"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Start Free Trial
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                  <div className="text-3xl font-bold">Custom</div>
                  <p className="text-gray-400 text-sm mt-1">For large organizations</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    "Everything in Pro",
                    "White-label option",
                    "Custom integrations",
                    "Dedicated support",
                    "SLA guarantee",
                    "On-premise option"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl p-[1px]"
            >
              <div className="bg-black/80 backdrop-blur-sm rounded-3xl p-12 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Ready to predict your
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> next event?</span>
                </h2>
                <p className="text-xl text-gray-400 mb-8">
                  Join 100+ organizations already using GuestPulse
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8"
                    asChild
                  >
                    <Link href="/organizer/events/new">
                      Create Free Event
                      <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 text-lg px-8"
                  >
                    Schedule Demo
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>SOC 2 Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>99.9% Uptime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">G</span>
                </div>
                <span className="text-xl font-bold">GuestPulse</span>
              </div>
              <p className="text-gray-400 text-sm">
                Making event attendance predictable.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition">API</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition">About</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2025 GuestPulse. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition">Twitter</Link>
              <Link href="#" className="hover:text-white transition">LinkedIn</Link>
              <Link href="#" className="hover:text-white transition">GitHub</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
