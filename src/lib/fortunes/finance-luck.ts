import type { SajuResult, FiveElement, TenGodName, FinanceLuckResult } from '@/types/saju'
import { CHEONGAN_ELEMENT, GENERATING, OVERCOMING, GENERATED_BY, OVERCOME_BY, YANG_STEMS, YANG_BRANCHES } from '../constants'
import { analyzeYongshin, getElementFavorability } from '../yongshin'

function determineTenGod(dayMasterElement: FiveElement, dayMasterYang: boolean, targetElement: FiveElement, targetYang: boolean): TenGodName {
  const samePolarity = dayMasterYang === targetYang
  if (targetElement === dayMasterElement) return samePolarity ? '비견' : '겁재'
  if (targetElement === GENERATING[dayMasterElement]) return samePolarity ? '식신' : '상관'
  if (targetElement === OVERCOMING[dayMasterElement]) return samePolarity ? '편재' : '정재'
  if (targetElement === OVERCOME_BY[dayMasterElement]) return samePolarity ? '편관' : '정관'
  if (targetElement === GENERATED_BY[dayMasterElement]) return samePolarity ? '편인' : '정인'
  return '비견'
}

function getManagementStyle(dominant: FiveElement): string {
  const styles: Record<FiveElement, string> = {
    '목': '성장형 투자자 — 장기적인 시각으로 투자하며, 교육이나 자기계발에 돈을 아끼지 않습니다.',
    '화': '활동형 투자자 — 트렌드에 민감하고 빠른 의사결정을 합니다. 단기 투자에 재능이 있습니다.',
    '토': '축적형 관리자 — 꾸준히 모으는 것을 좋아하며, 부동산 등 실물 자산에 관심이 많습니다.',
    '금': '절약형 관리자 — 계획적인 재무 관리를 하며, 낭비를 싫어합니다. 금융 상품에 밝습니다.',
    '수': '유동형 투자자 — 유연한 자산 운용을 하며, 다양한 분야에 분산 투자하는 경향이 있습니다.',
  }
  return styles[dominant]
}

export function calculateFinanceLuck(result: SajuResult, _birthYear: number): FinanceLuckResult {
  const dayMaster = result.dayPillar.cheongan
  const dayMasterElement = CHEONGAN_ELEMENT[dayMaster]
  const dayMasterYang = YANG_STEMS.has(dayMaster)

  const pillars = [
    { pillar: result.yearPillar },
    { pillar: result.monthPillar },
    { pillar: result.dayPillar },
    { pillar: result.hourPillar },
  ]

  let regularWealth = 0
  let windfall = 0

  for (const { pillar } of pillars) {
    const cgYang = YANG_STEMS.has(pillar.cheongan)
    const jjYang = YANG_BRANCHES.has(pillar.jiji)
    const cgTenGod = determineTenGod(dayMasterElement, dayMasterYang, pillar.cheonganElement, cgYang)
    const jjTenGod = determineTenGod(dayMasterElement, dayMasterYang, pillar.jijiElement, jjYang)

    if (cgTenGod === '정재') regularWealth++
    if (jjTenGod === '정재') regularWealth++
    if (cgTenGod === '편재') windfall++
    if (jjTenGod === '편재') windfall++
  }

  // 재물운 점수 계산
  let wealthScore = 50
  wealthScore += regularWealth * 10
  wealthScore += windfall * 8
  // 식신은 재성을 생하는 신이므로 보너스
  if (result.tenGods?.some(t => t.cheonganTenGod === '식신' || t.jijiTenGod === '식신')) wealthScore += 5

  // 용신 보정: 재성(내가 극하는) 오행이 용신이면 재물운 대폭 상승
  const yongshinAnalysis = analyzeYongshin(result)
  const wealthElement = OVERCOMING[dayMasterElement] // 재성 오행
  const wealthFav = getElementFavorability(yongshinAnalysis, wealthElement)
  wealthScore += Math.round(wealthFav * 12)

  wealthScore = Math.max(10, Math.min(100, wealthScore))

  // 대운에서 재성 나타나는 시기
  const bestInvestmentAges: number[] = []
  if (result.luckCycles) {
    for (const cycle of result.luckCycles) {
      const cgYang = YANG_STEMS.has(cycle.cheongan)
      const jjYang = YANG_BRANCHES.has(cycle.jiji)
      const cgTenGod = determineTenGod(dayMasterElement, dayMasterYang, cycle.cheonganElement, cgYang)
      const jjTenGod = determineTenGod(dayMasterElement, dayMasterYang, cycle.jijiElement, jjYang)
      if (['정재', '편재'].includes(cgTenGod) || ['정재', '편재'].includes(jjTenGod)) {
        bestInvestmentAges.push(Math.round((cycle.startAge + cycle.endAge) / 2))
      }
    }
  }

  const dominant = result.fiveElementBalance.dominant
  const managementStyle = getManagementStyle(dominant)
  const recommendations = getRecommendations(dominant, regularWealth, windfall)
  const cautions = getCautions(dominant, regularWealth, windfall)

  return {
    regularWealth,
    windfall,
    wealthScore,
    managementStyle,
    bestInvestmentAges,
    recommendations,
    cautions,
    summary: getFinanceSummary(wealthScore, regularWealth, windfall),
    advice: getFinanceAdvice(dominant),
  }
}

