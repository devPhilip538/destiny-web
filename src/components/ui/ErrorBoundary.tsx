import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-xl font-bold text-white mb-2">오류가 발생했습니다</h2>
          <p className="text-sm text-white/50 mb-6">페이지를 새로고침 해주세요.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-purple-dark transition-colors"
          >
            새로고침
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
