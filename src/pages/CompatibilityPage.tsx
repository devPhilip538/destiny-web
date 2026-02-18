import { useState } from 'react'
import { motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { AnimatedPage } from '@/components/ui/AnimatedPage'
import { PersonSelector } from '@/components/compatibility/PersonSelector'
import { CompatibilityResult } from '@/components/compatibility/CompatibilityResult'
import { useSajuStore } from '@/store/saju-store'
import { calculateCompatibility } from '@/lib/compatibility'
import type { SavedReading } from '@/types/saju'
import type { CompatibilityResult as CompatResult } from '@/lib/compatibility'

export function CompatibilityPage() {
  const history = useSajuStore((s) => s.history)
  const [person1, setPerson1] = useState<SavedReading | null>(null)
  const [person2, setPerson2] = useState<SavedReading | null>(null)
  const [result, setResult] = useState<CompatResult | null>(null)

  const handleAnalyze = () => {
    if (!person1 || !person2) return
    if (person1.id === person2.id) {
      alert('같은 사람을 선택할 수 없습니다. 다른 사람을 선택해주세요.')
      return
    }
    const compatResult = calculateCompatibility(person1.result, person2.result)
    setResult(compatResult)
  }

  const handleReset = () => {
    setPerson1(null)
    setPerson2(null)
    setResult(null)
  }

  return (
    <AnimatedPage>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="w-16 h-16 mx-auto mb-3 rounded-full glass-purple flex items-center justify-center">
            <Heart className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gradient">궁합 분석</h1>
          <p className="text-sm text-white/50 mt-1">두 사람의 사주를 비교하여 궁합을 분석합니다</p>
        </motion.div>

        {!result ? (
          <>
            {/* Person Selectors */}
            <PersonSelector
              label="첫 번째 사람"
              history={history}
              selected={person1}
              onSelect={setPerson1}
            />
            <PersonSelector
              label="두 번째 사람"
              history={history.filter((h) => h.id !== person1?.id)}
              selected={person2}
              onSelect={setPerson2}
            />

            {/* Analyze Button */}
            <motion.button
              type="button"
              onClick={handleAnalyze}
              disabled={!person1 || !person2}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-accent-purple text-white font-bold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2"
              whileTap={{ scale: 0.98 }}
            >
              <Heart className="w-5 h-5" />
              궁합 분석하기
            </motion.button>

            {history.length < 2 && (
              <p className="text-xs text-white/30 text-center">
                궁합 분석을 위해 최소 2명의 사주 분석 기록이 필요합니다
              </p>
            )}
          </>
        ) : (
          <>
            <CompatibilityResult
              result={result}
              name1={person1!.name}
              name2={person2!.name}
            />
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-white/5 text-white/70 font-medium hover:bg-white/10 transition-colors"
            >
              다시 분석하기
            </button>
          </>
        )}
      </div>
    </AnimatedPage>
  )
}
