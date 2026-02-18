import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Sparkles, ArrowRight, Star } from 'lucide-react'
import { AnimatedPage } from '@/components/ui/AnimatedPage'
import { GlassCard } from '@/components/ui/GlassCard'
import { DailyFortuneCard } from '@/components/home/DailyFortuneCard'
import { FortuneCategoryGrid } from '@/components/home/FortuneCategoryGrid'
import { useSajuStore } from '@/store/saju-store'
import { AdBanner } from '@/components/ui/AdBanner'

export function HomePage() {
  const history = useSajuStore((s) => s.history)
  const recentHistory = history.slice(0, 3)

  return (
    <AnimatedPage>
      <div className="flex flex-col items-center gap-8 pt-8">
        {/* Hero */}
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full glass-purple flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-accent-gold" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">사주팔자</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            생년월일시로 알아보는<br />나의 타고난 운명과 기운
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/input"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-purple to-accent-purple-dark text-white font-semibold text-lg shadow-lg shadow-accent-purple/25 hover:shadow-accent-purple/40 transition-shadow no-underline"
          >
            나의 사주 보기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Ad Banner */}
        <AdBanner slot="home-top" format="horizontal" />

        {/* Daily Fortune - 최근 분석이 있을 때만 표시 */}
        {history.length > 0 && history[0].result?.dayPillar && (
          <DailyFortuneCard dayPillar={history[0].result.dayPillar} />
        )}

        {/* Fortune Category Grid */}
        <FortuneCategoryGrid />

        {/* Info Cards */}
        <div className="w-full grid grid-cols-2 gap-3">
          {[
            { title: '사주란?', desc: '태어난 년·월·일·시의 네 기둥으로 분석하는 동양 철학' },
            { title: '오행이란?', desc: '목·화·토·금·수 다섯 가지 원소의 조화와 균형' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <GlassCard className="h-full">
                <Star className="w-4 h-4 text-accent-gold mb-2" />
                <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Recent History */}
        {recentHistory.length > 0 && (
          <motion.div
            className="w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white/80">최근 분석</h2>
              <Link to="/history" className="text-xs text-accent-purple-light no-underline">
                전체보기
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {recentHistory.map((reading) => (
                <Link
                  key={reading.id}
                  to={`/result/${reading.id}`}
                  className="no-underline"
                >
                  <GlassCard className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{reading.name}</p>
                      <p className="text-xs text-white/40">
                        {reading.birthYear}년 {reading.birthMonth}월 {reading.birthDay}일
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30" />
                  </GlassCard>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </AnimatedPage>
  )
}
