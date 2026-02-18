import { useState } from 'react'
import { motion } from 'motion/react'
import { User, Plus } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import type { SavedReading } from '@/types/saju'

interface PersonSelectorProps {
  label: string
  history: SavedReading[]
  selected: SavedReading | null
  onSelect: (reading: SavedReading) => void
}

export function PersonSelector({ label, history, selected, onSelect }: PersonSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full">
      <p className="text-sm font-semibold text-white/70 mb-2">{label}</p>

      {selected ? (
        <GlassCard className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center">
              <User className="w-5 h-5 text-accent-purple-light" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{selected.name}</p>
              <p className="text-xs text-white/40">
                {selected.birthYear}년 {selected.birthMonth}월 {selected.birthDay}일
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs text-accent-purple-light"
          >
            변경
          </button>
        </GlassCard>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full rounded-2xl border-2 border-dashed border-white/20 p-4 flex items-center justify-center gap-2 text-white/40 hover:border-accent-purple/40 hover:text-white/60 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">분석 기록에서 선택</span>
        </button>
      )}

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 rounded-xl bg-dark-card border border-white/10 overflow-hidden max-h-48 overflow-y-auto"
        >
          {history.length === 0 ? (
            <p className="p-4 text-sm text-white/40 text-center">저장된 분석 기록이 없습니다</p>
          ) : (
            history.map((reading) => (
              <button
                key={reading.id}
                type="button"
                onClick={() => {
                  onSelect(reading)
                  setIsOpen(false)
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
              >
                <User className="w-4 h-4 text-white/40" />
                <div>
                  <p className="text-sm text-white">{reading.name}</p>
                  <p className="text-xs text-white/40">
                    {reading.birthYear}년 {reading.birthMonth}월 {reading.birthDay}일
                  </p>
                </div>
              </button>
            ))
          )}
        </motion.div>
      )}
    </div>
  )
}
