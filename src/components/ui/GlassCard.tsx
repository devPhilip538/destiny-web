import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'strong' | 'purple'
}

export function GlassCard({ children, className, variant = 'default' }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-4',
        variant === 'default' && 'glass',
        variant === 'strong' && 'glass-strong',
        variant === 'purple' && 'glass-purple',
        className,
      )}
    >
      {children}
    </div>
  )
}
