import { GlassCard } from '@/components/ui/GlassCard'
import { SIJIN } from '@/lib/constants'

interface ReviewStepProps {
  name: string
  gender: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: string
  calendarType: string
}

export function ReviewStep(props: ReviewStepProps) {
  const sijin = SIJIN.find((s) => s.code === props.birthHour)

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-white">입력 정보를 확인해주세요</h2>
      <p className="text-sm text-white/50">아래 정보가 맞으면 분석을 시작합니다.</p>

      <GlassCard variant="purple" className="flex flex-col gap-3">
        <Row label="이름" value={props.name} />
        <Row label="성별" value={props.gender === 'male' ? '남성' : '여성'} />
        <Row
          label="생년월일"
          value={`${props.birthYear}년 ${props.birthMonth}월 ${props.birthDay}일`}
        />
        <Row label="달력" value={props.calendarType === 'solar' ? '양력' : '음력'} />
        <Row label="태어난 시간" value={sijin ? `${sijin.name} (${sijin.time || '시간 모름'})` : '모름'} />
      </GlassCard>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  )
}
