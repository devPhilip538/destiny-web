import { AnimatedPage } from '@/components/ui/AnimatedPage'
import { EmptyState } from '@/components/history/EmptyState'
import { HistoryCard } from '@/components/history/HistoryCard'
import { useSajuStore } from '@/store/saju-store'
import { Trash2 } from 'lucide-react'

export function HistoryPage() {
  const history = useSajuStore((s) => s.history)
  const removeFromHistory = useSajuStore((s) => s.removeFromHistory)
  const clearHistory = useSajuStore((s) => s.clearHistory)

  return (
    <AnimatedPage>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">분석 기록</h1>
        {history.length > 0 && (
          <button
            type="button"
            onClick={() => { if (window.confirm('모든 분석 기록을 삭제하시겠습니까?')) clearHistory() }}
            className="flex items-center gap-1 text-xs text-white/30 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            전체 삭제
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {history.map((reading, i) => (
            <HistoryCard
              key={reading.id}
              reading={reading}
              index={i}
              onDelete={removeFromHistory}
            />
          ))}
        </div>
      )}
    </AnimatedPage>
  )
}