function getRecommendations(dominant: FiveElement, regular: number, wind: number): string[] {
  const base: Record<FiveElement, string[]> = {
    '목': ['교육 관련 투자', '성장주 장기 투자', '친환경/건강 관련 사업'],
    '화': ['IT/미디어 관련 투자', '단기 트레이딩', '문화/예술 관련 사업'],
    '토': ['부동산 투자', '적금/예금', '식품/농업 관련 사업'],
    '금': ['금융 상품 투자', '채권/안전자산', '제조/기술 관련 사업'],
    '수': ['분산 투자', '해외 투자', '유통/서비스 관련 사업'],
  }
  const result = [...base[dominant]]
  if (regular >= 2) result.push('안정적인 월급 관리를 기반으로 한 투자')
  if (wind >= 2) result.push('투기적 기회에 대한 감각 활용 (단, 리스크 관리 필수)')
  return result
}

function getCautions(dominant: FiveElement, regular: number, wind: number): string[] {
  const result: string[] = []
  if (wind >= 2 && regular === 0) result.push('안정적 수입원 확보가 우선입니다')
  if (regular === 0 && wind === 0) result.push('재성이 부족하므로 재테크보다 본업에 집중하세요')
  if (dominant === '화') result.push('충동적 소비에 주의하세요')
  if (dominant === '수') result.push('지나친 분산투자는 피하세요')
  if (dominant === '목') result.push('낙관적 전망만 믿고 투자하지 마세요')
  if (dominant === '금') result.push('지나친 절약이 기회를 놓칠 수 있습니다')
  if (dominant === '토') result.push('유동성을 확보해두는 것도 중요합니다')
  return result
}

function getFinanceSummary(score: number, _regular: number, _wind: number): string {
  if (score >= 80) return '사주에 재성이 잘 갖추어져 재물운이 매우 좋습니다. 재테크 감각이 뛰어나고 돈을 모으는 능력이 있습니다.'
  if (score >= 60) return '재물운이 양호합니다. 꾸준한 노력으로 안정적인 재산을 형성할 수 있습니다.'
  if (score >= 40) return '재물운은 보통입니다. 본업에 집중하면서 차근차근 재산을 늘려가는 것이 좋습니다.'
  return '재성이 다소 부족하지만, 대운의 흐름에 따라 재물운이 좋아지는 시기가 있습니다. 그때를 잘 활용하세요.'
}

function getFinanceAdvice(dominant: FiveElement): string {
  const advice: Record<FiveElement, string> = {
    '목': '장기적인 시각으로 투자하세요. 급하게 서두르면 손해를 볼 수 있습니다. 자기계발에 투자한 것이 결국 큰 재산이 됩니다.',
    '화': '열정적인 투자도 좋지만, 냉정한 분석도 함께 하세요. 감정에 휘둘리지 않는 투자 원칙을 세우세요.',
    '토': '부동산이나 실물 자산에 강합니다. 안정적인 자산을 기반으로 차근차근 부를 쌓아가세요.',
    '금': '계획적인 재무 관리는 장점이지만, 가끔은 과감한 투자도 필요합니다. 기회를 놓치지 마세요.',
    '수': '유연한 투자 전략이 장점입니다. 다만 핵심 자산은 안전하게 지키면서 여유 자금으로 투자하세요.',
  }
  return advice[dominant]
}
