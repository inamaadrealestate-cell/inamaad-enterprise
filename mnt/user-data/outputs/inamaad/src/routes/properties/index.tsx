// src/routes/properties/index.tsx — Listings Search
import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useListings } from '../../hooks'
import { ListingCard, ListingCardSkeleton } from '../../components/listings/ListingCard'
import { NIGERIAN_STATES } from '../../lib/utils'
import type { SearchFilters } from '../../types/database'

export const Route = createFileRoute('/properties/')({
  validateSearch: (s: Record<string, unknown>): SearchFilters => ({
    keyword: s.keyword as string ?? '',
    state: s.state as string ?? '',
    listing_type: s.listing_type as any ?? undefined,
  }),
  component: PropertiesPage,
})

const LISTING_TYPES = [
  { value: '', label: 'All types' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
  { value: 'joint_venture', label: 'Joint Venture' },
]
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'most_viewed', label: 'Most viewed' },
  { value: 'most_saved', label: 'Most saved' },
]

function PropertiesPage() {
  const search = Route.useSearch()
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: search.keyword ?? '',
    state: search.state ?? '',
    listing_type: search.listing_type ?? undefined,
    sort_by: 'newest',
  })

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useListings(filters)
  const listings = data?.pages.flat() ?? []

  function update(key: keyof SearchFilters, value: any) {
    setFilters(f => ({ ...f, [key]: value || undefined }))
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-mid mb-1">Property listings</h1>
        <p className="text-sm text-gray-500">Verified real estate opportunities across Nigeria</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <input
            value={filters.keyword ?? ''}
            onChange={e => update('keyword', e.target.value)}
            placeholder="Keyword search..."
            className="col-span-2 md:col-span-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
          />
          <select value={filters.state ?? ''} onChange={e => update('state', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy appearance-none">
            <option value="">All states</option>
            {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filters.listing_type ?? ''} onChange={e => update('listing_type', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy appearance-none">
            {LISTING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select value={filters.verification_status ?? ''} onChange={e => update('verification_status', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy appearance-none">
            <option value="">Any status</option>
            <option value="verified">Verified only</option>
          </select>
          <select value={filters.sort_by ?? 'newest'} onChange={e => update('sort_by', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy appearance-none">
            {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <ListingCardSkeleton key={i} />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <h3 className="text-base font-semibold text-navy-mid mb-2">No listings found</h3>
          <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-4">{listings.length} listing{listings.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
          {hasNextPage && (
            <div className="text-center mt-10">
              <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}
                className="bg-navy text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-navy-light transition-colors disabled:opacity-50">
                {isFetchingNextPage ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
