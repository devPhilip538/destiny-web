import { motion } from 'motion/react'
import { GlassCard } from '@/components/ui/GlassCard'
import { getZodiacAnimal, getConstellation } from '@/lib/zodiac'
import type { Jiji } from '@/types/saju'

interface ZodiacSectionProps {
  yearBranch: Jiji
  birthMonth: number
  birthDay: number
}

export function ZodiacSection({ yearBranch, birthMonth, birthDay }: ZodiacSectionProps) {
  const animal = getZodiacAnimal(yearBranch)
  const constellation = getConstellation(birthMonth, birthDay)

  return (
    <GlassCard>
      <h3 className="text-lg font-bold text-white mb-3">띠 & 별자리</h3>
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          className="rounded-xl bg-white/5 p-4 text-center border border-white/10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-4xl block mb-2">{animal.emoji}</span>
          <p className="text-sm font-semibold text-white">{animal.name}띠</p>
          <p className="text-xs text-white/40 mt-1">12지 동물</p>
        </motion.div>

        <motion.div
          className="rounded-xl bg-white/5 p-4 text-center border border-white/10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-4xl block mb-2">{constellation.symbol}</span>
          <p className="text-sm font-semibold text-white">{constellation.name}</p>
          <p className="text-xs text-white/40 mt-1">{constellation.nameEn}</p>
        </motion.div>
      </div>
    </GlassCard>
  )
}
