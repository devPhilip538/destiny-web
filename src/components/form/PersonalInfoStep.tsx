import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface PersonalInfoStepProps {
  name: string
  gender: 'male' | 'female' | ''
  onChange: (field: string, value: string) => void
}

export function PersonalInfoStep({ name, gender, onChange }: PersonalInfoStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-white">기본 정보를 입력해주세요</h2>
      <p className="text-sm text-white/50">이름과 성별을 알려주세요.</p>

      <GlassCard>
        <label className="text-xs text-white/50 mb-2 block">이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="이름을 입력해주세요"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent-purple"
          maxLength={20}
        />
      </GlassCard>

      <GlassCard>
        <label className="text-xs text-white/50 mb-2 block">성별</label>
        <div className="flex gap-2">
          {([
            { value: 'male', label: '남성' },
            { value: 'female', label: '여성' },
          ] as const).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange('gender', option.value)}
              className={cn(
                'flex-1 py-3 rounded-xl text-sm font-medium transition-all',
                gender === option.value
                  ? 'bg-accent-purple text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
