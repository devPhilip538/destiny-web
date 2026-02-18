export type Cheongan = '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계'
export type Jiji = '자' | '축' | '인' | '묘' | '진' | '사' | '오' | '미' | '신' | '유' | '술' | '해'
export type FiveElement = '목' | '화' | '토' | '금' | '수'

export interface Pillar {
  cheongan: Cheongan
  jiji: Jiji
  cheonganHanja: string
  jijiHanja: string
  cheonganElement: FiveElement
  jijiElement: FiveElement
}

export interface SajuResult {
  yearPillar: Pillar
  monthPillar: Pillar
  dayPillar: Pillar
  hourPillar: Pillar
  fiveElementBalance: FiveElementBalance
  personality: string[]
  fortune: string[]
  recommendations: Recommendations
  luckCycles?: LuckCyclePeriod[]
  tenGods?: TenGodRelation[]
}

export interface LuckCyclePeriod {
  startAge: number
  endAge: number
  cheongan: Cheongan
  jiji: Jiji
  cheonganHanja: string
  jijiHanja: string
  cheonganElement: FiveElement
  jijiElement: FiveElement
  isCurrent: boolean
}

export type TenGodName = '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '편관' | '정관' | '편인' | '정인'

export interface TenGodRelation {
  position: string
  cheongan: Cheongan
  jiji: Jiji
  cheonganTenGod: TenGodName
  jijiTenGod: TenGodName
}

export interface FiveElementBalance {
  목: number
  화: number
  토: number
  금: number
  수: number
  dominant: FiveElement
  lacking: FiveElement
}

export interface Recommendations {
  luckyColor: string
  luckyNumber: number
  luckyDirection: string
  advice: string
}

export interface SavedReading {
  id: string
  name: string
  gender: 'male' | 'female'
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: string
  calendarType: 'solar' | 'lunar'
  result: SajuResult
  createdAt: string
}

export interface FormData {
  name: string
  gender: 'male' | 'female'
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: string
  calendarType: 'solar' | 'lunar'
  isLeapMonth: boolean
}

export type FortuneCategory =
  | 'daily' | 'weekly' | 'yearly' | 'lifetime' | 'compatibility'
  | 'marriage' | 'love' | 'finance' | 'health' | 'career'

export interface FortuneCategoryInfo {
  key: FortuneCategory
  name: string
  icon: string
  description: string
}

export interface DailyFortuneResult {
  date: string
  todayGanji: string
  todayHanja: string
  score: number
  categories: { name: string; score: number; comment: string }[]
  summary: string
  advice: string
  todayElement: FiveElement
}

export interface WeeklyFortuneResult {
  weekRange: string
  dailyScores: { date: string; ganji: string; score: number; element: FiveElement }[]
  bestDay: string
  worstDay: string
  averageScore: number
  summary: string
  advice: string
}

export interface YearlyFortuneResult {
  year: number
  yearGanji: string
  yearHanja: string
  yearElement: FiveElement
  tenGodRelation: string
  theme: string
  score: number
  currentLuckCycle: string
  monthlyOverview: { month: number; score: number; keyword: string }[]
  summary: string
  advice: string
}

export interface MarriageLuckResult {
  spouseStar: TenGodName
  spouseStarCount: number
  spouseStarPositions: string[]
  hasDoHwaSal: boolean
  doHwaSalPositions: string[]
  spouseElement: FiveElement
  spouseTraits: string[]
  marriageScore: number
  bestMarriageAges: number[]
  summary: string
  advice: string
}

export interface LoveLuckResult {
  loveStars: TenGodName[]
  loveStarCount: number
  loveStyle: string
  currentLoveScore: number
  elementInfluence: string
  strengths: string[]
  cautions: string[]
  summary: string
  advice: string
}

export interface FinanceLuckResult {
  regularWealth: number
  windfall: number
  wealthScore: number
  managementStyle: string
  bestInvestmentAges: number[]
  recommendations: string[]
  cautions: string[]
  summary: string
  advice: string
}

export interface HealthLuckResult {
  organMapping: { element: FiveElement; organs: string; status: 'strong' | 'normal' | 'weak' | 'excess' }[]
  weakOrgans: string[]
  excessOrgans: string[]
  seasonalAdvice: string
  healthScore: number
  preventionTips: string[]
  summary: string
  advice: string
}

export interface CareerLuckResult {
  careerStars: { name: TenGodName; count: number }[]
  suitableJobs: string[]
  careerStyle: string
  promotionAges: number[]
  currentCareerScore: number
  strengths: string[]
  summary: string
  advice: string
}
