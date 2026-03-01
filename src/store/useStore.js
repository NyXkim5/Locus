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

  // ── Generated Neighborhoods ──
  generatedNeighborhoods: (() => {
    try {
      const raw = localStorage.getItem('locus_generated_neighborhoods')
      return raw ? JSON.parse(raw) : {}
    } catch { return {} }
  })(),
  addGeneratedNeighborhood: (neighborhood) => set((state) => {
    const next = { ...state.generatedNeighborhoods, [neighborhood.id]: neighborhood }
    try { localStorage.setItem('locus_generated_neighborhoods', JSON.stringify(next)) } catch {}
    return { generatedNeighborhoods: next }
  }),

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

  // ── Priorities ──
  priorities: (() => {
    try {
      const raw = localStorage.getItem('locus_priorities')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })(),
  togglePriority: (id) => set((state) => {
    const next = state.priorities.includes(id)
      ? state.priorities.filter((p) => p !== id)
      : [...state.priorities, id]
    try { localStorage.setItem('locus_priorities', JSON.stringify(next)) } catch {}
    return { priorities: next }
  }),

  // ── Interests (for local recommendations) ──
  interests: (() => {
    try {
      const raw = localStorage.getItem('locus_interests')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })(),
  addInterest: (interest) => set((state) => {
    const normalized = interest.trim().toLowerCase()
    if (!normalized || state.interests.includes(normalized) || state.interests.length >= 10) return state
    const next = [...state.interests, normalized]
    try { localStorage.setItem('locus_interests', JSON.stringify(next)) } catch {}
    return { interests: next }
  }),
  removeInterest: (interest) => set((state) => {
    const next = state.interests.filter((i) => i !== interest)
    try { localStorage.setItem('locus_interests', JSON.stringify(next)) } catch {}
    return { interests: next }
  }),

  // ── Viewed Neighborhoods (passive tracking) ──
  viewedNeighborhoods: (() => {
    try {
      const raw = localStorage.getItem('locus_viewed')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })(),
  trackView: (id, name) => set((state) => {
    const exists = state.viewedNeighborhoods.find(v => v.id === id)
    let next
    if (exists) {
      next = state.viewedNeighborhoods.map(v =>
        v.id === id ? { ...v, count: v.count + 1, lastViewed: Date.now() } : v
      )
    } else {
      next = [...state.viewedNeighborhoods, { id, name, count: 1, lastViewed: Date.now() }]
    }
    try { localStorage.setItem('locus_viewed', JSON.stringify(next)) } catch {}
    return { viewedNeighborhoods: next }
  }),

  // ── Budget Range (from mortgage calculator) ──
  budgetRange: (() => {
    try {
      const raw = localStorage.getItem('locus_budget')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })(),
  setBudgetRange: (range) => set(() => {
    try { localStorage.setItem('locus_budget', JSON.stringify(range)) } catch {}
    return { budgetRange: range }
  }),

  // ── Profile Panel ──
  profileOpen: false,
  toggleProfile: () => set((s) => ({ profileOpen: !s.profileOpen })),

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
