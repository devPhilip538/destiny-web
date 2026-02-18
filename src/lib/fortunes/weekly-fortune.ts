import type { Pillar, FiveElement, WeeklyFortuneResult } from '@/types/saju'
import { getPillarForDate, getRelationScore } from './daily-fortune'

function getMonday(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d
}

export function calculateWeeklyFortune(dayPillar: Pillar): WeeklyFortuneResult {
  const now = new Date()
  const monday = getMonday(now)
  const sunday = new Date(monday)
  sunday.setDate(sunday.getDate() + 6)

  const weekRange = `${monday.getMonth() + 1}/${monday.getDate()} ~ ${sunday.getMonth() + 1}/${sunday.getDate()}`

  const dayNames = ['월', '화', '수', '목', '금', '토', '일']
  const dailyScores: WeeklyFortuneResult['dailyScores'] = []
  let bestScore = -1
  let worstScore = 101
  let bestDay = ''
  let worstDay = ''

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    const pillar = getPillarForDate(d)

    const stemScore = getRelationScore(dayPillar.cheonganElement, pillar.cheonganElement)
    const branchScore = getRelationScore(dayPillar.jijiElement, pillar.jijiElement)

    const daySeed = (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) % 20
    const rawScore = 50 + stemScore + branchScore + (daySeed - 10)
    const score = Math.max(10, Math.min(100, rawScore))

    const dateStr = `${d.getMonth() + 1}/${d.getDate()}(${dayNames[i]})`
    dailyScores.push({
      date: dateStr,
      ganji: `${pillar.cheongan}${pillar.jiji}`,
      score,
      element: pillar.cheonganElement,
    })

    if (score > bestScore) { bestScore = score; bestDay = dateStr }
    if (score < worstScore) { worstScore = score; worstDay = dateStr }
  }

  const averageScore = Math.round(dailyScores.reduce((s, d) => s + d.score, 0) / 7)

  return {
    weekRange,
    dailyScores,
    bestDay,
    worstDay,
    averageScore,
    summary: getWeeklySummary(averageScore, dayPillar.cheonganElement),
    advice: getWeeklyAdvice(averageScore, dayPillar.cheonganElement),
  }
}

function getWeeklySummary(avg: number, el: FiveElement): string {
  if (avg >= 75) return `이번 주는 ${el}의 기운이 강하게 작용하여 전반적으로 좋은 흐름이 이어집니다. 적극적으로 행동하면 좋은 결과를 얻을 수 있습니다.`
  if (avg >= 55) return '이번 주는 무난한 한 주가 될 것입니다. 꾸준한 노력이 빛을 발하는 시기입니다.'
  if (avg >= 40) return '이번 주는 다소 조용한 흐름입니다. 내면의 충전이 필요한 시기이므로 무리하지 마세요.'
  return '이번 주는 신중함이 필요합니다. 중요한 결정은 다음 주로 미루는 것이 좋겠습니다.'
}

function getWeeklyAdvice(_avg: number, el: FiveElement): string {
  const adviceMap: Record<FiveElement, string> = {
    '목': '자연 속에서 시간을 보내면 기운이 충전됩니다. 나무가 많은 곳이 행운의 장소입니다.',
    '화': '사람들과의 만남이 에너지를 높여줍니다. 밝은 색상의 옷이 행운을 불러옵니다.',
    '토': '안정적인 루틴을 유지하는 것이 중요합니다. 규칙적인 생활이 힘이 됩니다.',
    '금': '정돈된 환경이 집중력을 높여줍니다. 금요일에 중요한 약속을 잡아보세요.',
    '수': '조용한 곳에서의 사색이 좋은 아이디어를 줍니다. 물과 관련된 활동이 길합니다.',
  }
  return adviceMap[el]
}
