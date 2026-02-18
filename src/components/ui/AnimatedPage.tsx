import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export function AnimatedPage({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
    >
      {children}
    </motion.div>
  )
}
