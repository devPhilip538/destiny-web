import { motion } from 'motion/react'
import { User } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

interface PersonalitySectionProps {
  personality: string[]
}

export function PersonalitySection({ personality }: PersonalitySectionProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-accent-purple-light" />
        성격 분석
      </h3>
      <div className="flex flex-col gap-2">
        {personality.map((text, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="text-sm text-white/80 leading-relaxed">
              {text}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
