import { create } from 'zustand'

const useStore = create((set) => ({
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
