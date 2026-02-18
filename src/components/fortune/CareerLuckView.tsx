import { useMemo } from 'react'
import { motion } from 'motion/react'
import { GlassCard } from '@/components/ui/GlassCard'
import { calculateCareerLuck } from '@/lib/fortunes/career-luck'
import type { SajuResult } from '@/types/saju'

function scoreColor(score: number): string {
  if (score >= 80) return '#EAB308'
  if (score >= 60) return '#22C55E'
  if (score >= 40) return '#3B82F6'
  return '#EF4444'
}

export function CareerLuckView({ result, birthYear }: { result: SajuResult; birthYear: number }) {
  const fortune = useMemo(() => calculateCareerLuck(result, birthYear), [result, birthYear])

  return (
    <div className="flex flex-col gap-4">
      {/* 직장운 종합 */}
      <GlassCard variant="purple">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/60">현재 직장운</span>
          <span className="text-2xl font-bold" style={{ color: scoreColor(fortune.currentCareerScore) }}>
            {fortune.currentCareerScore}점
          </span>
        </div>
        <motion.div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: scoreColor(fortune.currentCareerScore) }}
            initial={{ width: 0 }}
            animate={{ width: `${fortune.currentCareerScore}%` }}
            transition={{ duration: 1 }}
          />
        </motion.div>
        <p className="text-sm text-white/80">{fortune.summary}</p>
      </GlassCard>

      {/* 업무 스타일 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-2">업무 스타일</h3>
        <p className="text-sm text-white/70">{fortune.careerStyle}</p>
      </GlassCard>

      {/* 직업 관련 십신 */}
      {fortune.careerStars.length > 0 && (
        <GlassCard>
          <h3 className="text-sm font-semibold text-white mb-3">직업 관련 십신</h3>
          <div className="flex flex-wrap gap-2">
            {fortune.careerStars.map((star) => (
              <span key={star.name} className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-sm font-medium text-blue-300">
                {star.name} ×{star.count}
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      {/* 적합 직업 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-3">적합 직업군</h3>
        <div className="flex flex-wrap gap-2">
          {fortune.suitableJobs.map((job) => (
            <span key={job} className="px-3 py-1.5 rounded-full bg-white/10 text-xs text-white/70">
              {job}
            </span>
          ))}
        </div>
      </GlassCard>

      {/* 승진/이직 시기 */}
      {fortune.promotionAges.length > 0 && (
        <GlassCard>
          <h3 className="text-sm font-semibold text-white mb-3">승진/이직 유리 시기</h3>
          <div className="flex flex-wrap gap-2">
            {fortune.promotionAges.map((age) => (
              <span key={age} className="px-3 py-1.5 rounded-xl bg-accent-purple/20 text-sm font-semibold text-accent-purple-light">
                {age}세 전후
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      {/* 강점 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-green-400 mb-2">직장 강점</h3>
        <ul className="flex flex-col gap-1.5">
          {fortune.strengths.map((s) => (
            <li key={s} className="text-sm text-white/70 flex items-start gap-2">
              <span className="text-green-400 mt-0.5">•</span>{s}
            </li>
          ))}
        </ul>
      </GlassCard>

      {/* 조언 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-2">직장운 조언</h3>
        <p className="text-sm text-white/70">{fortune.advice}</p>
      </GlassCard>
    </div>
  )
}
