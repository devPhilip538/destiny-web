import type { Jiji, FiveElement } from '@/types/saju'

/**
 * 지지 관계 (地支 關係) — 합/충/형/파/해
 *
 * 지지 간의 상호 관계는 사주 해석에서 매우 중요한 요소.
 * 합(合)은 좋은 관계, 충(沖)은 충돌, 형(刑)은 형벌, 파(破)는 파괴, 해(害)는 해침
 */

// ── 육합 (六合) ──
// 두 지지가 만나 새로운 오행을 형성
export const YUKAP: [Jiji, Jiji, FiveElement][] = [
  ['자', '축', '토'],
  ['인', '해', '목'],
  ['묘', '술', '화'],
  ['진', '유', '금'],
  ['사', '신', '수'],
  ['오', '미', '화'],
]

// ── 삼합 (三合) ──
// 세 지지가 모여 하나의 오행국을 이룸 (가장 강력한 합)
export const SAMHAP: [Jiji, Jiji, Jiji, FiveElement][] = [
  ['신', '자', '진', '수'],  // 신자진 → 수국
  ['해', '묘', '미', '목'],  // 해묘미 → 목국
  ['인', '오', '술', '화'],  // 인오술 → 화국
  ['사', '유', '축', '금'],  // 사유축 → 금국
]

// ── 반합 (半合) — 삼합 중 두 개만 있는 경우
export const BANHAP: [Jiji, Jiji, FiveElement][] = [
  ['신', '자', '수'], ['자', '진', '수'],
  ['해', '묘', '목'], ['묘', '미', '목'],
  ['인', '오', '화'], ['오', '술', '화'],
  ['사', '유', '금'], ['유', '축', '금'],
]

// ── 방합 (方合) ──
// 같은 방위의 세 지지가 모여 계절 오행을 강화
export const BANGHAP: [Jiji, Jiji, Jiji, FiveElement][] = [
  ['인', '묘', '진', '목'],  // 동방 목국
  ['사', '오', '미', '화'],  // 남방 화국
  ['신', '유', '술', '금'],  // 서방 금국
  ['해', '자', '축', '수'],  // 북방 수국
]

// ── 충 (沖) — 정면 충돌 ──
export const CHUNG: [Jiji, Jiji][] = [
  ['자', '오'],
  ['축', '미'],
  ['인', '신'],
  ['묘', '유'],
  ['진', '술'],
  ['사', '해'],
]

// ── 형 (刑) — 형벌, 고통 ──
export const HYUNG: [Jiji, Jiji, string][] = [
  ['인', '사', '무은지형'],    // 인사형 — 은혜를 모르는 형벌
  ['사', '신', '무은지형'],
  ['신', '인', '무은지형'],
  ['축', '술', '무은지형'],    // 축술미 삼형 — 세력다툼
  ['술', '미', '무은지형'],
  ['미', '축', '무은지형'],
  ['자', '묘', '무례지형'],    // 자묘형 — 예의 없는 형벌
  ['묘', '자', '무례지형'],
  ['진', '진', '자형'],        // 자형 — 스스로를 해치는 형벌
  ['오', '오', '자형'],
  ['유', '유', '자형'],
  ['해', '해', '자형'],
]

// ── 파 (破) — 파괴, 부서짐 ──
export const PA: [Jiji, Jiji][] = [
  ['자', '유'],
  ['축', '진'],
  ['인', '해'],
  ['묘', '오'],
  ['신', '사'],
  ['미', '술'],
]

// ── 해 (害) — 해침, 원한 ──
export const HAE: [Jiji, Jiji][] = [
  ['자', '미'],
  ['축', '오'],
  ['인', '사'],
  ['묘', '진'],
  ['신', '해'],
  ['유', '술'],
]

// ── 분석 함수들 ──

export interface BranchRelation {
  type: '육합' | '삼합' | '반합' | '방합' | '충' | '형' | '파' | '해'
  branches: Jiji[]
  positions: string[]
  resultElement?: FiveElement
  description: string
  isPositive: boolean
  detail?: string
}

function checkPairRelation(b1: Jiji, b2: Jiji, pairs: [Jiji, Jiji][]): boolean {
  return pairs.some(([a, b]) => (a === b1 && b === b2) || (a === b2 && b === b1))
}

