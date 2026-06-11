// src/routes/properties/$listingId.tsx — Listing Detail
import React, { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useListing, useStartConversation, useProfile, useToggleSave, useSavedListings } from '../../hooks'
import { formatPrice, formatDate, documentTypeLabel, listingTypeLabel } from '../../lib/utils'
import { Badge, Avatar, Button, Alert } from '../../components/ui/index'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/properties/$listingId')({ component: ListingDetailPage })

function ListingDetailPage() {
  const { listingId } = Route.useParams()
  const { data: listing, isLoading, error } = useListing(listingId)
  const { data: profile } = useProfile()
  const { data: saved } = useSavedListings()
  const startConv = useStartConversation()
  const toggleSave = useToggleSave()
  const navigate = useNavigate()
  const [imgIndex, setImgIndex] = useState(0)
  const [contactSent, setContactSent] = useState(false)

  if (isLoading) return <DetailSkeleton />
  if (error || !listing) return (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
      <p className="text-4xl mb-4">😕</p>
      <h2 className="text-lg font-semibold text-navy-mid mb-2">Listing not found</h2>
      <Link to="/properties" className="text-sm text-gold-muted hover:text-gold">← Back to listings</Link>
    </div>
  )

  const images = listing.images ?? []
  const isSaved = saved?.some(s => s.listing_id === listing.id) ?? false
  const isOwner = profile?.id === listing.owner_id
  const jv = listing.jv_opportunity

  async function handleContact() {
    if (!profile) { navigate({ to: '/auth/login' }); return }
    if (!listing.owner_id) return
    const conv = await startConv.mutateAsync({ listingId: listing.id, ownerId: listing.owner_id })
    if (conv?.id) navigate({ to: '/messages/$conversationId', params: { conversationId: conv.id } })
    setContactSent(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link to="/" className="hover:text-gray-600">Home</Link>
        <span>›</span>
        <Link to="/properties" className="hover:text-gray-600">Properties</Link>
        <span>›</span>
        <span className="text-navy-mid truncate max-w-xs">{listing.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Left column */}
        <div>
          {/* Gallery */}
          <div className="bg-navy-mid rounded-xl overflow-hidden mb-5">
            <div className="h-72 md:h-96 relative flex items-center justify-center">
              {images[imgIndex]
                ? <img src={images[imgIndex].image_url} alt={listing.title} className="w-full h-full object-cover" />
                : <div className="text-white/10 text-7xl">⬛</div>
              }
              <div className="absolute top-4 left-4 flex gap-2">
                {listing.featured && <Badge variant="featured">Featured</Badge>}
                {listing.verification_status === 'verified' && <Badge variant="verified">✓ Verified</Badge>}
              </div>
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button onClick={() => setImgIndex(i => Math.max(0, i - 1))}
                    className="w-8 h-8 bg-black/40 text-white rounded-lg flex items-center justify-center hover:bg-black/60">‹</button>
                  <button onClick={() => setImgIndex(i => Math.min(images.length - 1, i + 1))}
                    className="w-8 h-8 bg-black/40 text-white rounded-lg flex items-center justify-center hover:bg-black/60">›</button>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-3 bg-navy overflow-x-auto">
                {images.slice(0, 8).map((img, i) => (
                  <button key={img.id} onClick={() => setImgIndex(i)}
                    className={`w-16 h-12 flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${i === imgIndex ? 'border-gold' : 'border-transparent'}`}>
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
                {images.length > 8 && (
                  <div className="w-16 h-12 flex-shrink-0 rounded bg-white/10 flex items-center justify-center text-white text-xs">
                    +{images.length - 8}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header */}
          <div className="mb-5">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="type">{listingTypeLabel(listing.listing_type)}</Badge>
              {listing.verification_status === 'verified' && <Badge variant="success">✓ Document verified</Badge>}
            </div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-navy-mid leading-tight">{listing.title}</h1>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-navy-mid">{formatPrice(listing.price, listing.currency)}</p>
                <p className="text-xs text-gray-400">Asking price</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">📍 {listing.address ? `${listing.address}, ` : ''}{listing.city}, {listing.state}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => toggleSave.mutate({ listingId: listing.id, isSaved })}
                className={`text-sm px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${isSaved ? 'border-red-200 text-red-500 bg-red-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                ♥ {isSaved ? 'Saved' : 'Save listing'}
              </button>
              <button className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
                ⬆ Share
              </button>
            </div>
          </div>

          {/* Specs */}
          {(listing.residential_details || listing.commercial_details || listing.land_details) && (
            <div className="bg-white border border-gray-200 rounded-xl mb-4">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <span className="text-sm font-semibold text-navy-mid">Property specifications</span>
              </div>
              <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-3">
                {listing.residential_details && Object.entries({
                  Bedrooms: listing.residential_details.bedrooms,
                  Bathrooms: listing.residential_details.bathrooms,
                  'Parking spaces': listing.residential_details.parking_spaces,
                  'Floor area': listing.residential_details.floor_area ? `${listing.residential_details.floor_area} sqm` : null,
                }).filter(([, v]) => v != null).map(([k, v]) => (
                  <SpecItem key={k} label={k} value={String(v)} />
                ))}
                {listing.commercial_details && Object.entries({
                  'Building area': listing.commercial_details.building_area ? `${listing.commercial_details.building_area} sqm` : null,
                  'Land area': listing.commercial_details.land_area ? `${listing.commercial_details.land_area} sqm` : null,
                  'Property class': listing.commercial_details.property_class,
                  'Occupancy': listing.commercial_details.occupancy_status?.replace(/_/g, ' '),
                  'Floors': listing.commercial_details.floors,
                }).filter(([, v]) => v != null).map(([k, v]) => (
                  <SpecItem key={k} label={k} value={String(v)} />
                ))}
                {listing.land_details && Object.entries({
                  'Land size': listing.land_details.land_size ? `${listing.land_details.land_size} sqm` : null,
                  'Land use': listing.land_details.land_use_type?.replace(/_/g, ' '),
                  'Title type': listing.land_details.title_type?.replace(/_/g, ' ').toUpperCase(),
                }).filter(([, v]) => v != null).map(([k, v]) => (
                  <SpecItem key={k} label={k} value={String(v)} />
                ))}
              </div>
            </div>
          )}

          {/* JV details */}
          {jv && (
            <div className="bg-white border border-gray-200 rounded-xl mb-4">
              <div className="px-5 py-4 border-b border-gray-100">
                <span className="text-sm font-semibold text-navy-mid">Joint venture details</span>
              </div>
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <SpecItem label="Project value" value={formatPrice(jv.project_value)} />
                  <SpecItem label="Capital required" value={formatPrice(jv.capital_requirement)} />
                  <SpecItem label="Equity structure" value={jv.equity_structure ?? '—'} />
                </div>
                {jv.exit_strategy && (
                  <div><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Exit strategy</p><p className="text-sm text-navy-mid">{jv.exit_strategy}</p></div>
                )}
                {jv.risk_summary && (
                  <div><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Risk summary</p><p className="text-sm text-gray-600 leading-relaxed">{jv.risk_summary}</p></div>
                )}
                {jv.timeline && (
                  <div><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Timeline</p><p className="text-sm text-navy-mid">{jv.timeline}</p></div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {listing.description && (
            <div className="bg-white border border-gray-200 rounded-xl mb-4">
              <div className="px-5 py-4 border-b border-gray-100">
                <span className="text-sm font-semibold text-navy-mid">Description</span>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>
              </div>
            </div>
          )}

          {/* Documents */}
          {(listing.documents ?? []).length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl mb-4">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-navy-mid">Property documents</span>
                <span className="text-xs text-gray-400">Access on request</span>
              </div>
              <div className="p-5 space-y-2">
                {listing.documents!.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center text-sm">📄</div>
                      <div>
                        <p className="text-sm font-medium text-navy-mid">{documentTypeLabel(doc.document_type)}</p>
                        <p className="text-xs text-gray-400">{formatDate(doc.uploaded_at)}</p>
                      </div>
                    </div>
                    {doc.verified
                      ? <span className="text-xs text-green-600 flex items-center gap-1">✓ Verified</span>
                      : <span className="text-xs text-gray-400 flex items-center gap-1">🔒 Restricted</span>
                    }
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="bg-white border border-gray-200 rounded-xl mb-4">
            <div className="px-5 py-4 border-b border-gray-100">
              <span className="text-sm font-semibold text-navy-mid">Location</span>
            </div>
            <div className="p-5">
              <div className="h-36 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mb-4 border border-blue-100">
                <div className="text-center">
                  <p className="text-2xl mb-1">🗺️</p>
                  <p className="text-xs text-gray-400">{listing.city}, {listing.state}, Nigeria</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {[['State', listing.state], ['City', listing.city], ['Country', listing.country]].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-400">{k}</span>
                    <span className="text-navy-mid font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Owner card */}
          {listing.owner && (
            <div className="bg-white border border-gray-200 rounded-xl mb-4">
              <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-navy-mid">Listing owner</span>
                {listing.owner.is_verified && <Badge variant="verified">✓ Verified</Badge>}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={listing.owner.full_name} imageUrl={listing.owner.profile_image} size="lg" />
                  <div>
                    <p className="text-sm font-semibold text-navy-mid">{listing.owner.full_name}</p>
                    {listing.owner.company_name && <p className="text-xs text-gray-500">{listing.owner.company_name}</p>}
                    {listing.owner.is_verified && <p className="text-xs text-green-600 mt-1">✓ Premium verified</p>}
                  </div>
                </div>
                {contactSent ? (
                  <Alert variant="success">Message sent! Check your inbox.</Alert>
                ) : !isOwner ? (
                  <>
                    <Button variant="primary" className="w-full mb-2" onClick={handleContact} loading={startConv.isPending}>
                      💬 Send enquiry
                    </Button>
                    <button onClick={() => toggleSave.mutate({ listingId: listing.id, isSaved })}
                      className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                      ♥ {isSaved ? 'Saved' : 'Save listing'}
                    </button>
                  </>
                ) : (
                  <Link to="/listings/$listingId/edit" params={{ listingId: listing.id }}
                    className="block w-full bg-navy text-white text-center py-2.5 rounded-lg text-sm font-medium hover:bg-navy-light transition-colors">
                    ✏️ Edit listing
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Listing meta */}
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="px-4 py-3.5 border-b border-gray-100">
              <span className="text-sm font-semibold text-navy-mid">Listing details</span>
            </div>
            <div className="p-4 space-y-2.5 text-sm">
              {[
                ['Type', listingTypeLabel(listing.listing_type)],
                ['Status', listing.status],
                ['Verification', listing.verification_status],
                ['Listed', formatDate(listing.created_at)],
                ['Views', listing.view_count.toLocaleString()],
                ['Saved by', `${listing.save_count} investors`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">{k}</span>
                  <span className="text-navy-mid font-medium capitalize">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-semibold text-navy-mid capitalize">{value}</p>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div>
          <div className="h-80 bg-gray-200 animate-pulse rounded-xl mb-5" />
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-2/3" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3" />
          </div>
        </div>
        <div>
          <div className="h-64 bg-gray-200 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  )
}
