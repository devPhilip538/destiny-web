import { useMemo } from 'react'
import { motion } from 'motion/react'
import { GlassCard } from '@/components/ui/GlassCard'
import { calculateHealthLuck } from '@/lib/fortunes/health-luck'
import { ELEMENT_COLOR } from '@/lib/constants'
import type { SajuResult } from '@/types/saju'

function scoreColor(score: number): string {
  if (score >= 80) return '#EAB308'
  if (score >= 60) return '#22C55E'
  if (score >= 40) return '#3B82F6'
  return '#EF4444'
}

function statusLabel(status: string): { text: string; color: string } {
  if (status === 'strong') return { text: '양호', color: '#22C55E' }
  if (status === 'normal') return { text: '보통', color: '#94A3B8' }
  if (status === 'weak') return { text: '약함', color: '#EF4444' }
  return { text: '과잉', color: '#F97316' }
}

export function HealthLuckView({ result }: { result: SajuResult }) {
  const fortune = useMemo(() => calculateHealthLuck(result), [result])

  return (
    <div className="flex flex-col gap-4">
      {/* 건강운 종합 */}
      <GlassCard variant="purple">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/60">건강운 점수</span>
          <span className="text-2xl font-bold" style={{ color: scoreColor(fortune.healthScore) }}>
            {fortune.healthScore}점
          </span>
        </div>
        <motion.div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: scoreColor(fortune.healthScore) }}
            initial={{ width: 0 }}
            animate={{ width: `${fortune.healthScore}%` }}
            transition={{ duration: 1 }}
          />
        </motion.div>
        <p className="text-sm text-white/80">{fortune.summary}</p>
      </GlassCard>

      {/* 오행-장부 매핑 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-3">오행별 장부 분석</h3>
        <div className="flex flex-col gap-3">
          {fortune.organMapping.map((organ, i) => {
            const status = statusLabel(organ.status)
            return (
              <motion.div
                key={organ.element}
                className="flex items-center gap-3 p-2 rounded-xl bg-white/5"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.08 * i }}
              >
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: `${ELEMENT_COLOR[organ.element]}30`, color: ELEMENT_COLOR[organ.element] }}
                >
                  {organ.element}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-white/80">{organ.organs}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-lg"
                  style={{ color: status.color, backgroundColor: `${status.color}20` }}
                >
                  {status.text}
                </span>
              </motion.div>
            )
          })}
        </div>
      </GlassCard>

      {/* 계절 조언 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-2">계절별 건강 조언</h3>
        <p className="text-sm text-white/70">{fortune.seasonalAdvice}</p>
      </GlassCard>

      {/* 예방 관리 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-2">건강 관리 팁</h3>
        <ul className="flex flex-col gap-1.5">
          {fortune.preventionTips.map((tip) => (
            <li key={tip} className="text-sm text-white/70 flex items-start gap-2">
              <span className="text-green-400 mt-0.5">•</span>{tip}
            </li>
          ))}
        </ul>
      </GlassCard>

      {/* 종합 조언 */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-2">건강운 조언</h3>
        <p className="text-sm text-white/70">{fortune.advice}</p>
      </GlassCard>
    </div>
  )
}
