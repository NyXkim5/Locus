import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { getNeighborhoodById, neighborhoods, getAllNeighborhoods } from '../data/neighborhoods'
import { fetchListings } from '../services/listings'
import { generateNeighborhood } from '../services/generateNeighborhood'
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
  const color = score >= 80 ? 'var(--score-high)' : score >= 70 ? 'var(--color-sustainability)' : score >= 55 ? 'var(--score-mid)' : 'var(--score-low)'

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
      className="mt-8 p-5 bg-[var(--bg-surface)] border border-[var(--color-sustainability-border)] rounded-[10px]"
    >
      <div className="flex items-center gap-2 mb-5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ stroke: 'var(--color-sustainability)' }}>
          <path d="M12 22c5.523 0 7-6.477 7-12 0 0-3.5.5-7 3s-4.5 5-4.5 5" />
          <path d="M5 14c2.5-2.5 5-3.5 7-3.5" />
          <path d="M12 22V10" />
        </svg>
        <h3 className="text-[14px] font-semibold" style={{ color: 'var(--color-sustainability)' }}>
          Sustainability Profile
        </h3>
        <span className="ml-auto text-[12px] font-medium" style={{ color: 'var(--color-sustainability)' }}>
          {susCat.score}/100
        </span>
      </div>

      {/* Visual factor bars */}
      <div className="space-y-3 mb-5">
        {factors.map((f) => {
          const barColor = f.score >= 70 ? 'var(--color-sustainability)' : f.score >= 50 ? 'var(--score-mid)' : 'var(--score-low)'
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
              <span className="text-[var(--color-sustainability)] flex-shrink-0">→</span>
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

function ListingSkeleton() {
  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
        <span className="text-[12px] text-[var(--text-muted)]">Finding listings...</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden animate-pulse"
          >
            <div className="h-28 bg-[var(--bg-elevated)]" />
            <div className="p-3 space-y-2">
              <div className="h-3.5 w-3/4 bg-[var(--bg-elevated)] rounded" />
              <div className="h-3 w-1/2 bg-[var(--bg-elevated)] rounded" />
              <div className="flex gap-2 mt-1">
                <div className="h-2.5 w-10 bg-[var(--bg-elevated)] rounded" />
                <div className="h-2.5 w-10 bg-[var(--bg-elevated)] rounded" />
                <div className="h-2.5 w-14 bg-[var(--bg-elevated)] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function NeighborhoodPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
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
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [showOverallScore, setShowOverallScore] = useState(Boolean(location.state?.showScore))
  const [generating, setGenerating] = useState(false)
  const [progressText, setProgressText] = useState('')
  const [genError, setGenError] = useState(null)
  const listboxRef = useRef(null)
  const videoRef = useRef(null)

  const allNeighborhoods = useMemo(() => getAllNeighborhoods(), [])
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    return allNeighborhoods.filter((n) =>
      n.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, allNeighborhoods])
  const trimmedQuery = searchQuery.trim()
  const hasExactMatch = trimmedQuery.length > 0 && allNeighborhoods.some(
    (n) => n.name.toLowerCase() === trimmedQuery.toLowerCase()
  )
  const showGenerateOption = trimmedQuery.length > 2 && !hasExactMatch
  const isSearchOpen = searchResults.length > 0 || showGenerateOption

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.8
  }, [])

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

  const handleSelectNeighborhood = useCallback((nextId) => {
    setShowOverallScore(true)
    setSearchQuery('')
    setActiveIndex(-1)
    navigate(`/neighborhood/${nextId}`, { state: { showScore: true } })
  }, [navigate])

  const handleGenerate = useCallback(async () => {
    setGenerating(true)
    setGenError(null)
    setProgressText('Connecting to AI...')
    try {
      const result = await generateNeighborhood(trimmedQuery, setProgressText)
      setShowOverallScore(true)
      setSearchQuery('')
      setActiveIndex(-1)
      navigate(`/neighborhood/${result.id}`, { state: { showScore: true } })
    } catch (err) {
      setGenError(err.message)
      setGenerating(false)
    }
  }, [trimmedQuery, navigate])

  const handleSearchKeyDown = useCallback((e) => {
    if (!isSearchOpen) return
    const totalItems = searchResults.length + (showGenerateOption ? 1 : 0)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => (prev + 1) % totalItems)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < searchResults.length) {
          handleSelectNeighborhood(searchResults[activeIndex].id)
        } else if (activeIndex === searchResults.length && showGenerateOption) {
          handleGenerate()
        }
        break
      case 'Escape':
        e.preventDefault()
        setSearchQuery('')
        setActiveIndex(-1)
        break
      default:
        break
    }
  }, [isSearchOpen, activeIndex, searchResults, showGenerateOption, handleSelectNeighborhood, handleGenerate])

  const handleSearchInputChange = (e) => {
    const nextValue = e.target.value
    setSearchQuery(nextValue)
    setActiveIndex(-1)
    setGenError(null)
  }

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

      <div className="max-w-[92rem] mx-auto px-6 pt-8 pb-32">
        {/* AI-Generated badge */}
        {neighborhood.isGenerated && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex justify-center"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] text-[12px] font-medium">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              AI-Generated Analysis
            </span>
          </motion.div>
        )}
        {/* Framing toggle */}
        <div className="flex justify-end mb-6">
          <FramingToggle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] lg:grid-cols-[3fr_1fr] gap-6">
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
            {listingsLoading && <ListingSkeleton />}
            {listingsError && !listingsLoading && (
              <div className="mt-3 px-3 py-2.5 rounded-[8px] border border-[var(--score-low)]/20 bg-[var(--score-low)]/5">
                <p className="text-[12px] text-[var(--score-low)]">{listingsError}</p>
              </div>
            )}
          </motion.div>

          {/* Right: Score + Categories */}
          <div>
            {/* Search then Overall Score */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-6"
            >
              {!showOverallScore ? (
                <div>
                  {generating && (
                    <div className="mb-4 px-3 py-3 rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)]">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin" />
                        <p className="text-[13px] font-medium text-[var(--text-primary)]">{progressText || 'Generating...'}</p>
                      </div>
                      <p className="text-[12px] text-[var(--text-muted)]">This usually takes 10-15 seconds</p>
                    </div>
                  )}

                  <div className="flex justify-center mb-2">
                    <video
                      ref={videoRef}
                      src="/davsan-logo.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-28 h-28 object-contain"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  </div>
                  <h2 className="text-[18px] font-semibold tracking-[-0.02em] mb-0.5 text-center">
                    <span className="text-[var(--accent)]">LOCUS</span>
                  </h2>
                  <p className="text-[var(--text-muted)] text-[11px] uppercase tracking-[0.08em] mb-4 text-center">
                    Neighborhood Intelligence, Debiased
                  </p>
                  <h3 className="text-[20px] font-semibold tracking-[-0.02em] mb-3 text-center">
                    Where are you looking?
                  </h3>
                  <div className="relative">
                    <div className="flex items-center bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] px-4 py-3 focus-within:border-[var(--accent)] transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" className="mr-3 flex-shrink-0" aria-hidden="true">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                      </svg>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Search address or neighborhood"
                        className="bg-transparent w-full text-[14px] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
                        role="combobox"
                        aria-expanded={isSearchOpen}
                        aria-haspopup="listbox"
                        aria-controls="neighborhood-search-listbox"
                        aria-activedescendant={activeIndex >= 0 ? `neighborhood-option-${searchResults[activeIndex]?.id}` : undefined}
                        aria-label="Search neighborhoods"
                        autoComplete="off"
                      />
                    </div>
                    {isSearchOpen && (
                      <div
                        ref={listboxRef}
                        id="neighborhood-search-listbox"
                        role="listbox"
                        aria-label="Neighborhood search results"
                        className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.1)] z-20"
                      >
                        {searchResults.map((n, i) => (
                          <button
                            key={n.id}
                            id={`neighborhood-option-${n.id}`}
                            role="option"
                            aria-selected={i === activeIndex}
                            onClick={() => handleSelectNeighborhood(n.id)}
                            onMouseEnter={() => setActiveIndex(i)}
                            className={`w-full text-left px-4 py-3 text-[14px] transition-colors flex items-center justify-between ${
                              i === activeIndex ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {n.name}
                              {n.isGenerated && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] font-medium">AI</span>
                              )}
                            </span>
                            <span className="text-[12px] text-[var(--text-muted)]">Score: {n.overallScore}</span>
                          </button>
                        ))}
                        {showGenerateOption && (
                          <button
                            id="neighborhood-option-generate"
                            role="option"
                            aria-selected={activeIndex === searchResults.length}
                            onClick={handleGenerate}
                            onMouseEnter={() => setActiveIndex(searchResults.length)}
                            className={`w-full text-left px-4 py-3 text-[14px] transition-colors flex items-center gap-2 border-t border-[var(--border)] ${
                              activeIndex === searchResults.length ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]'
                            }`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="flex-shrink-0">
                              <path d="M12 2L2 7l10 5 10-5-10-5z" />
                              <path d="M2 17l10 5 10-5" />
                              <path d="M2 12l10 5 10-5" />
                            </svg>
                            <span className="text-[var(--accent)] font-medium">
                              Generate AI analysis for <strong>{trimmedQuery}</strong>
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {genError && (
                    <div className="mt-2 px-3 py-2 rounded-[8px] bg-[var(--score-low)]/10 border border-[var(--score-low)]/20">
                      <p className="text-[12px] text-[var(--score-low)]">{genError}</p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {neighborhoods.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleSelectNeighborhood(n.id)}
                        className="px-3 py-1.5 text-[12px] text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border)] rounded-[6px] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-all"
                      >
                        {n.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <div className="relative w-full mb-4">
                    <div className="flex items-center bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] px-4 py-2.5 focus-within:border-[var(--accent)] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" className="mr-2.5 flex-shrink-0" aria-hidden="true">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                      </svg>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Search another neighborhood"
                        className="bg-transparent w-full text-[13px] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
                        role="combobox"
                        aria-expanded={isSearchOpen}
                        aria-haspopup="listbox"
                        aria-controls="neighborhood-search-listbox"
                        aria-activedescendant={activeIndex >= 0 ? `neighborhood-option-${searchResults[activeIndex]?.id}` : undefined}
                        aria-label="Search neighborhoods"
                        autoComplete="off"
                      />
                    </div>
                    {isSearchOpen && (
                      <div
                        ref={listboxRef}
                        id="neighborhood-search-listbox"
                        role="listbox"
                        aria-label="Neighborhood search results"
                        className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.1)] z-20"
                      >
                        {searchResults.map((n, i) => (
                          <button
                            key={n.id}
                            id={`neighborhood-option-${n.id}`}
                            role="option"
                            aria-selected={i === activeIndex}
                            onClick={() => handleSelectNeighborhood(n.id)}
                            onMouseEnter={() => setActiveIndex(i)}
                            className={`w-full text-left px-4 py-3 text-[14px] transition-colors flex items-center justify-between ${
                              i === activeIndex ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]'
                            }`}
                          >
                            <span>{n.name}</span>
                            <span className="text-[12px] text-[var(--text-muted)]">Score: {n.overallScore}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                  <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)] mb-3">
                    Overall Score
                  </span>
                  <ScoreCircle score={neighborhood.overallScore} size="lg" />
                </div>
                </div>
              )}

              {showOverallScore && (
                <div className="flex justify-center mt-3">
                  <SustainabilityBadge categories={neighborhood.categories} />
                </div>
              )}
            </motion.div>

            {/* Category Cards */}
            {showOverallScore && (
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
            )}

            {/* Action buttons */}
            {showOverallScore && (
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
            )}
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
