import type { SajuResult, FiveElement, TenGodName, CareerLuckResult } from '@/types/saju'
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

function getSuitableJobs(dominant: FiveElement, careerStars: { name: TenGodName; count: number }[]): string[] {
  const baseJobs: Record<FiveElement, string[]> = {
    '목': ['교육/강의', '의료/건강', '출판/언론', '농업/원예', '환경/복지'],
    '화': ['예술/디자인', '엔터테인먼트', 'IT/미디어', '마케팅/홍보', '요리/외식'],
    '토': ['부동산', '건설/건축', '공무원', '농업/식품', '중개/유통'],
    '금': ['금융/보험', '법률/회계', '제조/기술', 'IT/엔지니어링', '군/경찰'],
    '수': ['연구/학문', '무역/물류', '서비스업', '여행/관광', '수산/해양'],
  }

  const result = [...baseJobs[dominant]]

  const hasGwan = careerStars.some(s => s.name === '정관' || s.name === '편관')
  const hasSik = careerStars.some(s => s.name === '식신' || s.name === '상관')

  if (hasGwan) result.push('관리직/공무원', '조직 리더')
  if (hasSik) result.push('프리랜서/전문직', '크리에이터')

  return result.slice(0, 7)
}

function getCareerStyle(dominant: FiveElement): string {
  const styles: Record<FiveElement, string> = {
    '목': '성장과 발전을 추구하는 스타일입니다. 꾸준한 학습과 자기계발을 통해 실력을 키워가는 타입입니다.',
    '화': '열정적이고 창의적인 업무 스타일입니다. 새로운 프로젝트에 불을 붙이고 팀에 활력을 불어넣습니다.',
    '토': '안정적이고 신뢰할 수 있는 업무 스타일입니다. 묵묵히 책임을 다하며 팀의 든든한 기둥 역할을 합니다.',
    '금': '체계적이고 효율적인 업무 스타일입니다. 명확한 목표 설정과 계획적인 실행이 강점입니다.',
    '수': '유연하고 창의적인 업무 스타일입니다. 변화에 잘 적응하며 새로운 아이디어를 제시합니다.',
  }
  return styles[dominant]
}

export function calculateCareerLuck(result: SajuResult, _birthYear: number): CareerLuckResult {
  const dayMaster = result.dayPillar.cheongan
  const dayMasterElement = CHEONGAN_ELEMENT[dayMaster]
  const dayMasterYang = YANG_STEMS.has(dayMaster)

  const pillars = [
    { pillar: result.yearPillar },
    { pillar: result.monthPillar },
    { pillar: result.dayPillar },
    { pillar: result.hourPillar },
  ]

  const starCounts = new Map<TenGodName, number>()

  for (const { pillar } of pillars) {
    const cgYang = YANG_STEMS.has(pillar.cheongan)
    const jjYang = YANG_BRANCHES.has(pillar.jiji)
    const cgTenGod = determineTenGod(dayMasterElement, dayMasterYang, pillar.cheonganElement, cgYang)
    const jjTenGod = determineTenGod(dayMasterElement, dayMasterYang, pillar.jijiElement, jjYang)

    starCounts.set(cgTenGod, (starCounts.get(cgTenGod) || 0) + 1)
    starCounts.set(jjTenGod, (starCounts.get(jjTenGod) || 0) + 1)
  }

  const careerRelated: TenGodName[] = ['정관', '편관', '식신', '상관', '정인', '편인']
  const careerStars = careerRelated
    .filter(name => (starCounts.get(name) || 0) > 0)
    .map(name => ({ name, count: starCounts.get(name)! }))

  // 승진/이직 유리 시기
  const promotionAges: number[] = []
  if (result.luckCycles) {
    for (const cycle of result.luckCycles) {
      const cgYang = YANG_STEMS.has(cycle.cheongan)
      const jjYang = YANG_BRANCHES.has(cycle.jiji)
      const cgTenGod = determineTenGod(dayMasterElement, dayMasterYang, cycle.cheonganElement, cgYang)
      const jjTenGod = determineTenGod(dayMasterElement, dayMasterYang, cycle.jijiElement, jjYang)
      if (['정관', '편관'].includes(cgTenGod) || ['정관', '편관'].includes(jjTenGod)) {
        promotionAges.push(Math.round((cycle.startAge + cycle.endAge) / 2))
      }
    }
  }

  // 현재 직장운 점수
  const currentCycle = result.luckCycles?.find(c => c.isCurrent)
  let currentCareerScore = 50
  if (currentCycle) {
    const cycleScore = getRelationScore(dayMasterElement, currentCycle.cheonganElement)
    currentCareerScore = Math.max(10, Math.min(100, 50 + cycleScore * 2))
  }
  const gwanCount = (starCounts.get('정관') || 0) + (starCounts.get('편관') || 0)
  currentCareerScore = Math.min(100, currentCareerScore + gwanCount * 8)

  const dominant = result.fiveElementBalance.dominant
  const suitableJobs = getSuitableJobs(dominant, careerStars)
  const careerStyle = getCareerStyle(dominant)
  const strengths = getCareerStrengths(dominant, careerStars)

  return {
    careerStars,
    suitableJobs,
    careerStyle,
    promotionAges,
    currentCareerScore,
    strengths,
    summary: getCareerSummary(currentCareerScore, careerStars),
    advice: getCareerAdvice(dominant),
  }
}

