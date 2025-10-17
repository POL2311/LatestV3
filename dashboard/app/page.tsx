'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/hooks/use-auth'
import { useCampaigns, useAnalytics } from '@/hooks/useApi'
import { formatNumber, formatDate } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

import {
  Zap,
  Shield,
  Coins,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Activity,
  Calendar,
  ChevronRight,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
} from 'lucide-react'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export default function EnhancedLandingPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('home')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  const { data: campaignsData, isLoading: campaignsLoading } = useCampaigns({ limit: 1000 })
  const { data: analyticsData } = useAnalytics()

  const campaigns = campaignsData?.data?.campaigns || []
  const analytics = analyticsData ?? {
    totalClaims: 1502,
    successRate: 0,
    avgClaimTime: '0s',
    topLocation: 'N/A',
    chartData: [],
    recentClaims: [],
  }
  // Filtrado de campañas
  const filteredCampaigns = campaigns.filter((campaign: any) => {
    const q = searchTerm.trim().toLowerCase()
    const matchesSearch =
      q.length === 0 ||
      campaign.name?.toLowerCase().includes(q) ||
      campaign.description?.toLowerCase().includes(q)
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && campaign.isActive) ||
      (filterStatus === 'inactive' && !campaign.isActive)
    return matchesSearch && matchesFilter
  })

  // Datos para charts
  const claimsData =
    analytics.chartData?.slice(0, 7).map((item: any) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      claims: item.claims,
      users: item.unique_users,
    })) || []

  const statusDistribution = [
    { name: 'Active', value: campaigns.filter((c: any) => c.isActive).length, color: '#10b981' },
    { name: 'Inactive', value: campaigns.filter((c: any) => !c.isActive).length, color: '#6b7280' },
  ]

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard')
  }, [isAuthenticated, router])

  if (isAuthenticated) return null

  return (
    <div id="enhanced-landing">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Header con navegación */}
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Gasless infrastructure</span>
            </div>

            <div className="flex items-center space-x-6">
              <TabsList className="grid w-48 grid-cols-3">
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* HOME */}
        <TabsContent value="home" className="container mx-auto px-4 py-8">
          {/* Hero */}
          <section className="text-center py-12">
            <Badge variant="secondary" className="mb-4">
              🚀 Multi-Tenant SaaS Platform
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Create and Manage <br />
              <span className="text-indigo-600">POAP Campaigns</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Gasless POAP platform on Solana. Create campaigns, manage claims, and track analytics
              — all without paying gas fees.
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

          {/* Métricas */}
          <section className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
                      <p className="text-2xl font-bold">{campaigns.length}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {campaigns.filter((c: any) => c.isActive).length} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Claims</p>
                      <p className="text-2xl font-bold">
                        {formatNumber(analytics.totalClaims || 0)}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {analytics.successRate || 0}% success rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg. Claims/Campaign</p>
                      <p className="text-2xl font-bold">
                        {campaigns.length > 0
                          ? formatNumber((analytics.totalClaims || 0) / campaigns.length)
                          : '0'}
                      </p>
                    </div>
                    <TrendingUpIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {analytics.avgClaimTime || '0s'} avg time
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Events</p>
                      <p className="text-2xl font-bold">
                        {campaigns.filter((c: any) => c.isActive).length}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {analytics.topLocation || 'N/A'} location
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Features */}
          <section className="py-12">
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
                    Attendees claim POAPs without paying any gas fees. We handle all blockchain
                    costs.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 text-green-600 mb-2" />
                  <CardTitle>Secure & Scalable</CardTitle>
                  <CardDescription>
                    Built on Solana with enterprise-grade security. Handle thousands of claims per
                    event.
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

          {/* Data Visualization */}
          <section className="py-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Statistics</h2>
              <p className="text-lg text-gray-600">Real-time insights into campaign performance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Claims Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle>Claims Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={claimsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="claims" stroke="#8884d8" strokeWidth={2} name="Total Claims" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Campaign Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center space-x-4 mt-4">
                    {statusDistribution.map((entry, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm">
                          {entry.name}: {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
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
          <section className="py-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Event Organizers</h2>
              <p className="text-lg text-gray-600">
                Join hundreds of successful events using our platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">
                      "The platform is insanely easy to use. Our attendees love the gas-free claiming
                      experience!"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <span className="text-indigo-600 font-bold">{['JD', 'SJ', 'MR'][i - 1]}</span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {['John Doe', 'Sarah Johnson', 'Michael Roberts'][i - 1]}
                        </p>
                        <p className="text-sm text-gray-500">
                          {['Event Organizer', 'Conference Director', 'Tech Event Manager'][i - 1]}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section className="py-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
              <p className="text-lg text-gray-600">Start free, scale as you grow</p>
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
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">Most Popular</Badge>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For growing organizations</CardDescription>
                  <div className="text-3xl font-bold">
                    $49<span className="text-lg font-normal">/month</span>
                  </div>
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

          {/* CTA */}
          <section className="bg-indigo-600 text-white py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to launch your first POAP campaign?</h2>
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
        </TabsContent>

        {/* ABOUT */}
        <TabsContent value="about" className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About Gasless Infrastructure</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                Gasless Infrastructure is a cutting-edge platform built on Solana that revolutionizes
                how event organizers create and manage Proof of Attendance Protocols (POAPs).
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Vision</h2>
              <p className="text-gray-700 mb-6">
                We believe that every event attendee should be able to claim their POAP without
                worrying about blockchain transaction fees.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How It Works</h2>
              <p className="text-gray-700 mb-6">
                Our platform leverages Solana&apos;s high-throughput, low-cost transactions to enable
                gasless minting. A relayer pays the gas fees on behalf of attendees.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Features</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Gasless POAP minting for attendees</li>
                <li>Real-time analytics and insights</li>
                <li>Multi-tenant architecture for event organizers</li>
                <li>Secure and scalable infrastructure</li>
                <li>Easy API integration for websites and applications</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* EVENTS */}
        <TabsContent value="events" className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Global Events</h1>

              <div className="flex space-x-4 mt-4 md:mt-0">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                  className="border rounded-md px-3 py-2"
                >
                  <option value="all">All Events</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {campaignsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign: any) => {
                  const totalClaims = campaign._count?.claims || 0
                  const maxClaims = campaign.maxClaims || 100
                  const progress = maxClaims > 0 ? Math.min(100, (totalClaims / maxClaims) * 100) : 0
                  const remaining = maxClaims > 0 ? Math.max(0, maxClaims - totalClaims) : null

                  return (
                    <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{campaign.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {formatDate(campaign.eventDate)}
                            </CardDescription>
                          </div>
                          {/* Si no tienes un variant "success", usamos default + estilos */}
                          <Badge
                            variant={campaign.isActive ? 'default' : 'secondary'}
                            className={
                              campaign.isActive
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : ''
                            }
                          >
                            {campaign.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent>
                        {campaign.description && (
                          <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
                        )}

                        {campaign.location && (
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <Globe className="h-4 w-4 mr-1" />
                            {campaign.location}
                          </div>
                        )}

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Claims</span>
                            <span>
                              {totalClaims} / {maxClaims}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          {remaining !== null && (
                            <p className="text-xs text-gray-500 mt-1">{remaining} remaining</p>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{totalClaims} claims</span>
                          <Link href={`/claim/${campaign.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {filteredCampaigns.length === 0 && !campaignsLoading && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                <Button
                  onClick={() => {
                    setSearchTerm('')
                    setFilterStatus('all')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6" />
              <span className="font-bold">Gasless infrastructure</span>
            </div>
            <div className="text-sm text-gray-400">Built on Solana • Powered by DevAI</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
