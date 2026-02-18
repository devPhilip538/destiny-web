import type { Cheongan, FiveElement, TenGodName, TenGodRelation, Pillar } from '@/types/saju'
import { CHEONGAN_ELEMENT, GENERATING, OVERCOMING, GENERATED_BY, OVERCOME_BY, YANG_STEMS, YANG_BRANCHES } from './constants'

/**
 * 십신(十神) 관계 계산
 * 일간(日干)을 기준으로 다른 천간/지지와의 관계를 판단
 *
 * 같은 오행:
 *   같은 음양 → 비견(比肩), 다른 음양 → 겁재(劫財)
 * 내가 생하는 오행:
 *   같은 음양 → 식신(食神), 다른 음양 → 상관(傷官)
 * 내가 극하는 오행:
 *   같은 음양 → 편재(偏財), 다른 음양 → 정재(正財)
 * 나를 극하는 오행:
 *   같은 음양 → 편관(偏官), 다른 음양 → 정관(正官)
 * 나를 생하는 오행:
 *   같은 음양 → 편인(偏印), 다른 음양 → 정인(正印)
 */

function isYang(stem: Cheongan): boolean {
  return YANG_STEMS.has(stem)
}

function isYangStemOrBranch(isStem: boolean, value: string): boolean {
  if (isStem) {
    return YANG_STEMS.has(value as Cheongan)
  }
  return YANG_BRANCHES.has(value as never)
}

function determineTenGod(
  dayMasterElement: FiveElement,
  dayMasterYang: boolean,
  targetElement: FiveElement,
  targetYang: boolean,
): TenGodName {
  const samePolarity = dayMasterYang === targetYang

  if (targetElement === dayMasterElement) {
    return samePolarity ? '비견' : '겁재'
  }
  if (targetElement === GENERATING[dayMasterElement]) {
    return samePolarity ? '식신' : '상관'
  }
  if (targetElement === OVERCOMING[dayMasterElement]) {
    return samePolarity ? '편재' : '정재'
  }
  if (targetElement === OVERCOME_BY[dayMasterElement]) {
    return samePolarity ? '편관' : '정관'
  }
  if (targetElement === GENERATED_BY[dayMasterElement]) {
    return samePolarity ? '편인' : '정인'
  }

  return '비견' // fallback
}

export function calculateTenGods(
  dayPillar: Pillar,
  yearPillar: Pillar,
  monthPillar: Pillar,
  hourPillar: Pillar,
): TenGodRelation[] {
  const dayMaster = dayPillar.cheongan
  const dayMasterElement = CHEONGAN_ELEMENT[dayMaster]
  const dayMasterYang = isYang(dayMaster)

  const positions = [
    { name: '년주', pillar: yearPillar },
    { name: '월주', pillar: monthPillar },
    { name: '일주', pillar: dayPillar },
    { name: '시주', pillar: hourPillar },
  ]

  return positions.map(({ name, pillar }) => {
    const cgYang = isYangStemOrBranch(true, pillar.cheongan)
    const jjYang = isYangStemOrBranch(false, pillar.jiji)

    return {
      position: name,
      cheongan: pillar.cheongan,
      jiji: pillar.jiji,
      cheonganTenGod: name === '일주'
        ? '비견' // 일간 자체는 항상 비견 (자기 자신)
        : determineTenGod(dayMasterElement, dayMasterYang, pillar.cheonganElement, cgYang),
      jijiTenGod: determineTenGod(dayMasterElement, dayMasterYang, pillar.jijiElement, jjYang),
    }
  })
}

export const TEN_GOD_DESCRIPTIONS: Record<TenGodName, string> = {
  '비견': '나와 같은 기운. 독립심, 자존심, 경쟁심을 나타냅니다.',
  '겁재': '나와 비슷하지만 다른 기운. 욕심, 승부욕, 도전 정신을 나타냅니다.',
  '식신': '내가 만들어내는 기운. 재능, 여유, 낙천적 성향을 나타냅니다.',
  '상관': '내가 표현하는 기운. 창의성, 반항심, 예술적 감각을 나타냅니다.',
  '편재': '내가 다스리는 재물. 사업수완, 투자 감각, 활동성을 나타냅니다.',
  '정재': '내가 지키는 재물. 근면, 절약, 안정적 재물운을 나타냅니다.',
  '편관': '나를 제어하는 기운. 권위, 리더십, 카리스마를 나타냅니다.',
  '정관': '나를 바로잡는 기운. 명예, 책임감, 사회적 지위를 나타냅니다.',
  '편인': '나를 키우는 기운. 학문, 특수 재능, 비범한 사고력을 나타냅니다.',
  '정인': '나를 보살피는 기운. 학업, 어머니의 사랑, 지식욕을 나타냅니다.',
}