export function analyzeBranchRelations(
  yearBranch: Jiji,
  monthBranch: Jiji,
  dayBranch: Jiji,
  hourBranch: Jiji,
): BranchRelation[] {
  const branches: { jiji: Jiji; position: string }[] = [
    { jiji: yearBranch, position: '년지' },
    { jiji: monthBranch, position: '월지' },
    { jiji: dayBranch, position: '일지' },
    { jiji: hourBranch, position: '시지' },
  ]

  const relations: BranchRelation[] = []

  // 육합 체크
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const match = YUKAP.find(([a, b]) =>
        (a === branches[i].jiji && b === branches[j].jiji) ||
        (b === branches[i].jiji && a === branches[j].jiji)
      )
      if (match) {
        relations.push({
          type: '육합',
          branches: [branches[i].jiji, branches[j].jiji],
          positions: [branches[i].position, branches[j].position],
          resultElement: match[2],
          description: `${branches[i].position}(${branches[i].jiji})와 ${branches[j].position}(${branches[j].jiji})이 육합하여 ${match[2]}의 기운을 형성합니다.`,
          isPositive: true,
        })
      }
    }
  }

  // 삼합 체크
  const jijiSet = new Set(branches.map(b => b.jiji))
  for (const [a, b, c, element] of SAMHAP) {
    if (jijiSet.has(a) && jijiSet.has(b) && jijiSet.has(c)) {
      const positions = branches.filter(br => br.jiji === a || br.jiji === b || br.jiji === c).map(br => br.position)
      relations.push({
        type: '삼합',
        branches: [a, b, c],
        positions,
        resultElement: element,
        description: `${a}${b}${c} 삼합으로 ${element}국이 형성되어 ${element}의 기운이 매우 강합니다.`,
        isPositive: true,
      })
    }
  }

  // 반합 체크 (삼합이 없을 때만)
  if (!relations.some(r => r.type === '삼합')) {
    for (const [a, b, element] of BANHAP) {
      if (jijiSet.has(a) && jijiSet.has(b)) {
        const posA = branches.find(br => br.jiji === a)!
        const posB = branches.find(br => br.jiji === b)!
        relations.push({
          type: '반합',
          branches: [a, b],
          positions: [posA.position, posB.position],
          resultElement: element,
          description: `${a}${b} 반합으로 ${element}의 기운이 부분적으로 형성됩니다.`,
          isPositive: true,
        })
      }
    }
  }

  // 충 체크
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (checkPairRelation(branches[i].jiji, branches[j].jiji, CHUNG)) {
        relations.push({
          type: '충',
          branches: [branches[i].jiji, branches[j].jiji],
          positions: [branches[i].position, branches[j].position],
          description: `${branches[i].position}(${branches[i].jiji})와 ${branches[j].position}(${branches[j].jiji})이 충(沖)하여 불안정한 기운이 있습니다.`,
          isPositive: false,
        })
      }
    }
  }

  // 형 체크
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const match = HYUNG.find(([a, b]) => a === branches[i].jiji && b === branches[j].jiji)
      if (match) {
        relations.push({
          type: '형',
          branches: [branches[i].jiji, branches[j].jiji],
          positions: [branches[i].position, branches[j].position],
          description: `${branches[i].position}(${branches[i].jiji})와 ${branches[j].position}(${branches[j].jiji})이 형(刑)을 이룹니다.`,
          isPositive: false,
          detail: match[2],
        })
      }
    }
  }

  // 자형 (같은 지지가 두 개 이상)
  for (const [a] of HYUNG.filter(([, , t]) => t === '자형')) {
    const count = branches.filter(b => b.jiji === a).length
    if (count >= 2) {
      relations.push({
        type: '형',
        branches: [a],
        positions: branches.filter(b => b.jiji === a).map(b => b.position),
        description: `${a}(이)가 중복되어 자형(自刑)을 이룹니다. 스스로를 힘들게 하는 기운이 있습니다.`,
        isPositive: false,
        detail: '자형',
      })
    }
  }

  // 파 체크
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (checkPairRelation(branches[i].jiji, branches[j].jiji, PA)) {
        relations.push({
          type: '파',
          branches: [branches[i].jiji, branches[j].jiji],
          positions: [branches[i].position, branches[j].position],
          description: `${branches[i].position}(${branches[i].jiji})와 ${branches[j].position}(${branches[j].jiji})이 파(破)를 이루어 계획이 흔들릴 수 있습니다.`,
          isPositive: false,
        })
      }
    }
  }

  // 해 체크
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (checkPairRelation(branches[i].jiji, branches[j].jiji, HAE)) {
        relations.push({
          type: '해',
          branches: [branches[i].jiji, branches[j].jiji],
          positions: [branches[i].position, branches[j].position],
          description: `${branches[i].position}(${branches[i].jiji})와 ${branches[j].position}(${branches[j].jiji})이 해(害)를 이루어 인간관계에 주의가 필요합니다.`,
          isPositive: false,
        })
      }
    }
  }

  return relations
}

/**
 * 사주에 충이 있는지 간단 체크
 */
export function hasChung(b1: Jiji, b2: Jiji): boolean {
  return checkPairRelation(b1, b2, CHUNG)
}

/**
 * 사주에 합이 있는지 간단 체크
 */
export function hasYukap(b1: Jiji, b2: Jiji): boolean {
  return YUKAP.some(([a, b]) => (a === b1 && b === b2) || (b === b1 && a === b2))
}
