import type { Cheongan, Jiji, FiveElement, SajuResult } from '@/types/saju'
import { CHEONGAN_ELEMENT, GENERATING, GENERATED_BY, OVERCOMING, OVERCOME_BY } from './constants'
import { HIDDEN_STEMS } from './hidden-stems'
import { getTwelveStage, STAGE_STRENGTH } from './twelve-stages'
import { getSeasonalStrength, isDangryeong } from './seasonal-strength'

/**
 * 일간 강약 판단 (日干 强弱)
 *
 * 일간(日干)의 힘이 강한지 약한지 판단하는 것은
 * 사주 해석의 가장 핵심적인 기초.
 *
 * 강약 판단 요소:
 * 1. 월령 득실 (가장 중요 - 40%)
 * 2. 비겁(비견/겁재)의 도움 (20%)
 * 3. 인성(정인/편인)의 도움 (20%)
 * 4. 12운성의 강약 (10%)
 * 5. 지장간 내 아군 세력 (10%)
 */

export interface DayMasterAnalysis {
  dayMaster: Cheongan
  dayMasterElement: FiveElement
  isStrong: boolean
  strengthScore: number // 0~100
  strengthLevel: '극강' | '강' | '중강' | '중약' | '약' | '극약'
  seasonalState: string
  isDangryeong: boolean
  supportCount: number // 비겁 + 인성 수
  drainCount: number   // 식상 + 재성 + 관살 수
  twelveStageOnDay: string
  details: {
    seasonalScore: number
    peerScore: number
    resourceScore: number
    stageScore: number
    hiddenScore: number
  }
}

function countTenGodType(
  dayMasterElement: FiveElement,
  targetElement: FiveElement,
): 'peer' | 'resource' | 'output' | 'wealth' | 'power' {
  if (targetElement === dayMasterElement) return 'peer'           // 비겁
  if (targetElement === GENERATED_BY[dayMasterElement]) return 'resource'  // 인성
  if (targetElement === GENERATING[dayMasterElement]) return 'output'     // 식상
  if (targetElement === OVERCOMING[dayMasterElement]) return 'wealth'     // 재성
  if (targetElement === OVERCOME_BY[dayMasterElement]) return 'power'     // 관살
  return 'peer'
}

export function analyzeDayMasterStrength(result: SajuResult): DayMasterAnalysis {
  const dayMaster = result.dayPillar.cheongan
  const dayMasterElement = CHEONGAN_ELEMENT[dayMaster]
  const monthBranch = result.monthPillar.jiji

  // 1. 월령 득실 (40점 만점)
  const dangryeong = isDangryeong(dayMasterElement, monthBranch)
  const seasonalStr = getSeasonalStrength(dayMasterElement, monthBranch)
  const seasonalScore = Math.round(seasonalStr * 40)

  // 2. 비겁(비견/겁재) 세력 계산 (20점 만점)
  let peerCount = 0
  let resourceCount = 0
  let drainCount = 0

  const allStems = [
    result.yearPillar.cheongan,
    result.monthPillar.cheongan,
    // 일간 자신 제외
    result.hourPillar.cheongan,
  ]
  for (const stem of allStems) {
    const el = CHEONGAN_ELEMENT[stem]
    const type = countTenGodType(dayMasterElement, el)
    if (type === 'peer') peerCount++
    else if (type === 'resource') resourceCount++
    else drainCount++
  }

  // 지지 본기에서도 비겁/인성 체크
  const allBranches: Jiji[] = [
    result.yearPillar.jiji,
    result.monthPillar.jiji,
    result.dayPillar.jiji,
    result.hourPillar.jiji,
  ]
  let hiddenPeerResource = 0
  let hiddenDrain = 0
  for (const branch of allBranches) {
    for (const hs of HIDDEN_STEMS[branch]) {
      const type = countTenGodType(dayMasterElement, hs.element)
      if (type === 'peer' || type === 'resource') {
        hiddenPeerResource += hs.weight
      } else {
        hiddenDrain += hs.weight
      }
    }
  }

  const peerScore = Math.min(20, Math.round((peerCount / 3) * 20))
  const resourceScore = Math.min(20, Math.round((resourceCount / 3) * 20))

  // 4. 12운성 강약 (10점 만점)
  const dayStage = getTwelveStage(dayMaster, result.dayPillar.jiji)
  const dayStageStrength = STAGE_STRENGTH[dayStage]
  const stageScore = Math.round(dayStageStrength * 10)

  // 5. 지장간 아군 비율 (10점 만점)
  const totalHidden = hiddenPeerResource + hiddenDrain
  const hiddenRatio = totalHidden > 0 ? hiddenPeerResource / totalHidden : 0.5
  const hiddenScore = Math.round(hiddenRatio * 10)

  // 종합
  const strengthScore = seasonalScore + peerScore + resourceScore + stageScore + hiddenScore
  const supportCount = peerCount + resourceCount
  const totalDrainCount = drainCount

  let strengthLevel: DayMasterAnalysis['strengthLevel']
  if (strengthScore >= 80) strengthLevel = '극강'
  else if (strengthScore >= 65) strengthLevel = '강'
  else if (strengthScore >= 50) strengthLevel = '중강'
  else if (strengthScore >= 35) strengthLevel = '중약'
  else if (strengthScore >= 20) strengthLevel = '약'
  else strengthLevel = '극약'

  const isStrong = strengthScore >= 50

  return {
    dayMaster,
    dayMasterElement,
    isStrong,
    strengthScore,
    strengthLevel,
    seasonalState: dangryeong ? '당령(得令)' : '실령(失令)',
    isDangryeong: dangryeong,
    supportCount,
    drainCount: totalDrainCount,
    twelveStageOnDay: dayStage,
    details: {
      seasonalScore,
      peerScore,
      resourceScore,
      stageScore,
      hiddenScore,
    },
  }
}
