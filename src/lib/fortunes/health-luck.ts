import type { SajuResult, FiveElement, HealthLuckResult } from '@/types/saju'
import { analyzeYongshin, getElementFavorability } from '../yongshin'

const ORGAN_MAP: Record<FiveElement, string> = {
  '목': '간/담낭',
  '화': '심장/소장',
  '토': '비장/위장',
  '금': '폐/대장',
  '수': '신장/방광',
}

function getSeason(): FiveElement {
  const month = new Date().getMonth() + 1
  if (month >= 2 && month <= 4) return '목'
  if (month >= 5 && month <= 7) return '화'
  if (month === 1 || month >= 10) return '수'
  if (month >= 8 && month <= 9) return '금'
  return '토'
}

function getOrganStatus(count: number): 'strong' | 'normal' | 'weak' | 'excess' {
  if (count >= 4) return 'excess'
  if (count >= 2) return 'strong'
  if (count === 1) return 'normal'
  return 'weak'
}

function getSeasonalAdvice(dominant: FiveElement, season: FiveElement): string {
  if (dominant === season) return '현재 계절과 주도 오행이 같아 기운이 과잉될 수 있습니다. 반대 오행의 활동으로 균형을 잡으세요.'
  const seasonNames: Record<FiveElement, string> = { '목': '봄', '화': '여름', '토': '환절기', '금': '가을', '수': '겨울' }
  return `현재 ${seasonNames[season]} 계절입니다. ${dominant}의 기운이 강한 당신은 ${ORGAN_MAP[dominant]} 관리에 특히 신경 쓰세요.`
}

export function calculateHealthLuck(result: SajuResult): HealthLuckResult {
  const balance = result.fiveElementBalance
  const elements: FiveElement[] = ['목', '화', '토', '금', '수']

  const organMapping = elements.map(el => ({
    element: el,
    organs: ORGAN_MAP[el],
    status: getOrganStatus(balance[el]),
  }))

  const weakOrgans = organMapping.filter(o => o.status === 'weak').map(o => o.organs)
  const excessOrgans = organMapping.filter(o => o.status === 'excess').map(o => o.organs)

  const season = getSeason()
  const seasonalAdvice = getSeasonalAdvice(balance.dominant, season)

  // 건강운 점수
  const weakCount = organMapping.filter(o => o.status === 'weak').length
  const excessCount = organMapping.filter(o => o.status === 'excess').length
  const normalCount = organMapping.filter(o => o.status === 'normal' || o.status === 'strong').length
  let healthScore = 70 + normalCount * 5 - weakCount * 10 - excessCount * 8

  // 용신 보정: 용신 오행의 장부는 보호, 기신 오행의 장부는 취약
  const yongshinAnalysis = analyzeYongshin(result)
  for (const organ of organMapping) {
    const fav = getElementFavorability(yongshinAnalysis, organ.element)
    // 용신 오행(+1.0) 장부는 보호 → +5, 기신 오행(-1.0) 장부는 취약 → -5
    healthScore += Math.round(fav * 5)
  }

  healthScore = Math.max(10, Math.min(100, healthScore))

  const preventionTips = getPreventionTips(balance.dominant, balance.lacking, weakOrgans)

  return {
    organMapping,
    weakOrgans,
    excessOrgans,
    seasonalAdvice,
    healthScore,
    preventionTips,
    summary: getHealthSummary(healthScore, weakOrgans, excessOrgans),
    advice: getHealthAdvice(balance.dominant, balance.lacking),
  }
}

function getPreventionTips(dominant: FiveElement, lacking: FiveElement, _weakOrgans: string[]): string[] {
  const tips: string[] = []

  const elementTips: Record<FiveElement, string[]> = {
    '목': ['간 건강을 위해 과음을 피하세요', '눈 건강에 신경 쓰세요 (블루라이트 차단)'],
    '화': ['심혈관 건강을 위해 규칙적인 유산소 운동을 하세요', '스트레스 관리가 중요합니다'],
    '토': ['위장 건강을 위해 규칙적인 식사를 하세요', '과식과 야식을 피하세요'],
    '금': ['호흡기 건강을 위해 깊은 호흡 운동을 하세요', '건조한 환경에서는 수분 보충을 하세요'],
    '수': ['신장 건강을 위해 충분한 수분 섭취를 하세요', '하체 운동으로 순환을 도우세요'],
  }

  // 부족한 오행의 장부 관리
  tips.push(...elementTips[lacking])

  // 과다한 오행의 조절
  if (dominant !== lacking) {
    const dominantAdvice: Record<FiveElement, string> = {
      '목': '과도한 활동보다는 적절한 휴식이 필요합니다',
      '화': '과열된 몸을 시원하게 관리하세요',
      '토': '소화기관에 무리가 가지 않도록 주의하세요',
      '금': '건조함을 주의하고 보습에 신경 쓰세요',
      '수': '체온 관리에 주의하고 따뜻하게 유지하세요',
    }
    tips.push(dominantAdvice[dominant])
  }

  tips.push('규칙적인 수면 습관을 유지하세요')
  return tips
}

function getHealthSummary(score: number, weakOrgans: string[], excessOrgans: string[]): string {
  if (score >= 80) return '오행이 균형 잡혀 있어 전반적인 건강운이 좋습니다. 현재 생활 습관을 잘 유지하세요.'
  if (score >= 60) {
    if (weakOrgans.length > 0) return `전반적으로 양호하지만, ${weakOrgans.join(', ')} 부위에 특히 신경 쓸 필요가 있습니다.`
    return '건강운이 양호합니다. 규칙적인 생활이 건강을 지키는 열쇠입니다.'
  }
  if (score >= 40) {
    const concerns = [...weakOrgans, ...excessOrgans].join(', ')
    return `${concerns} 관련 건강 관리가 필요합니다. 예방적 차원에서 정기 검진을 추천합니다.`
  }
  return '오행 불균형이 있어 건강 관리에 적극적으로 나설 필요가 있습니다. 전문가 상담도 고려해 보세요.'
}

function getHealthAdvice(dominant: FiveElement, lacking: FiveElement): string {
  const foodAdvice: Record<FiveElement, string> = {
    '목': '신맛 음식(레몬, 식초)과 녹색 채소',
    '화': '쓴맛 음식(커피, 녹차)과 붉은색 식품',
    '토': '단맛 음식(고구마, 호박)과 노란색 식품',
    '금': '매운 맛 음식(생강, 마늘)과 흰색 식품',
    '수': '짠맛 음식(해산물, 해조류)과 검은색 식품',
  }
  return `부족한 ${lacking}의 기운을 보충하기 위해 ${foodAdvice[lacking]}을 섭취하면 좋습니다. 과다한 ${dominant}의 기운은 절제하면서 균형을 잡아보세요.`
}
