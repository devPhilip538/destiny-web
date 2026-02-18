import { useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import type { LuckCyclePeriod } from '@/types/saju'
import { ELEMENT_COLOR } from '@/lib/constants'
import { GlassCard } from '@/components/ui/GlassCard'

interface LuckCycleTimelineProps {
  cycles: LuckCyclePeriod[]
}

export function LuckCycleTimeline({ cycles }: LuckCycleTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentRef.current && scrollRef.current) {
      const container = scrollRef.current
      const el = currentRef.current
      const scrollLeft = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [])

  return (
    <GlassCard>
      <h3 className="text-lg font-bold text-white mb-1">대운 흐름</h3>
      <p className="text-xs text-white/40 mb-4">10년 단위의 운세 흐름을 확인하세요</p>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {cycles.map((cycle, i) => {
          const color = ELEMENT_COLOR[cycle.cheonganElement]
          return (
            <motion.div
              key={i}
              ref={cycle.isCurrent ? currentRef : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex-shrink-0 w-[100px] rounded-xl p-3 border transition-all ${
                cycle.isCurrent
                  ? 'border-accent-purple bg-accent-purple/20 shadow-lg shadow-accent-purple/20'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {cycle.isCurrent && (
                <span className="text-[10px] text-accent-purple-light font-semibold block mb-1">
                  현재 대운
                </span>
              )}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-lg font-bold" style={{ color }}>
                    {cycle.cheonganHanja}
                  </span>
                  <span className="text-lg font-bold" style={{ color: ELEMENT_COLOR[cycle.jijiElement] }}>
                    {cycle.jijiHanja}
                  </span>
                </div>
                <p className="text-xs text-white/60 mb-1">
                  {cycle.cheongan}{cycle.jiji}
                </p>
                <p className="text-[10px] text-white/40">
                  {cycle.startAge}~{cycle.endAge}세
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </GlassCard>
  )
}
