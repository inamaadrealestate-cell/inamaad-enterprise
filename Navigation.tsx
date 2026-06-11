// ============================================================
// INAMAAD — Navigation Component
// ============================================================

import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { useProfile, useNotifications, useMarkNotificationsRead } from '../../hooks'
import { Avatar, Badge } from '../ui'
import { supabase } from '../../lib/supabase'

export function Navigation() {
  const { data: profile } = useProfile()
  const { data: notifications = [] } = useNotifications()
  const markRead = useMarkNotificationsRead()
  const router = useRouter()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.is_read).length

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.navigate({ to: '/auth/login' })
  }

  const navLinks = [
    { to: '/properties', label: 'Properties' },
    { to: '/properties?type=land', label: 'Land' },
    { to: '/jv', label: 'JV Opportunities' },
    { to: '/investors', label: 'Investors' },
    { to: '/about', label: 'About' },
  ]

  return (
    <nav className="bg-navy-DEFAULT sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-gold rounded-md flex items-center justify-center">
              <span className="text-navy-DEFAULT font-bold text-sm tracking-wide">IN</span>
            </div>
            <span className="text-white font-semibold text-base tracking-wide">
              INA<span className="text-gold">MAAD</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white/65 hover:text-white text-sm transition-colors duration-150"
                activeProps={{ className: 'text-white' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {profile ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); setProfileMenuOpen(false) }}
                    className="relative p-2 text-white/65 hover:text-white transition-colors"
                    aria-label="Notifications"
                  >
                    <i className="ti ti-bell text-lg" aria-hidden="true" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-gold rounded-full text-navy-DEFAULT text-[10px] font-bold flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-modal border border-slate-200 z-50">
                      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-800">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markRead.mutate(notifications.filter(n => !n.is_read).map(n => n.id))}
                            className="text-xs text-gold-muted font-medium hover:text-gold transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-slate-400">No notifications</div>
                        ) : (
                          notifications.slice(0, 10).map(n => (
                            <div key={n.id} className={`px-4 py-3 ${!n.is_read ? 'bg-gold/5' : ''}`}>
                              <p className="text-sm font-medium text-slate-800">{n.title}</p>
                              {n.body && <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>}
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-2 border-t border-slate-200">
                        <Link to="/notifications" onClick={() => setNotifOpen(false)} className="block text-center text-xs text-gold-muted font-medium py-1.5 hover:text-gold transition-colors">
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages icon */}
                <Link to="/messages" className="p-2 text-white/65 hover:text-white transition-colors" aria-label="Messages">
                  <i className="ti ti-message text-lg" aria-hidden="true" />
                </Link>

                {/* Profile menu */}
                <div className="relative ml-1">
                  <button
                    onClick={() => { setProfileMenuOpen(!profileMenuOpen); setNotifOpen(false) }}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Avatar name={profile.full_name} imageUrl={profile.profile_image} size="sm" />
                    <span className="hidden sm:block text-white text-sm font-medium max-w-[100px] truncate">
                      {profile.full_name.split(' ')[0]}
                    </span>
                    <i className="ti ti-chevron-down text-white/50 text-xs" aria-hidden="true" />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-modal border border-slate-200 z-50 py-1">
                      <div className="px-4 py-3 border-b border-slate-200">
                        <p className="text-sm font-semibold text-slate-800 truncate">{profile.full_name}</p>
                        <p className="text-xs text-slate-500 capitalize">{profile.role}</p>
                      </div>
                      {[
                        { to: '/dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard' },
                        { to: '/listings/my', label: 'My Listings', icon: 'ti-building' },
                        { to: '/saved', label: 'Saved Listings', icon: 'ti-heart' },
                        { to: '/messages', label: 'Messages', icon: 'ti-message' },
                        { to: '/profile/settings', label: 'Settings', icon: 'ti-settings' },
                      ].map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <i className={`ti ${item.icon} text-base text-slate-400`} aria-hidden="true" />
                          {item.label}
                        </Link>
                      ))}
                      {profile.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 transition-colors border-t border-slate-200 mt-1"
                        >
                          <i className="ti ti-shield text-base text-amber-500" aria-hidden="true" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-200 mt-1"
                      >
                        <i className="ti ti-logout text-base" aria-hidden="true" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="text-white/70 hover:text-white text-sm transition-colors px-3 py-1.5">
                  Sign in
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-gold text-navy-DEFAULT font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gold-light transition-colors"
                >
                  Get started
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-white/65 hover:text-white ml-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <i className={`ti ${mobileMenuOpen ? 'ti-x' : 'ti-menu-2'} text-xl`} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-mid border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-white/75 hover:text-white text-sm rounded-lg hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── Footer ──────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="bg-navy-DEFAULT text-white/45 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-gold rounded flex items-center justify-center">
                <span className="text-navy-DEFAULT font-bold text-xs">IN</span>
              </div>
              <span className="text-white font-semibold text-sm tracking-wide">INA<span className="text-gold">MAAD</span></span>
            </div>
            <p className="text-sm leading-relaxed max-w-[220px]">
              Nigeria's verified real estate investment marketplace — connecting capital with verified opportunities.
            </p>
          </div>
          {[
            { heading: 'Platform', links: ['Properties', 'Land listings', 'JV opportunities', 'Investor network'] },
            { heading: 'Account', links: ['Sign in', 'Create account', 'Verification', 'Post listing'] },
            { heading: 'Company', links: ['About', 'Contact', 'Privacy policy', 'Terms of use'] },
          ].map(col => (
            <div key={col.heading}>
              <h4 className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-4">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-sm hover:text-white/75 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs">
          <span>© {new Date().getFullYear()} INAMAAD. All rights reserved.</span>
          <span>Built for Nigeria. Scaling across Africa.</span>
        </div>
      </div>
    </footer>
  )
}
