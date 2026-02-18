import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { GlassCard } from '@/components/ui/GlassCard'
import type { FortuneCategory } from '@/types/saju'

interface CategoryItem {
  key: FortuneCategory
  name: string
  icon: string
  description: string
  link: string
}

const CATEGORIES: CategoryItem[] = [
  { key: 'daily', name: '오늘의 사주', icon: '☀️', description: '오늘 하루 운세', link: '/fortune/daily' },
  { key: 'weekly', name: '이번주 사주', icon: '📅', description: '주간 운세 흐름', link: '/fortune/weekly' },
  { key: 'yearly', name: '올해의 사주', icon: '🎆', description: '연간 운세 분석', link: '/fortune/yearly' },
  { key: 'lifetime', name: '평생 사주', icon: '🔮', description: '타고난 운명 분석', link: '/result' },
  { key: 'marriage', name: '결혼운', icon: '💍', description: '배우자 & 결혼 시기', link: '/fortune/marriage' },
  { key: 'love', name: '애정운', icon: '❤️', description: '연애 스타일 & 운세', link: '/fortune/love' },
  { key: 'finance', name: '금전운', icon: '💰', description: '재물운 & 투자 시기', link: '/fortune/finance' },
  { key: 'health', name: '건강운', icon: '💪', description: '오행별 건강 분석', link: '/fortune/health' },
  { key: 'career', name: '직장운', icon: '💼', description: '적성 & 승진 시기', link: '/fortune/career' },
  { key: 'compatibility', name: '궁합', icon: '💕', description: '두 사람의 궁합', link: '/compatibility' },
]

export function FortuneCategoryGrid() {
  return (
    <div className="w-full">
      <h2 className="text-sm font-semibold text-white/80 mb-3">운세 카테고리</h2>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.key}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i }}
          >
            <Link to={cat.link} className="no-underline">
              <GlassCard className="flex items-start gap-3 hover:bg-white/10 transition-colors">
                <span className="text-2xl">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{cat.name}</p>
                  <p className="text-xs text-white/40">{cat.description}</p>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
