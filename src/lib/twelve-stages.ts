import type { Cheongan, Jiji } from '@/types/saju'
import { JIJI, YANG_STEMS } from './constants'

/**
 * 12운성 (十二運星) — 오행의 생명주기 12단계
 *
 * 각 천간이 12지지를 만났을 때의 에너지 상태를 나타냄
 * 장생→목욕→관대→건록→제왕→쇠→병→사→묘→절→태→양
 *
 * 양간은 순행, 음간은 역행
 */

export type TwelveStage =
  | '장생' | '목욕' | '관대' | '건록' | '제왕'
  | '쇠' | '병' | '사' | '묘' | '절' | '태' | '양'

export const TWELVE_STAGE_ORDER: TwelveStage[] = [
  '장생', '목욕', '관대', '건록', '제왕',
  '쇠', '병', '사', '묘', '절', '태', '양',
]

// 양간의 장생지 (12운성 시작 지지)
// 갑(목양)→해, 병(화양)→인, 무(토양)→인, 경(금양)→사, 임(수양)→신
const YANG_STEM_START: Record<string, number> = {
  '갑': 11, // 해
  '병': 2,  // 인
  '무': 2,  // 인
  '경': 5,  // 사
  '임': 8,  // 신
}

// 음간의 장생지 (역행)
// 을(목음)→오, 정(화음)→유, 기(토음)→유, 신(금음)→자, 계(수음)→묘
const YIN_STEM_START: Record<string, number> = {
  '을': 6,  // 오
  '정': 9,  // 유
  '기': 9,  // 유
  '신': 0,  // 자
  '계': 3,  // 묘
}

/**
 * 특정 천간이 특정 지지를 만났을 때의 12운성 판별
 */
export function getTwelveStage(stem: Cheongan, branch: Jiji): TwelveStage {
  const branchIdx = JIJI.indexOf(branch)
  const isYang = YANG_STEMS.has(stem)

  if (isYang) {
    const startIdx = YANG_STEM_START[stem]
    const offset = ((branchIdx - startIdx) % 12 + 12) % 12
    return TWELVE_STAGE_ORDER[offset]
  } else {
    const startIdx = YIN_STEM_START[stem]
    // 음간은 역행: 장생지에서 역방향으로 진행
    const offset = ((startIdx - branchIdx) % 12 + 12) % 12
    return TWELVE_STAGE_ORDER[offset]
  }
}

/**
 * 12운성의 에너지 강도 (0.0 ~ 1.0)
 * 제왕이 가장 강하고 절이 가장 약함
 */
export const STAGE_STRENGTH: Record<TwelveStage, number> = {
  '장생': 0.7,
  '목욕': 0.5,
  '관대': 0.8,
  '건록': 0.9,
  '제왕': 1.0,
  '쇠': 0.4,
  '병': 0.3,
  '사': 0.2,
  '묘': 0.15,
  '절': 0.1,
  '태': 0.3,
  '양': 0.5,
}

/**
 * 12운성의 의미 설명
 */
export const STAGE_DESCRIPTIONS: Record<TwelveStage, string> = {
  '장생': '새로운 시작의 에너지. 탄생과 성장의 기운이 가득합니다.',
  '목욕': '정화와 변화의 시기. 기존의 것을 씻어내고 새롭게 출발합니다.',
  '관대': '성장기. 자신감이 넘치고 사회적 활동이 활발해집니다.',
  '건록': '전성기 직전. 실력이 무르익어 안정적인 성과를 냅니다.',
  '제왕': '최전성기. 에너지가 최고조에 달하며 큰 성과를 이룰 수 있습니다.',
  '쇠': '하강기 시작. 내면의 성찰이 필요한 시기입니다.',
  '병': '에너지가 약해지는 시기. 건강과 체력 관리가 중요합니다.',
  '사': '정체기. 큰 변화보다 내실을 다지는 것이 좋습니다.',
  '묘': '잠복기. 겉으로는 조용하지만 내면에서 변화가 준비됩니다.',
  '절': '가장 약한 시기. 인내와 지혜가 필요합니다.',
  '태': '새로운 씨앗이 잉태되는 시기. 미래의 가능성이 싹트고 있습니다.',
  '양': '회복기. 서서히 에너지가 충전되며 새로운 시작을 준비합니다.',
}

/**
 * 사주 네 기둥의 일간 12운성 분석
 */
export function analyzeTwelveStages(
  dayStem: Cheongan,
  yearBranch: Jiji,
  monthBranch: Jiji,
  dayBranch: Jiji,
  hourBranch: Jiji,
): { position: string; branch: Jiji; stage: TwelveStage; strength: number }[] {
  return [
    { position: '년지', branch: yearBranch, stage: getTwelveStage(dayStem, yearBranch), strength: STAGE_STRENGTH[getTwelveStage(dayStem, yearBranch)] },
    { position: '월지', branch: monthBranch, stage: getTwelveStage(dayStem, monthBranch), strength: STAGE_STRENGTH[getTwelveStage(dayStem, monthBranch)] },
    { position: '일지', branch: dayBranch, stage: getTwelveStage(dayStem, dayBranch), strength: STAGE_STRENGTH[getTwelveStage(dayStem, dayBranch)] },
    { position: '시지', branch: hourBranch, stage: getTwelveStage(dayStem, hourBranch), strength: STAGE_STRENGTH[getTwelveStage(dayStem, hourBranch)] },
  ]
}
