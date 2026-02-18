import { motion } from 'motion/react'
import { TrendingUp } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

interface FortuneSectionProps {
  fortune: string[]
}

export function FortuneSection({ fortune }: FortuneSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-accent-gold" />
        운세
      </h3>
      <div className="flex flex-col gap-2">
        {fortune.map((text, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard variant="purple" className="text-sm text-white/80 leading-relaxed">
              {text}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
