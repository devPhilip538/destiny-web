import { cn } from '@/lib/utils'
import { motion } from 'motion/react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  labels: string[]
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            {i <= currentStep && (
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-purple to-accent-gold"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              />
            )}
          </div>
          <span
            className={cn(
              'text-[10px]',
              i <= currentStep ? 'text-white/70' : 'text-white/30',
            )}
          >
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  )
}
