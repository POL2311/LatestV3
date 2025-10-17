'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosInstance } from 'axios'
import toast from 'react-hot-toast'

// =======================
// 🔧 API CLIENTS
// =======================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

// Instancia PARA PÚBLICO: NO redirige en 401
const apiPublic: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Instancia PARA AUTENTICADO: redirige en 401
const apiAuth: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiAuth.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiAuth.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth-token')
      // redirige solo en flujos protegidos
      window.location.replace('/login')
    }
    return Promise.reject(error)
  }
)

// =======================
// 🧾 TYPES
// =======================
export interface Campaign {
  id: string
  name: string
  description?: string
  eventDate: string | null
  location?: string | null
  imageUrl?: string | null
  externalUrl?: string | null
  secretCode?: string | null
  maxClaims?: number | null
  isActive: boolean
  organizerId?: string
  createdAt?: string
  updatedAt?: string
  metadata?: any
  _count?: { claims: number }
  organizer?: { name: string; email: string; company?: string }
}

export interface CampaignsQuery {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}

export interface CampaignsResponse {
  data: { campaigns: Campaign[] }
  success?: boolean
}

export interface Claim {
  id: string
  campaignId: string
  userPublicKey: string
  mintAddress?: string
  transactionHash?: string
  claimedAt: string
}

export interface CampaignAnalytics {
  campaign: { id: string; name: string; maxClaims?: number | null }
  claims: { total: number; today: number; thisWeek: number; thisMonth: number; remaining?: number | null }
  gas: { totalCost: number; averageCost: number; totalCostSOL: number }
  dailyClaims: Array<{ date: string; claims: number }>
}

export interface AnalyticsPoint {
  date: string // ISO string
  claims: number
  unique_users?: number
}

export interface AnalyticsSummary {
  totalClaims: number
  successRate: number        // 0..100
  avgClaimTime: string       // ej. "2.3 seconds"
  topLocation?: string
  chartData: AnalyticsPoint[]
  recentClaims: Array<{
    id: string
    campaignName: string
    userWallet: string
    claimedAt: string
    transactionSignature: string
  }>
  totalGasCostSOL?: number
}

// =======================
// 🪙 CAMPAIGNS (Público o Autenticado)
// =======================

/**
 * Hook universal para campañas.
 * - Por defecto usa el cliente PUBLICO (no redirige en 401).
 * - Si necesitas forzar auth (dashboard), pasa { auth: true }.
 */
export function useCampaigns(params?: CampaignsQuery, opts?: { auth?: boolean }) {
  const auth = opts?.auth === true
  return useQuery({
    queryKey: ['campaigns', params, auth ? 'auth' : 'public'],
    queryFn: async (): Promise<CampaignsResponse> => {
      const client = auth ? apiAuth : apiPublic
      const { data } = await client.get('/api/campaigns', { params })
      // Normalizamos forma: { data: { campaigns: [...] } }
      const payload = Array.isArray(data?.data)
        ? { data: { campaigns: data.data as Campaign[] } }
        : (data as CampaignsResponse)

      return {
        data: {
          campaigns: (payload?.data?.campaigns ?? []).map((c: any) => ({
            ...c,
            imageUrl: c.imageUrl ?? c.image ?? null,
            _count: c._count ?? { claims: c.totalClaimed ?? 0 },
            maxClaims: c.maxClaims ?? c.maxSupply ?? null,
          })),
        },
        success: payload?.success,
      }
    },
    staleTime: 30_000,
  })
}

export function useCampaign(id: string, opts?: { auth?: boolean }) {
  const auth = opts?.auth === true
  return useQuery({
    queryKey: ['campaign', id, auth ? 'auth' : 'public'],
    queryFn: async () => {
      const client = auth ? apiAuth : apiPublic
      const { data } = await client.get(`/api/campaigns/${id}`)
      return data?.data as Campaign
    },
    enabled: !!id,
  })
}

export function useCampaignAnalytics(id: string, opts?: { auth?: boolean }) {
  const auth = opts?.auth === true
  return useQuery({
    queryKey: ['campaign-analytics', id, auth ? 'auth' : 'public'],
    queryFn: async (): Promise<CampaignAnalytics> => {
      const client = auth ? apiAuth : apiPublic
      const { data } = await client.get(`/api/campaigns/${id}/analytics`)
      return data?.data as CampaignAnalytics
    },
    enabled: !!id,
    refetchInterval: 60_000,
  })
}

