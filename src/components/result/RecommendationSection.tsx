import { motion } from 'motion/react'
import { Palette, Hash, Navigation, MessageCircle } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import type { Recommendations } from '@/types/saju'

interface RecommendationSectionProps {
  recommendations: Recommendations
}

export function RecommendationSection({ recommendations }: RecommendationSectionProps) {
  const items = [
    { icon: Palette, label: '행운의 색', value: recommendations.luckyColor },
    { icon: Hash, label: '행운의 숫자', value: String(recommendations.luckyNumber) },
    { icon: Navigation, label: '행운의 방향', value: recommendations.luckyDirection },
  ]

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">추천사항</h3>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="flex flex-col items-center text-center gap-2">
              <item.icon className="w-5 h-5 text-accent-gold" />
              <span className="text-[10px] text-white/40">{item.label}</span>
              <span className="text-xs font-bold text-white">{item.value}</span>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard variant="purple" className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-accent-purple-light shrink-0 mt-0.5" />
          <p className="text-sm text-white/80 leading-relaxed">{recommendations.advice}</p>
        </GlassCard>
      </motion.div>
    </div>
  )
}