function getCareerStrengths(dominant: FiveElement, stars: { name: TenGodName; count: number }[]): string[] {
  const base: Record<FiveElement, string[]> = {
    '목': ['성장 지향적 마인드', '교육/코칭 능력', '인내심과 꾸준함'],
    '화': ['창의력과 표현력', '리더십과 추진력', '대인관계 능력'],
    '토': ['안정적인 업무 수행', '신뢰와 책임감', '조직 관리 능력'],
    '금': ['분석력과 판단력', '효율적인 업무 처리', '원칙과 정확성'],
    '수': ['유연한 사고력', '문제 해결 능력', '학습 능력'],
  }
  const result = [...base[dominant]]
  if (stars.some(s => s.name === '정관')) result.push('조직 내 승진에 유리')
  if (stars.some(s => s.name === '편관')) result.push('리더십과 결단력')
  if (stars.some(s => s.name === '식신')) result.push('전문 기술력')
  return result
}

function getCareerSummary(score: number, stars: { name: TenGodName; count: number }[]): string {
  const hasGwan = stars.some(s => s.name === '정관' || s.name === '편관')
  if (score >= 75) {
    if (hasGwan) return '관성이 잘 갖추어져 있어 직장운이 매우 좋습니다. 승진과 인정을 받을 기회가 많습니다.'
    return '직장운이 좋은 시기입니다. 자신의 역량을 충분히 발휘할 수 있습니다.'
  }
  if (score >= 55) return '직장운이 안정적입니다. 꾸준한 노력이 성과로 이어지는 시기입니다.'
  if (score >= 40) return '직장운은 보통입니다. 현재 위치에서 실력을 쌓는 데 집중하면 좋겠습니다.'
  return '직장운이 다소 약한 시기입니다. 이직보다는 현재 위치에서 역량을 키우는 것을 추천합니다.'
}

function getCareerAdvice(dominant: FiveElement): string {
  const advice: Record<FiveElement, string> = {
    '목': '지속적인 자기계발이 경쟁력입니다. 새로운 자격증이나 교육에 투자하세요.',
    '화': '네트워킹을 적극 활용하세요. 사람들과의 관계에서 기회가 찾아옵니다.',
    '토': '신뢰를 바탕으로 한 안정적인 커리어를 쌓아가세요. 충성심이 인정받을 것입니다.',
    '금': '전문성을 깊이 있게 파세요. 해당 분야의 전문가로 인정받으면 기회가 열립니다.',
    '수': '변화에 유연하게 대응하세요. 새로운 트렌드를 빠르게 파악하는 것이 강점입니다.',
  }
  return advice[dominant]
}
