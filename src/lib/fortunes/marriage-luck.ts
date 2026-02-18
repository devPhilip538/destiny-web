import type { SajuResult, FiveElement, TenGodName, MarriageLuckResult } from '@/types/saju'
import { CHEONGAN_ELEMENT, GENERATING, OVERCOMING, GENERATED_BY, OVERCOME_BY, YANG_STEMS, YANG_BRANCHES } from '../constants'

function determineTenGod(dayMasterElement: FiveElement, dayMasterYang: boolean, targetElement: FiveElement, targetYang: boolean): TenGodName {
  const samePolarity = dayMasterYang === targetYang
  if (targetElement === dayMasterElement) return samePolarity ? '비견' : '겁재'
  if (targetElement === GENERATING[dayMasterElement]) return samePolarity ? '식신' : '상관'
  if (targetElement === OVERCOMING[dayMasterElement]) return samePolarity ? '편재' : '정재'
  if (targetElement === OVERCOME_BY[dayMasterElement]) return samePolarity ? '편관' : '정관'
  if (targetElement === GENERATED_BY[dayMasterElement]) return samePolarity ? '편인' : '정인'
  return '비견'
}

const DOWHASA_BRANCHES = new Set(['자', '오', '묘', '유'])

function getSpouseElement(spouseStar: TenGodName, dayMasterElement: FiveElement): FiveElement {
  if (spouseStar === '정재' || spouseStar === '편재') return OVERCOMING[dayMasterElement]
  if (spouseStar === '정관' || spouseStar === '편관') return OVERCOME_BY[dayMasterElement]
  return dayMasterElement
}

function getSpouseTraits(element: FiveElement): string[] {
  const traits: Record<FiveElement, string[]> = {
    '목': ['성장 지향적', '인내심 있는', '교육적', '부드러운 리더십'],
    '화': ['열정적', '사교적', '표현력 풍부', '에너지 넘치는'],
    '토': ['안정적', '신뢰할 수 있는', '포용력 있는', '실용적'],
    '금': ['결단력 있는', '원칙적', '깔끔한', '절약 정신'],
    '수': ['지적', '감성적', '유연한', '배려심 깊은'],
  }
  return traits[element]
}

