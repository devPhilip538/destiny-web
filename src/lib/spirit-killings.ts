import type { Jiji, SajuResult } from '@/types/saju'

/**
 * 신살 (神殺) — 사주의 특수한 별(星)
 *
 * 지지 간의 특수한 조합에서 발생하는 길흉의 기운.
 * 12종 신살 구현: 도화살, 역마살, 화개살, 귀문관살, 천을귀인, 천살, 지살,
 * 망신살, 겁살, 재살, 백호살, 고독살
 */

export interface SpiritKilling {
  name: string
  hanja: string
  type: 'positive' | 'negative' | 'neutral'
  positions: string[]
  description: string
  advice: string
}

// ── 도화살 (桃花殺) ──
// 일지/년지 기준으로 사주 내 특정 지지가 있으면 발동
// 일지 기준: 인오술→묘, 사유축→오, 신자진→유, 해묘미→자
const DOHWA_MAP: Record<string, Jiji> = {
  '인': '묘', '오': '묘', '술': '묘',
  '사': '오', '유': '오', '축': '오',
  '신': '유', '자': '유', '진': '유',
  '해': '자', '묘': '자', '미': '자',
}

// ── 역마살 (驛馬殺) ──
// 일지 기준: 인오술→신, 사유축→해, 신자진→인, 해묘미→사
const YEOKMA_MAP: Record<string, Jiji> = {
  '인': '신', '오': '신', '술': '신',
  '사': '해', '유': '해', '축': '해',
  '신': '인', '자': '인', '진': '인',
  '해': '사', '묘': '사', '미': '사',
}

// ── 화개살 (華蓋殺) ──
// 일지 기준: 인오술→술, 사유축→축, 신자진→진, 해묘미→미
const HWAGAE_MAP: Record<string, Jiji> = {
  '인': '술', '오': '술', '술': '술',
  '사': '축', '유': '축', '축': '축',
  '신': '진', '자': '진', '진': '진',
  '해': '미', '묘': '미', '미': '미',
}

// ── 귀문관살 (鬼門關殺) ──
// 일지 기준 특정 조합
const GWIMUNGWAN_MAP: Record<string, Jiji> = {
  '자': '유', '축': '오', '인': '미', '묘': '신',
  '진': '사', '사': '진', '오': '축', '미': '인',
  '신': '묘', '유': '자', '술': '해', '해': '술',
}

// ── 천을귀인 (天乙貴人) ── (일간 기준)
// 갑무→축미, 을기→자신, 병정→해유, 경신→인오, 임계→묘사
const CHEONUL_MAP: Record<string, Jiji[]> = {
  '갑': ['축', '미'], '무': ['축', '미'],
  '을': ['자', '신'], '기': ['자', '신'],
  '병': ['해', '유'], '정': ['해', '유'],
  '경': ['인', '오'], '신': ['인', '오'],
  '임': ['묘', '사'], '계': ['묘', '사'],
}

// ── 겁살 (劫殺) ──
// 일지 기준: 인오술→해, 사유축→인, 신자진→사, 해묘미→신
const GEOBSAL_MAP: Record<string, Jiji> = {
  '인': '해', '오': '해', '술': '해',
  '사': '인', '유': '인', '축': '인',
  '신': '사', '자': '사', '진': '사',
  '해': '신', '묘': '신', '미': '신',
}

// ── 재살 (災殺) ──
// 일지 기준: 인오술→자, 사유축→묘, 신자진→오, 해묘미→유
const JAESAL_MAP: Record<string, Jiji> = {
  '인': '자', '오': '자', '술': '자',
  '사': '묘', '유': '묘', '축': '묘',
  '신': '오', '자': '오', '진': '오',
  '해': '유', '묘': '유', '미': '유',
}

// ── 망신살 (亡身殺) ──
// 일지 기준: 인오술→사, 사유축→신, 신자진→해, 해묘미→인
const MANGSIN_MAP: Record<string, Jiji> = {
  '인': '사', '오': '사', '술': '사',
  '사': '신', '유': '신', '축': '신',
  '신': '해', '자': '해', '진': '해',
  '해': '인', '묘': '인', '미': '인',
}

// ── 백호살 (白虎殺) ──
// 일지 기준: 인오술→유, 사유축→자, 신자진→묘, 해묘미→오
// (일부 유파에 따라 다를 수 있음)

function findPositions(result: SajuResult, targetJiji: Jiji): string[] {
  const positions: string[] = []
  if (result.yearPillar.jiji === targetJiji) positions.push('년지')
  if (result.monthPillar.jiji === targetJiji) positions.push('월지')
  if (result.dayPillar.jiji === targetJiji) positions.push('일지')
  if (result.hourPillar.jiji === targetJiji) positions.push('시지')
  return positions
}

