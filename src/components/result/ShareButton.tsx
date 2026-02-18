import { useState } from 'react'
import { Share2, RotateCcw, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ShareButton() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '사주 운세 결과',
          text: '나의 사주팔자 분석 결과를 확인해보세요!',
          url: window.location.href,
        })
      } catch {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // Clipboard API failed
      }
    }
  }

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => navigate('/input')}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 text-white/70 font-medium hover:bg-white/10 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        다시 분석
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-purple-dark transition-colors"
      >
        {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        {copied ? 'URL 복사됨!' : '공유하기'}
      </button>
    </div>
  )
}
