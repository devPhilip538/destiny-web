import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { AnimatedPage } from '@/components/ui/AnimatedPage'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { StepIndicator } from '@/components/form/StepIndicator'
import { BirthDateStep } from '@/components/form/BirthDateStep'
import { BirthTimeStep } from '@/components/form/BirthTimeStep'
import { PersonalInfoStep } from '@/components/form/PersonalInfoStep'
import { ReviewStep } from '@/components/form/ReviewStep'
import { useSajuStore } from '@/store/saju-store'
import { calculateSaju } from '@/lib/saju-calculator'
import { analyzeFiveElements } from '@/lib/five-elements'
import { generatePersonality, generateFortune, generateRecommendations } from '@/lib/interpretation'
import { calculateLuckCycles } from '@/lib/luck-cycle'
import { calculateTenGods } from '@/lib/ten-gods'
import type { FormData, SavedReading } from '@/types/saju'

const STEP_LABELS = ['생년월일', '시간', '정보', '확인']

export function InputPage() {
  const navigate = useNavigate()
  const { setFormData, setResult, addToHistory } = useSajuStore()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    gender: '' as 'male' | 'female' | '',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: '',
    calendarType: 'solar' as 'solar' | 'lunar',
    isLeapMonth: false,
  })

  const updateField = (field: string, value: number | string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    switch (step) {
      case 0: return form.birthYear > 0 && form.birthMonth > 0 && form.birthDay > 0
      case 1: return form.birthHour !== ''
      case 2: return form.name.trim() !== '' && form.gender !== ''
      case 3: return true
      default: return false
    }
  }

  const handleSubmit = () => {
    if (isLoading) return
    setIsLoading(true)
    const loadingStart = Date.now()

    try {
      const formData: FormData = {
        name: form.name,
        gender: form.gender as 'male' | 'female',
        birthYear: form.birthYear,
        birthMonth: form.birthMonth,
        birthDay: form.birthDay,
        birthHour: form.birthHour,
        calendarType: form.calendarType,
        isLeapMonth: form.isLeapMonth,
      }

      setFormData(formData)

      const pillars = calculateSaju({
        birthYear: form.birthYear,
        birthMonth: form.birthMonth,
        birthDay: form.birthDay,
        birthHour: form.birthHour,
        calendarType: form.calendarType,
        isLeapMonth: form.isLeapMonth,
      })

      const balance = analyzeFiveElements(
        pillars.yearPillar, pillars.monthPillar, pillars.dayPillar, pillars.hourPillar,
      )

      const personality = generatePersonality(pillars.dayPillar, balance)
      const fortune = generateFortune(pillars.dayPillar)
      const recommendations = generateRecommendations(balance)

      const luckCycles = calculateLuckCycles(
        form.gender as 'male' | 'female',
        pillars.yearPillar.cheongan,
        pillars.monthPillar.cheongan,
        pillars.monthPillar.jiji,
        form.birthYear,
        form.birthMonth,
        form.birthDay,
      )

      const tenGods = calculateTenGods(
        pillars.dayPillar, pillars.yearPillar, pillars.monthPillar, pillars.hourPillar,
      )

      const result = {
        ...pillars,
        fiveElementBalance: balance,
        personality,
        fortune,
        recommendations,
        luckCycles,
        tenGods,
      }

      setResult(result)

      const reading: SavedReading = {
        id: crypto.randomUUID(),
        name: form.name,
        gender: form.gender as 'male' | 'female',
        birthYear: form.birthYear,
        birthMonth: form.birthMonth,
        birthDay: form.birthDay,
        birthHour: form.birthHour,
        calendarType: form.calendarType,
        result,
        createdAt: new Date().toISOString(),
      }

      addToHistory(reading)

      const MIN_LOADING_MS = 2200
      const elapsed = Date.now() - loadingStart
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed)
      setTimeout(() => navigate('/result'), remaining)
    } catch (error) {
      setIsLoading(false)
      const message = error instanceof Error ? error.message : '사주 분석 중 오류가 발생했습니다.'
      alert(message)
    }
  }

  return (
    <AnimatedPage>
      <LoadingOverlay isVisible={isLoading} />
      <StepIndicator currentStep={step} totalSteps={4} labels={STEP_LABELS} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <BirthDateStep
              birthYear={form.birthYear}
              birthMonth={form.birthMonth}
              birthDay={form.birthDay}
              calendarType={form.calendarType}
              isLeapMonth={form.isLeapMonth}
              onChange={updateField}
            />
          )}
          {step === 1 && (
            <BirthTimeStep birthHour={form.birthHour} onChange={updateField} />
          )}
          {step === 2 && (
            <PersonalInfoStep
              name={form.name}
              gender={form.gender}
              onChange={updateField}
            />
          )}
          {step === 3 && (
            <ReviewStep
              name={form.name}
              gender={form.gender}
              birthYear={form.birthYear}
              birthMonth={form.birthMonth}
              birthDay={form.birthDay}
              birthHour={form.birthHour}
              calendarType={form.calendarType}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 text-white/70 font-medium transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            이전
          </button>
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent-purple text-white font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent-purple-dark"
          >
            다음
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-gold text-white font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-accent-purple/25"
          >
            <Sparkles className="w-4 h-4" />
            사주 분석 시작
          </button>
        )}
      </div>
    </AnimatedPage>
  )
}
