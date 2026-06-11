// ============================================================
// INAMAAD v3.0 — React Query Hooks
// ============================================================

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { supabase, getCurrentProfile, logActivity } from '../lib/supabase'
import type { SearchFilters, DealStage } from '../types/database'

const PAGE_SIZE = 12

// ============================================================
// AUTH
// ============================================================

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getCurrentProfile,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (updates: Record<string, unknown>) => {
      const profile = await getCurrentProfile()
      if (!profile) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single()
      if (error) throw error
      await logActivity('profile_updated', { fields: Object.keys(updates) })
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  })
}

// ============================================================
// LISTINGS
// ============================================================

export function useListings(filters: SearchFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['listings', filters],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('listings')
        .select(`
          *,
          owner:profiles!listings_owner_id_fkey(id, full_name, company_name, verification_level, is_verified),
          images:listing_images(id, image_url, is_cover, display_order),
          residential_details(*),
          commercial_details(*),
          land_details(*),
          jv_opportunity:jv_opportunities(*)
        `)
        .eq('status', 'approved')
        .is('deleted_at', null)
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1)

      if (filters.listing_type) query = query.eq('listing_type', filters.listing_type)
      if (filters.state) query = query.ilike('state', `%${filters.state}%`)
      if (filters.city) query = query.ilike('city', `%${filters.city}%`)
      if (filters.min_price) query = query.gte('price', filters.min_price)
      if (filters.max_price) query = query.lte('price', filters.max_price)
      if (filters.verification_status) query = query.eq('verification_status', filters.verification_status)
      if (filters.featured) query = query.eq('featured', true)
      if (filters.keyword) query = query.or(`title.ilike.%${filters.keyword}%,description.ilike.%${filters.keyword}%`)

      switch (filters.sort_by) {
        case 'oldest': query = query.order('created_at', { ascending: true }); break
        case 'price_asc': query = query.order('price', { ascending: true }); break
        case 'price_desc': query = query.order('price', { ascending: false }); break
        case 'most_viewed': query = query.order('view_count', { ascending: false }); break
        case 'most_saved': query = query.order('save_count', { ascending: false }); break
        default: query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : undefined,
    initialPageParam: 0,
  })
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          owner:profiles!listings_owner_id_fkey(*),
          images:listing_images(*),
          videos:listing_videos(*),
          documents:property_documents(*),
          residential_details(*),
          commercial_details(*),
          land_details(*),
          jv_opportunity:jv_opportunities(*)
        `)
        .eq('id', id)
        .is('deleted_at', null)
        .single()
      if (error) throw error
      // Increment view count
      await supabase.rpc('increment_view_count', { listing_uuid: id })
      return data
    },
    enabled: !!id,
  })
}

export function useMyListings() {
  return useQuery({
    queryKey: ['my-listings'],
    queryFn: async () => {
      const profile = await getCurrentProfile()
      if (!profile) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('listings')
        .select('*, images:listing_images(id, image_url, is_cover)')
        .eq('owner_id', profile.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useCreateListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const profile = await getCurrentProfile()
      if (!profile) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('listings')
        .insert({ ...input, owner_id: profile.id, status: 'pending_review' })
        .select()
        .single()
      if (error) throw error
      await logActivity('listing_created', { listing_id: data.id, type: input.listing_type })
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-listings'] })
      qc.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

export function useUpdateListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => {
      const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      await logActivity('listing_updated', { listing_id: id })
      return data
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['listing', id] })
      qc.invalidateQueries({ queryKey: ['my-listings'] })
    },
  })
}

export function useDeleteListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('listings')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
      await logActivity('listing_deleted', { listing_id: id })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-listings'] })
      qc.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

// ============================================================
// SAVED LISTINGS
// ============================================================

export function useSavedListings() {
  return useQuery({
    queryKey: ['saved-listings'],
    queryFn: async () => {
      const profile = await getCurrentProfile()
      if (!profile) return []
      const { data, error } = await supabase
        .from('saved_listings')
        .select('*, listing:listings(*, images:listing_images(id, image_url, is_cover))')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useToggleSave() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ listingId, isSaved }: { listingId: string; isSaved: boolean }) => {
      const profile = await getCurrentProfile()
      if (!profile) throw new Error('Not authenticated')
      if (isSaved) {
        await supabase.from('saved_listings').delete()
          .eq('user_id', profile.id).eq('listing_id', listingId)
      } else {
        await supabase.from('saved_listings').insert({ user_id: profile.id, listing_id: listingId })
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-listings'] }),
  })
}

// ============================================================
// CONVERSATIONS & MESSAGES
// ============================================================

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const profile = await getCurrentProfile()
      if (!profile) return []
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(id, title, listing_type),
          p1:profiles!conversations_participant_one_fkey(id, full_name, profile_image, verification_level),
          p2:profiles!conversations_participant_two_fkey(id, full_name, profile_image, verification_level)
        `)
        .or(`participant_one.eq.${profile.id},participant_two.eq.${profile.id}`)
        .is('deleted_at', null)
        .order('last_message_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:profiles!messages_sender_id_fkey(id, full_name, profile_image)')
        .eq('conversation_id', conversationId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data ?? []
    },
    enabled: !!conversationId,
    refetchInterval: 3000, // Poll every 3s (upgrade to realtime subscription in production)
  })
}

