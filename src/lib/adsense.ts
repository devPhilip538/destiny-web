const ADSENSE_PUB_ID = import.meta.env.VITE_ADSENSE_PUB_ID as string | undefined

const CONSENT_KEY = 'adsense-cookie-consent'

export function getPublisherId(): string | undefined {
  return ADSENSE_PUB_ID
}

export function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'true'
  } catch {
    return false
  }
}

export function giveConsent(): void {
  try {
    localStorage.setItem(CONSENT_KEY, 'true')
  } catch {
    // localStorage unavailable
  }
}

export function loadAdSenseScript(): void {
  if (!ADSENSE_PUB_ID) return
  if (!hasConsent()) return
  if (document.querySelector('script[data-adsense]')) return

  const script = document.createElement('script')
  script.async = true
  script.crossOrigin = 'anonymous'
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`
  script.dataset.adsense = 'true'
  document.head.appendChild(script)
}

export function initAdSense(): void {
  if (hasConsent()) {
    loadAdSenseScript()
  }
}
