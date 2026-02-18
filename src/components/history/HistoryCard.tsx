import { Link } from 'react-router-dom'
import { Trash2, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { GlassCard } from '@/components/ui/GlassCard'
import type { SavedReading } from '@/types/saju'
import { ELEMENT_COLOR } from '@/lib/constants'

interface HistoryCardProps {
  reading: SavedReading
  index: number
  onDelete: (id: string) => void
}

export function HistoryCard({ reading, index, onDelete }: HistoryCardProps) {
  const dominant = reading.result.fiveElementBalance.dominant

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlassCard className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
          style={{ backgroundColor: `${ELEMENT_COLOR[dominant]}20`, color: ELEMENT_COLOR[dominant] }}
        >
          {reading.result.dayPillar.cheonganHanja}
        </div>

        <Link to={`/result/${reading.id}`} className="flex-1 min-w-0 no-underline">
          <p className="text-sm font-medium text-white truncate">{reading.name}</p>
          <p className="text-xs text-white/40">
            {reading.birthYear}년 {reading.birthMonth}월 {reading.birthDay}일
            · {reading.gender === 'male' ? '남' : '여'}
          </p>
          <p className="text-[10px] text-white/25 mt-0.5">
            {new Date(reading.createdAt).toLocaleDateString('ko-KR')}
          </p>
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => { if (window.confirm('이 분석 기록을 삭제하시겠습니까?')) onDelete(reading.id) }}
            className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Link to={`/result/${reading.id}`} className="p-2 rounded-lg text-white/30 hover:text-white/60 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  )
}
