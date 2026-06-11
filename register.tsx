// src/routes/auth/register.tsx
import React, { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { signUp } from '../../lib/supabase'

export const Route = createFileRoute('/auth/register')({ component: RegisterPage })

const ROLES = [
  { value: 'investor', label: 'Investor', desc: 'Seeking real estate investment opportunities' },
  { value: 'landowner', label: 'Landowner', desc: 'Own land and want to sell or develop' },
  { value: 'developer', label: 'Developer', desc: 'Developing and selling properties' },
  { value: 'agent', label: 'Agent', desc: 'Representing buyers, sellers, and landlords' },
]

function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'investor', company_name: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error: err } = await signUp(form.email, form.password, form.full_name, form.role)
    if (err) { setError(err.message); setLoading(false); return }
    navigate({ to: '/auth/verify-email' })
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-gold font-bold text-sm">IN</span>
          </div>
          <h1 className="text-2xl font-bold text-navy-mid mb-1">Create your account</h1>
          <p className="text-sm text-gray-500">Join Nigeria's verified investment marketplace</p>
          <div className="flex items-center gap-2 justify-center mt-4">
            {[1,2,3].map(n => (
              <div key={n} className={`h-1.5 rounded-full transition-all ${n <= step ? 'w-8 bg-navy' : 'w-4 bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-navy-mid mb-4">Personal details</h2>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Full name</label>
                <input value={form.full_name} onChange={e => update('full_name', e.target.value)} placeholder="Your full name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Phone</label>
                <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+234 xxx xxx xxxx"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy" />
              </div>
              <button onClick={() => setStep(2)} disabled={!form.full_name || !form.email}
                className="w-full bg-navy text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors disabled:opacity-50">
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-base font-semibold text-navy-mid mb-4">Select your role</h2>
              <div className="space-y-3 mb-6">
                {ROLES.map(r => (
                  <label key={r.value} className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${form.role === r.value ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="role" value={r.value} checked={form.role === r.value}
                      onChange={e => update('role', e.target.value)} className="mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-navy-mid">{r.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-navy-mid py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-navy text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors">Continue</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-base font-semibold text-navy-mid mb-4">Secure your account</h2>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Company name (optional)</label>
                <input value={form.company_name} onChange={e => update('company_name', e.target.value)} placeholder="Your company or firm"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Password</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)} minLength={8} required
                  placeholder="Minimum 8 characters"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-navy-mid py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">Back</button>
                <button type="submit" disabled={loading || !form.password}
                  className="flex-1 bg-gold text-navy py-2.5 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors disabled:opacity-50">
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </div>
            </form>
          )}
        </div>
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-gold-muted font-medium hover:text-gold">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
