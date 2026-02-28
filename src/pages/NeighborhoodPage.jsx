import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { getNeighborhoodById } from '../data/neighborhoods'
import { fetchListings } from '../services/listings'
import useStore from '../store/useStore'
import TopBar from '../components/shared/TopBar'
import ScoreCircle from '../components/shared/ScoreCircle'
import CategoryCard from '../components/scores/CategoryCard'
import FramingToggle from '../components/framing/FramingToggle'
import MapPlaceholder from '../components/map/MapPlaceholder'
import AIAdvisor from '../components/ai/AIAdvisor'

function SustainabilityBadge({ categories }) {
  const susCat = categories.find(c => c.label === 'Sustainability')
  if (!susCat) return null

  const score = susCat.score
  const level = score >= 80 ? 'Excellent' : score >= 70 ? 'Good' : score >= 55 ? 'Moderate' : 'Needs Work'
  const color = score >= 80 ? 'var(--score-high)' : score >= 70 ? '#22C55E' : score >= 55 ? 'var(--score-mid)' : 'var(--score-low)'

  return (
    <div
      className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[13px] font-medium"
      style={{ borderColor: color, color, background: `color-mix(in srgb, ${color} 10%, transparent)` }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22c5.523 0 7-6.477 7-12 0 0-3.5.5-7 3s-4.5 5-4.5 5" />
        <path d="M5 14c2.5-2.5 5-3.5 7-3.5" />
        <path d="M12 22V10" />
      </svg>
      Sustainability: {level} ({score})
    </div>
  )
}

function getFactorTip(name, score) {
  const tips = {
    'Carbon Footprint': {
      high: 'Excellent carbon profile. Maintain it by choosing energy-efficient appliances and supporting local clean energy programs.',
      low: 'Consider energy-efficient appliances and local solar programs to reduce your household carbon footprint.',
    },
    'Green Transit Score': {
      high: 'Strong transit access. Use it — even 2 bus/rail trips per week instead of driving saves ~1.5 tons CO\u2082/year.',
      low: 'Transit options are limited here. Carpooling, e-bikes, or remote work can offset the gap.',
    },
    'Bike Infrastructure': {
      high: 'Great bike infrastructure. Use protected lanes for short errands to save fuel costs and improve health.',
      low: 'Bike infrastructure needs improvement. Consider advocating for protected lanes through your city council.',
    },
    'Renewable Energy': {
      high: 'Strong renewable energy adoption. Check if your utility offers 100% green energy plans to go fully renewable.',
      low: 'Check local utility rebates for solar panels — California offers significant state and federal incentives.',
    },
    'Green Space Coverage': {
      high: 'Abundant green space nearby. Engage with community gardens and tree-planting programs to maintain it.',
      low: 'Limited green space. Support community garden initiatives and indoor plants to improve local air quality.',
    },
  }
  const tier = score >= 70 ? 'high' : 'low'
  return tips[name]?.[tier] || `Explore local programs to improve ${name.toLowerCase()}.`
}

function SustainabilityHighlights({ neighborhood }) {
  const susCat = neighborhood.categories.find(c => c.label === 'Sustainability')
  if (!susCat) return null

  const factors = susCat.factors
  const sources = factors.flatMap(f => f.sources.filter(s => s.type === 'measured').map(s => s.name))
  const uniqueSources = [...new Set(sources)].slice(0, 4)

  // Pick 2 most impactful tips: lowest-scoring factors, or if all high, the highest
  const sorted = [...factors].sort((a, b) => a.score - b.score)
  const tipFactors = sorted.filter(f => f.score < 70).length > 0
    ? sorted.filter(f => f.score < 70).slice(0, 2)
    : sorted.slice(-2).reverse()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="mt-8 p-5 bg-[var(--bg-surface)] border border-[#22C55E]/20 rounded-[10px]"
    >
      <div className="flex items-center gap-2 mb-5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22c5.523 0 7-6.477 7-12 0 0-3.5.5-7 3s-4.5 5-4.5 5" />
          <path d="M5 14c2.5-2.5 5-3.5 7-3.5" />
          <path d="M12 22V10" />
        </svg>
        <h3 className="text-[14px] font-semibold" style={{ color: '#22C55E' }}>
          Sustainability Profile
        </h3>
        <span className="ml-auto text-[12px] font-medium" style={{ color: '#22C55E' }}>
          {susCat.score}/100
        </span>
      </div>

      {/* Visual factor bars */}
      <div className="space-y-3 mb-5">
        {factors.map((f) => {
          const barColor = f.score >= 70 ? '#22C55E' : f.score >= 50 ? 'var(--score-mid)' : 'var(--score-low)'
          return (
            <div key={f.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] text-[var(--text-secondary)]">{f.name}</span>
                <span className="text-[13px] font-medium" style={{ color: barColor }}>{f.score}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${f.score}%` }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: barColor }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Personalized tips */}
      <div className="mb-4 p-3 rounded-[8px] bg-[var(--bg-elevated)]">
        <h4 className="text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)] mb-2">
          Personalized Tips
        </h4>
        <ul className="space-y-1.5">
          {tipFactors.map(f => (
            <li key={f.name} className="text-[12px] text-[var(--text-secondary)] leading-relaxed flex gap-2">
              <span className="text-[#22C55E] flex-shrink-0">→</span>
              <span><strong className="text-[var(--text-primary)]">{f.name}:</strong> {getFactorTip(f.name, f.score)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Methodology note */}
      <div className="pt-3 border-t border-[var(--border)]">
        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
          <strong className="text-[var(--text-secondary)]">Methodology:</strong>{' '}
          Sustainability scores combine measured data from verified public sources
          ({uniqueSources.join(', ')}) weighted at 70–80% with AI estimates filling
          data gaps at 20–30%. Confidence levels reflect source coverage and data recency.
        </p>
      </div>
    </motion.div>
  )
}

export default function NeighborhoodPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const neighborhood = getNeighborhoodById(id)
  const openChallenge = useStore((s) => s.openChallenge)
  const addToComparison = useStore((s) => s.addToComparison)
  const comparisonIds = useStore((s) => s.comparisonIds)
  const collapseAll = useStore((s) => s.collapseAll)
  const clearChatHistory = useStore((s) => s.clearChatHistory)
  const favorites = useStore((s) => s.favorites)
  const toggleFavorite = useStore((s) => s.toggleFavorite)
  const showToast = useStore((s) => s.showToast)

  const [listings, setListings] = useState([])
  const [listingsLoading, setListingsLoading] = useState(true)
  const [listingsError, setListingsError] = useState(null)
  const [aiResponse, setAiResponse] = useState(null)

  useEffect(() => {
    collapseAll()
    clearChatHistory()
    setAiResponse(null)
  }, [id, collapseAll, clearChatHistory])

  useEffect(() => {
    let cancelled = false
    setListingsLoading(true)
    setListingsError(null)
    setListings([])

    fetchListings(id)
      .then((data) => { if (!cancelled) setListings(data) })
      .catch((err) => { if (!cancelled) setListingsError(err.message) })
      .finally(() => { if (!cancelled) setListingsLoading(false) })

    return () => { cancelled = true }
  }, [id])

  const handleAIResponse = useCallback((data) => {
    setAiResponse(data)
  }, [])

  if (!neighborhood) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Neighborhood not found</p>
      </div>
    )
  }

  const handleChallenge = useCallback((categoryIndex, factorIndex) => {
    openChallenge(id, categoryIndex, factorIndex)
  }, [id, openChallenge])

  const alreadyInComparison = comparisonIds.includes(id)

  const handleCompare = () => {
    if (!alreadyInComparison) {
      addToComparison(id)
      showToast(`${neighborhood.name} added to comparison`)
    }
    navigate('/compare')
  }

  const handleToggleFavorite = () => {
    const wasFavorited = favorites.includes(id)
    toggleFavorite(id)
    showToast(wasFavorited ? `Removed from favorites` : `${neighborhood.name} saved to favorites`)
  }

  const categories = neighborhood.categories

  return (
    <div className="min-h-screen">
      <TopBar title={neighborhood.name} showBack />

      <div className="max-w-6xl mx-auto px-6 pt-8 pb-32">
        {/* Framing toggle */}
        <div className="flex justify-end mb-6">
          <FramingToggle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* Left: Map */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MapPlaceholder
              name={neighborhood.name}
              coordinates={neighborhood.coordinates}
              overallScore={neighborhood.overallScore}
              listings={listings}
            />
            {listingsLoading && (
              <div className="flex items-center gap-2 mt-2 px-1">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:0ms]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:150ms]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:300ms]" />
                </div>
                <span className="text-[12px] text-[var(--text-muted)]">Loading listings...</span>
              </div>
            )}
          </motion.div>

          {/* Right: Score + Categories */}
          <div>
            {/* Overall Score */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex flex-col items-center mb-6"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)] mb-3">
                Overall Score
              </span>
              <ScoreCircle score={neighborhood.overallScore} size="lg" />

              {/* Sustainability badge */}
              <SustainabilityBadge categories={neighborhood.categories} />
            </motion.div>

            {/* Category Cards */}
            <div className="space-y-3">
              {categories.map((category, i) => (
                <motion.div
                  key={category.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                >
                  <CategoryCard
                    categoryKey={i}
                    category={category}
                    neighborhoodId={id}
                    onChallengeFactor={handleChallenge}
                  />
                </motion.div>
              ))}
            </div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-2 mt-4"
            >
              <button
                onClick={handleCompare}
                disabled={comparisonIds.length >= 2 && !comparisonIds.includes(id)}
                className="flex-1 py-3 border border-dashed border-[var(--border)] rounded-[10px] text-[13px] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {alreadyInComparison ? 'View comparison' : '+ Compare'}
              </button>
              <button
                onClick={handleToggleFavorite}
                aria-label={favorites.includes(id) ? 'Remove from favorites' : 'Add to favorites'}
                className={`w-12 flex items-center justify-center border rounded-[10px] transition-all ${
                  favorites.includes(id)
                    ? 'border-[var(--score-low)] bg-[var(--score-low)]/8 text-[var(--score-low)]'
                    : 'border-dashed border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--score-low)] hover:text-[var(--score-low)]'
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={favorites.includes(id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>

        {/* AI Advisor */}
        <AIAdvisor
          currentNeighborhood={neighborhood}
          listings={listings}
          onResponse={handleAIResponse}
        />

        {/* Sustainability Highlights */}
        <SustainabilityHighlights neighborhood={neighborhood} />
      </div>
    </div>
  )
}
