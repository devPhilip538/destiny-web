import type { Cheongan, Jiji, FiveElement } from '@/types/saju'

export const CHEONGAN: Cheongan[] = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']
export const JIJI: Jiji[] = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']

export const CHEONGAN_HANJA: Record<Cheongan, string> = {
  '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊',
  '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸',
}

export const JIJI_HANJA: Record<Jiji, string> = {
  '자': '子', '축': '丑', '인': '寅', '묘': '卯', '진': '辰', '사': '巳',
  '오': '午', '미': '未', '신': '申', '유': '酉', '술': '戌', '해': '亥',
}

export const CHEONGAN_ELEMENT: Record<Cheongan, FiveElement> = {
  '갑': '목', '을': '목', '병': '화', '정': '화', '무': '토',
  '기': '토', '경': '금', '신': '금', '임': '수', '계': '수',
}

export const JIJI_ELEMENT: Record<Jiji, FiveElement> = {
  '자': '수', '축': '토', '인': '목', '묘': '목', '진': '토', '사': '화',
  '오': '화', '미': '토', '신': '금', '유': '금', '술': '토', '해': '수',
}

export const ELEMENT_COLOR: Record<FiveElement, string> = {
  '목': '#22C55E',
  '화': '#EF4444',
  '토': '#EAB308',
  '금': '#E2E8F0',
  '수': '#3B82F6',
}

export const ELEMENT_BG_CLASS: Record<FiveElement, string> = {
  '목': 'bg-element-wood/20 text-element-wood',
  '화': 'bg-element-fire/20 text-element-fire',
  '토': 'bg-element-earth/20 text-element-earth',
  '금': 'bg-element-metal/20 text-element-metal',
  '수': 'bg-element-water/20 text-element-water',
}

export const SIJIN = [
  { code: 'ja', name: '자시', hanja: '子時', time: '23:00 ~ 01:00', jiji: '자' as Jiji },
  { code: 'chuk', name: '축시', hanja: '丑時', time: '01:00 ~ 03:00', jiji: '축' as Jiji },
  { code: 'in', name: '인시', hanja: '寅時', time: '03:00 ~ 05:00', jiji: '인' as Jiji },
  { code: 'myo', name: '묘시', hanja: '卯時', time: '05:00 ~ 07:00', jiji: '묘' as Jiji },
  { code: 'jin', name: '진시', hanja: '辰時', time: '07:00 ~ 09:00', jiji: '진' as Jiji },
  { code: 'sa', name: '사시', hanja: '巳時', time: '09:00 ~ 11:00', jiji: '사' as Jiji },
  { code: 'o', name: '오시', hanja: '午時', time: '11:00 ~ 13:00', jiji: '오' as Jiji },
  { code: 'mi', name: '미시', hanja: '未時', time: '13:00 ~ 15:00', jiji: '미' as Jiji },
  { code: 'sin', name: '신시', hanja: '申時', time: '15:00 ~ 17:00', jiji: '신' as Jiji },
  { code: 'yu', name: '유시', hanja: '酉時', time: '17:00 ~ 19:00', jiji: '유' as Jiji },
  { code: 'sul', name: '술시', hanja: '戌時', time: '19:00 ~ 21:00', jiji: '술' as Jiji },
  { code: 'hae', name: '해시', hanja: '亥時', time: '21:00 ~ 23:00', jiji: '해' as Jiji },
  { code: 'unknown', name: '모름', hanja: '', time: '', jiji: '자' as Jiji },
]

// 월간(月干) 구하기: 년간에 따른 월간 시작 인덱스
// 갑/기년 → 병인월(인덱스2), 을/경년 → 무인월(4), 병/신년 → 경인월(6), 정/임년 → 임인월(8), 무/계년 → 갑인월(0)
export const MONTH_STEM_START: Record<number, number> = {
  0: 2, // 갑
  1: 4, // 을
  2: 6, // 병
  3: 8, // 정
  4: 0, // 무
  5: 2, // 기
  6: 4, // 경
  7: 6, // 신
  8: 8, // 임
  9: 0, // 계
}

// 시간(時干) 구하기: 일간에 따른 시간 시작 인덱스
// 갑/기일 → 갑자시(0), 을/경일 → 병자시(2), 병/신일 → 무자시(4), 정/임일 → 경자시(6), 무/계일 → 임자시(8)
export const HOUR_STEM_START: Record<number, number> = {
  0: 0, // 갑
  1: 2, // 을
  2: 4, // 병
  3: 6, // 정
  4: 8, // 무
  5: 0, // 기
  6: 2, // 경
  7: 4, // 신
  8: 6, // 임
  9: 8, // 계
}

// 오행 상생 관계: 목→화→토→금→수→목
export const GENERATING: Record<FiveElement, FiveElement> = {
  '목': '화', '화': '토', '토': '금', '금': '수', '수': '목',
}

// 오행 상극 관계: 목→토→수→화→금→목
export const OVERCOMING: Record<FiveElement, FiveElement> = {
  '목': '토', '토': '수', '수': '화', '화': '금', '금': '목',
}

// 나를 생하는 오행 (상생 역방향)
export const GENERATED_BY: Record<FiveElement, FiveElement> = {
  '목': '수', '화': '목', '토': '화', '금': '토', '수': '금',
}

// 나를 극하는 오행 (상극 역방향)
export const OVERCOME_BY: Record<FiveElement, FiveElement> = {
  '목': '금', '화': '수', '토': '목', '금': '화', '수': '토',
}

// 천간의 음양 판단 (갑병무경임 = 양, 을정기신계 = 음)
export const YANG_STEMS = new Set<Cheongan>(['갑', '병', '무', '경', '임'])

// 지지의 음양 (자인진오신술 = 양, 축묘사미유해 = 음)
export const YANG_BRANCHES = new Set<Jiji>(['자', '인', '진', '오', '신', '술'])

// 절기 기반 월 시작일 (양력 기준 대략적 날짜)
export const SOLAR_MONTH_START = [
  { month: 1, startMonth: 2, startDay: 4 },   // 입춘 (인월 시작)
  { month: 2, startMonth: 3, startDay: 6 },   // 경칩
  { month: 3, startMonth: 4, startDay: 5 },   // 청명
  { month: 4, startMonth: 5, startDay: 6 },   // 입하
  { month: 5, startMonth: 6, startDay: 6 },   // 망종
  { month: 6, startMonth: 7, startDay: 7 },   // 소서
  { month: 7, startMonth: 8, startDay: 7 },   // 입추
  { month: 8, startMonth: 9, startDay: 8 },   // 백로
  { month: 9, startMonth: 10, startDay: 8 },  // 한로
  { month: 10, startMonth: 11, startDay: 7 }, // 입동
  { month: 11, startMonth: 12, startDay: 7 }, // 대설
  { month: 12, startMonth: 1, startDay: 6 },  // 소한
]
