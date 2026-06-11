// src/components/jv/JVCard.tsx
import React from 'react'
import { Link } from '@tanstack/react-router'
import type { Listing } from '../../types/database'
import { formatPrice } from '../../lib/utils'
import { Badge } from '../ui/index'

interface JVCardProps {
  listing: Listing
}

export function JVCard({ listing }: JVCardProps) {
  const jv = listing.jv_opportunity

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all">
      <div className="flex items-start justify-between mb-3">
        <Badge variant="info">Joint Venture</Badge>
        {listing.verification_status === 'verified' && (
          <Badge variant="success">✓ Admin reviewed</Badge>
        )}
      </div>
      <h3 className="text-base font-semibold text-navy-mid mb-2 leading-snug">{listing.title}</h3>
      <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
        <span>📍</span>
        <span>{listing.city}, {listing.state}</span>
      </div>

      {jv && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Project value', value: formatPrice(jv.project_value) },
            { label: 'Capital needed', value: formatPrice(jv.capital_requirement) },
            { label: 'Equity share', value: jv.equity_structure ?? '—' },
          ].map(m => (
            <div key={m.label} className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{m.label}</p>
              <p className="text-sm font-semibold text-navy-mid">{m.value}</p>
            </div>
          ))}
        </div>
      )}

      <Link
        to="/jv/$listingId"
        params={{ listingId: listing.id }}
        className="block w-full bg-navy text-white text-center py-2.5 rounded-lg text-sm font-medium hover:bg-navy-light transition-colors"
      >
        View opportunity
      </Link>
    </div>
  )
}
