import type { FiveElement, SajuResult, TenGodName } from '@/types/saju'
import { CHEONGAN_ELEMENT, YANG_STEMS, GENERATING, OVERCOMING, GENERATED_BY, OVERCOME_BY } from './constants'
import { analyzeDayMasterStrength } from './day-master-strength'
import { HIDDEN_STEMS } from './hidden-stems'

/**
 * 격국 (格局) — 사주의 구조/패턴 분류
 *
 * 월지의 지장간 본기가 일간과 어떤 관계인지로 격국을 결정
 * 크게 정격(내격)과 특수격(외격)으로 나뉨
 *
 * 정격 8가지:
 * - 정관격, 편관격(칠살격)
 * - 정인격, 편인격
 * - 정재격, 편재격
 * - 식신격, 상관격
 *
 * 특수격:
 * - 종격(從格): 일간이 극약해서 따라가는 격
 *   - 종재격: 재성을 따름
 *   - 종관격: 관성을 따름
 *   - 종아격: 식상을 따름
 * - 건록격: 월지가 일간의 건록지
 * - 양인격: 월지가 일간의 양인지
 */

export type ChartPatternType =
  | '정관격' | '편관격' | '정인격' | '편인격'
  | '정재격' | '편재격' | '식신격' | '상관격'
  | '건록격' | '양인격'
  | '종재격' | '종관격' | '종아격'

export interface ChartPattern {
  type: ChartPatternType
  category: '정격' | '특수격'
  description: string
  personality: string[]
  strengths: string[]
  weaknesses: string[]
  advice: string
}

// 건록지 매핑: 천간 → 지지
const GEONROK_MAP: Record<string, string> = {
  '갑': '인', '을': '묘', '병': '사', '정': '오', '무': '사',
  '기': '오', '경': '신', '신': '유', '임': '해', '계': '자',
}

// 양인지 매핑: 천간 → 지지
const YANGIN_MAP: Record<string, string> = {
  '갑': '묘', '을': '인', '병': '오', '정': '사', '무': '오',
  '기': '사', '경': '유', '신': '신', '임': '자', '계': '해',
}

function determineTenGodForElement(
  dayMasterElement: FiveElement,
  dayMasterYang: boolean,
  targetElement: FiveElement,
  targetYang: boolean,
): TenGodName {
  const samePolarity = dayMasterYang === targetYang
  if (targetElement === dayMasterElement) return samePolarity ? '비견' : '겁재'
  if (targetElement === GENERATING[dayMasterElement]) return samePolarity ? '식신' : '상관'
  if (targetElement === OVERCOMING[dayMasterElement]) return samePolarity ? '편재' : '정재'
  if (targetElement === OVERCOME_BY[dayMasterElement]) return samePolarity ? '편관' : '정관'
  if (targetElement === GENERATED_BY[dayMasterElement]) return samePolarity ? '편인' : '정인'
  return '비견'
}

export function analyzeChartPattern(result: SajuResult): ChartPattern {
  const dayStem = result.dayPillar.cheongan
  const dayMasterElement = CHEONGAN_ELEMENT[dayStem]
  const dayMasterYang = YANG_STEMS.has(dayStem)
  const monthBranch = result.monthPillar.jiji
  const dma = analyzeDayMasterStrength(result)

  // 특수격 체크: 종격 (일간이 극약)
  if (dma.strengthLevel === '극약') {
    // 가장 많은 십신 유형으로 종격 결정
    const elements = [
      result.yearPillar.cheonganElement, result.yearPillar.jijiElement,
      result.monthPillar.cheonganElement, result.monthPillar.jijiElement,
      result.hourPillar.cheonganElement, result.hourPillar.jijiElement,
    ]
    let wealthCount = 0, powerCount = 0, outputCount = 0
    for (const el of elements) {
      if (el === OVERCOMING[dayMasterElement]) wealthCount++
      if (el === OVERCOME_BY[dayMasterElement]) powerCount++
      if (el === GENERATING[dayMasterElement]) outputCount++
    }

    if (wealthCount >= powerCount && wealthCount >= outputCount) {
      return getPatternInfo('종재격')
    }
    if (powerCount >= wealthCount && powerCount >= outputCount) {
      return getPatternInfo('종관격')
    }
    return getPatternInfo('종아격')
  }

  // 건록격/양인격 체크
  if (GEONROK_MAP[dayStem] === monthBranch) {
    return getPatternInfo('건록격')
  }
  if (YANGIN_MAP[dayStem] === monthBranch) {
    return getPatternInfo('양인격')
  }

  // 정격: 월지 본기의 십신으로 결정
  const mainHidden = HIDDEN_STEMS[monthBranch][0]
  const mainYang = YANG_STEMS.has(mainHidden.stem)
  const tenGod = determineTenGodForElement(dayMasterElement, dayMasterYang, mainHidden.element, mainYang)

  const patternMap: Record<TenGodName, ChartPatternType> = {
    '정관': '정관격', '편관': '편관격',
    '정인': '정인격', '편인': '편인격',
    '정재': '정재격', '편재': '편재격',
    '식신': '식신격', '상관': '상관격',
    '비견': '건록격', '겁재': '양인격',
  }

  return getPatternInfo(patternMap[tenGod])
}

