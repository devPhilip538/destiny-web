import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SajuResult, SavedReading, FormData } from '@/types/saju'

const MAX_HISTORY = 50

const safeStorage = {
  getItem: (name: string) => {
    try {
      return localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value)
    } catch {
      console.warn('localStorage 저장에 실패했습니다. 저장 공간이 부족할 수 있습니다.')
    }
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name)
    } catch {
      // ignore
    }
  },
}

interface SajuStore {
  formData: FormData | null
  result: SajuResult | null
  history: SavedReading[]

  setFormData: (data: FormData) => void
  setResult: (result: SajuResult) => void
  addToHistory: (reading: SavedReading) => void
  removeFromHistory: (id: string) => void
  clearHistory: () => void
  reset: () => void
}

export const useSajuStore = create<SajuStore>()(
  persist(
    (set) => ({
      formData: null,
      result: null,
      history: [],

      setFormData: (data) => set({ formData: data }),
      setResult: (result) => set({ result }),
      addToHistory: (reading) =>
        set((state) => ({ history: [reading, ...state.history].slice(0, MAX_HISTORY) })),
      removeFromHistory: (id) =>
        set((state) => ({ history: state.history.filter((r) => r.id !== id) })),
      clearHistory: () => set({ history: [] }),
      reset: () => set({ formData: null, result: null }),
    }),
    {
      name: 'saju-storage',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ history: state.history }),
    },
  ),
)
