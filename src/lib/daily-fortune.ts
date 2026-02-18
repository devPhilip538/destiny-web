import type { Pillar, FiveElement } from '@/types/saju'
import { CHEONGAN, JIJI, CHEONGAN_HANJA, JIJI_HANJA, CHEONGAN_ELEMENT, JIJI_ELEMENT, GENERATING, OVERCOMING } from './constants'

// 오늘 날짜의 일주(간지) 계산
export function getTodayPillar(): { cheongan: string; jiji: string; cheonganHanja: string; jijiHanja: string; cheonganElement: FiveElement; jijiElement: FiveElement } {
  const baseDate = new Date(1900, 0, 31) // 갑자일 기준
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.floor((today.getTime() - baseDate.getTime()) / 86400000)
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

function getRelationScore(myElement: FiveElement, todayElement: FiveElement): number {
  if (myElement === todayElement) return 15 // 비화 (같은 오행)
  if (GENERATING[myElement] === todayElement) return 10 // 내가 생하는
  if (GENERATING[todayElement] === myElement) return 20 // 나를 생하는 (가장 좋음)
  if (OVERCOMING[myElement] === todayElement) return 5 // 내가 극하는
  if (OVERCOMING[todayElement] === myElement) return -5 // 나를 극하는 (가장 나쁨)
  return 10
}

export interface DailyFortune {
  date: string
  todayGanji: string
  todayHanja: string
  score: number // 0~100
  summary: string
  advice: string
  todayElement: FiveElement
}

export function calculateDailyFortune(dayPillar: Pillar): DailyFortune {
  const today = getTodayPillar()
  const now = new Date()
  const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`

  // 점수 계산: 천간 관계 + 지지 관계
  const stemScore = getRelationScore(dayPillar.cheonganElement, today.cheonganElement)
  const branchScore = getRelationScore(dayPillar.jijiElement, today.jijiElement)

  // 날짜 기반 시드로 약간의 변동 추가
  const daySeed = (now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()) % 20
  const rawScore = 50 + stemScore + branchScore + (daySeed - 10)
  const score = Math.max(10, Math.min(100, rawScore))

  const summary = getFortuneText(score, dayPillar.cheonganElement, today.cheonganElement)
  const advice = getAdviceText(score, dayPillar.cheonganElement)

  return {
    date: dateStr,
    todayGanji: `${today.cheongan}${today.jiji}`,
    todayHanja: `${today.cheonganHanja}${today.jijiHanja}`,
    score,
    summary,
    advice,
    todayElement: today.cheonganElement,
  }
}

function getFortuneText(score: number, myEl: FiveElement, todayEl: FiveElement): string {
  if (score >= 80) {
    return `${myEl}의 기운이 ${todayEl}와 조화를 이루며 최고의 하루입니다!`
  }
  if (score >= 60) {
    return `오늘은 전반적으로 순조로운 흐름이 이어집니다.`
  }
  if (score >= 40) {
    return `평범하지만 안정적인 하루가 예상됩니다.`
  }
  return `오늘은 신중하게 행동하면 무난히 넘길 수 있습니다.`
}

function getAdviceText(score: number, myEl: FiveElement): string {
  const adviceMap: Record<FiveElement, string[]> = {
    '목': ['초록색 아이템이 행운을 가져옵니다.', '아침 산책으로 좋은 기운을 받으세요.'],
    '화': ['밝은 색 옷이 에너지를 높여줍니다.', '적극적인 소통이 기회를 만듭니다.'],
    '토': ['안정적인 일상이 힘이 됩니다.', '노란색 계열이 행운을 불러옵니다.'],
    '금': ['정리정돈으로 마음을 가다듬으세요.', '금속 액세서리가 행운의 아이템입니다.'],
    '수': ['물 가까이에서 영감을 받을 수 있습니다.', '차분한 시간이 지혜를 가져다 줍니다.'],
  }
  const idx = score >= 60 ? 0 : 1
  return adviceMap[myEl][idx]
}
