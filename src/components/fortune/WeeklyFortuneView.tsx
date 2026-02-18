import { useMemo } from 'react'
import { motion } from 'motion/react'
import { GlassCard } from '@/components/ui/GlassCard'
import { calculateWeeklyFortune } from '@/lib/fortunes/weekly-fortune'
import { ELEMENT_COLOR } from '@/lib/constants'
import type { Pillar } from '@/types/saju'

function scoreColor(score: number): string {
  if (score >= 80) return '#EAB308'
  if (score >= 60) return '#22C55E'
  if (score >= 40) return '#3B82F6'
  return '#EF4444'
}

export function WeeklyFortuneView({ dayPillar }: { dayPillar: Pillar }) {
  const fortune = useMemo(() => calculateWeeklyFortune(dayPillar), [dayPillar])

  const maxScore = Math.max(...fortune.dailyScores.map(d => d.score))

  return (
    <div className="flex flex-col gap-4">
      {/* 주간 총평 */}
      <GlassCard variant="purple">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-white">{fortune.weekRange}</span>
          <span className="text-lg font-bold" style={{ color: scoreColor(fortune.averageScore) }}>
            평균 {fortune.averageScore}점
          </span>
        </div>
        <p className="text-sm text-white/80">{fortune.summary}</p>
      </GlassCard>

      {/* 7일 점수 막대 그래프 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-4">일별 운세</h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {fortune.dailyScores.map((day, i) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-semibold" style={{ color: scoreColor(day.score) }}>
                {day.score}
              </span>
              <motion.div
                className="w-full rounded-t-lg"
                style={{
                  backgroundColor: day.score === maxScore
                    ? ELEMENT_COLOR[day.element]
                    : `${ELEMENT_COLOR[day.element]}80`,
                }}
                initial={{ height: 0 }}
                animate={{ height: `${(day.score / 100) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.05 * i }}
              />
              <span className="text-xs text-white/50 whitespace-nowrap">
                {day.date.split('(')[0]}
              </span>
              <span className="text-xs text-white/30">
                {day.ganji}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 최고/최저 + 조언 */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard>
          <p className="text-xs text-white/50 mb-1">최고의 날</p>
          <p className="text-sm font-semibold text-green-400">{fortune.bestDay}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-white/50 mb-1">주의할 날</p>
          <p className="text-sm font-semibold text-red-400">{fortune.worstDay}</p>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-2">주간 조언</h3>
        <p className="text-sm text-white/70">{fortune.advice}</p>
      </GlassCard>
    </div>
  )
}
