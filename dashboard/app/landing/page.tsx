'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Shield, Coins, Users, ArrowRight, CheckCircle, Star, Globe, Lock, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Gasless infrastructure</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          🚀 Multi-Tenant SaaS Platform
        </Badge>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Create and Manage <br />
          <span className="text-indigo-600">POAP Campaigns</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Gasless POAP platform on Solana. Create campaigns, manage claims, and track analytics - all without paying gas fees.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="text-lg px-8">
              Login to Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need for POAP events
          </h2>
          <p className="text-lg text-gray-600">
            Professional tools for event organizers and seamless experience for attendees
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-indigo-600 mb-2" />
              <CardTitle>Gasless Minting</CardTitle>
              <CardDescription>
                Attendees claim POAPs without paying any gas fees. We handle all blockchain costs.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Secure & Scalable</CardTitle>
              <CardDescription>
                Built on Solana with enterprise-grade security. Handle thousands of claims per event.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Multi-Tenant</CardTitle>
              <CardDescription>
                Each organizer gets their own space with campaigns, analytics, and API keys.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Coins className="h-10 w-10 text-yellow-600 mb-2" />
              <CardTitle>Real-time Analytics</CardTitle>
              <CardDescription>
                Track claims, monitor usage, and get insights about your POAP campaigns.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Easy Integration</CardTitle>
              <CardDescription>
                Simple API and embeddable widgets. Add POAP claiming to any website.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <ArrowRight className="h-10 w-10 text-red-600 mb-2" />
              <CardTitle>Instant Setup</CardTitle>
              <CardDescription>
                Create your first campaign in minutes. No blockchain knowledge required.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Creating and managing POAP campaigns has never been easier
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Campaign</h3>
            <p className="text-gray-600">
              Set up your POAP campaign with event details, dates, and claim conditions.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Share & Claim</h3>
            <p className="text-gray-600">
              Share the campaign link with attendees who claim their POAPs gas-free.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Analyze Results</h3>
            <p className="text-gray-600">
              Track claims, monitor engagement, and get insights with real-time analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Event Organizers
          </h2>
          <p className="text-lg text-gray-600">
            Join hundreds of successful events using our platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "This platform made it so easy to create and manage POAP campaigns. 
                Our attendees love the gas-free claiming experience!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-bold">JD</span>
                </div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">Event Organizer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The analytics dashboard gives us insights we never had before. 
                Our engagement rates have doubled since using this platform."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-bold">SJ</span>
                </div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Conference Director</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The API integration was seamless. We were able to embed POAP claiming 
                directly into our event website in just a few hours."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-bold">MR</span>
                </div>
                <div>
                  <p className="font-medium">Michael Roberts</p>
                  <p className="text-sm text-gray-500">Tech Event Manager</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-600">
            Start free, scale as you grow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect for small events</CardDescription>
              <div className="text-3xl font-bold">$0</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  3 campaigns
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  100 claims/month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  2 API keys
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Basic analytics
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-indigo-200 relative">
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              Most Popular
            </Badge>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For growing organizations</CardDescription>
              <div className="text-3xl font-bold">$49<span className="text-lg font-normal">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  50 campaigns
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  5,000 claims/month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  10 API keys
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Priority support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For large-scale events</CardDescription>
              <div className="text-3xl font-bold">Custom</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Unlimited campaigns
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  50,000+ claims/month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Unlimited API keys
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  White-label options
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Dedicated support
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to launch your first POAP campaign?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of event organizers already using our platform
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6" />
              <span className="font-bold">Gasless infrastructure</span>
            </div>
            <div className="text-sm text-gray-400">
              Built on Solana • Powered by DevAI
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}