import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { TenGodRelation, TenGodName } from '@/types/saju'
import { TEN_GOD_DESCRIPTIONS } from '@/lib/ten-gods'
import { GlassCard } from '@/components/ui/GlassCard'
import { CHEONGAN_HANJA, JIJI_HANJA } from '@/lib/constants'

interface TenGodsSectionProps {
  tenGods: TenGodRelation[]
}

const TEN_GOD_COLOR: Record<TenGodName, string> = {
  '비견': 'text-green-400',
  '겁재': 'text-green-300',
  '식신': 'text-red-400',
  '상관': 'text-red-300',
  '편재': 'text-yellow-400',
  '정재': 'text-yellow-300',
  '편관': 'text-blue-400',
  '정관': 'text-blue-300',
  '편인': 'text-purple-400',
  '정인': 'text-purple-300',
}

export function TenGodsSection({ tenGods }: TenGodsSectionProps) {
  const [selectedGod, setSelectedGod] = useState<TenGodName | null>(null)

  return (
    <GlassCard>
      <h3 className="text-lg font-bold text-white mb-1">십신 관계</h3>
      <p className="text-xs text-white/40 mb-4">일간을 기준으로 각 기둥과의 관계를 나타냅니다</p>

      {/* 4기둥 십신 표 */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {tenGods.map((tg, i) => (
          <motion.div
            key={tg.position}
            className="text-center rounded-xl bg-white/5 border border-white/10 p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="text-[10px] text-white/40 mb-2">{tg.position}</p>

            {/* 천간 십신 */}
            <button
              type="button"
              onClick={() => setSelectedGod(tg.cheonganTenGod)}
              className={`text-xs font-semibold mb-1 block w-full ${TEN_GOD_COLOR[tg.cheonganTenGod]} hover:opacity-80 transition-opacity`}
            >
              {tg.cheonganTenGod}
            </button>
            <p className="text-sm text-white/80">{CHEONGAN_HANJA[tg.cheongan]}</p>

            <div className="border-t border-white/10 my-2" />

            {/* 지지 십신 */}
            <button
              type="button"
              onClick={() => setSelectedGod(tg.jijiTenGod)}
              className={`text-xs font-semibold mb-1 block w-full ${TEN_GOD_COLOR[tg.jijiTenGod]} hover:opacity-80 transition-opacity`}
            >
              {tg.jijiTenGod}
            </button>
            <p className="text-sm text-white/80">{JIJI_HANJA[tg.jiji]}</p>
          </motion.div>
        ))}
      </div>

      {/* 선택된 십신 설명 */}
      <AnimatePresence mode="wait">
        {selectedGod && (
          <motion.div
            key={selectedGod}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl bg-white/5 border border-white/10 p-3"
          >
            <p className={`text-sm font-semibold mb-1 ${TEN_GOD_COLOR[selectedGod]}`}>
              {selectedGod}
            </p>
            <p className="text-xs text-white/60 leading-relaxed">
              {TEN_GOD_DESCRIPTIONS[selectedGod]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}
