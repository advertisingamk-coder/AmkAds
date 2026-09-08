import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ImagePlus, Video, LogOut, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'https://amkads.advertisingamk.workers.dev'

const navItems = [
  {
    to: '/dashboard',
    icon: LayoutDashboard,
    label: 'Portfolio',
    end: true,
  },
  {
    to: '/dashboard/division-media',
    icon: ImagePlus,
    label: 'Division Galleries',
    end: false,
  },
  {
    to: '/dashboard/service-videos',
    icon: Video,
    label: 'Service Videos',
    end: false,
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      if (res.ok) {
        toast.success('Logged out successfully')
        navigate('/login', { replace: true })
      } else {
        toast.error('Failed to log out')
      }
    } catch {
      toast.error('Failed to log out')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 hidden md:flex flex-col bg-slate-900 border-r border-slate-800 h-screen sticky top-0">

        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
              <img
                src="/images/amk-ads-logo-final.png"
                alt="AMK ADS"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <p className="font-bold text-white font-outfit leading-tight">AMK Ads</p>
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-brand-orange" />
                <span className="text-[10px] text-brand-orange font-semibold uppercase tracking-wider">Admin Panel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 font-medium transition-all duration-200"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <img
              src="/images/amk-ads-logo-final.png"
              alt="AMK ADS"
              className="w-6 h-6 object-contain"
            />
          </div>
          <span className="font-bold text-white font-outfit text-sm">AMK Ads Admin</span>
        </div>
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-brand-orange/20 text-brand-orange'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
              title={item.label}
            >
              <item.icon className="w-4 h-4" />
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 min-h-screen overflow-auto">
        <div className="pt-0 md:pt-0 mt-14 md:mt-0 page-enter">
          {children}
        </div>
      </main>
    </div>
  )
}