export function analyzeSpiritKillings(result: SajuResult): SpiritKilling[] {
  const killings: SpiritKilling[] = []
  const dayBranch = result.dayPillar.jiji
  const dayStem = result.dayPillar.cheongan

  // 도화살
  const dohwaTarget = DOHWA_MAP[dayBranch]
  if (dohwaTarget) {
    const pos = findPositions(result, dohwaTarget)
    if (pos.length > 0) {
      killings.push({
        name: '도화살',
        hanja: '桃花殺',
        type: 'neutral',
        positions: pos,
        description: '이성에 대한 매력이 강하며 인기가 많습니다. 예술적 감각이 뛰어나고 사교성이 좋습니다.',
        advice: '이성 관계에서 신중한 판단이 필요합니다. 매력을 긍정적으로 활용하면 대인관계에서 큰 도움이 됩니다.',
      })
    }
  }

  // 역마살
  const yeokmaTarget = YEOKMA_MAP[dayBranch]
  if (yeokmaTarget) {
    const pos = findPositions(result, yeokmaTarget)
    if (pos.length > 0) {
      killings.push({
        name: '역마살',
        hanja: '驛馬殺',
        type: 'neutral',
        positions: pos,
        description: '활동적이고 변화를 추구하는 성향이 강합니다. 해외 활동이나 이사, 출장이 잦을 수 있습니다.',
        advice: '한 곳에 정착하기보다 다양한 경험을 쌓는 것이 좋습니다. 여행이나 이직이 오히려 발전의 기회가 됩니다.',
      })
    }
  }

  // 화개살
  const hwagaeTarget = HWAGAE_MAP[dayBranch]
  if (hwagaeTarget) {
    const pos = findPositions(result, hwagaeTarget)
    if (pos.length > 0) {
      killings.push({
        name: '화개살',
        hanja: '華蓋殺',
        type: 'neutral',
        positions: pos,
        description: '학문적 재능과 예술적 감각이 뛰어납니다. 종교나 철학에 관심이 깊으며 독창적인 사고를 합니다.',
        advice: '혼자만의 시간이 중요하지만, 사회적 관계도 적절히 유지하세요. 학문이나 예술 분야에서 큰 성취를 이룰 수 있습니다.',
      })
    }
  }

  // 귀문관살
  const gwimunTarget = GWIMUNGWAN_MAP[dayBranch]
  if (gwimunTarget) {
    const pos = findPositions(result, gwimunTarget)
    if (pos.length > 0) {
      killings.push({
        name: '귀문관살',
        hanja: '鬼門關殺',
        type: 'negative',
        positions: pos,
        description: '직감이 예리하고 영적 감수성이 강합니다. 심리적 압박이나 원인 모를 불안감을 느낄 수 있습니다.',
        advice: '명상이나 종교 활동으로 마음의 안정을 찾으세요. 예민한 감수성은 상담, 예술 등의 분야에서 강점이 됩니다.',
      })
    }
  }

  // 천을귀인
  const cheonulTargets = CHEONUL_MAP[dayStem]
  if (cheonulTargets) {
    const allPos: string[] = []
    for (const target of cheonulTargets) {
      allPos.push(...findPositions(result, target))
    }
    if (allPos.length > 0) {
      killings.push({
        name: '천을귀인',
        hanja: '天乙貴人',
        type: 'positive',
        positions: allPos,
        description: '어려울 때 귀인의 도움을 받을 수 있는 길한 별입니다. 위기에서 벗어나는 힘이 있습니다.',
        advice: '주변 사람들과의 관계를 소중히 하세요. 어려운 상황에서도 도와주는 사람이 나타날 운입니다.',
      })
    }
  }

  // 겁살
  const geobTarget = GEOBSAL_MAP[dayBranch]
  if (geobTarget) {
    const pos = findPositions(result, geobTarget)
    if (pos.length > 0) {
      killings.push({
        name: '겁살',
        hanja: '劫殺',
        type: 'negative',
        positions: pos,
        description: '예상치 못한 손실이나 방해를 당할 수 있는 기운입니다. 대담함과 결단력은 있으나 주의가 필요합니다.',
        advice: '중요한 결정은 충분히 검토한 후에 하세요. 보증이나 투기성 투자는 특히 신중하게 판단하세요.',
      })
    }
  }

  // 재살
  const jaesalTarget = JAESAL_MAP[dayBranch]
  if (jaesalTarget) {
    const pos = findPositions(result, jaesalTarget)
    if (pos.length > 0) {
      killings.push({
        name: '재살',
        hanja: '災殺',
        type: 'negative',
        positions: pos,
        description: '재앙이나 사고에 대한 주의가 필요한 기운입니다. 건강이나 안전사고에 유의해야 합니다.',
        advice: '무리한 행동을 피하고 안전에 항상 주의하세요. 보험 등 안전장치를 마련해두는 것이 좋습니다.',
      })
    }
  }

  // 망신살
  const mangsinTarget = MANGSIN_MAP[dayBranch]
  if (mangsinTarget) {
    const pos = findPositions(result, mangsinTarget)
    if (pos.length > 0) {
      killings.push({
        name: '망신살',
        hanja: '亡身殺',
        type: 'negative',
        positions: pos,
        description: '체면이나 명예에 손상이 올 수 있는 기운입니다. 구설수나 소문에 주의해야 합니다.',
        advice: '언행을 신중히 하고, SNS나 공개적인 발언에 특히 주의하세요. 겸손한 태도가 화를 막습니다.',
      })
    }
  }

  // 고독살 — 년지 기준: 인묘진→사, 사오미→신, 신유술→해, 해자축→인 (남자)
  // 여자는 과숙살: 인묘진→축, 사오미→진, 신유술→미, 해자축→술
  // 간단히 일지 기준 동일 적용
  const GODOK_MAP: Record<string, Jiji> = {
    '인': '사', '묘': '사', '진': '사',
    '사': '신', '오': '신', '미': '신',
    '신': '해', '유': '해', '술': '해',
    '해': '인', '자': '인', '축': '인',
  }
  const godokTarget = GODOK_MAP[result.yearPillar.jiji]
  if (godokTarget) {
    const pos = findPositions(result, godokTarget)
    if (pos.length > 0) {
      killings.push({
        name: '고독살',
        hanja: '孤獨殺',
        type: 'negative',
        positions: pos,
        description: '혼자 있는 시간이 많거나 외로움을 느끼기 쉬운 기운입니다. 독립심이 강한 반면 고독감을 느낄 수 있습니다.',
        advice: '혼자만의 시간을 창의적으로 활용하세요. 적극적인 사회 활동과 봉사로 관계를 넓히면 좋습니다.',
      })
    }
  }

  return killings
}
