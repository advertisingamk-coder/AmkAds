import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || ''

/**
 * LoginPage
 *
 * The absolute entry point for the Admin Panel.
 * Credentials are submitted to the Worker backend (/api/admin/login)
 * which verifies them against ADMIN_USERNAME and ADMIN_PASSWORD env vars —
 * never stored in client code.
 *
 * On success the Worker sets a secure HttpOnly JWT cookie and this page
 * redirects to /dashboard.
 */
export default function LoginPage() {
  const [username, setUsername]     = useState('')
  const [password, setPassword]     = useState('')
  const [showPwd, setShowPwd]       = useState(false)
  const [isLoading, setIsLoading]   = useState(false)
  const navigate                    = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',           // Required so the HttpOnly cookie is stored
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        toast.success('Welcome back! Redirecting…')
        navigate('/dashboard', { replace: true })
      } else {
        const data = await res.json() as { error?: string }
        toast.error(data.error || 'Invalid username or password')
      }
    } catch {
      toast.error('Unable to reach the server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(245,130,31,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,130,31,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Card */}
      <div className="w-full max-w-md relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-brand-orange/20">
              <img
                src="/images/amk-ads-logo-final.png"
                alt="AMK ADS Logo"
                className="w-14 h-14 object-contain"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-brand-orange rounded-full flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white font-outfit mb-2">
            Admin Access
          </h1>
          <p className="text-slate-400 text-sm">
            Sign in to manage your AMK Ads portfolio &amp; media.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-slate-300">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600
                             focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-12 py-3 text-white placeholder:text-slate-600
                             focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-brand-orange to-brand-orangeHover text-white font-semibold
                         rounded-xl py-3 flex items-center justify-center gap-2
                         transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-brand-orange/20 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          © {new Date().getFullYear()} AMK Ads. Restricted access — authorised personnel only.
        </p>
      </div>
    </div>
  )
}
