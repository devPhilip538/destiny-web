import { useMemo } from 'react'
import { motion } from 'motion/react'
import { GlassCard } from '@/components/ui/GlassCard'
import { calculateDailyFortune } from '@/lib/fortunes/daily-fortune'
import { ELEMENT_COLOR } from '@/lib/constants'
import type { Pillar } from '@/types/saju'

function scoreColor(score: number): string {
  if (score >= 80) return '#EAB308'
  if (score >= 60) return '#22C55E'
  if (score >= 40) return '#3B82F6'
  return '#EF4444'
}

export function DailyFortuneView({ dayPillar }: { dayPillar: Pillar }) {
  const fortune = useMemo(() => calculateDailyFortune(dayPillar), [dayPillar])

  return (
    <div className="flex flex-col gap-4">
      {/* 오늘의 간지 + 종합 점수 */}
      <GlassCard variant="purple">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: ELEMENT_COLOR[fortune.todayElement] }}>
              {fortune.todayGanji}
            </span>
            <span className="text-sm text-white/40">({fortune.todayHanja})</span>
          </div>
          <span className="text-xs text-white/40">{fortune.date}</span>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-white/60">종합 운세</span>
            <span className="text-lg font-bold" style={{ color: scoreColor(fortune.score) }}>
              {fortune.score}점
            </span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: scoreColor(fortune.score) }}
              initial={{ width: 0 }}
              animate={{ width: `${fortune.score}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        <p className="text-sm text-white/80">{fortune.summary}</p>
      </GlassCard>

      {/* 카테고리별 소점수 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-3">분야별 운세</h3>
        <div className="flex flex-col gap-3">
          {fortune.categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white/70">{cat.name}</span>
                <span className="text-sm font-semibold" style={{ color: scoreColor(cat.score) }}>
                  {cat.score}점
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-1">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: scoreColor(cat.score) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.score}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * i }}
                />
              </div>
              <p className="text-xs text-white/50">{cat.comment}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* 조언 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-2">오늘의 조언</h3>
        <p className="text-sm text-white/70">{fortune.advice}</p>
      </GlassCard>
    </div>
  )
}
