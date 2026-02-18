import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { hasConsent, giveConsent, loadAdSenseScript } from '@/lib/adsense'

export function CookieConsent() {
  const [visible, setVisible] = useState(!hasConsent())

  if (!visible) return null

  const handleAccept = () => {
    giveConsent()
    loadAdSenseScript()
    setVisible(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-md mx-auto glass-strong rounded-2xl p-4 flex items-center gap-3">
          <p className="text-xs text-white/70 flex-1 leading-relaxed">
            이 사이트는 맞춤형 광고를 위해 쿠키를 사용합니다.
          </p>
          <button
            onClick={handleAccept}
            className="shrink-0 px-4 py-2 rounded-xl bg-accent-purple text-white text-xs font-medium hover:bg-accent-purple-dark transition-colors"
          >
            동의
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
