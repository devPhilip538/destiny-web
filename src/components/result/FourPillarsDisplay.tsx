import { motion } from 'motion/react'
import type { Pillar } from '@/types/saju'
import { ELEMENT_COLOR } from '@/lib/constants'

interface FourPillarsDisplayProps {
  yearPillar: Pillar
  monthPillar: Pillar
  dayPillar: Pillar
  hourPillar: Pillar
}

const PILLAR_LABELS = ['시주', '일주', '월주', '년주']

export function FourPillarsDisplay({ yearPillar, monthPillar, dayPillar, hourPillar }: FourPillarsDisplayProps) {
  const pillars = [hourPillar, dayPillar, monthPillar, yearPillar]

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">사주팔자 (四柱八字)</h3>
      <div className="grid grid-cols-4 gap-2">
        {pillars.map((pillar, i) => (
          <motion.div
            key={PILLAR_LABELS[i]}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-[10px] text-white/40 mb-1">{PILLAR_LABELS[i]}</span>

            {/* 천간 */}
            <div
              className="w-full aspect-square rounded-xl glass flex flex-col items-center justify-center"
              style={{ boxShadow: `0 0 20px ${ELEMENT_COLOR[pillar.cheonganElement]}20` }}
            >
              <span
                className="text-2xl font-bold"
                style={{ color: ELEMENT_COLOR[pillar.cheonganElement] }}
              >
                {pillar.cheonganHanja}
              </span>
              <span className="text-xs text-white/60">{pillar.cheongan}</span>
              <span className="text-[10px] text-white/30">{pillar.cheonganElement}</span>
            </div>

            {/* 지지 */}
            <div
              className="w-full aspect-square rounded-xl glass flex flex-col items-center justify-center"
              style={{ boxShadow: `0 0 20px ${ELEMENT_COLOR[pillar.jijiElement]}20` }}
            >
              <span
                className="text-2xl font-bold"
                style={{ color: ELEMENT_COLOR[pillar.jijiElement] }}
              >
                {pillar.jijiHanja}
              </span>
              <span className="text-xs text-white/60">{pillar.jiji}</span>
              <span className="text-[10px] text-white/30">{pillar.jijiElement}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
