import type { LuckCyclePeriod, Cheongan, Jiji } from '@/types/saju'
import { CHEONGAN, JIJI, CHEONGAN_HANJA, JIJI_HANJA, CHEONGAN_ELEMENT, JIJI_ELEMENT } from './constants'

/**
 * 대운(大運) 계산
 * - 남자 양간(甲丙戊庚壬) / 여자 음간(乙丁己辛癸) → 순행
 * - 남자 음간 / 여자 양간 → 역행
 * - 월주를 기준으로 순행/역행하여 10년 단위 대운 산출
 */

const YANG_STEMS = new Set<Cheongan>(['갑', '병', '무', '경', '임'])

export function calculateLuckCycles(
  gender: 'male' | 'female',
  yearStem: Cheongan,
  monthStem: Cheongan,
  monthBranch: Jiji,
  birthYear: number,
  birthMonth?: number,
  birthDay?: number,
  currentAge?: number,
): LuckCyclePeriod[] {
  const isYangStem = YANG_STEMS.has(yearStem)
  const isForward = (gender === 'male' && isYangStem) || (gender === 'female' && !isYangStem)

  const monthStemIdx = CHEONGAN.indexOf(monthStem)
  const monthBranchIdx = JIJI.indexOf(monthBranch)

  // 대운 시작 나이 계산: 생일부터 가장 가까운 절기까지의 일수 / 3 (반올림)
  // 절기 간격: 약 30일, 3일 = 1년으로 환산
  // 간단 근사: 생월 기준으로 절기까지의 거리 추정
  let startAge = 3 // 기본값
  if (birthMonth && birthDay) {
    // 절기 시작일 (양력 기준 근사)
    const solarTermDays = [4, 6, 5, 6, 6, 7, 7, 8, 8, 7, 7, 6] // 각 월의 절기 시작일 근사
    const termDay = solarTermDays[(birthMonth - 1) % 12]

    let daysToTerm: number
    if (isForward) {
      // 순행: 다음 절기까지의 일수
      daysToTerm = birthDay <= termDay ? termDay - birthDay : (30 - birthDay + termDay)
    } else {
      // 역행: 이전 절기까지의 일수
      daysToTerm = birthDay >= termDay ? birthDay - termDay : (birthDay + 30 - termDay)
    }
    startAge = Math.max(1, Math.round(daysToTerm / 3))
  }

  const now = new Date()
  const age = currentAge ?? (now.getFullYear() - birthYear)
  const cycles: LuckCyclePeriod[] = []

  for (let i = 0; i < 8; i++) {
    const offset = isForward ? i + 1 : -(i + 1)
    const stemIdx = ((monthStemIdx + offset) % 10 + 10) % 10
    const branchIdx = ((monthBranchIdx + offset) % 12 + 12) % 12

    const cg = CHEONGAN[stemIdx]
    const jj = JIJI[branchIdx]
    const periodStartAge = startAge + i * 10
    const periodEndAge = periodStartAge + 9

    cycles.push({
      startAge: periodStartAge,
      endAge: periodEndAge,
      cheongan: cg,
      jiji: jj,
      cheonganHanja: CHEONGAN_HANJA[cg],
      jijiHanja: JIJI_HANJA[jj],
      cheonganElement: CHEONGAN_ELEMENT[cg],
      jijiElement: JIJI_ELEMENT[jj],
      isCurrent: age >= periodStartAge && age <= periodEndAge,
    })
  }

  return cycles
}
