// src/routes/dashboard/index.tsx — Role-based dashboard
import React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useProfile, useMyListings, useSavedListings, useConversations, useDealPipeline, useNotifications } from '../../hooks'
import { StatCard } from '../../components/ui/index'
import { ListingCard } from '../../components/listings/ListingCard'
import { formatPrice, dealStageLabel, formatRelativeDate } from '../../lib/utils'

export const Route = createFileRoute('/dashboard/')({ component: DashboardPage })

function DashboardPage() {
  const { data: profile, isLoading } = useProfile()
  if (isLoading) return <div className="max-w-7xl mx-auto px-6 py-12 text-center text-gray-400">Loading dashboard…</div>
  if (!profile) return <div className="max-w-7xl mx-auto px-6 py-12 text-center"><Link to="/auth/login" className="text-gold-muted">Sign in to view your dashboard</Link></div>

  if (profile.role === 'admin') return <AdminDashboard />
  if (profile.role === 'investor') return <InvestorDashboard />
  return <OwnerDashboard />
}

function InvestorDashboard() {
  const { data: profile } = useProfile()
  const { data: savedPages } = useSavedListings()
  const { data: conversations } = useConversations()
  const { data: pipeline } = useDealPipeline()
  const { data: notifications } = useNotifications()
  const unread = notifications?.filter(n => !n.is_read).length ?? 0
  const saved = savedPages ?? []

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-mid">Welcome back, {profile?.full_name?.split(' ')[0]}</h1>
        <p className="text-sm text-gray-500 mt-1">Your investment dashboard</p>
      </div>

      {!profile?.is_verified && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-800">Complete your verification</p>
            <p className="text-xs text-amber-600 mt-0.5">Verified investors get access to restricted documents and priority visibility.</p>
          </div>
          <Link to="/verification" className="bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex-shrink-0">
            Get verified
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Saved listings" value={saved.length} />
        <StatCard label="Active deals" value={pipeline?.length ?? 0} />
        <StatCard label="Conversations" value={conversations?.length ?? 0} />
        <StatCard label="Unread notifications" value={unread} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-navy-mid">Saved listings</h2>
            <Link to="/saved" className="text-xs text-gold-muted hover:text-gold">View all →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {saved.slice(0, 4).map(s => s.listing && <ListingCard key={s.id} listing={s.listing as any} />)}
            {saved.length === 0 && (
              <div className="col-span-2 text-center py-10 bg-white border border-gray-200 rounded-xl">
                <p className="text-3xl mb-2">🔖</p>
                <p className="text-sm text-gray-500">No saved listings yet</p>
                <Link to="/properties" className="text-xs text-gold-muted hover:text-gold mt-2 block">Browse properties →</Link>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-navy-mid">Deal pipeline</h2>
            <Link to="/dashboard/pipeline" className="text-xs text-gold-muted hover:text-gold">View all →</Link>
          </div>
          <div className="space-y-3">
            {(pipeline ?? []).slice(0, 5).map(deal => (
              <div key={deal.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1 truncate">{deal.listing?.title}</p>
                <p className="text-sm font-semibold text-navy-mid">{formatPrice(deal.listing?.price, deal.listing?.currency)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                  <span className="text-xs text-gray-500">{dealStageLabel(deal.stage)}</span>
                </div>
              </div>
            ))}
            {!pipeline?.length && (
              <div className="text-center py-8 bg-white border border-gray-200 rounded-xl">
                <p className="text-2xl mb-2">📊</p>
                <p className="text-xs text-gray-400">No active deals</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function OwnerDashboard() {
  const { data: profile } = useProfile()
  const { data: myListings } = useMyListings()
  const { data: conversations } = useConversations()
  const listings = myListings ?? []
  const active = listings.filter(l => l.status === 'approved').length
  const pending = listings.filter(l => l.status === 'pending_review').length

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-mid">Welcome back, {profile?.full_name?.split(' ')[0]}</h1>
          <p className="text-sm text-gray-500 mt-1 capitalize">{profile?.role} dashboard</p>
        </div>
        <Link to="/listings/create" className="bg-gold text-navy font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-gold-light transition-colors">
          + New listing
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total listings" value={listings.length} />
        <StatCard label="Active" value={active} />
        <StatCard label="Pending review" value={pending} />
        <StatCard label="Enquiries" value={conversations?.length ?? 0} />
      </div>

      <h2 className="text-base font-semibold text-navy-mid mb-4">My listings</h2>
      {listings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <p className="text-4xl mb-3">🏠</p>
          <h3 className="text-base font-semibold text-navy-mid mb-2">No listings yet</h3>
          <p className="text-sm text-gray-400 mb-5">Create your first listing to start receiving enquiries</p>
          <Link to="/listings/create" className="bg-navy text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors">
            Create listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map(l => <ListingCard key={l.id} listing={l as any} />)}
        </div>
      )}
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
      <h1 className="text-2xl font-bold text-navy-mid mb-6">Admin dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'User management', href: '/admin/users', icon: '👥', desc: 'View, verify, suspend users' },
          { label: 'Listing management', href: '/admin/listings', icon: '🏠', desc: 'Approve and moderate listings' },
          { label: 'Verifications', href: '/admin/verifications', icon: '✅', desc: 'Review verification requests' },
          { label: 'Reports', href: '/admin/reports', icon: '🚨', desc: 'Handle fraud and abuse reports' },
          { label: 'Analytics', href: '/admin/analytics', icon: '📈', desc: 'Platform metrics and insights' },
        ].map(item => (
          <Link key={item.href} to={item.href}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-navy/30 hover:shadow-sm transition-all">
            <div className="text-2xl mb-3">{item.icon}</div>
            <h3 className="text-sm font-semibold text-navy-mid mb-1">{item.label}</h3>
            <p className="text-xs text-gray-400">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
