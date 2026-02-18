import { SIJIN } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface BirthTimeStepProps {
  birthHour: string
  onChange: (field: string, value: string) => void
}

export function BirthTimeStep({ birthHour, onChange }: BirthTimeStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-white">태어난 시간을 선택해주세요</h2>
      <p className="text-sm text-white/50">12시진 중 해당하는 시간대를 선택해주세요.</p>

      <div className="grid grid-cols-3 gap-2">
        {SIJIN.map((sijin) => (
          <button
            key={sijin.code}
            type="button"
            onClick={() => onChange('birthHour', sijin.code)}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-xl transition-all text-center',
              birthHour === sijin.code
                ? 'bg-accent-purple/30 border border-accent-purple text-white'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10',
              sijin.code === 'unknown' && 'col-span-3',
            )}
          >
            {sijin.hanja && (
              <span className="text-lg font-bold">{sijin.hanja}</span>
            )}
            <span className="text-sm font-medium">{sijin.name}</span>
            {sijin.time && (
              <span className="text-[10px] text-white/40">{sijin.time}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
