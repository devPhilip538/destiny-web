import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/config/query-client'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { CookieConsent } from '@/components/ui/CookieConsent'
import { HomePage } from '@/pages/HomePage'
import { InputPage } from '@/pages/InputPage'
import { ResultPage } from '@/pages/ResultPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { CompatibilityPage } from '@/pages/CompatibilityPage'
import { FortuneDetailPage } from '@/pages/FortuneDetailPage'

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-5xl mb-4">🔮</p>
      <h2 className="text-xl font-bold text-white mb-2">페이지를 찾을 수 없습니다</h2>
      <p className="text-sm text-white/50 mb-6">요청하신 페이지가 존재하지 않습니다.</p>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-purple-dark transition-colors no-underline"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <MobileLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/input" element={<InputPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/result/:id" element={<ResultPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/fortune/:category" element={<FortuneDetailPage />} />
              <Route path="/fortune/:category/:id" element={<FortuneDetailPage />} />
              <Route path="/compatibility" element={<CompatibilityPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </MobileLayout>
        </ErrorBoundary>
        <CookieConsent />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
