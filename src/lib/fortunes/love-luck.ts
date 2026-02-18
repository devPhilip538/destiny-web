import type { SajuResult, FiveElement, TenGodName, LoveLuckResult } from '@/types/saju'
import { CHEONGAN_ELEMENT, GENERATING, OVERCOMING, GENERATED_BY, OVERCOME_BY, YANG_STEMS, YANG_BRANCHES } from '../constants'
import { getRelationScore } from './daily-fortune'

function determineTenGod(dayMasterElement: FiveElement, dayMasterYang: boolean, targetElement: FiveElement, targetYang: boolean): TenGodName {
  const samePolarity = dayMasterYang === targetYang
  if (targetElement === dayMasterElement) return samePolarity ? '비견' : '겁재'
  if (targetElement === GENERATING[dayMasterElement]) return samePolarity ? '식신' : '상관'
  if (targetElement === OVERCOMING[dayMasterElement]) return samePolarity ? '편재' : '정재'
  if (targetElement === OVERCOME_BY[dayMasterElement]) return samePolarity ? '편관' : '정관'
  if (targetElement === GENERATED_BY[dayMasterElement]) return samePolarity ? '편인' : '정인'
  return '비견'
}

function getLoveStyle(dominant: FiveElement): string {
  const styles: Record<FiveElement, string> = {
    '화': '열정적이고 적극적인 연애 스타일입니다. 감정 표현이 풍부하고 로맨틱한 분위기를 즐깁니다.',
    '수': '감성적이고 깊은 연애를 추구합니다. 상대방의 마음을 잘 읽고 배려심이 깊습니다.',
    '목': '성장하는 사랑을 추구합니다. 상대방과 함께 발전해 나가는 관계를 좋아합니다.',
    '금': '진지하고 일관된 연애를 합니다. 한번 마음을 주면 끝까지 책임지는 스타일입니다.',
    '토': '안정적이고 헌신적인 연애를 합니다. 편안하고 따뜻한 관계를 만들어 갑니다.',
  }
  return styles[dominant]
}

export function calculateLoveLuck(result: SajuResult, gender: 'male' | 'female'): LoveLuckResult {
  const dayMaster = result.dayPillar.cheongan
  const dayMasterElement = CHEONGAN_ELEMENT[dayMaster]
  const dayMasterYang = YANG_STEMS.has(dayMaster)

  // 남자: 재성(정재/편재), 여자: 관성(정관/편관)
  const loveStarTypes: TenGodName[] = gender === 'male' ? ['정재', '편재'] : ['정관', '편관']

  const pillars = [
    { pillar: result.yearPillar },
    { pillar: result.monthPillar },
    { pillar: result.dayPillar },
    { pillar: result.hourPillar },
  ]

  const loveStars: TenGodName[] = []
  let loveStarCount = 0

  for (const { pillar } of pillars) {
    const cgYang = YANG_STEMS.has(pillar.cheongan)
    const jjYang = YANG_BRANCHES.has(pillar.jiji)
    const cgTenGod = determineTenGod(dayMasterElement, dayMasterYang, pillar.cheonganElement, cgYang)
    const jjTenGod = determineTenGod(dayMasterElement, dayMasterYang, pillar.jijiElement, jjYang)

    if (loveStarTypes.includes(cgTenGod)) { loveStarCount++; if (!loveStars.includes(cgTenGod)) loveStars.push(cgTenGod) }
    if (loveStarTypes.includes(jjTenGod)) { loveStarCount++; if (!loveStars.includes(jjTenGod)) loveStars.push(jjTenGod) }
  }

  const dominant = result.fiveElementBalance.dominant
  const loveStyle = getLoveStyle(dominant)

  // 현재 대운의 연애 기운 점수
  const currentCycle = result.luckCycles?.find(c => c.isCurrent)
  let currentLoveScore = 50
  if (currentCycle) {
    const cycleScore = getRelationScore(dayMasterElement, currentCycle.cheonganElement)
    currentLoveScore = Math.max(10, Math.min(100, 50 + cycleScore * 2))
  }
  if (loveStarCount >= 2) currentLoveScore = Math.min(100, currentLoveScore + 15)
  else if (loveStarCount === 1) currentLoveScore = Math.min(100, currentLoveScore + 8)

  const elementInfluence = getElementInfluence(dominant)
  const strengths = getLoveStrengths(dominant, loveStarCount)
  const cautions = getLoveCautions(dominant, loveStarCount)

  return {
    loveStars,
    loveStarCount,
    loveStyle,
    currentLoveScore,
    elementInfluence,
    strengths,
    cautions,
    summary: getLoveSummary(currentLoveScore, loveStarCount, gender),
    advice: getLoveAdvice(dominant),
  }
}

