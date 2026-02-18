import type { Pillar, FiveElement, FiveElementBalance } from '@/types/saju'

export function analyzeFiveElements(
  yearPillar: Pillar,
  monthPillar: Pillar,
  dayPillar: Pillar,
  hourPillar: Pillar,
): FiveElementBalance {
  const counts: Record<FiveElement, number> = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 }

  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar]
  for (const p of pillars) {
    counts[p.cheonganElement] += 1
    counts[p.jijiElement] += 1
  }

  // 동점 시 오행 우선순위(목→화→토→금→수) 기반 일관된 선택
  const PRIORITY: FiveElement[] = ['목', '화', '토', '금', '수']
  const dominant = PRIORITY.reduce((a, b) => counts[a] >= counts[b] ? a : b)
  const lacking = PRIORITY.reduce((a, b) => counts[a] <= counts[b] ? a : b)

  return { ...counts, dominant, lacking }
}
