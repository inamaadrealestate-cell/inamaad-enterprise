import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number | null | undefined, currency = 'NGN'): string {
  if (amount == null) return 'Price on request'
  if (currency === 'NGN') {
    if (amount >= 1_000_000_000) return `₦ ${(amount / 1_000_000_000).toFixed(1)}B`
    if (amount >= 1_000_000) return `₦ ${(amount / 1_000_000).toFixed(0)}M`
    return `₦ ${amount.toLocaleString()}`
  }
  return `${currency} ${amount.toLocaleString()}`
}

export function formatArea(sqm: number | null | undefined): string {
  if (sqm == null) return '—'
  if (sqm >= 10_000) return `${(sqm / 10_000).toFixed(1)} ha`
  return `${sqm.toLocaleString()} sqm`
}

export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export function formatRelativeDate(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return `${months} month${months > 1 ? 's' : ''} ago`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function listingTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    residential: 'Residential', commercial: 'Commercial',
    land: 'Land', joint_venture: 'Joint Venture',
  }
  return labels[type] ?? type
}

export function dealStageLabel(stage: string): string {
  const labels: Record<string, string> = {
    new_lead: 'New Lead', contact_established: 'Contact Established',
    discussion: 'Discussion', negotiation: 'Negotiation',
    due_diligence: 'Due Diligence', agreement: 'Agreement', closed: 'Closed',
  }
  return labels[stage] ?? stage
}

export function documentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    certificate_of_occupancy: 'Certificate of Occupancy',
    right_of_occupancy: 'Right of Occupancy',
    survey_plan: 'Survey Plan',
    deed_of_assignment: 'Deed of Assignment',
    building_approval: 'Building Approval',
    development_permit: 'Development Permit',
    jv_summary: 'JV Summary',
    ownership_document: 'Ownership Document',
  }
  return labels[type] ?? type
}

export const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT Abuja','Gombe',
  'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
  'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers',
  'Sokoto','Taraba','Yobe','Zamfara',
]

export const DEAL_STAGES = [
  'new_lead','contact_established','discussion',
  'negotiation','due_diligence','agreement','closed',
] as const
