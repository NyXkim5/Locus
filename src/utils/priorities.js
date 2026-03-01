export const PRIORITIES = [
  { id: 'schools', label: 'Good Schools', boosts: { Community: 2.0, Safety: 1.3 } },
  { id: 'safety', label: 'Safe Area', boosts: { Safety: 2.5 } },
  { id: 'walkable', label: 'Walkable', boosts: { Livability: 2.0, Sustainability: 1.3 } },
  { id: 'nightlife', label: 'Nightlife & Culture', boosts: { Community: 2.0 } },
  { id: 'green', label: 'Eco-Friendly', boosts: { Sustainability: 2.5 } },
  { id: 'investment', label: 'Good Investment', boosts: { Growth: 2.5 } },
]

export function getCategoryWeights(priorityIds) {
  const weights = {}
  for (const pid of priorityIds) {
    const priority = PRIORITIES.find((p) => p.id === pid)
    if (!priority) continue
    for (const [cat, boost] of Object.entries(priority.boosts)) {
      weights[cat] = (weights[cat] || 1.0) + boost
    }
  }
  return weights
}

export function computePersonalizedScore(categories, priorityIds) {
  if (!priorityIds || priorityIds.length === 0) {
    return Math.round(categories.reduce((s, c) => s + c.score, 0) / categories.length)
  }
  const weights = getCategoryWeights(priorityIds)
  let totalWeight = 0
  let weightedSum = 0
  for (const cat of categories) {
    const w = weights[cat.label] || 1.0
    weightedSum += cat.score * w
    totalWeight += w
  }
  return Math.round(weightedSum / totalWeight)
}
