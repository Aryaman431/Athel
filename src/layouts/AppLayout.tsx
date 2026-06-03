import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Dumbbell,
  Apple,
  LineChart,
  BookOpen,
  Settings,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { to: '/nutrition', icon: Apple, label: 'Nutrition' },
  { to: '/insights', icon: LineChart, label: 'Insights' },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function AppLayout() {
  const location = useLocation()
  const { state } = useApp()

  return (
    <div className="flex h-screen bg-[#FAF8F5] dark:bg-[#111110] overflow-hidden">
      {/* ── Desktop Sidebar ─────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#E8E5E0] dark:border-[#2C2C2A] bg-white dark:bg-[#1C1C1A] shrink-0">
        {/* Logo */}
        <div className="px-7 py-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-[#1D1D1F] dark:bg-[#F5F3EF] flex items-center justify-center">
              <span className="text-white dark:text-[#1D1D1F] text-sm font-semibold">Æ</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F3EF]">Aethel</span>
          </motion.div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item, i) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#F2EFE9] dark:bg-[#2C2C2A] text-[#1D1D1F] dark:text-[#F5F3EF]'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-[#F5F3EF] hover:bg-[#F8F6F2] dark:hover:bg-[#242422]'
                  }`
                }
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" size={18} />
                {item.label}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 pb-6">
          <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#E8E5E0] dark:bg-[#2C2C2A] flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-[#6E6E73]">
                {state.user?.name?.[0] ?? 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F3EF] truncate">{state.user?.name}</p>
              <p className="text-xs text-[#6E6E73] truncate">{state.user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-24 lg:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Mobile Bottom Nav ────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/90 dark:bg-[#1C1C1A]/90 backdrop-blur-xl border-t border-[#E8E5E0] dark:border-[#2C2C2A]">
        <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
          {navItems.slice(0, 5).map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-[#1D1D1F] dark:text-[#F5F3EF]'
                    : 'text-[#6E6E73]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} />
                  <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 ${
                isActive ? 'text-[#1D1D1F] dark:text-[#F5F3EF]' : 'text-[#6E6E73]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Settings size={20} />
                <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  Settings
                </span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
