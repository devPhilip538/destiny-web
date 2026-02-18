import type { Jiji } from '@/types/saju'

// 띠 (12지 동물)
const ZODIAC_ANIMALS: Record<Jiji, { name: string; emoji: string }> = {
  '자': { name: '쥐', emoji: '🐀' },
  '축': { name: '소', emoji: '🐂' },
  '인': { name: '호랑이', emoji: '🐅' },
  '묘': { name: '토끼', emoji: '🐇' },
  '진': { name: '용', emoji: '🐉' },
  '사': { name: '뱀', emoji: '🐍' },
  '오': { name: '말', emoji: '🐴' },
  '미': { name: '양', emoji: '🐑' },
  '신': { name: '원숭이', emoji: '🐒' },
  '유': { name: '닭', emoji: '🐓' },
  '술': { name: '개', emoji: '🐕' },
  '해': { name: '돼지', emoji: '🐖' },
}

export function getZodiacAnimal(yearBranch: Jiji) {
  return ZODIAC_ANIMALS[yearBranch]
}

// 서양 별자리
interface Constellation {
  name: string
  nameEn: string
  symbol: string
  startMonth: number
  startDay: number
  endMonth: number
  endDay: number
}

const CONSTELLATIONS: Constellation[] = [
  { name: '물병자리', nameEn: 'Aquarius', symbol: '♒', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { name: '물고기자리', nameEn: 'Pisces', symbol: '♓', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  { name: '양자리', nameEn: 'Aries', symbol: '♈', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { name: '황소자리', nameEn: 'Taurus', symbol: '♉', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { name: '쌍둥이자리', nameEn: 'Gemini', symbol: '♊', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21 },
  { name: '게자리', nameEn: 'Cancer', symbol: '♋', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22 },
  { name: '사자자리', nameEn: 'Leo', symbol: '♌', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { name: '처녀자리', nameEn: 'Virgo', symbol: '♍', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { name: '천칭자리', nameEn: 'Libra', symbol: '♎', startMonth: 9, startDay: 23, endMonth: 10, endDay: 23 },
  { name: '전갈자리', nameEn: 'Scorpio', symbol: '♏', startMonth: 10, startDay: 24, endMonth: 11, endDay: 22 },
  { name: '사수자리', nameEn: 'Sagittarius', symbol: '♐', startMonth: 11, startDay: 23, endMonth: 12, endDay: 21 },
  { name: '염소자리', nameEn: 'Capricorn', symbol: '♑', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
]

export function getConstellation(month: number, day: number): Constellation {
  const dateValue = month * 100 + day // e.g. 2월 18일 → 218

  for (const c of CONSTELLATIONS) {
    const startValue = c.startMonth * 100 + c.startDay
    const endValue = c.endMonth * 100 + c.endDay

    if (c.endMonth < c.startMonth) {
      // 연도를 넘기는 경우 (염소자리: 12/22 ~ 1/19)
      if (dateValue >= startValue || dateValue <= endValue) return c
    } else {
      // 일반적인 경우
      if (dateValue >= startValue && dateValue <= endValue) return c
    }
  }
  return CONSTELLATIONS[0] // fallback
}