function getPatternInfo(type: ChartPatternType): ChartPattern {
  const patterns: Record<ChartPatternType, Omit<ChartPattern, 'type'>> = {
    '정관격': {
      category: '정격',
      description: '정관격은 명예와 질서를 중시하는 격입니다. 사회적 규범을 잘 따르고 조직 내에서 인정받는 사주입니다.',
      personality: ['책임감이 강함', '규칙을 중시', '사회적 지위를 추구', '보수적이고 안정 지향'],
      strengths: ['조직 관리 능력', '높은 도덕성', '안정적인 커리어', '신뢰를 얻는 능력'],
      weaknesses: ['융통성 부족', '변화에 대한 두려움', '자기 표현이 약할 수 있음'],
      advice: '원칙을 지키되 유연성도 갖추세요. 때로는 새로운 시도가 큰 성장을 가져옵니다.',
    },
    '편관격': {
      category: '정격',
      description: '편관격(칠살격)은 권위와 리더십의 격입니다. 강한 추진력과 카리스마를 가지며 도전적인 사주입니다.',
      personality: ['강한 리더십', '결단력 있음', '카리스마', '도전 정신'],
      strengths: ['위기 대처 능력', '추진력', '독립적 사고', '승부사 기질'],
      weaknesses: ['독선적일 수 있음', '스트레스에 취약', '인간관계 마찰'],
      advice: '강한 추진력을 유연함과 조화시키세요. 주변의 의견을 경청하면 더 큰 성과를 냅니다.',
    },
    '정인격': {
      category: '정격',
      description: '정인격은 학문과 지혜의 격입니다. 학습 능력이 뛰어나고 지적 호기심이 강한 사주입니다.',
      personality: ['학구적', '인자함', '배려심', '전통을 중시'],
      strengths: ['학습 능력', '깊은 사고력', '좋은 판단력', '인덕이 있음'],
      weaknesses: ['우유부단할 수 있음', '실행력 부족', '지나친 의존심'],
      advice: '알고 있는 것을 실행에 옮기세요. 행동이 따라야 지식이 빛을 발합니다.',
    },
    '편인격': {
      category: '정격',
      description: '편인격은 특수한 재능과 비범한 사고의 격입니다. 독특한 관점과 창의력을 가진 사주입니다.',
      personality: ['독창적', '비범한 사고', '예술적 감각', '신비로운 분야에 관심'],
      strengths: ['창의력', '특수 분야 재능', '직관력', '독립적 연구 능력'],
      weaknesses: ['현실 감각 부족', '고독감', '변덕스러울 수 있음'],
      advice: '독특한 재능을 살릴 수 있는 전문 분야를 찾으세요. 현실적인 균형도 중요합니다.',
    },
    '정재격': {
      category: '정격',
      description: '정재격은 근면과 안정적 재물의 격입니다. 성실하게 재산을 모으고 관리하는 사주입니다.',
      personality: ['근면성실', '절약 정신', '계획적', '현실적'],
      strengths: ['재무 관리 능력', '안정적 수입', '꾸준한 노력', '신뢰성'],
      weaknesses: ['모험을 피함', '지나친 계산', '인색할 수 있음'],
      advice: '안정적인 토대 위에서 때로는 과감한 투자도 필요합니다. 인간관계에도 투자하세요.',
    },
    '편재격': {
      category: '정격',
      description: '편재격은 사업수완과 활동력의 격입니다. 돈을 벌고 쓰는 데 대범하며 사교적인 사주입니다.',
      personality: ['활동적', '사교적', '사업 수완', '대범한 성격'],
      strengths: ['투자 감각', '넓은 인맥', '기회 포착 능력', '리스크 관리'],
      weaknesses: ['과소비 위험', '안정성 부족', '금전 관계 마찰'],
      advice: '좋은 감각을 가졌으니 리스크 관리를 철저히 하세요. 저축 습관도 중요합니다.',
    },
    '식신격': {
      category: '정격',
      description: '식신격은 재능과 여유의 격입니다. 낙천적이고 표현력이 풍부하며 복이 있는 사주입니다.',
      personality: ['낙천적', '여유로움', '재능이 많음', '미식가'],
      strengths: ['표현력', '창의력', '인복', '여유로운 삶의 태도'],
      weaknesses: ['게으를 수 있음', '안주할 수 있음', '결단력 부족'],
      advice: '재능을 연마하고 꾸준히 노력하세요. 편안함에 안주하면 기회를 놓칠 수 있습니다.',
    },
    '상관격': {
      category: '정격',
      description: '상관격은 창의성과 자유의 격입니다. 관습을 깨는 혁신적 사고와 예술적 재능의 사주입니다.',
      personality: ['창의적', '반항적', '표현 욕구 강함', '자유로운 영혼'],
      strengths: ['혁신 능력', '예술적 재능', '언변', '독창적 아이디어'],
      weaknesses: ['권위에 반발', '인간관계 충돌', '감정 기복'],
      advice: '창의력을 건설적으로 발휘하세요. 때로는 기존 질서와 타협하는 지혜도 필요합니다.',
    },
    '건록격': {
      category: '정격',
      description: '건록격은 자립과 자수성가의 격입니다. 스스로의 힘으로 일어서는 강한 사주입니다.',
      personality: ['독립적', '자수성가형', '강한 자존심', '실행력'],
      strengths: ['자립 능력', '추진력', '실행력', '끈기'],
      weaknesses: ['도움을 거부할 수 있음', '고집', '외로울 수 있음'],
      advice: '자립심은 훌륭하지만, 때로는 도움을 받는 것도 지혜입니다. 협력의 힘을 활용하세요.',
    },
    '양인격': {
      category: '정격',
      description: '양인격은 결단력과 강인함의 격입니다. 위기에 강하고 과감한 행동력의 사주입니다.',
      personality: ['과감함', '결단력', '강인한 정신', '승부사'],
      strengths: ['위기 대처', '강한 실행력', '리더십', '도전 정신'],
      weaknesses: ['공격적일 수 있음', '무모할 수 있음', '인간관계 마찰'],
      advice: '강한 에너지를 긍정적으로 사용하세요. 인내와 배려를 함께 갖추면 큰 인물이 됩니다.',
    },
    '종재격': {
      category: '특수격',
      description: '종재격은 재물을 따르는 특수한 격입니다. 재성의 기운이 강해 재물운이 독특한 사주입니다.',
      personality: ['재물에 민감', '유연한 적응력', '실리적', '현실적'],
      strengths: ['재물 운용 능력', '상황 적응력', '실리적 판단', '사업 기질'],
      weaknesses: ['주체성 약할 수 있음', '물질주의', '변동이 심함'],
      advice: '재물의 흐름을 잘 읽으세요. 용신이 일반격과 반대로 작용하니 재성이 강할 때가 좋습니다.',
    },
    '종관격': {
      category: '특수격',
      description: '종관격은 권력을 따르는 특수한 격입니다. 조직이나 권위 속에서 빛나는 사주입니다.',
      personality: ['순종적이면서 야심가', '조직 친화적', '권위를 인정', '출세 지향'],
      strengths: ['조직 적응력', '승진 운', '권력 활용 능력', '정치 감각'],
      weaknesses: ['주체성 부족', '권력에 의존', '스트레스에 취약'],
      advice: '조직 내에서 실력을 쌓으세요. 관성이 강할 때 승진과 인정의 기회가 옵니다.',
    },
    '종아격': {
      category: '특수격',
      description: '종아격은 식상(표현·재능)을 따르는 특수한 격입니다. 재능과 표현력으로 성공하는 사주입니다.',
      personality: ['재능이 풍부', '표현력 뛰어남', '자유로운 영혼', '예술가 기질'],
      strengths: ['창의력', '예술적 재능', '언변', '독창적 사고'],
      weaknesses: ['현실 감각 부족', '변덕', '경제적 불안정'],
      advice: '재능을 충분히 발휘하세요. 식상이 강한 시기에 큰 성취를 이룰 수 있습니다.',
    },
  }

  return { type, ...patterns[type] }
}
