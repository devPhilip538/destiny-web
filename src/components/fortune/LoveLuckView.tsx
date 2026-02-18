import { useMemo } from 'react'
import { motion } from 'motion/react'
import { GlassCard } from '@/components/ui/GlassCard'
import { calculateLoveLuck } from '@/lib/fortunes/love-luck'
import type { SajuResult } from '@/types/saju'

function scoreColor(score: number): string {
  if (score >= 80) return '#EAB308'
  if (score >= 60) return '#22C55E'
  if (score >= 40) return '#3B82F6'
  return '#EF4444'
}

export function LoveLuckView({ result, gender }: { result: SajuResult; gender: 'male' | 'female' }) {
  const fortune = useMemo(() => calculateLoveLuck(result, gender), [result, gender])

  return (
    <div className="flex flex-col gap-4">
      {/* 애정운 종합 */}
      <GlassCard variant="purple">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/60">현재 애정운</span>
          <span className="text-2xl font-bold" style={{ color: scoreColor(fortune.currentLoveScore) }}>
            {fortune.currentLoveScore}점
          </span>
        </div>
        <motion.div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: scoreColor(fortune.currentLoveScore) }}
            initial={{ width: 0 }}
            animate={{ width: `${fortune.currentLoveScore}%` }}
            transition={{ duration: 1 }}
          />
        </motion.div>
        <p className="text-sm text-white/80">{fortune.summary}</p>
      </GlassCard>

      {/* 연애 스타일 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-2">연애 스타일</h3>
        <p className="text-sm text-white/70">{fortune.loveStyle}</p>
      </GlassCard>

      {/* 오행 영향 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-2">오행 분석</h3>
        <p className="text-sm text-white/70 mb-3">{fortune.elementInfluence}</p>
        {fortune.loveStars.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">연애 관련 십신:</span>
            {fortune.loveStars.map((star) => (
              <span key={star} className="px-2 py-1 rounded-lg bg-pink-500/20 text-xs text-pink-300 font-medium">
                {star}
              </span>
            ))}
          </div>
        )}
      </GlassCard>

      {/* 강점 & 주의 */}
      <div className="grid grid-cols-1 gap-3">
        <GlassCard>
          <h3 className="text-sm font-semibold text-green-400 mb-2">연애 강점</h3>
          <ul className="flex flex-col gap-1.5">
            {fortune.strengths.map((s) => (
              <li key={s} className="text-sm text-white/70 flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>{s}
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-semibold text-amber-400 mb-2">주의할 점</h3>
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
        <h3 className="text-sm font-semibold text-white mb-2">애정운 조언</h3>
        <p className="text-sm text-white/70">{fortune.advice}</p>
      </GlassCard>
    </div>
  )
}
