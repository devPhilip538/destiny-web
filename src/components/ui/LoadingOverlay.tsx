import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const LOADING_STEPS = [
  '사주 계산 중...',
  '오행 분석 중...',
  '운세 해석 중...',
]

interface LoadingOverlayProps {
  isVisible: boolean
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setStepIndex(0)
      return
    }
    const interval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1))
    }, 700)
    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark-bg/80 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 회전하는 팔괘 심볼 */}
      <motion.div
        className="relative w-24 h-24 mb-8"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-accent-purple/30" />
        <div className="absolute inset-1 rounded-full border-2 border-accent-gold/40" />
        <div className="absolute inset-2 rounded-full border-t-2 border-accent-purple" />
        {/* 중앙 태극 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">☯</span>
        </div>
      </motion.div>

      {/* 단계별 텍스트 */}
      <div className="h-8 flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            className="text-white/80 text-lg font-medium"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {LOADING_STEPS[stepIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* 진행 바 */}
      <div className="mt-6 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent-purple to-accent-gold rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}
