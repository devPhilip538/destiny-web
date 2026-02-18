import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { AnimatedPage } from '@/components/ui/AnimatedPage'
import { FortuneHeader } from '@/components/fortune/FortuneHeader'
import { DailyFortuneView } from '@/components/fortune/DailyFortuneView'
import { WeeklyFortuneView } from '@/components/fortune/WeeklyFortuneView'
import { YearlyFortuneView } from '@/components/fortune/YearlyFortuneView'
import { MarriageLuckView } from '@/components/fortune/MarriageLuckView'
import { LoveLuckView } from '@/components/fortune/LoveLuckView'
import { FinanceLuckView } from '@/components/fortune/FinanceLuckView'
import { HealthLuckView } from '@/components/fortune/HealthLuckView'
import { CareerLuckView } from '@/components/fortune/CareerLuckView'
import { AdBanner } from '@/components/ui/AdBanner'
import { useSajuStore } from '@/store/saju-store'
import type { FortuneCategory } from '@/types/saju'

const VALID_CATEGORIES: FortuneCategory[] = ['daily', 'weekly', 'yearly', 'marriage', 'love', 'finance', 'health', 'career']

export function FortuneDetailPage() {
  const { category, id } = useParams<{ category: string; id?: string }>()
  const navigate = useNavigate()
  const history = useSajuStore((s) => s.history)

  if (!category || !VALID_CATEGORIES.includes(category as FortuneCategory)) {
    return <Navigate to="/" replace />
  }

  if (history.length === 0) {
    return <Navigate to="/input" replace />
  }

  const currentReading = id
    ? history.find((r) => r.id === id) || history[0]
    : history[0]

  const handleSelectReading = (selectedId: string) => {
    navigate(`/fortune/${category}/${selectedId}`, { replace: true })
  }

  const renderView = () => {
    const { result } = currentReading

    switch (category as FortuneCategory) {
      case 'daily':
        return <DailyFortuneView dayPillar={result.dayPillar} />
      case 'weekly':
        return <WeeklyFortuneView dayPillar={result.dayPillar} />
      case 'yearly':
        return <YearlyFortuneView result={result} birthYear={currentReading.birthYear} />
      case 'marriage':
        return <MarriageLuckView result={result} gender={currentReading.gender} birthYear={currentReading.birthYear} />
      case 'love':
        return <LoveLuckView result={result} gender={currentReading.gender} />
      case 'finance':
        return <FinanceLuckView result={result} birthYear={currentReading.birthYear} />
      case 'health':
        return <HealthLuckView result={result} />
      case 'career':
        return <CareerLuckView result={result} birthYear={currentReading.birthYear} />
      default:
        return <Navigate to="/" replace />
    }
  }

  return (
    <AnimatedPage>
      <div className="pt-4 pb-8">
        <FortuneHeader
          category={category as FortuneCategory}
          currentReading={currentReading}
          allReadings={history}
          onSelectReading={handleSelectReading}
        />
        <AdBanner slot="fortune-top" format="horizontal" className="mb-4" />
        {renderView()}
        <AdBanner slot="fortune-bottom" format="rectangle" className="mt-6" />
      </div>
    </AnimatedPage>
  )
}
