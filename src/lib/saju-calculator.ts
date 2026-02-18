import type { Pillar } from '@/types/saju'
import {
  CHEONGAN, JIJI,
  CHEONGAN_HANJA, JIJI_HANJA,
  CHEONGAN_ELEMENT, JIJI_ELEMENT,
  MONTH_STEM_START, HOUR_STEM_START,
  SOLAR_MONTH_START, SIJIN,
} from './constants'
import { lunarToSolar } from './lunar-calendar'

function makePillar(cheonganIdx: number, jijiIdx: number): Pillar {
  const cg = CHEONGAN[cheonganIdx % 10]
  const jj = JIJI[jijiIdx % 12]
  return {
    cheongan: cg,
    jiji: jj,
    cheonganHanja: CHEONGAN_HANJA[cg],
    jijiHanja: JIJI_HANJA[jj],
    cheonganElement: CHEONGAN_ELEMENT[cg],
    jijiElement: JIJI_ELEMENT[jj],
  }
}

// 년주 계산: (년도 - 4) % 60 으로 60갑자 인덱스
function calcYearPillar(year: number): Pillar {
  const idx = (year - 4) % 60
  return makePillar(idx % 10, idx % 12)
}

// 절기 기반 월 계산 (양력 기준)
function getSolarMonthIndex(solarMonth: number, solarDay: number): number {
  // 절기를 기준으로 해당 월 판단
  for (let i = SOLAR_MONTH_START.length - 1; i >= 0; i--) {
    const entry = SOLAR_MONTH_START[i]
    if (solarMonth > entry.startMonth || (solarMonth === entry.startMonth && solarDay >= entry.startDay)) {
      return entry.month
    }
  }
  // 1월 소한 이전이면 이전 해 12월
  return 12
}

// 월주 계산
function calcMonthPillar(yearStemIdx: number, solarMonth: number, solarDay: number): Pillar {
  const lunarMonthIdx = getSolarMonthIndex(solarMonth, solarDay)
  const monthStemStart = MONTH_STEM_START[yearStemIdx % 10]
  const stemIdx = (monthStemStart + (lunarMonthIdx - 1)) % 10
  // 월지는 인(2)에서 시작하여 순서대로
  const branchIdx = (lunarMonthIdx + 1) % 12
  return makePillar(stemIdx, branchIdx)
}

// 일주 계산: 기준일(1900년 1월 31일 = 갑자일)로부터의 일수 차이
function calcDayPillar(solarYear: number, solarMonth: number, solarDay: number): Pillar {
  const baseDate = new Date(1900, 0, 31) // 1900-01-31 is 갑자일 (index 0)
  const targetDate = new Date(solarYear, solarMonth - 1, solarDay)
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000)
  const idx = ((diffDays % 60) + 60) % 60
  return makePillar(idx % 10, idx % 12)
}

// 시주 계산
function calcHourPillar(dayStemIdx: number, hourCode: string): Pillar {
  const sijin = SIJIN.find(s => s.code === hourCode)
  const jijiIdx = sijin ? JIJI.indexOf(sijin.jiji) : 0
  const hourStemStart = HOUR_STEM_START[dayStemIdx % 10]
  const stemIdx = (hourStemStart + jijiIdx) % 10
  return makePillar(stemIdx, jijiIdx)
}

export interface CalculateInput {
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: string
  calendarType: 'solar' | 'lunar'
  isLeapMonth: boolean
}

export function calculateSaju(input: CalculateInput) {
  try {
    let solarYear = input.birthYear
    let solarMonth = input.birthMonth
    let solarDay = input.birthDay

    // 음력이면 양력으로 변환
    if (input.calendarType === 'lunar') {
      const solar = lunarToSolar(input.birthYear, input.birthMonth, input.birthDay, input.isLeapMonth)
      solarYear = solar.year
      solarMonth = solar.month
      solarDay = solar.day
    }

    // 절기 기준 연도 판단: 2월 입춘 이전이면 전년도
    const isBeforeLichun = solarMonth < 2 || (solarMonth === 2 && solarDay < 4)
    const sajuYear = isBeforeLichun ? solarYear - 1 : solarYear

    const yearPillar = calcYearPillar(sajuYear)
    const yearStemIdx = CHEONGAN.indexOf(yearPillar.cheongan)

    const monthPillar = calcMonthPillar(yearStemIdx, solarMonth, solarDay)

    const dayPillar = calcDayPillar(solarYear, solarMonth, solarDay)
    const dayStemIdx = CHEONGAN.indexOf(dayPillar.cheongan)

    const hourPillar = calcHourPillar(dayStemIdx, input.birthHour)

    return { yearPillar, monthPillar, dayPillar, hourPillar }
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    throw new Error(`사주 계산 중 오류가 발생했습니다: ${message}`)
  }
}
