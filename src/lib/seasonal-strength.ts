import type { FiveElement, Jiji } from '@/types/saju'

/**
 * 월령 (月令) — 월지(月支)에 의한 계절 기운
 *
 * 사주에서 월지는 "절기"를 나타내며, 일간의 힘을 판단하는 가장 중요한 요소
 * 월지의 계절과 일간의 오행이 같으면 "당령(得令)" = 힘이 강함
 * 반대면 "실령(失令)" = 힘이 약함
 */

// 월지 → 계절 오행 (절기 기준)
// 인묘(봄) = 목, 사오(여름) = 화, 신유(가을) = 금, 해자(겨울) = 수
// 진술축미(환절기) = 토
export const MONTH_SEASON: Record<Jiji, FiveElement> = {
  '인': '목', '묘': '목',
  '사': '화', '오': '화',
  '신': '금', '유': '금',
  '해': '수', '자': '수',
  '진': '토', '술': '토', '축': '토', '미': '토',
}

/**
 * 오행의 왕상휴수사 (旺相休囚死)
 * 계절에 따른 오행의 힘 상태
 *
 * 왕(旺) = 1.0: 현재 계절의 오행 (가장 강함)
 * 상(相) = 0.8: 왕이 생하는 오행
 * 휴(休) = 0.5: 왕을 생하는 오행
 * 수(囚) = 0.3: 왕을 극하는 오행
 * 사(死) = 0.1: 왕에게 극당하는 오행
 */

import { GENERATING, GENERATED_BY, OVERCOMING, OVERCOME_BY } from './constants'

export type SeasonalState = '왕' | '상' | '휴' | '수' | '사'

export function getSeasonalState(element: FiveElement, monthBranch: Jiji): SeasonalState {
  const seasonElement = MONTH_SEASON[monthBranch]

  if (element === seasonElement) return '왕'
  if (element === GENERATING[seasonElement]) return '상'
  if (element === GENERATED_BY[seasonElement]) return '휴'
  if (element === OVERCOME_BY[seasonElement]) return '수'
  if (element === OVERCOMING[seasonElement]) return '사'
  return '휴' // fallback
}

export const SEASONAL_STATE_STRENGTH: Record<SeasonalState, number> = {
  '왕': 1.0,
  '상': 0.8,
  '휴': 0.5,
  '수': 0.3,
  '사': 0.1,
}

export function getSeasonalStrength(element: FiveElement, monthBranch: Jiji): number {
  const state = getSeasonalState(element, monthBranch)
  return SEASONAL_STATE_STRENGTH[state]
}

/**
 * 월령 득실 판단 (일간이 월지에서 힘을 얻는지)
 */
export function isDangryeong(dayElement: FiveElement, monthBranch: Jiji): boolean {
  const state = getSeasonalState(dayElement, monthBranch)
  return state === '왕' || state === '상'
}

export const SEASONAL_STATE_DESCRIPTIONS: Record<SeasonalState, string> = {
  '왕': '현재 계절과 같은 기운으로 가장 강한 상태입니다.',
  '상': '계절의 기운이 생해주어 힘이 좋은 상태입니다.',
  '휴': '계절과 무관하여 보통의 상태입니다.',
  '수': '계절의 기운에 억눌려 약한 상태입니다.',
  '사': '계절의 기운에 극을 당해 가장 약한 상태입니다.',
}