export function calculateMarriageLuck(result: SajuResult, gender: 'male' | 'female', _birthYear: number): MarriageLuckResult {
  const dayMaster = result.dayPillar.cheongan
  const dayMasterElement = CHEONGAN_ELEMENT[dayMaster]
  const dayMasterYang = YANG_STEMS.has(dayMaster)

  // 남자: 정재(배우자성), 여자: 정관(배우자성)
  const spouseStar: TenGodName = gender === 'male' ? '정재' : '정관'

  const pillars = [
    { name: '년주', pillar: result.yearPillar },
    { name: '월주', pillar: result.monthPillar },
    { name: '일주', pillar: result.dayPillar },
    { name: '시주', pillar: result.hourPillar },
  ]

  let spouseStarCount = 0
  const spouseStarPositions: string[] = []

  for (const { name, pillar } of pillars) {
    const cgYang = YANG_STEMS.has(pillar.cheongan)
    const jjYang = YANG_BRANCHES.has(pillar.jiji)
    const cgTenGod = determineTenGod(dayMasterElement, dayMasterYang, pillar.cheonganElement, cgYang)
    const jjTenGod = determineTenGod(dayMasterElement, dayMasterYang, pillar.jijiElement, jjYang)

    if (cgTenGod === spouseStar) { spouseStarCount++; spouseStarPositions.push(`${name} 천간`) }
    if (jjTenGod === spouseStar) { spouseStarCount++; spouseStarPositions.push(`${name} 지지`) }
  }

  // 도화살 체크
  const doHwaSalPositions: string[] = []
  if (DOWHASA_BRANCHES.has(result.dayPillar.jiji)) doHwaSalPositions.push('일지')
  if (DOWHASA_BRANCHES.has(result.yearPillar.jiji)) doHwaSalPositions.push('년지')
  if (DOWHASA_BRANCHES.has(result.monthPillar.jiji)) doHwaSalPositions.push('월지')
  if (DOWHASA_BRANCHES.has(result.hourPillar.jiji)) doHwaSalPositions.push('시지')

  // 대운에서 배우자성 나타나는 시기 추정
  const bestMarriageAges: number[] = []
  if (result.luckCycles) {
    for (const cycle of result.luckCycles) {
      const cgYang = YANG_STEMS.has(cycle.cheongan)
      const jjYang = YANG_BRANCHES.has(cycle.jiji)
      const cgTenGod = determineTenGod(dayMasterElement, dayMasterYang, cycle.cheonganElement, cgYang)
      const jjTenGod = determineTenGod(dayMasterElement, dayMasterYang, cycle.jijiElement, jjYang)
      if (cgTenGod === spouseStar || jjTenGod === spouseStar) {
        const midAge = Math.round((cycle.startAge + cycle.endAge) / 2)
        bestMarriageAges.push(midAge)
      }
    }
  }

  const spouseElement = getSpouseElement(spouseStar, dayMasterElement)
  const spouseTraits = getSpouseTraits(spouseElement)

  // 결혼운 종합 점수
  let marriageScore = 50
  if (spouseStarCount === 1) marriageScore += 20
  else if (spouseStarCount >= 2) marriageScore += 15
  if (spouseStarPositions.some(p => p.includes('일주'))) marriageScore += 10
  if (doHwaSalPositions.length > 0) marriageScore += 5
  if (bestMarriageAges.length > 0) marriageScore += 5
  marriageScore = Math.min(100, marriageScore)

  return {
    spouseStar,
    spouseStarCount,
    spouseStarPositions,
    hasDoHwaSal: doHwaSalPositions.length > 0,
    doHwaSalPositions,
    spouseElement,
    spouseTraits,
    marriageScore,
    bestMarriageAges,
    summary: getMarriageSummary(marriageScore, spouseStarCount, spouseStar),
    advice: getMarriageAdvice(spouseElement, doHwaSalPositions.length > 0),
  }
}

function getMarriageSummary(score: number, _count: number, star: TenGodName): string {
  if (score >= 80) return `사주에 ${star}(이/가) 적절히 자리잡고 있어 결혼운이 매우 좋습니다. 좋은 배우자를 만날 가능성이 높습니다.`
  if (score >= 60) return `결혼운이 양호합니다. ${star}의 기운이 작용하여 안정적인 가정을 꾸릴 수 있습니다.`
  if (score >= 40) return `결혼운은 보통입니다. 때를 기다리며 자기 발전에 집중하면 좋은 인연이 찾아올 것입니다.`
  return `결혼운이 다소 약하지만, 대운의 흐름에 따라 좋은 시기가 반드시 옵니다. 조급해하지 마세요.`
}

function getMarriageAdvice(spouseEl: FiveElement, hasDoHwa: boolean): string {
  const base: Record<FiveElement, string> = {
    '목': '교육이나 성장 관련 분야에서 좋은 배우자를 만날 수 있습니다. 봄철 만남에 주목하세요.',
    '화': '사교 모임이나 문화 활동에서 인연을 만날 수 있습니다. 열정적인 만남이 기다립니다.',
    '토': '직장이나 일상적인 환경에서 자연스럽게 인연이 찾아옵니다. 신뢰를 쌓는 것이 중요합니다.',
    '금': '격식 있는 자리나 소개팅에서 좋은 인연이 있을 수 있습니다. 첫인상을 중요하게 생각하세요.',
    '수': '학업이나 지적 활동에서 마음이 맞는 사람을 만날 수 있습니다. 대화가 이어지는 관계에 주목하세요.',
  }
  const extra = hasDoHwa ? ' 도화살의 영향으로 이성에게 인기가 있으니 신중한 선택이 중요합니다.' : ''
  return base[spouseEl] + extra
}
