// ============================================================
// INAMAAD — UI Components
// ============================================================

import React from 'react'
import { clsx } from 'clsx'

// ─── Button ─────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'navy' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-gold text-navy-DEFAULT hover:bg-gold-light',
    secondary: 'bg-transparent text-white border border-white/30 hover:bg-white/10',
    outline: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    navy: 'bg-navy-DEFAULT text-white hover:bg-navy-mid',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-sm',
  }

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : icon}
      {children}
    </button>
  )
}

// ─── Spinner ─────────────────────────────────────────────────
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-3 h-3', md: 'w-5 h-5', lg: 'w-8 h-8' }
  return (
    <div className={clsx('border-2 border-current border-t-transparent rounded-full animate-spin', sizes[size])} />
  )
}

// ─── Badge ───────────────────────────────────────────────────
interface BadgeProps {
  variant?: 'verified' | 'success' | 'pending' | 'rejected' | 'type' | 'featured' | 'info'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'info', children, className }: BadgeProps) {
  const variants = {
    verified: 'bg-navy-DEFAULT/85 text-gold-light',
    success: 'bg-green-50 text-green-700 border border-green-200',
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    rejected: 'bg-red-50 text-red-700 border border-red-200',
    type: 'bg-navy-DEFAULT text-white/85',
    featured: 'bg-gold text-navy-DEFAULT',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
  }
  return (
    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold tracking-wide', variants[variant], className)}>
      {children}
    </span>
  )
}

// ─── Card ─────────────────────────────────────────────────────
export function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('bg-white border border-slate-200 rounded-xl', className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('px-5 py-4 border-b border-slate-200 flex items-center justify-between', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('p-5', className)}>{children}</div>
}

// ─── Input ───────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full border rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold placeholder:text-slate-400 transition-colors duration-150',
            error ? 'border-red-400' : 'border-slate-200',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ─── Select ──────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && <label htmlFor={selectId} className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'w-full border rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors duration-150 appearance-none cursor-pointer',
            error ? 'border-red-400' : 'border-slate-200',
            className
          )}
          {...props}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

// ─── Textarea ────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const taId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && <label htmlFor={taId} className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>}
        <textarea
          ref={ref}
          id={taId}
          className={clsx(
            'w-full border rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold placeholder:text-slate-400 transition-colors duration-150 resize-none',
            error ? 'border-red-400' : 'border-slate-200',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

// ─── Skeleton ────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('bg-slate-200 animate-pulse rounded', className)} />
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="px-4 py-3 border-t border-slate-200 flex justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────
interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon = 'ti-inbox', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <i className={`ti ${icon} text-3xl text-slate-400`} aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

// ─── Avatar ──────────────────────────────────────────────────
interface AvatarProps {
  name: string
  imageUrl?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ name, imageUrl, size = 'md', className }: AvatarProps) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl' }
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  if (imageUrl) {
    return <img src={imageUrl} alt={name} className={clsx('rounded-full object-cover', sizes[size], className)} />
  }
  return (
    <div className={clsx('rounded-full bg-navy-DEFAULT flex items-center justify-center text-gold-light font-semibold flex-shrink-0', sizes[size], className)}>
      {initials}
    </div>
  )
}

// ─── Modal ───────────────────────────────────────────────────
interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  if (!open) return null
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={clsx('relative bg-white rounded-xl shadow-modal w-full', sizes[size])}>
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <i className="ti ti-x text-lg" aria-label="Close modal" />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Stat Card ───────────────────────────────────────────────
export function StatCard({ label, value, icon, trend }: { label: string; value: string | number; icon?: string; trend?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
        {icon && <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
          <i className={`ti ${icon} text-gold-muted`} aria-hidden="true" />
        </div>}
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {trend && <p className="text-xs text-slate-400 mt-1">{trend}</p>}
    </div>
  )
}

// ─── Section Header ──────────────────────────────────────────
export function SectionHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-7">
      <div>
        {eyebrow && <p className="text-xs font-semibold text-gold-muted uppercase tracking-widest mb-2">{eyebrow}</p>}
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
      </div>
      {action}
    </div>
  )
}

// ─── Alert ───────────────────────────────────────────────────
export function Alert({ type = 'info', children }: { type?: 'info' | 'success' | 'warning' | 'error'; children: React.ReactNode }) {
  const styles = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-red-50 text-red-700 border-red-200',
  }
  const icons = { info: 'ti-info-circle', success: 'ti-circle-check', warning: 'ti-alert-triangle', error: 'ti-alert-circle' }
  return (
    <div className={clsx('flex items-start gap-3 px-4 py-3 rounded-lg border text-sm', styles[type])}>
      <i className={`ti ${icons[type]} text-lg flex-shrink-0 mt-0.5`} aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}

// ─── Price Formatter ─────────────────────────────────────────
export function formatPrice(price: number | null, currency = 'NGN'): string {
  if (!price) return 'Price on request'
  const symbol = currency === 'NGN' ? '₦' : currency
  if (price >= 1_000_000_000) return `${symbol} ${(price / 1_000_000_000).toFixed(1)}B`
  if (price >= 1_000_000) return `${symbol} ${(price / 1_000_000).toFixed(0)}M`
  return `${symbol} ${price.toLocaleString()}`
}

// ─── Verification Indicator ──────────────────────────────────
export function VerifiedBadge({ level }: { level: string }) {
  if (level === 'unverified') return null
  const labels: Record<string, string> = {
    verified: 'Verified',
    premium_verified: 'Premium Verified',
    institutional_verified: 'Institutional Verified',
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-navy-DEFAULT/85 text-gold-light">
      <i className="ti ti-shield-check text-[10px]" aria-hidden="true" />
      {labels[level] ?? 'Verified'}
    </span>
  )
}
