// src/components/listings/ListingCard.tsx
import React from 'react'
import { Link } from '@tanstack/react-router'
import type { Listing } from '../../types/database'
import { formatPrice, formatRelativeDate, listingTypeLabel, cn } from '../../lib/utils'
import { Badge, Avatar } from '../ui/index'
import { useToggleSave, useSavedListings } from '../../hooks'

interface ListingCardProps {
  listing: Listing
  className?: string
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const { data: saved } = useSavedListings()
  const toggle = useToggleSave()
  const isSaved = saved?.some(s => s.listing_id === listing.id) ?? false
  const coverImage = listing.images?.find(i => i.is_cover) ?? listing.images?.[0]

  const specLine = (() => {
    if (listing.listing_type === 'residential' && listing.residential_details) {
      const d = listing.residential_details
      return [d.bedrooms && `${d.bedrooms} beds`, d.bathrooms && `${d.bathrooms} baths`].filter(Boolean).join(' · ')
    }
    if (listing.listing_type === 'commercial' && listing.commercial_details) {
      const d = listing.commercial_details
      return d.building_area ? `${d.building_area.toLocaleString()} sqm` : ''
    }
    if (listing.listing_type === 'land' && listing.land_details) {
      const d = listing.land_details
      return d.land_size ? `${d.land_size.toLocaleString()} sqm` : ''
    }
    if (listing.listing_type === 'joint_venture' && listing.jv_opportunity) {
      const jv = listing.jv_opportunity
      return jv.project_value ? `Project: ${formatPrice(jv.project_value)}` : ''
    }
    return ''
  })()

  return (
    <div className={cn('bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all', className)}>
      {/* Image */}
      <Link to="/properties/$listingId" params={{ listingId: listing.id }} className="block relative">
        <div className="h-44 bg-navy-mid flex items-center justify-center overflow-hidden">
          {coverImage
            ? <img src={coverImage.image_url} alt={listing.title} className="w-full h-full object-cover" loading="lazy" />
            : <div className="text-white/10 text-5xl">⬛</div>
          }
        </div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {listing.featured && <Badge variant="featured">Featured</Badge>}
          {listing.verification_status === 'verified' && (
            <Badge variant="verified">✓ Verified</Badge>
          )}
          <Badge variant="type">{listingTypeLabel(listing.listing_type)}</Badge>
        </div>
      </Link>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-base font-bold text-navy-mid leading-tight">{formatPrice(listing.price, listing.currency)}</p>
          <button
            onClick={() => toggle.mutate({ listingId: listing.id, isSaved })}
            className={cn('flex-shrink-0 p-1 rounded transition-colors', isSaved ? 'text-red-500' : 'text-gray-300 hover:text-gray-500')}
            aria-label={isSaved ? 'Unsave listing' : 'Save listing'}
          >
            ♥
          </button>
        </div>
        <p className="text-sm text-navy-mid font-medium mb-2 line-clamp-2 leading-snug">{listing.title}</p>
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
          <span>📍</span>
          <span>{listing.city}, {listing.state}</span>
        </div>
        {specLine && (
          <p className="text-xs text-gray-500 mb-3">{specLine}</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar name={listing.owner?.full_name ?? 'Owner'} size="xs" />
          <span className="text-xs text-gray-500 truncate max-w-[120px]">
            {listing.owner?.company_name ?? listing.owner?.full_name}
          </span>
        </div>
        <Link
          to="/properties/$listingId"
          params={{ listingId: listing.id }}
          className="text-xs text-gold-muted font-medium hover:text-gold transition-colors"
        >
          View details →
        </Link>
      </div>
    </div>
  )
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="h-44 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-gray-200 animate-pulse rounded w-1/2" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
        <div className="h-3 bg-gray-200 animate-pulse rounded w-1/3" />
      </div>
    </div>
  )
}
