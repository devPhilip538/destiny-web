import type { Pillar, FiveElement, FiveElementBalance, Recommendations } from '@/types/saju'

const PERSONALITY_BY_ELEMENT: Record<FiveElement, string[]> = {
  '목': [
    '성장과 발전을 추구하는 진취적인 성격입니다.',
    '창의력이 풍부하고 새로운 시작을 좋아합니다.',
    '인자하고 포용력이 있어 주변 사람들에게 신뢰를 줍니다.',
  ],
  '화': [
    '열정적이고 활발한 에너지를 가지고 있습니다.',
    '예의 바르고 사교적이며 표현력이 뛰어납니다.',
    '리더십이 강하고 주변을 밝게 만드는 매력이 있습니다.',
  ],
  '토': [
    '안정적이고 신뢰감을 주는 성격입니다.',
    '중재 능력이 뛰어나고 조화를 중시합니다.',
    '성실하고 책임감이 강하며 꾸준한 노력을 합니다.',
  ],
  '금': [
    '결단력이 있고 정의감이 강한 성격입니다.',
    '섬세하고 완벽주의적인 면이 있습니다.',
    '의리가 있고 한번 시작한 일은 끝까지 해냅니다.',
  ],
  '수': [
    '지혜롭고 유연한 사고방식을 가지고 있습니다.',
    '적응력이 뛰어나고 다양한 분야에 관심이 많습니다.',
    '깊은 통찰력으로 본질을 꿰뚫어 봅니다.',
  ],
}

const FORTUNE_BY_DAY_STEM: Record<string, string[]> = {
  '갑': ['올해는 새로운 시작의 기운이 강합니다. 도전을 두려워하지 마세요.', '봄에 좋은 기회가 찾아올 수 있습니다.'],
  '을': ['부드러운 접근이 성공의 열쇠입니다. 협력 관계를 중시하세요.', '예술적 활동이 행운을 가져다 줄 수 있습니다.'],
  '병': ['활발한 에너지로 원하는 것을 이룰 수 있는 시기입니다.', '자신감을 가지되 겸손함을 잃지 마세요.'],
  '정': ['내면의 따뜻함이 주변을 감화시키는 시기입니다.', '작은 친절이 큰 행운으로 돌아올 수 있습니다.'],
  '무': ['안정적인 기반 위에 성장할 수 있는 시기입니다.', '부동산이나 토지 관련 일에 좋은 기운이 있습니다.'],
  '기': ['세심한 관리와 꾸준함이 빛을 발하는 해입니다.', '건강 관리에 특히 신경 쓰면 좋겠습니다.'],
  '경': ['강한 추진력으로 목표를 달성할 수 있습니다.', '재물운이 좋으니 투자를 고려해볼 만합니다.'],
  '신': ['섬세함과 정확함이 요구되는 시기입니다.', '기술이나 전문 분야에서 인정받을 수 있습니다.'],
  '임': ['유연하게 흐름을 타면 큰 성과를 거둘 수 있습니다.', '여행이나 이동이 행운을 가져올 수 있습니다.'],
  '계': ['조용한 내면의 힘이 빛나는 시기입니다.', '학문이나 연구 활동에 좋은 기운이 함께합니다.'],
}

const RECOMMENDATIONS_BY_ELEMENT: Record<FiveElement, Recommendations> = {
  '목': { luckyColor: '초록색, 청록색', luckyNumber: 3, luckyDirection: '동쪽', advice: '나무처럼 뿌리를 깊이 내리고 꾸준히 성장하세요. 아침 산책이 좋은 에너지를 줍니다.' },
  '화': { luckyColor: '빨간색, 주황색', luckyNumber: 7, luckyDirection: '남쪽', advice: '열정을 잘 조절하면 큰 성과를 이룰 수 있습니다. 명상이 도움이 됩니다.' },
  '토': { luckyColor: '노란색, 갈색', luckyNumber: 5, luckyDirection: '중앙', advice: '안정적인 기반을 다지는 것이 중요합니다. 규칙적인 생활이 행운을 불러옵니다.' },
  '금': { luckyColor: '흰색, 금색', luckyNumber: 9, luckyDirection: '서쪽', advice: '결단력을 발휘할 때입니다. 정리정돈이 마음의 평화를 가져다 줍니다.' },
  '수': { luckyColor: '파란색, 검은색', luckyNumber: 1, luckyDirection: '북쪽', advice: '유연한 자세가 기회를 만듭니다. 물 가까이에서 좋은 영감을 받을 수 있습니다.' },
}

export function generatePersonality(dayPillar: Pillar, balance: FiveElementBalance): string[] {
  const dayElement = dayPillar.cheonganElement
  const base = PERSONALITY_BY_ELEMENT[dayElement]

  const additional: string[] = []
  if (balance.dominant !== dayElement) {
    additional.push(`${balance.dominant}의 기운이 강하여 ${getElementTraitShort(balance.dominant)} 면도 함께 가지고 있습니다.`)
  }
  if (balance.lacking !== dayElement) {
    additional.push(`${balance.lacking}의 기운을 보충하면 더욱 균형 잡힌 삶을 살 수 있습니다.`)
  }

  return [...base, ...additional]
}

export function generateFortune(dayPillar: Pillar): string[] {
  return FORTUNE_BY_DAY_STEM[dayPillar.cheongan] ?? ['좋은 기운이 함께하는 시기입니다.']
}

export function generateRecommendations(balance: FiveElementBalance): Recommendations {
  return RECOMMENDATIONS_BY_ELEMENT[balance.lacking]
}

function getElementTraitShort(element: FiveElement): string {
  const traits: Record<FiveElement, string> = {
    '목': '진취적인',
    '화': '열정적인',
    '토': '안정적인',
    '금': '결단력 있는',
    '수': '지혜로운',
  }
  return traits[element]
}
