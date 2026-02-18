import { useMemo } from 'react'
import { motion } from 'motion/react'
import { Sun } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { calculateDailyFortune } from '@/lib/fortunes/daily-fortune'
import { ELEMENT_COLOR } from '@/lib/constants'
import type { Pillar } from '@/types/saju'

interface DailyFortuneCardProps {
  dayPillar: Pillar
}

export function DailyFortuneCard({ dayPillar }: DailyFortuneCardProps) {
  const fortune = useMemo(() => calculateDailyFortune(dayPillar), [dayPillar])

  const scoreColor =
    fortune.score >= 80 ? '#EAB308' :
    fortune.score >= 60 ? '#22C55E' :
    fortune.score >= 40 ? '#3B82F6' :
    '#EF4444'

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      <GlassCard variant="purple">
        <div className="flex items-center gap-2 mb-3">
          <Sun className="w-4 h-4 text-accent-gold" />
          <h3 className="text-sm font-semibold text-white">오늘의 운세</h3>
          <span className="text-xs text-white/40 ml-auto">{fortune.date}</span>
        </div>

        {/* 오늘의 간지 */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold" style={{ color: ELEMENT_COLOR[fortune.todayElement] }}>
              {fortune.todayGanji}
            </span>
            <span className="text-xs text-white/40">({fortune.todayHanja})</span>
          </div>

          {/* 점수 게이지 */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/50">운세 지수</span>
              <span className="text-sm font-bold" style={{ color: scoreColor }}>
                {fortune.score}점
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: scoreColor }}
                initial={{ width: 0 }}
                animate={{ width: `${fortune.score}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* 한줄 운세 */}
        <p className="text-sm text-white/80 mb-2">{fortune.summary}</p>

        {/* 조언 */}
        <p className="text-xs text-white/50 italic">{fortune.advice}</p>
      </GlassCard>
    </motion.div>
  )
}
