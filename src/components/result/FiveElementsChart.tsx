import { useMemo } from 'react'
import { motion } from 'motion/react'
import type { FiveElementBalance, FiveElement } from '@/types/saju'
import { ELEMENT_COLOR } from '@/lib/constants'

interface FiveElementsChartProps {
  balance: FiveElementBalance
}

const ELEMENTS: FiveElement[] = ['목', '화', '토', '금', '수']
const ELEMENT_LABELS: Record<FiveElement, string> = {
  '목': '木 목', '화': '火 화', '토': '土 토', '금': '金 금', '수': '水 수',
}

export function FiveElementsChart({ balance }: FiveElementsChartProps) {
  const max = useMemo(() => Math.max(...ELEMENTS.map((e) => balance[e]), 1), [balance])

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">오행 분석 (五行)</h3>
      <div className="flex flex-col gap-3">
        {ELEMENTS.map((element, i) => {
          const count = balance[element]
          const pct = (count / max) * 100
          return (
            <div key={element} className="flex items-center gap-3">
              <span className="text-sm w-12 text-white/60 shrink-0">{ELEMENT_LABELS[element]}</span>
              <div className="flex-1 h-6 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: ELEMENT_COLOR[element] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                />
              </div>
              <span className="text-sm font-bold w-6 text-right" style={{ color: ELEMENT_COLOR[element] }}>
                {count}
              </span>
            </div>
          )
        })}
      </div>
      <div className="flex gap-4 mt-4 text-xs">
        <span className="text-white/40">
          강한 기운: <span style={{ color: ELEMENT_COLOR[balance.dominant] }} className="font-bold">{balance.dominant}</span>
        </span>
        <span className="text-white/40">
          약한 기운: <span style={{ color: ELEMENT_COLOR[balance.lacking] }} className="font-bold">{balance.lacking}</span>
        </span>
      </div>
    </div>
  )
}
