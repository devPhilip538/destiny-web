import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import type { SavedReading, FortuneCategory } from '@/types/saju'

const CATEGORY_LABELS: Record<FortuneCategory, { name: string; icon: string }> = {
  daily: { name: '오늘의 사주', icon: '☀️' },
  weekly: { name: '이번주 사주', icon: '📅' },
  yearly: { name: '올해의 사주', icon: '🎆' },
  lifetime: { name: '평생 사주', icon: '🔮' },
  compatibility: { name: '궁합', icon: '💕' },
  marriage: { name: '결혼운', icon: '💍' },
  love: { name: '애정운', icon: '❤️' },
  finance: { name: '금전운', icon: '💰' },
  health: { name: '건강운', icon: '💪' },
  career: { name: '직장운', icon: '💼' },
}

interface FortuneHeaderProps {
  category: FortuneCategory
  currentReading: SavedReading
  allReadings: SavedReading[]
  onSelectReading: (id: string) => void
}

export function FortuneHeader({ category, currentReading, allReadings, onSelectReading }: FortuneHeaderProps) {
  const navigate = useNavigate()
  const info = CATEGORY_LABELS[category]

  return (
    <div className="mb-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-white/60 text-sm mb-4 bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        뒤로가기
      </button>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{info.icon}</span>
            <h1 className="text-xl font-bold text-white">{info.name}</h1>
          </div>
        </div>

        {allReadings.length > 1 && (
          <div className="relative">
            <select
              value={currentReading.id}
              onChange={(e) => onSelectReading(e.target.value)}
              className="appearance-none bg-white/10 text-white text-sm rounded-xl px-3 py-2 pr-8 border border-white/10 cursor-pointer"
            >
              {allReadings.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#1a1040] text-white">
                  {r.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-white/40 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}
      </div>

      <p className="text-sm text-white/50 mt-1">
        {currentReading.name} · {currentReading.birthYear}년 {currentReading.birthMonth}월 {currentReading.birthDay}일
      </p>
    </div>
  )
}
