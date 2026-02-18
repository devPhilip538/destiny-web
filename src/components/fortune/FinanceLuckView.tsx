import { useMemo } from 'react'
import { motion } from 'motion/react'
import { GlassCard } from '@/components/ui/GlassCard'
import { calculateFinanceLuck } from '@/lib/fortunes/finance-luck'
import type { SajuResult } from '@/types/saju'

function scoreColor(score: number): string {
  if (score >= 80) return '#EAB308'
  if (score >= 60) return '#22C55E'
  if (score >= 40) return '#3B82F6'
  return '#EF4444'
}

export function FinanceLuckView({ result, birthYear }: { result: SajuResult; birthYear: number }) {
  const fortune = useMemo(() => calculateFinanceLuck(result, birthYear), [result, birthYear])

  return (
    <div className="flex flex-col gap-4">
      {/* 금전운 종합 */}
      <GlassCard variant="purple">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/60">재물운 점수</span>
          <span className="text-2xl font-bold" style={{ color: scoreColor(fortune.wealthScore) }}>
            {fortune.wealthScore}점
          </span>
        </div>
        <motion.div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: scoreColor(fortune.wealthScore) }}
            initial={{ width: 0 }}
            animate={{ width: `${fortune.wealthScore}%` }}
            transition={{ duration: 1 }}
          />
        </motion.div>
        <p className="text-sm text-white/80">{fortune.summary}</p>
      </GlassCard>

      {/* 재성 분석 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-3">재성 분석</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-xl bg-white/5">
            <p className="text-xs text-white/50 mb-1">정재 (안정 수입)</p>
            <p className="text-2xl font-bold text-green-400">{fortune.regularWealth}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5">
            <p className="text-xs text-white/50 mb-1">편재 (투기 재물)</p>
            <p className="text-2xl font-bold text-amber-400">{fortune.windfall}</p>
          </div>
        </div>
      </GlassCard>

      {/* 관리 스타일 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-2">재물 관리 스타일</h3>
        <p className="text-sm text-white/70">{fortune.managementStyle}</p>
      </GlassCard>

      {/* 투자 유리 시기 */}
      {fortune.bestInvestmentAges.length > 0 && (
        <GlassCard>
          <h3 className="text-sm font-semibold text-white mb-3">투자 유리 시기</h3>
          <div className="flex flex-wrap gap-2">
            {fortune.bestInvestmentAges.map((age) => (
              <span key={age} className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-sm font-semibold text-amber-300">
                {age}세 전후
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      {/* 추천 & 주의 */}
      <div className="grid grid-cols-1 gap-3">
        <GlassCard>
          <h3 className="text-sm font-semibold text-green-400 mb-2">추천</h3>
          <ul className="flex flex-col gap-1.5">
            {fortune.recommendations.map((r) => (
              <li key={r} className="text-sm text-white/70 flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>{r}
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-semibold text-amber-400 mb-2">주의</h3>
          <ul className="flex flex-col gap-1.5">
            {fortune.cautions.map((c) => (
              <li key={c} className="text-sm text-white/70 flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>{c}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* 조언 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-2">금전운 조언</h3>
        <p className="text-sm text-white/70">{fortune.advice}</p>
      </GlassCard>
    </div>
  )
}
