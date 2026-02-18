import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { getPublisherId, hasConsent } from '@/lib/adsense'

interface AdBannerProps {
  slot: string
  format?: 'auto' | 'horizontal' | 'rectangle'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null)
  const { pathname } = useLocation()
  const pubId = getPublisherId()

  useEffect(() => {
    if (!pubId || !hasConsent()) return

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // adsbygoogle not loaded yet
    }
  }, [pubId, pathname])

  if (!pubId || !hasConsent()) return null

  const formatStyles: Record<string, { minHeight: string }> = {
    auto: { minHeight: '100px' },
    horizontal: { minHeight: '90px' },
    rectangle: { minHeight: '250px' },
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="glass rounded-xl p-3">
        <p className="text-[10px] text-white/30 mb-2">광고</p>
        <div style={formatStyles[format]}>
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={pubId}
            data-ad-slot={slot}
            data-ad-format={format === 'auto' ? 'auto' : undefined}
            data-full-width-responsive={format === 'auto' ? 'true' : undefined}
            key={pathname}
          />
        </div>
      </div>
    </div>
  )
}
