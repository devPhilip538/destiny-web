import { useMemo } from 'react'
import { motion } from 'motion/react'
import { GlassCard } from '@/components/ui/GlassCard'
import { calculateMarriageLuck } from '@/lib/fortunes/marriage-luck'
import { ELEMENT_COLOR } from '@/lib/constants'
import type { SajuResult } from '@/types/saju'

function scoreColor(score: number): string {
  if (score >= 80) return '#EAB308'
  if (score >= 60) return '#22C55E'
  if (score >= 40) return '#3B82F6'
  return '#EF4444'
}

export function MarriageLuckView({ result, gender, birthYear }: { result: SajuResult; gender: 'male' | 'female'; birthYear: number }) {
  const fortune = useMemo(() => calculateMarriageLuck(result, gender, birthYear), [result, gender, birthYear])

  return (
    <div className="flex flex-col gap-4">
      {/* 결혼운 종합 */}
      <GlassCard variant="purple">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/60">결혼운 점수</span>
          <span className="text-2xl font-bold" style={{ color: scoreColor(fortune.marriageScore) }}>
            {fortune.marriageScore}점
          </span>
        </div>
        <motion.div
          className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: scoreColor(fortune.marriageScore) }}
            initial={{ width: 0 }}
            animate={{ width: `${fortune.marriageScore}%` }}
            transition={{ duration: 1 }}
          />
        </motion.div>
        <p className="text-sm text-white/80">{fortune.summary}</p>
      </GlassCard>

      {/* 배우자성 분석 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-3">배우자성 분석</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">배우자성</span>
            <span className="text-sm font-semibold text-accent-gold">{fortune.spouseStar}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">사주 내 개수</span>
            <span className="text-sm font-semibold text-white">{fortune.spouseStarCount}개</span>
          </div>
          {fortune.spouseStarPositions.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">위치</span>
              <span className="text-sm text-white/80">{fortune.spouseStarPositions.join(', ')}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">도화살</span>
            <span className={`text-sm font-semibold ${fortune.hasDoHwaSal ? 'text-pink-400' : 'text-white/40'}`}>
              {fortune.hasDoHwaSal ? `있음 (${fortune.doHwaSalPositions.join(', ')})` : '없음'}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* 배우자 성향 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-3">예상 배우자 성향</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-white/60">배우자 오행:</span>
          <span className="text-sm font-bold" style={{ color: ELEMENT_COLOR[fortune.spouseElement] }}>
            {fortune.spouseElement}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {fortune.spouseTraits.map((trait) => (
            <span key={trait} className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/70">
              {trait}
            </span>
          ))}
        </div>
      </GlassCard>

      {/* 결혼 유리 시기 */}
      {fortune.bestMarriageAges.length > 0 && (
        <GlassCard>
          <h3 className="text-sm font-semibold text-white mb-3">결혼 유리 시기</h3>
          <div className="flex flex-wrap gap-2">
            {fortune.bestMarriageAges.map((age) => (
              <span key={age} className="px-3 py-1.5 rounded-xl bg-accent-purple/20 text-sm font-semibold text-accent-purple-light">
                {age}세 전후
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      {/* 조언 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-2">결혼운 조언</h3>
        <p className="text-sm text-white/70">{fortune.advice}</p>
      </GlassCard>
    </div>
  )
}
