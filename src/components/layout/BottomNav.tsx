import { NavLink } from 'react-router-dom'
import { Home, Compass, Heart, History } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: Home, label: '홈' },
  { to: '/input', icon: Compass, label: '분석' },
  { to: '/compatibility', icon: Heart, label: '궁합' },
  { to: '/history', icon: History, label: '기록' },
]

export function BottomNav() {
  return (
    <nav aria-label="메인 네비게이션" className="fixed bottom-0 left-0 right-0 z-50 glass-strong" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors no-underline',
                isActive
                  ? 'text-accent-purple-light'
                  : 'text-white/50 hover:text-white/80',
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
