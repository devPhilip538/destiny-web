import { useMemo } from 'react'
import { motion } from 'motion/react'
import { GlassCard } from '@/components/ui/GlassCard'
import { calculateYearlyFortune } from '@/lib/fortunes/yearly-fortune'
import { ELEMENT_COLOR } from '@/lib/constants'
import type { SajuResult } from '@/types/saju'

function scoreColor(score: number): string {
  if (score >= 80) return '#EAB308'
  if (score >= 60) return '#22C55E'
  if (score >= 40) return '#3B82F6'
  return '#EF4444'
}

function keywordColor(keyword: string): string {
  if (keyword === '대길') return '#EAB308'
  if (keyword === '길') return '#22C55E'
  if (keyword === '보통') return '#94A3B8'
  if (keyword === '소흉') return '#F97316'
  return '#EF4444'
}

export function YearlyFortuneView({ result, birthYear }: { result: SajuResult; birthYear: number }) {
  const fortune = useMemo(() => calculateYearlyFortune(result, birthYear), [result, birthYear])

  return (
    <div className="flex flex-col gap-4">
      {/* 연간 테마 */}
      <GlassCard variant="purple">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: ELEMENT_COLOR[fortune.yearElement] }}>
              {fortune.yearGanji}
            </span>
            <span className="text-sm text-white/40">({fortune.yearHanja})</span>
          </div>
          <span className="text-lg font-bold" style={{ color: scoreColor(fortune.score) }}>
            {fortune.score}점
          </span>
        </div>
        <p className="text-sm font-semibold text-accent-gold mb-1">{fortune.theme}</p>
        <p className="text-xs text-white/50 mb-2">십신: {fortune.tenGodRelation} · {fortune.currentLuckCycle}</p>
        <p className="text-sm text-white/80">{fortune.summary}</p>
      </GlassCard>

      {/* 월별 흐름 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-3">월별 운세 흐름</h3>
        <div className="grid grid-cols-4 gap-2">
          {fortune.monthlyOverview.map((m, i) => (
            <motion.div
              key={m.month}
              className="text-center p-2 rounded-xl bg-white/5"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.03 * i }}
            >
              <p className="text-xs text-white/50">{m.month}월</p>
              <p className="text-sm font-bold" style={{ color: scoreColor(m.score) }}>{m.score}</p>
              <p className="text-xs font-medium" style={{ color: keywordColor(m.keyword) }}>{m.keyword}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* 조언 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-2">{fortune.year}년 조언</h3>
        <p className="text-sm text-white/70">{fortune.advice}</p>
      </GlassCard>
    </div>
  )
}
