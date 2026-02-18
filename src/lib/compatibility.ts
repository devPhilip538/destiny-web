import type { SajuResult, FiveElement } from '@/types/saju'
import { GENERATING, OVERCOMING } from './constants'

export interface CompatibilityResult {
  totalScore: number
  categories: {
    name: string
    score: number
    description: string
  }[]
  summary: string
  advice: string
}

// 천간합 (갑기, 을경, 병신, 정임, 무계)
const CHEONGAN_HARMONY = new Map([
  ['갑기', true], ['기갑', true],
  ['을경', true], ['경을', true],
  ['병신', true], ['신병', true],
  ['정임', true], ['임정', true],
  ['무계', true], ['계무', true],
])

// 지지육합 (자축, 인해, 묘술, 진유, 사신, 오미)
const JIJI_HARMONY = new Map([
  ['자축', true], ['축자', true],
  ['인해', true], ['해인', true],
  ['묘술', true], ['술묘', true],
  ['진유', true], ['유진', true],
  ['사신', true], ['신사', true],
  ['오미', true], ['미오', true],
])

function getElementRelationScore(el1: FiveElement, el2: FiveElement): number {
  if (el1 === el2) return 70
  if (GENERATING[el1] === el2 || GENERATING[el2] === el1) return 90
  if (OVERCOMING[el1] === el2 || OVERCOMING[el2] === el1) return 40
  return 60
}

export function calculateCompatibility(result1: SajuResult, result2: SajuResult): CompatibilityResult {
  // 1. 일주 오행 상성
  const dayElScore = getElementRelationScore(
    result1.dayPillar.cheonganElement,
    result2.dayPillar.cheonganElement,
  )

  // 2. 천간합 체크
  const dayHarmony = CHEONGAN_HARMONY.has(result1.dayPillar.cheongan + result2.dayPillar.cheongan)
  const harmoniesCount = [
    CHEONGAN_HARMONY.has(result1.yearPillar.cheongan + result2.yearPillar.cheongan),
    dayHarmony,
    CHEONGAN_HARMONY.has(result1.monthPillar.cheongan + result2.monthPillar.cheongan),
    CHEONGAN_HARMONY.has(result1.hourPillar.cheongan + result2.hourPillar.cheongan),
  ].filter(Boolean).length
  const cheonganScore = Math.min(100, 50 + harmoniesCount * 20)

  // 3. 지지합 체크
  const jijiHarmonies = [
    JIJI_HARMONY.has(result1.dayPillar.jiji + result2.dayPillar.jiji),
    JIJI_HARMONY.has(result1.yearPillar.jiji + result2.yearPillar.jiji),
    JIJI_HARMONY.has(result1.monthPillar.jiji + result2.monthPillar.jiji),
    JIJI_HARMONY.has(result1.hourPillar.jiji + result2.hourPillar.jiji),
  ].filter(Boolean).length
  const jijiScore = Math.min(100, 50 + jijiHarmonies * 20)

  // 4. 오행 보완도 (한 쪽이 부족한 오행을 다른 쪽이 가지고 있는지)
  const balance1 = result1.fiveElementBalance
  const balance2 = result2.fiveElementBalance
  const complementary =
    (balance1.lacking === balance2.dominant ? 25 : 0) +
    (balance2.lacking === balance1.dominant ? 25 : 0)
  const complementScore = 50 + complementary

  // 종합 점수
  const totalScore = Math.round(
    dayElScore * 0.3 + cheonganScore * 0.2 + jijiScore * 0.2 + complementScore * 0.3,
  )

  const categories = [
    {
      name: '일주 상성',
      score: dayElScore,
      description: dayElScore >= 80
        ? '두 사람의 일주 오행이 상생 관계로 서로에게 좋은 에너지를 줍니다.'
        : dayElScore >= 60
        ? '두 사람의 일주 오행이 무난한 관계입니다.'
        : '두 사람의 일주 오행이 상극 관계이지만, 긴장감이 성장의 원동력이 될 수 있습니다.',
    },
    {
      name: '천간 조화',
      score: cheonganScore,
      description: harmoniesCount >= 2
        ? '천간합이 여러 곳에서 이루어져 깊은 인연입니다.'
        : harmoniesCount === 1
        ? '천간합이 존재하여 서로 끌리는 기운이 있습니다.'
        : '천간합은 없지만, 다른 부분에서 조화를 찾을 수 있습니다.',
    },
    {
      name: '지지 조화',
      score: jijiScore,
      description: jijiHarmonies >= 2
        ? '지지합이 여러 곳에서 이루어져 실제 생활에서의 궁합이 좋습니다.'
        : jijiHarmonies === 1
        ? '지지합이 존재하여 함께 있을 때 편안함을 느낍니다.'
        : '지지합은 없지만, 서로의 노력으로 좋은 관계를 만들 수 있습니다.',
    },
    {
      name: '오행 보완',
      score: complementScore,
      description: complementary >= 40
        ? '서로의 부족한 기운을 채워주는 이상적인 조합입니다!'
        : complementary >= 20
        ? '한 쪽이 다른 쪽의 부족한 기운을 보완해줍니다.'
        : '오행 보완은 약하지만, 함께 성장할 수 있는 관계입니다.',
    },
  ]

  const summary = totalScore >= 80
    ? '천생연분! 서로에게 최고의 파트너가 될 수 있는 궁합입니다.'
    : totalScore >= 65
    ? '좋은 궁합입니다. 서로 부족한 부분을 채워줄 수 있는 관계입니다.'
    : totalScore >= 50
    ? '무난한 궁합입니다. 서로의 차이를 이해하고 존중하면 좋은 관계를 유지할 수 있습니다.'
    : '도전적인 궁합입니다. 서로의 다름을 인정하고 소통하면 오히려 강한 유대감을 가질 수 있습니다.'

  const advice = totalScore >= 70
    ? '서로의 장점을 인정하고 칭찬하면 더욱 좋은 관계가 됩니다. 감사의 표현을 자주 해보세요.'
    : totalScore >= 50
    ? '가끔 의견 충돌이 있을 수 있지만, 대화로 풀어나가면 더 단단한 관계가 됩니다.'
    : '서로의 차이점이 오히려 매력 포인트가 될 수 있습니다. 상대방의 관점을 이해하려 노력해보세요.'

  return { totalScore, categories, summary, advice }
}
