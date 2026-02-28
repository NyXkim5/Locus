import { create } from 'zustand'

const useStore = create((set) => ({
  // ── Theme ──
  theme: (() => {
    try {
      return localStorage.getItem('locus_theme') || 'light'
    } catch { return 'light' }
  })(),
  toggleTheme: () => set((state) => {
    const next = state.theme === 'light' ? 'dark' : 'light'
    try { localStorage.setItem('locus_theme', next) } catch {}
    document.documentElement.setAttribute('data-theme', next)
    return { theme: next }
  }),

  // ── Toast notifications ──
  toast: null,
  showToast: (message) => {
    set({ toast: message })
    setTimeout(() => set({ toast: null }), 2500)
  },

  // ── Chat history (multi-turn AI) ──
  // Cap at 6 messages (3 exchanges) to stay within Gemini's context budget
  chatHistory: [],
  addChatMessage: (role, text) => set((state) => {
    const updated = [...state.chatHistory, { role, text }]
    return { chatHistory: updated.slice(-6) }
  }),
  clearChatHistory: () => set({ chatHistory: [] }),

  // ── Favorites ──
  favorites: (() => {
    try {
      const raw = localStorage.getItem('locus_favorites')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })(),
  toggleFavorite: (id) => set((state) => {
    const next = state.favorites.includes(id)
      ? state.favorites.filter((f) => f !== id)
      : [...state.favorites, id]
    try { localStorage.setItem('locus_favorites', JSON.stringify(next)) } catch {}
    return { favorites: next }
  }),

  // ── Framing ──
  framingMode: 'neutral',
  setFramingMode: (mode) => set({ framingMode: mode }),

  expandedCategory: null,
  toggleCategory: (key) => set((state) => ({
    expandedCategory: state.expandedCategory === key ? null : key,
  })),
  collapseAll: () => set({ expandedCategory: null }),

  challengeFactor: null,
  openChallenge: (neighborhoodId, categoryKey, factorIndex) => set({
    challengeFactor: { neighborhoodId, categoryKey, factorIndex },
  }),
  closeChallenge: () => set({ challengeFactor: null }),

  challengedFactors: {},
  setChallengedFactor: (key, factor) => set((state) => ({
    challengedFactors: { ...state.challengedFactors, [key]: factor },
  })),

  comparisonIds: [],
  addToComparison: (id) => set((state) => {
    if (state.comparisonIds.includes(id) || state.comparisonIds.length >= 2) return state;
    return { comparisonIds: [...state.comparisonIds, id] };
  }),
  removeFromComparison: (id) => set((state) => ({
    comparisonIds: state.comparisonIds.filter(i => i !== id),
  })),
  clearComparison: () => set({ comparisonIds: [] }),
}));

export default useStore;
