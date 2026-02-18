import type { FiveElement, SajuResult, YearlyFortuneResult, TenGodName } from '@/types/saju'
import { CHEONGAN, JIJI, CHEONGAN_HANJA, JIJI_HANJA, CHEONGAN_ELEMENT, JIJI_ELEMENT, GENERATING, OVERCOMING, GENERATED_BY, OVERCOME_BY, YANG_STEMS } from '../constants'
import { getRelationScore } from './daily-fortune'

function getYearPillar(year: number) {
  const stemIdx = (year - 4) % 10
  const branchIdx = (year - 4) % 12
  const cg = CHEONGAN[stemIdx]
  const jj = JIJI[branchIdx]
  return {
    cheongan: cg,
    jiji: jj,
    cheonganHanja: CHEONGAN_HANJA[cg],
    jijiHanja: JIJI_HANJA[jj],
    cheonganElement: CHEONGAN_ELEMENT[cg],
    jijiElement: JIJI_ELEMENT[jj],
  }
}

function getTenGodRelationName(dayMasterElement: FiveElement, dayMasterYang: boolean, targetElement: FiveElement, targetYang: boolean): TenGodName {
  const samePolarity = dayMasterYang === targetYang
  if (targetElement === dayMasterElement) return samePolarity ? '비견' : '겁재'
  if (targetElement === GENERATING[dayMasterElement]) return samePolarity ? '식신' : '상관'
  if (targetElement === OVERCOMING[dayMasterElement]) return samePolarity ? '편재' : '정재'
  if (targetElement === OVERCOME_BY[dayMasterElement]) return samePolarity ? '편관' : '정관'
  if (targetElement === GENERATED_BY[dayMasterElement]) return samePolarity ? '편인' : '정인'
  return '비견'
}

function getYearTheme(tenGod: TenGodName): string {
  const themes: Record<TenGodName, string> = {
    '비견': '자기 발견과 독립의 해',
    '겁재': '도전과 경쟁의 해',
    '식신': '재능 발휘와 여유의 해',
    '상관': '창의성과 변화의 해',
    '편재': '투자와 기회의 해',
    '정재': '안정적 수입과 저축의 해',
    '편관': '리더십과 권위의 해',
    '정관': '명예와 승진의 해',
    '편인': '학문과 자기계발의 해',
    '정인': '학업과 성장의 해',
  }
  return themes[tenGod]
}

function getMonthlyKeyword(monthScore: number): string {
  if (monthScore >= 80) return '대길'
  if (monthScore >= 65) return '길'
  if (monthScore >= 50) return '보통'
  if (monthScore >= 35) return '소흉'
  return '주의'
}

export function calculateYearlyFortune(result: SajuResult, _birthYear: number): YearlyFortuneResult {
  const now = new Date()
  const currentYear = now.getFullYear()
  const yearPillar = getYearPillar(currentYear)

  const dayMasterElement = result.dayPillar.cheonganElement
  const dayMasterYang = YANG_STEMS.has(result.dayPillar.cheongan)

  const yearStemYang = YANG_STEMS.has(yearPillar.cheongan as typeof CHEONGAN[number])
  const tenGod = getTenGodRelationName(dayMasterElement, dayMasterYang, yearPillar.cheonganElement, yearStemYang)

  const stemScore = getRelationScore(dayMasterElement, yearPillar.cheonganElement)
  const branchScore = getRelationScore(result.dayPillar.jijiElement, yearPillar.jijiElement)
  const baseScore = 50 + stemScore + branchScore
  const score = Math.max(10, Math.min(100, baseScore))

  const currentLuckCycle = result.luckCycles?.find(c => c.isCurrent)
  const currentLuckStr = currentLuckCycle
    ? `${currentLuckCycle.cheongan}${currentLuckCycle.jiji}(${currentLuckCycle.cheonganHanja}${currentLuckCycle.jijiHanja}) 대운`
    : '대운 정보 없음'

  const monthlyOverview: YearlyFortuneResult['monthlyOverview'] = []
  for (let m = 1; m <= 12; m++) {
    const monthStemIdx = ((currentYear - 4) % 10 * 2 + 2 + m - 1) % 10
    const monthBranchIdx = (m + 1) % 12
    const mElement = CHEONGAN_ELEMENT[CHEONGAN[monthStemIdx]]
    const mBranchElement = JIJI_ELEMENT[JIJI[monthBranchIdx]]
    const mStemScore = getRelationScore(dayMasterElement, mElement)
    const mBranchScore = getRelationScore(result.dayPillar.jijiElement, mBranchElement)
    const monthSeed = (currentYear * 100 + m) % 15
    const mScore = Math.max(10, Math.min(100, 50 + mStemScore + mBranchScore + (monthSeed - 7)))
    monthlyOverview.push({ month: m, score: mScore, keyword: getMonthlyKeyword(mScore) })
  }

  return {
    year: currentYear,
    yearGanji: `${yearPillar.cheongan}${yearPillar.jiji}`,
    yearHanja: `${yearPillar.cheonganHanja}${yearPillar.jijiHanja}`,
    yearElement: yearPillar.cheonganElement,
    tenGodRelation: tenGod,
    theme: getYearTheme(tenGod),
    score,
    currentLuckCycle: currentLuckStr,
    monthlyOverview,
    summary: getYearlySummary(score, tenGod, currentYear),
    advice: getYearlyAdvice(tenGod),
  }
}

function getYearlySummary(score: number, tenGod: TenGodName, year: number): string {
  if (score >= 75) return `${year}년은 ${tenGod}의 기운이 작용하여 전반적으로 좋은 한 해가 될 것입니다. 새로운 시도에 좋은 시기입니다.`
  if (score >= 55) return `${year}년은 안정적인 한 해입니다. ${tenGod}의 기운 아래 꾸준한 노력이 성과로 이어집니다.`
  if (score >= 40) return `${year}년은 내면의 성장에 집중하기 좋은 해입니다. 조급해하지 말고 천천히 나아가세요.`
  return `${year}년은 인내가 필요한 해입니다. 기반을 다지는 시기로 삼으면 좋겠습니다.`
}

function getYearlyAdvice(tenGod: TenGodName): string {
  const adviceMap: Record<TenGodName, string> = {
    '비견': '자기 자신에게 투자하세요. 건강 관리와 자기계발이 중요한 해입니다.',
    '겁재': '경쟁에서 이기려 하기보다 협력의 기회를 찾으세요. 파트너십이 행운을 가져옵니다.',
    '식신': '취미와 재능을 살려보세요. 즐기는 것에서 기회가 찾아옵니다.',
    '상관': '기존의 틀을 깨는 새로운 시도가 좋습니다. 단, 인간관계에서는 언행에 주의하세요.',
    '편재': '투자와 사업에 좋은 기회가 올 수 있습니다. 단, 과욕은 금물입니다.',
    '정재': '꾸준한 저축과 안정적인 투자가 좋습니다. 지름길보다 정도를 걸으세요.',
    '편관': '리더십을 발휘할 기회가 옵니다. 책임감을 가지고 나서면 인정받습니다.',
    '정관': '승진이나 시험에 좋은 기운입니다. 규칙을 잘 지키면 좋은 결과가 따릅니다.',
    '편인': '새로운 분야의 공부나 자격증 취득에 좋습니다. 독특한 관점이 빛을 발합니다.',
    '정인': '학업과 자기계발에 최적의 해입니다. 어머니나 스승의 도움이 있을 수 있습니다.',
  }
  return adviceMap[tenGod]
}
