import type { FiveElement, SajuResult } from '@/types/saju'
import { GENERATING, GENERATED_BY, OVERCOMING, OVERCOME_BY } from './constants'
import { analyzeDayMasterStrength, type DayMasterAnalysis } from './day-master-strength'

/**
 * 용신 (用神) — 사주의 균형을 잡아주는 가장 필요한 오행
 *
 * 용신은 사주 해석의 핵심.
 * - 일간이 강하면 → 설기(식상), 극(관살), 소모(재성) 하는 오행이 용신
 * - 일간이 약하면 → 생(인성), 돕는(비겁) 오행이 용신
 *
 * 용신을 돕는 오행 = 희신(喜神)
 * 용신을 방해하는 오행 = 기신(忌神)
 */

export interface YongshinAnalysis {
  yongshin: FiveElement       // 용신 (가장 필요한 오행)
  heeshin: FiveElement        // 희신 (용신을 돕는 오행)
  gishin: FiveElement         // 기신 (가장 해로운 오행)
  gushin: FiveElement         // 구신 (기신을 돕는 오행)
  hansin: FiveElement         // 한신 (중립적 오행)
  dayMasterAnalysis: DayMasterAnalysis
  description: string
}

export function analyzeYongshin(result: SajuResult): YongshinAnalysis {
  const dma = analyzeDayMasterStrength(result)
  const el = dma.dayMasterElement

  let yongshin: FiveElement
  let heeshin: FiveElement
  let gishin: FiveElement
  let gushin: FiveElement
  let hansin: FiveElement

  if (dma.isStrong) {
    // 일간이 강함 → 기운을 빼줘야 함
    // 용신: 식상(내가 생하는 것) 또는 재성(내가 극하는 것) 또는 관살(나를 극하는 것)
    // 우선순위: 재성 > 식상 > 관살 (재성이 가장 일반적 용신)
    if (dma.strengthLevel === '극강') {
      // 극강이면 관살로 제압
      yongshin = OVERCOME_BY[el]      // 관살 (나를 극하는 것)
      heeshin = GENERATING[el]        // 식상 (내가 생하는 것)
      gishin = el                     // 비겁 (나와 같은 것)
      gushin = GENERATED_BY[el]       // 인성 (나를 생하는 것)
      hansin = OVERCOMING[el]         // 재성
    } else {
      // 강이면 식상/재성으로 설기
      yongshin = OVERCOMING[el]       // 재성 (내가 극하는 것)
      heeshin = GENERATING[el]        // 식상 (내가 생하는 것)
      gishin = GENERATED_BY[el]       // 인성 (나를 생하는 것)
      gushin = el                     // 비겁
      hansin = OVERCOME_BY[el]        // 관살
    }
  } else {
    // 일간이 약함 → 기운을 보충해줘야 함
    // 용신: 인성(나를 생하는 것) 또는 비겁(나와 같은 것)
    if (dma.strengthLevel === '극약') {
      // 극약이면 인성으로 생해주는 것이 최우선
      yongshin = GENERATED_BY[el]     // 인성 (나를 생하는 것)
      heeshin = el                    // 비겁 (나와 같은 것)
      gishin = OVERCOME_BY[el]        // 관살 (나를 극하는 것)
      gushin = OVERCOMING[el]         // 재성 (내가 극하는 것 - 힘 빼감)
      hansin = GENERATING[el]         // 식상
    } else {
      // 약이면 비겁과 인성 모두 도움
      yongshin = GENERATED_BY[el]     // 인성
      heeshin = el                    // 비겁
      gishin = OVERCOMING[el]         // 재성 (힘 빼감)
      gushin = OVERCOME_BY[el]        // 관살
      hansin = GENERATING[el]         // 식상
    }
  }

  const description = getYongshinDescription(dma, yongshin, heeshin, gishin)

  return {
    yongshin,
    heeshin,
    gishin,
    gushin,
    hansin,
    dayMasterAnalysis: dma,
    description,
  }
}

function getYongshinDescription(dma: DayMasterAnalysis, yongshin: FiveElement, _heeshin: FiveElement, gishin: FiveElement): string {
  const elName = dma.dayMasterElement
  const strengthText = dma.isStrong ? '강한' : '약한'

  const elementMeaning: Record<FiveElement, string> = {
    '목': '나무(성장·인내)', '화': '불(열정·표현)', '토': '흙(안정·신뢰)',
    '금': '금속(결단·원칙)', '수': '물(지혜·유연)',
  }

  const luckyColors: Record<FiveElement, string> = {
    '목': '초록색, 청색', '화': '빨간색, 보라색', '토': '노란색, 갈색',
    '금': '흰색, 은색', '수': '검은색, 파란색',
  }

  const luckyDirections: Record<FiveElement, string> = {
    '목': '동쪽', '화': '남쪽', '토': '중앙',
    '금': '서쪽', '수': '북쪽',
  }

  return `일간 ${elName}(${elementMeaning[elName]})이 ${strengthText} 사주입니다. ` +
    `용신은 ${yongshin}(${elementMeaning[yongshin]})이며, ` +
    `${yongshin}의 기운이 강한 시기에 운이 좋아집니다. ` +
    `행운의 색상은 ${luckyColors[yongshin]}, 방향은 ${luckyDirections[yongshin]}입니다. ` +
    `${gishin}(${elementMeaning[gishin]})의 기운이 강한 시기에는 주의가 필요합니다.`
}

/**
 * 특정 오행이 용신/희신/기신 중 무엇인지 판별
 */
export function classifyElement(
  analysis: YongshinAnalysis,
  element: FiveElement,
): '용신' | '희신' | '기신' | '구신' | '한신' {
  if (element === analysis.yongshin) return '용신'
  if (element === analysis.heeshin) return '희신'
  if (element === analysis.gishin) return '기신'
  if (element === analysis.gushin) return '구신'
  return '한신'
}

/**
 * 특정 오행이 사주에 좋은지 나쁜지 점수로 반환 (-1 ~ 1)
 */
export function getElementFavorability(analysis: YongshinAnalysis, element: FiveElement): number {
  if (element === analysis.yongshin) return 1.0
  if (element === analysis.heeshin) return 0.6
  if (element === analysis.hansin) return 0.0
  if (element === analysis.gushin) return -0.5
  if (element === analysis.gishin) return -1.0
  return 0
}
