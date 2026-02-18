import type { Pillar, FiveElement, FiveElementBalance } from '@/types/saju'
import { HIDDEN_STEMS } from './hidden-stems'

/**
 * 오행 분석 — 지장간 포함 가중치 방식
 *
 * 천간: 각 1.0
 * 지지 본기: 1.0, 중기: 0.5, 여기: 0.3
 * 총 오행 가중치 합으로 dominant/lacking 판단
 */
export function analyzeFiveElements(
  yearPillar: Pillar,
  monthPillar: Pillar,
  dayPillar: Pillar,
  hourPillar: Pillar,
): FiveElementBalance {
  const counts: Record<FiveElement, number> = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 }

  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar]

  for (const p of pillars) {
    // 천간 오행 (가중치 1.0)
    counts[p.cheonganElement] += 1

    // 지장간 오행 (가중치: 본기 1.0, 중기 0.5, 여기 0.3)
    for (const hs of HIDDEN_STEMS[p.jiji]) {
      counts[hs.element] += hs.weight
    }
  }

  // 정수로 반올림 (표시용)
  const displayCounts: Record<FiveElement, number> = {
    '목': Math.round(counts['목']),
    '화': Math.round(counts['화']),
    '토': Math.round(counts['토']),
    '금': Math.round(counts['금']),
    '수': Math.round(counts['수']),
  }

  // 가중치 기반 dominant/lacking 판단
  const PRIORITY: FiveElement[] = ['목', '화', '토', '금', '수']
  const dominant = PRIORITY.reduce((a, b) => counts[a] >= counts[b] ? a : b)
  const lacking = PRIORITY.reduce((a, b) => counts[a] <= counts[b] ? a : b)

  return { ...displayCounts, dominant, lacking }
}
