'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Loader2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        toast.success('Login successful! Redirecting...')
        router.push('/admin/portfolio')
        router.refresh() // Ensure middleware sees the new cookie
      } else {
        const data = (await res.json()) as any
        toast.error(data.error || 'Invalid username or password')
      }
    } catch (err) {
      console.error('Login Error:', err)
      toast.error('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 font-sans text-slate-200">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
      
      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-8">
        <div className="text-center mb-8">
          <div className="bg-white/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] p-4 bg-white">
            <img src="/images/amk-ads-logo-final.png" alt="AMK ADS Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-sm text-slate-400">Please sign in to continue to the dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-slate-500"
                placeholder="Enter admin username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-slate-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-orangeHover hover:bg-brand-orange text-white font-medium rounded-lg py-3 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
      
      <div className="mt-8 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} AMK ADS. All rights reserved.
      </div>
    </div>
  )
}
