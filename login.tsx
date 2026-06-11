// src/routes/auth/login.tsx
import React, { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { signIn } from '../../lib/supabase'
import { useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/auth/login')({ component: LoginPage })

function LoginPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error: err } = await signIn(email, password)
    if (err) { setError(err.message); setLoading(false); return }
    qc.invalidateQueries({ queryKey: ['profile'] })
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-gold font-bold text-sm">IN</span>
          </div>
          <h1 className="text-2xl font-bold text-navy-mid mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500">Sign in to your INAMAAD account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy" />
          </div>
          <div className="flex justify-end">
            <Link to="/auth/forgot-password" className="text-xs text-gold-muted hover:text-gold">Forgot password?</Link>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-navy text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-gold-muted font-medium hover:text-gold">Create account</Link>
        </p>
      </div>
    </div>
  )
}
