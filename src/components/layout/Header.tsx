import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white no-underline">
          <Sparkles className="w-5 h-5 text-accent-gold" />
          <span className="font-bold text-lg">사주운세</span>
        </Link>
      </div>
    </header>
  )
}