export function useSendMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      conversationId,
      receiverId,
      message,
    }: {
      conversationId: string
      receiverId: string
      message: string
    }) => {
      const profile = await getCurrentProfile()
      if (!profile) throw new Error('Not authenticated')
      const { data, error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: profile.id,
        receiver_id: receiverId,
        message,
      }).select().single()
      if (error) throw error
      return data
    },
    onSuccess: (_, { conversationId }) => {
      qc.invalidateQueries({ queryKey: ['messages', conversationId] })
      qc.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

export function useStartConversation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ listingId, ownerId }: { listingId: string; ownerId: string }) => {
      const profile = await getCurrentProfile()
      if (!profile) throw new Error('Not authenticated')
      // Find existing or create
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listingId)
        .eq('participant_one', profile.id)
        .eq('participant_two', ownerId)
        .single()
      if (existing) return existing
      const { data, error } = await supabase.from('conversations').insert({
        listing_id: listingId,
        participant_one: profile.id,
        participant_two: ownerId,
      }).select().single()
      if (error) throw error
      await logActivity('conversation_started', { listing_id: listingId })
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['conversations'] }),
  })
}

// ============================================================
// NOTIFICATIONS
// ============================================================

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const profile = await getCurrentProfile()
      if (!profile) return []
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data ?? []
    },
    refetchInterval: 10000,
  })
}

export function useMarkNotificationsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const profile = await getCurrentProfile()
      if (!profile) return
      await supabase.from('notifications').update({ is_read: true })
        .in('id', ids).eq('user_id', profile.id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

// ============================================================
// DEAL PIPELINE
// ============================================================

export function useDealPipeline() {
  return useQuery({
    queryKey: ['deal-pipeline'],
    queryFn: async () => {
      const profile = await getCurrentProfile()
      if (!profile) return []
      const { data, error } = await supabase
        .from('deal_pipeline')
        .select('*, listing:listings(id, title, listing_type, price, currency)')
        .eq('investor_id', profile.id)
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useUpdateDealStage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: DealStage }) => {
      const { data, error } = await supabase
        .from('deal_pipeline')
        .update({ stage, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      await logActivity('deal_stage_updated', { pipeline_id: id, stage })
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deal-pipeline'] }),
  })
}

// ============================================================
// ADMIN HOOKS
// ============================================================

export function useAdminListings(status?: string) {
  return useQuery({
    queryKey: ['admin-listings', status],
    queryFn: async () => {
      let query = supabase
        .from('listings')
        .select('*, owner:profiles!listings_owner_id_fkey(id, full_name, email, verification_level)')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      if (status) query = query.eq('status', status)
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  })
}

export function useAdminApproveListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, approve }: { id: string; approve: boolean }) => {
      const { error } = await supabase.from('listings').update({
        status: approve ? 'approved' : 'rejected',
        verification_status: approve ? 'verified' : 'rejected',
      }).eq('id', id)
      if (error) throw error
      await logActivity(approve ? 'listing_approved' : 'listing_rejected', { listing_id: id })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-listings'] })
      qc.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useAdminVerificationRequests() {
  return useQuery({
    queryKey: ['admin-verifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*, user:profiles!verification_requests_user_id_fkey(*)')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useAdminReports() {
  return useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*, reporter:profiles!reports_reporter_id_fkey(id, full_name, email)')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}
