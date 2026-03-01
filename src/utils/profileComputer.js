import { PRIORITIES } from './priorities'

const TRAIT_MAP = {
  // From priorities
  schools: { label: 'School Focused', icon: '🎓' },
  safety: { label: 'Safety First', icon: '🛡' },
  walkable: { label: 'Urban Walker', icon: '🚶' },
  nightlife: { label: 'Night Owl', icon: '🌙' },
  green: { label: 'Eco Warrior', icon: '🌿' },
  investment: { label: 'Investor', icon: '📈' },
}

const INTEREST_TRAITS = {
  hiking: { label: 'Nature Lover', icon: '🏔' },
  biking: { label: 'Cyclist', icon: '🚴' },
  yoga: { label: 'Wellness Seeker', icon: '🧘' },
  coffee: { label: 'Coffee Enthusiast', icon: '☕' },
  dogs: { label: 'Dog Lover', icon: '🐕' },
  parks: { label: 'Nature Lover', icon: '🌳' },
  gym: { label: 'Fitness Focused', icon: '💪' },
  food: { label: 'Foodie', icon: '🍽' },
  art: { label: 'Art Lover', icon: '🎨' },
  music: { label: 'Music Fan', icon: '🎵' },
  tech: { label: 'Tech Savvy', icon: '💻' },
  reading: { label: 'Bookworm', icon: '📚' },
  cooking: { label: 'Home Chef', icon: '👨‍🍳' },
  gardening: { label: 'Green Thumb', icon: '🌱' },
  running: { label: 'Runner', icon: '🏃' },
  swimming: { label: 'Swimmer', icon: '🏊' },
}

function deriveLifestyleType(priorities) {
  if (!priorities || priorities.length === 0) return 'Explorer'

  const has = (id) => priorities.includes(id)

  if (has('schools') && has('safety')) return 'Family-Oriented'
  if (has('schools')) return 'Family-Oriented'
  if (has('nightlife') && has('walkable')) return 'Young Professional'
  if (has('nightlife')) return 'Young Professional'
  if (has('green')) return 'Eco-Conscious'
  if (has('investment')) return 'Investor'
  if (has('walkable')) return 'Young Professional'
  if (has('safety')) return 'Family-Oriented'

  return 'Explorer'
}

function deriveBudgetTier(budgetRange) {
  if (!budgetRange || !budgetRange.homePrice) return null
  const price = budgetRange.homePrice
  if (price < 500000) return 'Starter'
  if (price < 1000000) return 'Mid-Range'
  if (price < 2000000) return 'Premium'
  return 'Luxury'
}

function deriveTraits(priorities, interests) {
  const seen = new Set()
  const traits = []

  const add = (t) => {
    if (!seen.has(t.label)) {
      seen.add(t.label)
      traits.push(t)
    }
  }

  if (priorities) {
    for (const pid of priorities) {
      if (TRAIT_MAP[pid]) add(TRAIT_MAP[pid])
    }
  }

  if (interests) {
    for (const interest of interests) {
      const lower = interest.toLowerCase()
      for (const [keyword, trait] of Object.entries(INTEREST_TRAITS)) {
        if (lower.includes(keyword)) {
          add(trait)
        }
      }
    }
  }

  return traits
}

function deriveSearchIntent(budgetRange, chatHistory) {
  if (chatHistory && chatHistory.length > 0) {
    const allText = chatHistory.map(m => m.text).join(' ').toLowerCase()
    if (allText.includes('rent') || allText.includes('lease') || allText.includes('tenant')) return 'rent'
    if (allText.includes('buy') || allText.includes('purchase') || allText.includes('mortgage')) return 'buy'
  }
  if (budgetRange && budgetRange.homePrice) return 'buy'
  return 'explore'
}

export function computeProfile({ priorities, interests, viewedNeighborhoods, budgetRange, favorites, chatHistory }) {
  const lifestyleType = deriveLifestyleType(priorities)
  const budgetTier = deriveBudgetTier(budgetRange)

  const topInterests = (interests || []).slice(0, 5)

  const topNeighborhoods = [...(viewedNeighborhoods || [])]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const prioritySummary = (priorities || [])
    .map(pid => {
      const p = PRIORITIES.find(pr => pr.id === pid)
      return p ? p.label : pid
    })

  const searchIntent = deriveSearchIntent(budgetRange, chatHistory)

  const traits = deriveTraits(priorities, interests)

  // Profile strength: 0-100
  let profileStrength = 0
  if (priorities && priorities.length > 0) profileStrength += 20
  if (interests && interests.length > 0) profileStrength += 20
  if (viewedNeighborhoods && viewedNeighborhoods.length >= 3) profileStrength += 20
  if (budgetRange) profileStrength += 20
  if (chatHistory && chatHistory.length > 0) profileStrength += 20

  return {
    lifestyleType,
    budgetTier,
    topInterests,
    topNeighborhoods,
    prioritySummary,
    searchIntent,
    profileStrength,
    traits,
  }
}
