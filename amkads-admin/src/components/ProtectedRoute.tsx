import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import AdminLayout from './AdminLayout'

const API_URL = import.meta.env.VITE_API_URL || 'https://amkads.advertisingamk.workers.dev'

type AuthState = 'loading' | 'authenticated' | 'unauthenticated'

/**
 * ProtectedRoute
 *
 * On mount, makes a lightweight GET /api/admin/me call to the Worker.
 * The Worker validates the HttpOnly JWT cookie and returns 200 or 401.
 * - If 200  → render the protected child pages inside AdminLayout
 * - If 401  → redirect to /login
 * - Loading → show a full-screen spinner (prevents flash of protected content)
 */
export default function ProtectedRoute() {
  const [authState, setAuthState] = useState<AuthState>('loading')

  useEffect(() => {
    let cancelled = false

    const checkSession = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/me`, {
          method: 'GET',
          credentials: 'include',
        })
        if (!cancelled) {
          setAuthState(res.ok ? 'authenticated' : 'unauthenticated')
        }
      } catch {
        if (!cancelled) setAuthState('unauthenticated')
      }
    }

    checkSession()
    return () => { cancelled = true }
  }, [])

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center">
              <img
                src="/images/amk-ads-logo-final.png"
                alt="AMK ADS"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700">
              <Loader2 className="w-3 h-3 text-brand-orange animate-spin" />
            </div>
          </div>
          <p className="text-slate-400 text-sm font-medium animate-pulse">Verifying session…</p>
        </div>
      </div>
    )
  }

  if (authState === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
