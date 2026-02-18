import { useParams, Link } from 'react-router-dom'
import { AnimatedPage } from '@/components/ui/AnimatedPage'
import { GlassCard } from '@/components/ui/GlassCard'
import { FourPillarsDisplay } from '@/components/result/FourPillarsDisplay'
import { FiveElementsChart } from '@/components/result/FiveElementsChart'
import { PersonalitySection } from '@/components/result/PersonalitySection'
import { FortuneSection } from '@/components/result/FortuneSection'
import { RecommendationSection } from '@/components/result/RecommendationSection'
import { ShareButton } from '@/components/result/ShareButton'
import { LuckCycleTimeline } from '@/components/result/LuckCycleTimeline'
import { ZodiacSection } from '@/components/result/ZodiacSection'
import { TenGodsSection } from '@/components/result/TenGodsSection'
import { useSajuStore } from '@/store/saju-store'
import { AdBanner } from '@/components/ui/AdBanner'

export function ResultPage() {
  const { id } = useParams()
  const storeResult = useSajuStore((s) => s.result)
  const formData = useSajuStore((s) => s.formData)
  const history = useSajuStore((s) => s.history)

  // If an ID is provided, find from history; otherwise use current result
  const historyItem = id ? history.find((h) => h.id === id) : null
  const result = historyItem?.result ?? storeResult
  const name = historyItem?.name ?? formData?.name ?? ''
  const birthMonth = historyItem?.birthMonth ?? formData?.birthMonth ?? 1
  const birthDay = historyItem?.birthDay ?? formData?.birthDay ?? 1

  if (!result) {
    return (
      <AnimatedPage>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-white mb-2">분석 결과를 찾을 수 없습니다</h2>
          <p className="text-sm text-white/50 mb-6">해당 분석 기록이 삭제되었거나 존재하지 않습니다.</p>
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-purple-dark transition-colors no-underline"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <div className="flex flex-col gap-6">
        {/* Name Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gradient">{name}님의 사주</h2>
        </div>

        {/* Four Pillars */}
        <GlassCard>
          <FourPillarsDisplay
            yearPillar={result.yearPillar}
            monthPillar={result.monthPillar}
            dayPillar={result.dayPillar}
            hourPillar={result.hourPillar}
          />
        </GlassCard>

        {/* Zodiac (띠 & 별자리) */}
        <ZodiacSection
          yearBranch={result.yearPillar.jiji}
          birthMonth={birthMonth}
          birthDay={birthDay}
        />

        {/* Five Elements */}
        <GlassCard>
          <FiveElementsChart balance={result.fiveElementBalance} />
        </GlassCard>

        {/* Ad Banner - Mid */}
        <AdBanner slot="result-mid" format="auto" />

        {/* Ten Gods (십신) */}
        {result.tenGods && (
          <TenGodsSection tenGods={result.tenGods} />
        )}

        {/* Luck Cycle (대운) */}
        {result.luckCycles && result.luckCycles.length > 0 && (
          <LuckCycleTimeline cycles={result.luckCycles} />
        )}

        {/* Personality */}
        <PersonalitySection personality={result.personality} />

        {/* Fortune */}
        <FortuneSection fortune={result.fortune} />

        {/* Recommendations */}
        <RecommendationSection recommendations={result.recommendations} />

        {/* Ad Banner - Bottom */}
        <AdBanner slot="result-bottom" format="auto" />

        {/* Share / Retry */}
        <ShareButton />
      </div>
    </AnimatedPage>
  )
}
