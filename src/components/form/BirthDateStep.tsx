import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface BirthDateStepProps {
  birthYear: number
  birthMonth: number
  birthDay: number
  calendarType: 'solar' | 'lunar'
  isLeapMonth: boolean
  onChange: (field: string, value: number | string | boolean) => void
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i)
const months = Array.from({ length: 12 }, (_, i) => i + 1)

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

export function BirthDateStep({
  birthYear, birthMonth, birthDay, calendarType, isLeapMonth, onChange,
}: BirthDateStepProps) {
  const maxDay = getDaysInMonth(birthYear, birthMonth)
  const days = Array.from({ length: maxDay }, (_, i) => i + 1)

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-white">생년월일을 알려주세요</h2>
      <p className="text-sm text-white/50">정확한 사주 분석을 위해 생년월일을 입력해주세요.</p>

      {/* Calendar Type Toggle */}
      <GlassCard>
        <label className="text-xs text-white/50 mb-2 block">달력 유형</label>
        <div className="flex gap-2">
          {(['solar', 'lunar'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange('calendarType', type)}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all',
                calendarType === type
                  ? 'bg-accent-purple text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10',
              )}
            >
              {type === 'solar' ? '양력' : '음력'}
            </button>
          ))}
        </div>
        {calendarType === 'lunar' && (
          <label className="flex items-center gap-2 mt-3 text-sm text-white/60">
            <input
              type="checkbox"
              checked={isLeapMonth}
              onChange={(e) => onChange('isLeapMonth', e.target.checked)}
              className="accent-accent-purple"
            />
            윤달
          </label>
        )}
      </GlassCard>

      {/* Year / Month / Day */}
      <GlassCard>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-white/50 mb-1 block">년</label>
            <select
              value={birthYear}
              onChange={(e) => onChange('birthYear', Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent-purple"
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-deep-indigo">{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1 block">월</label>
            <select
              value={birthMonth}
              onChange={(e) => onChange('birthMonth', Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent-purple"
            >
              {months.map((m) => (
                <option key={m} value={m} className="bg-deep-indigo">{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1 block">일</label>
            <select
              value={birthDay > maxDay ? maxDay : birthDay}
              onChange={(e) => onChange('birthDay', Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent-purple"
            >
              {days.map((d) => (
                <option key={d} value={d} className="bg-deep-indigo">{d}</option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
