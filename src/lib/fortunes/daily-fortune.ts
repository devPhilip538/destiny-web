import type { Pillar, FiveElement, DailyFortuneResult, SajuResult } from '@/types/saju'
import { CHEONGAN, JIJI, CHEONGAN_HANJA, JIJI_HANJA, CHEONGAN_ELEMENT, JIJI_ELEMENT, GENERATING, OVERCOMING } from '../constants'
import { analyzeYongshin, getElementFavorability } from '../yongshin'

export function getPillarForDate(date: Date): { cheongan: string; jiji: string; cheonganHanja: string; jijiHanja: string; cheonganElement: FiveElement; jijiElement: FiveElement } {
  const baseDate = new Date(1900, 0, 31)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.floor((target.getTime() - baseDate.getTime()) / 86400000)
  const idx = ((diffDays % 60) + 60) % 60
  const cg = CHEONGAN[idx % 10]
  const jj = JIJI[idx % 12]
  return {
    cheongan: cg,
    jiji: jj,
    cheonganHanja: CHEONGAN_HANJA[cg],
    jijiHanja: JIJI_HANJA[jj],
    cheonganElement: CHEONGAN_ELEMENT[cg],
    jijiElement: JIJI_ELEMENT[jj],
  }
}

export function getTodayPillar() {
  return getPillarForDate(new Date())
}

export function getRelationScore(myElement: FiveElement, targetElement: FiveElement): number {
  if (myElement === targetElement) return 15
  if (GENERATING[myElement] === targetElement) return 10
  if (GENERATING[targetElement] === myElement) return 20
  if (OVERCOMING[myElement] === targetElement) return 5
  if (OVERCOMING[targetElement] === myElement) return -5
  return 10
}

function getCategoryScore(baseScore: number, seed: number, offset: number): number {
  const variation = ((seed * 7 + offset * 13) % 21) - 10
  return Math.max(10, Math.min(100, baseScore + variation))
}

export function calculateDailyFortune(dayPillar: Pillar): DailyFortuneResult {
  const today = getTodayPillar()
  const now = new Date()
  const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`

  const stemScore = getRelationScore(dayPillar.cheonganElement, today.cheonganElement)
  const branchScore = getRelationScore(dayPillar.jijiElement, today.jijiElement)

  const daySeed = (now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()) % 20
  const rawScore = 50 + stemScore + branchScore + (daySeed - 10)
  const score = Math.max(10, Math.min(100, rawScore))

  const categories = [
    { name: '애정운', score: getCategoryScore(score, daySeed, 1), comment: getLoveDayComment(getCategoryScore(score, daySeed, 1)) },
    { name: '금전운', score: getCategoryScore(score, daySeed, 2), comment: getFinanceDayComment(getCategoryScore(score, daySeed, 2)) },
    { name: '건강운', score: getCategoryScore(score, daySeed, 3), comment: getHealthDayComment(getCategoryScore(score, daySeed, 3)) },
    { name: '직장운', score: getCategoryScore(score, daySeed, 4), comment: getCareerDayComment(getCategoryScore(score, daySeed, 4)) },
  ]

  return {
    date: dateStr,
    todayGanji: `${today.cheongan}${today.jiji}`,
    todayHanja: `${today.cheonganHanja}${today.jijiHanja}`,
    score,
    categories,
    summary: getFortuneText(score, dayPillar.cheonganElement, today.cheonganElement),
    advice: getAdviceText(score, dayPillar.cheonganElement),
    todayElement: today.cheonganElement,
  }
}

function getLoveDayComment(score: number): string {
  if (score >= 80) return '사랑하는 사람과 좋은 시간을 보낼 수 있는 날입니다.'
  if (score >= 60) return '소소한 대화가 관계를 따뜻하게 만듭니다.'
  if (score >= 40) return '평온한 하루, 마음의 여유를 가져보세요.'
  return '감정 표현에 신중하면 좋겠습니다.'
}

function getFinanceDayComment(score: number): string {
  if (score >= 80) return '예상치 못한 금전적 이득이 있을 수 있습니다.'
  if (score >= 60) return '계획적인 소비가 좋은 결과를 가져옵니다.'
  if (score >= 40) return '큰 지출은 피하는 것이 좋겠습니다.'
  return '충동구매를 조심하세요.'
}

function getHealthDayComment(score: number): string {
  if (score >= 80) return '활력이 넘치는 하루! 운동을 즐겨보세요.'
  if (score >= 60) return '건강한 식단이 에너지를 채워줍니다.'
  if (score >= 40) return '무리하지 않는 것이 좋겠습니다.'
  return '충분한 휴식을 취하세요.'
}

function getCareerDayComment(score: number): string {
  if (score >= 80) return '업무에서 좋은 성과를 거둘 수 있습니다.'
  if (score >= 60) return '동료와의 협력이 좋은 결과를 만듭니다.'
  if (score >= 40) return '꾸준히 하던 일에 집중하세요.'
  return '중요한 결정은 내일로 미루는 것이 좋겠습니다.'
}

function getFortuneText(score: number, myEl: FiveElement, todayEl: FiveElement): string {
  if (score >= 80) return `${myEl}의 기운이 ${todayEl}와 조화를 이루며 최고의 하루입니다!`
  if (score >= 60) return '오늘은 전반적으로 순조로운 흐름이 이어집니다.'
  if (score >= 40) return '평범하지만 안정적인 하루가 예상됩니다.'
  return '오늘은 신중하게 행동하면 무난히 넘길 수 있습니다.'
}

function getAdviceText(score: number, myEl: FiveElement): string {
  const adviceMap: Record<FiveElement, string[]> = {
    '목': ['초록색 아이템이 행운을 가져옵니다.', '아침 산책으로 좋은 기운을 받으세요.'],
    '화': ['밝은 색 옷이 에너지를 높여줍니다.', '적극적인 소통이 기회를 만듭니다.'],
    '토': ['안정적인 일상이 힘이 됩니다.', '노란색 계열이 행운을 불러옵니다.'],
    '금': ['정리정돈으로 마음을 가다듬으세요.', '금속 액세서리가 행운의 아이템입니다.'],
    '수': ['물 가까이에서 영감을 받을 수 있습니다.', '차분한 시간이 지혜를 가져다 줍니다.'],
  }
  return adviceMap[myEl][score >= 60 ? 0 : 1]
}

/**
 * 용신 기반 일일 운세 계산 (고급 버전)
 * 오늘의 오행이 용신/희신이면 보너스, 기신/구신이면 페널티
 */
export function calculateDailyFortuneAdvanced(result: SajuResult): DailyFortuneResult {
  const base = calculateDailyFortune(result.dayPillar)
  const yongshinAnalysis = analyzeYongshin(result)

  const today = getTodayPillar()
  const stemFavorability = getElementFavorability(yongshinAnalysis, today.cheonganElement)
  const branchFavorability = getElementFavorability(yongshinAnalysis, today.jijiElement)

  // 용신 보정: -15 ~ +15 범위
  const yongshinBonus = Math.round((stemFavorability + branchFavorability) * 7.5)
  const adjustedScore = Math.max(10, Math.min(100, base.score + yongshinBonus))

  const adjustedCategories = base.categories.map(cat => ({
    ...cat,
    score: Math.max(10, Math.min(100, cat.score + Math.round(yongshinBonus * 0.7))),
  }))

  return {
    ...base,
    score: adjustedScore,
    categories: adjustedCategories,
  }
}
