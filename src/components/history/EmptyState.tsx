import { Link } from 'react-router-dom'
import { Inbox, ArrowRight } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <Inbox className="w-12 h-12 text-white/20" />
      <div>
        <p className="text-white/50 text-sm">아직 분석 기록이 없습니다.</p>
        <p className="text-white/30 text-xs mt-1">사주 분석을 시작해보세요!</p>
      </div>
      <Link
        to="/input"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-purple text-white text-sm font-medium no-underline hover:bg-accent-purple-dark transition-colors"
      >
        분석 시작
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
