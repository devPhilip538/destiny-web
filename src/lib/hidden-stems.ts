import type { Cheongan, Jiji, FiveElement } from '@/types/saju'

/**
 * 지장간 (地藏干) — 지지 속에 감춰진 천간
 * 각 지지에는 1~3개의 천간이 숨겨져 있으며,
 * 본기(main) > 중기(middle) > 여기(residual) 순서로 영향력이 다름
 *
 * 가중치: 본기 = 1.0, 중기 = 0.5, 여기 = 0.3
 */

export interface HiddenStem {
  stem: Cheongan
  element: FiveElement
  weight: number // 본기 1.0, 중기 0.5, 여기 0.3
  type: 'main' | 'middle' | 'residual'
}

export const HIDDEN_STEMS: Record<Jiji, HiddenStem[]> = {
  '자': [
    { stem: '계', element: '수', weight: 1.0, type: 'main' },
  ],
  '축': [
    { stem: '기', element: '토', weight: 1.0, type: 'main' },
    { stem: '계', element: '수', weight: 0.5, type: 'middle' },
    { stem: '신', element: '금', weight: 0.3, type: 'residual' },
  ],
  '인': [
    { stem: '갑', element: '목', weight: 1.0, type: 'main' },
    { stem: '병', element: '화', weight: 0.5, type: 'middle' },
    { stem: '무', element: '토', weight: 0.3, type: 'residual' },
  ],
  '묘': [
    { stem: '을', element: '목', weight: 1.0, type: 'main' },
  ],
  '진': [
    { stem: '무', element: '토', weight: 1.0, type: 'main' },
    { stem: '을', element: '목', weight: 0.5, type: 'middle' },
    { stem: '계', element: '수', weight: 0.3, type: 'residual' },
  ],
  '사': [
    { stem: '병', element: '화', weight: 1.0, type: 'main' },
    { stem: '경', element: '금', weight: 0.5, type: 'middle' },
    { stem: '무', element: '토', weight: 0.3, type: 'residual' },
  ],
  '오': [
    { stem: '정', element: '화', weight: 1.0, type: 'main' },
    { stem: '기', element: '토', weight: 0.5, type: 'middle' },
  ],
  '미': [
    { stem: '기', element: '토', weight: 1.0, type: 'main' },
    { stem: '정', element: '화', weight: 0.5, type: 'middle' },
    { stem: '을', element: '목', weight: 0.3, type: 'residual' },
  ],
  '신': [
    { stem: '경', element: '금', weight: 1.0, type: 'main' },
    { stem: '임', element: '수', weight: 0.5, type: 'middle' },
    { stem: '무', element: '토', weight: 0.3, type: 'residual' },
  ],
  '유': [
    { stem: '신', element: '금', weight: 1.0, type: 'main' },
  ],
  '술': [
    { stem: '무', element: '토', weight: 1.0, type: 'main' },
    { stem: '신', element: '금', weight: 0.5, type: 'middle' },
    { stem: '정', element: '화', weight: 0.3, type: 'residual' },
  ],
  '해': [
    { stem: '임', element: '수', weight: 1.0, type: 'main' },
    { stem: '갑', element: '목', weight: 0.5, type: 'middle' },
  ],
}

/**
 * 지지에서 지장간의 가중 오행 합계를 반환
 */
export function getHiddenElementWeights(jiji: Jiji): Record<FiveElement, number> {
  const weights: Record<FiveElement, number> = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 }
  for (const hs of HIDDEN_STEMS[jiji]) {
    weights[hs.element] += hs.weight
  }
  return weights
}

/**
 * 지지 속에 특정 천간이 있는지 확인
 */
export function hasHiddenStem(jiji: Jiji, stem: Cheongan): boolean {
  return HIDDEN_STEMS[jiji].some(hs => hs.stem === stem)
}

/**
 * 지지의 본기(主氣) 천간 반환
 */
export function getMainHiddenStem(jiji: Jiji): Cheongan {
  return HIDDEN_STEMS[jiji][0].stem
}
