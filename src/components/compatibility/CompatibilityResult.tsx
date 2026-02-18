import { motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import type { CompatibilityResult as CompatResult } from '@/lib/compatibility'

interface CompatibilityResultProps {
  result: CompatResult
  name1: string
  name2: string
}

export function CompatibilityResult({ result, name1, name2 }: CompatibilityResultProps) {
  const scoreColor =
    result.totalScore >= 80 ? '#EF4444' :
    result.totalScore >= 65 ? '#EAB308' :
    result.totalScore >= 50 ? '#22C55E' :
    '#3B82F6'

  // 원형 게이지용 SVG
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (result.totalScore / 100) * circumference

  return (
    <div className="flex flex-col gap-4">
      {/* 종합 점수 */}
      <GlassCard variant="purple">
        <div className="flex flex-col items-center py-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-white">{name1}</span>
            <Heart className="w-4 h-4 text-red-400" fill="currentColor" />
            <span className="text-sm font-medium text-white">{name2}</span>
          </div>

          {/* 원형 게이지 */}
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60" cy="60" r={radius}
                fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"
              />
              <motion.circle
                cx="60" cy="60" r={radius}
                fill="none" stroke={scoreColor} strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-3xl font-bold text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                {result.totalScore}
              </motion.span>
            </div>
          </div>

          <p className="text-sm text-white/80 text-center leading-relaxed">{result.summary}</p>
        </div>
      </GlassCard>

      {/* 카테고리별 분석 */}
      {result.categories.map((cat, i) => (
        <motion.div
          key={cat.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-white">{cat.name}</h4>
              <span className="text-sm font-bold" style={{ color: cat.score >= 70 ? '#22C55E' : cat.score >= 50 ? '#EAB308' : '#EF4444' }}>
                {cat.score}점
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: cat.score >= 70 ? '#22C55E' : cat.score >= 50 ? '#EAB308' : '#EF4444',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${cat.score}%` }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
              />
            </div>
            <p className="text-xs text-white/50 leading-relaxed">{cat.description}</p>
          </GlassCard>
        </motion.div>
      ))}

      {/* 조언 */}
      <GlassCard>
        <h4 className="text-sm font-semibold text-accent-gold mb-2">궁합 조언</h4>
        <p className="text-sm text-white/70 leading-relaxed">{result.advice}</p>
      </GlassCard>
    </div>
  )
}
