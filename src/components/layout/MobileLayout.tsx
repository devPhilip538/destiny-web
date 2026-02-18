import type { ReactNode } from 'react'
import { Header } from './Header'
import { BottomNav } from './BottomNav'

export function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-md mx-auto px-4 pb-24 pt-4">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