function getElementInfluence(dominant: FiveElement): string {
  const influences: Record<FiveElement, string> = {
    '목': '목의 기운이 강해 성장하는 관계를 지향합니다. 상대방의 발전을 응원하고 함께 성장하려는 모습이 매력적입니다.',
    '화': '화의 기운이 강해 열정적이고 표현력이 풍부합니다. 상대방에게 따뜻한 감정을 잘 전달합니다.',
    '토': '토의 기운이 강해 안정적인 관계를 만들어 갑니다. 신뢰할 수 있는 파트너로서 매력이 있습니다.',
    '금': '금의 기운이 강해 진지하고 깊은 관계를 추구합니다. 약속을 잘 지키고 일관성 있는 모습이 장점입니다.',
    '수': '수의 기운이 강해 감성적이고 직관적인 연애를 합니다. 상대의 감정을 잘 읽어 공감 능력이 뛰어납니다.',
  }
  return influences[dominant]
}

function getLoveStrengths(dominant: FiveElement, starCount: number): string[] {
  const base: Record<FiveElement, string[]> = {
    '목': ['성장 지향적 관계 형성', '인내심과 배려', '미래를 함께 계획하는 능력'],
    '화': ['풍부한 감정 표현', '적극적인 애정 표현', '함께하는 시간을 즐기는 능력'],
    '토': ['안정적인 관계 유지', '헌신과 충성', '가정적인 면모'],
    '금': ['명확한 의사소통', '약속과 신뢰', '일관된 애정 표현'],
    '수': ['감성적 교류', '깊은 공감 능력', '상대를 이해하는 직관'],
  }
  const result = [...base[dominant]]
  if (starCount >= 2) result.push('이성에 대한 자연스러운 매력')
  return result
}

function getLoveCautions(dominant: FiveElement, starCount: number): string[] {
  const base: Record<FiveElement, string[]> = {
    '목': ['지나친 이상주의', '상대에 대한 기대치가 높을 수 있음'],
    '화': ['감정 기복이 클 수 있음', '질투심에 주의'],
    '토': ['변화에 대한 두려움', '소유욕이 강할 수 있음'],
    '금': ['감정 표현이 부족할 수 있음', '완벽주의적 성향'],
    '수': ['우유부단할 수 있음', '감정에 너무 빠질 수 있음'],
  }
  const result = [...base[dominant]]
  if (starCount >= 3) result.push('이성 관계가 복잡해질 수 있으니 신중한 선택 필요')
  if (starCount === 0) result.push('연애에 소극적일 수 있으니 적극적인 자세 필요')
  return result
}

function getLoveSummary(score: number, _starCount: number, _gender: string): string {
  if (score >= 75) return '현재 애정운이 매우 좋은 시기입니다. 새로운 만남이나 기존 관계의 발전이 기대됩니다.'
  if (score >= 55) return '애정운이 안정적인 시기입니다. 자연스러운 만남을 통해 좋은 인연을 만날 수 있습니다.'
  if (score >= 40) return '애정운은 보통이지만, 자기 자신을 가꾸는 시간이 결국 좋은 인연을 부릅니다.'
  return '현재는 연애보다 자기 발전에 집중하면 좋겠습니다. 때가 되면 좋은 인연이 찾아올 것입니다.'
}

function getLoveAdvice(dominant: FiveElement): string {
  const advice: Record<FiveElement, string> = {
    '목': '상대방의 속도에 맞추어 보세요. 조급하지 않은 마음이 더 깊은 사랑을 만듭니다.',
    '화': '가끔은 한 발짝 물러서서 상대방의 이야기를 들어보세요. 경청이 사랑의 시작입니다.',
    '토': '새로운 경험을 함께 하면 관계가 더욱 풍요로워집니다. 변화를 두려워하지 마세요.',
    '금': '마음속 감정을 솔직하게 표현해 보세요. 당신의 진심이 상대에게 큰 감동을 줄 것입니다.',
    '수': '감정에 휩쓸리지 않고 이성적인 판단도 함께 하세요. 균형 잡힌 관계가 오래 갑니다.',
  }
  return advice[dominant]
}