export function useCampaignClaims(id: string, params?: { page?: number; limit?: number }, opts?: { auth?: boolean }) {
  const auth = opts?.auth === true
  return useQuery({
    queryKey: ['campaign-claims', id, params, auth ? 'auth' : 'public'],
    queryFn: async () => {
      const client = auth ? apiAuth : apiPublic
      const { data } = await client.get(`/api/campaigns/${id}/claims`, { params })
      return data?.data as { claims: Claim[]; page?: number; total?: number }
    },
    enabled: !!id,
  })
}

// =======================
// 📊 AGGREGATED ANALYTICS (Público)
// =======================
export function useAnalytics() {
  // usamos campañas PÚBLICAS para no redirigir en landing
  const { data: campaignsRes } = useCampaigns({ limit: 1000 })
  const campaigns = campaignsRes?.data?.campaigns ?? []

  return useQuery({
    queryKey: ['analytics', campaigns.length],
    queryFn: async (): Promise<AnalyticsSummary> => {
      if (!campaigns.length) {
        return {
          totalClaims: 0,
          successRate: 0,
          avgClaimTime: '0s',
          topLocation: 'N/A',
          chartData: [],
          recentClaims: [],
          totalGasCostSOL: 0,
        }
      }

      // Tomamos hasta N campañas para calcular agregado
      const MAX = 10
      const analyticsReqs = campaigns.slice(0, MAX).map((c) =>
        apiPublic.get(`/api/campaigns/${c.id}/analytics`).catch(() => null)
      )
      const results = await Promise.all(analyticsReqs)
      const valid = results.filter(r => r?.data?.success).map(r => r!.data.data as CampaignAnalytics)

      // Totales
      const totalClaims = valid.reduce((sum, a) => sum + (a.claims?.total || 0), 0)
      const totalGasCost = valid.reduce((sum, a) => sum + (a.gas?.totalCost || 0), 0)

      // Serie para chart (últimos 7 días)
      const allDaily = valid.flatMap(a => a.dailyClaims || [])
      const chartData = allDaily.reduce((acc: any[], d) => {
        const item = acc.find(x => x.date === d.date)
        if (item) item.claims += d.claims
        else acc.push({ date: d.date, claims: d.claims })
        return acc
      }, [])
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7)

      // Últimos claims (ligero muestreo)
      const recentReqs = campaigns.slice(0, 3).map(c =>
        apiPublic.get(`/api/campaigns/${c.id}/claims`, { params: { limit: 5 } })
          .then(r => (r.data?.data?.claims ?? []).map((cl: Claim) => ({
            id: cl.id,
            campaignName: c.name,
            userWallet: cl.userPublicKey,
            claimedAt: cl.claimedAt,
            transactionSignature: cl.transactionHash || 'N/A',
          })))
          .catch(() => [])
      )
      const recentResults = await Promise.all(recentReqs)
      const recentClaims = recentResults.flat()
        .sort((a, b) => new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime())
        .slice(0, 10)

      return {
        totalClaims,
        successRate: totalClaims > 0 ? 98.5 : 0,      // placeholder si tu API no lo manda
        avgClaimTime: '2.3 seconds',                  // idem
        topLocation: campaigns[0]?.location || 'Virtual',
        chartData,
        recentClaims,
        totalGasCostSOL: totalGasCost / 1e9,
      }
    },
    enabled: true,
  })
}

// =======================
// ✍️ MUTATIONS (Autenticado)
// =======================
export function useCreateCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Campaign>) => {
      const res = await apiAuth.post('/api/campaigns', data)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaigns'] })
      toast.success('Campaign created successfully!')
    },
    onError: () => toast.error('Failed to create campaign'),
  })
}

export function useUpdateCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Campaign> }) => {
      const res = await apiAuth.put(`/api/campaigns/${id}`, updates)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaigns'] })
      toast.success('Campaign updated successfully!')
    },
    onError: () => toast.error('Failed to update campaign'),
  })
}

export function useDeleteCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiAuth.delete(`/api/campaigns/${id}`)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaigns'] })
      toast.success('Campaign deleted successfully!')
    },
    onError: () => toast.error('Failed to delete campaign'),
  })
}

// =======================
// 🔐 PERFIL (Autenticado)
// =======================
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await apiAuth.get('/api/auth/profile')
      return data?.data
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth-token'),
  })
}
