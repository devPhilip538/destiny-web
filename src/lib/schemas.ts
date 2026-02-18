import { z } from 'zod'

const currentYear = new Date().getFullYear()

export const birthDateSchema = z.object({
  birthYear: z.number().min(1920).max(currentYear),
  birthMonth: z.number().min(1).max(12),
  birthDay: z.number().min(1).max(31),
  calendarType: z.enum(['solar', 'lunar']),
  isLeapMonth: z.boolean(),
}).superRefine((data, ctx) => {
  const { birthYear, birthMonth, birthDay } = data
  const daysInMonth = new Date(birthYear, birthMonth, 0).getDate()
  if (birthDay > daysInMonth) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${birthYear}년 ${birthMonth}월은 ${daysInMonth}일까지만 존재합니다.`,
      path: ['birthDay'],
    })
  }
})

export const birthTimeSchema = z.object({
  birthHour: z.string().min(1, '태어난 시간을 선택해주세요'),
})

export const personalInfoSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(20),
  gender: z.enum(['male', 'female'], { message: '성별을 선택해주세요' }),
})

export const fullFormSchema = birthDateSchema.merge(birthTimeSchema).merge(personalInfoSchema)

export type BirthDateFormValues = z.infer<typeof birthDateSchema>
export type BirthTimeFormValues = z.infer<typeof birthTimeSchema>
export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>
export type FullFormValues = z.infer<typeof fullFormSchema>
