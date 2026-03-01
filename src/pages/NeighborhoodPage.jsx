import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { getNeighborhoodById, getAllNeighborhoods } from '../data/neighborhoods'
import { fetchListings, fetchRentals, fetchAirbnbs } from '../services/listings'
import { generateNeighborhood } from '../services/generateNeighborhood'
import useStore from '../store/useStore'
import { computePersonalizedScore, getCategoryWeights } from '../utils/priorities'
import TopBar from '../components/shared/TopBar'
import ScoreCircle from '../components/shared/ScoreCircle'
import CategoryCard from '../components/scores/CategoryCard'
import FramingToggle from '../components/framing/FramingToggle'
import MapPlaceholder from '../components/map/MapPlaceholder'
import ListingsGrid from '../components/listings/ListingsGrid'
import MarketSnapshot from '../components/listings/MarketSnapshot'
import MortgageCalculator from '../components/listings/MortgageCalculator'
import AIAdvisor from '../components/ai/AIAdvisor'
import LocalRecommendations from '../components/recommendations/LocalRecommendations'

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
  const priorities = useStore((s) => s.priorities)
  const trackView = useStore((s) => s.trackView)

  const [listings, setListings] = useState([])
  const [listingsLoading, setListingsLoading] = useState(true)
  const [listingsError, setListingsError] = useState(null)
  const [rentals, setRentals] = useState([])
  const [rentalsLoading, setRentalsLoading] = useState(true)
  const [rentalsError, setRentalsError] = useState(null)
  const [airbnbs, setAirbnbs] = useState([])
  const [airbnbsLoading, setAirbnbsLoading] = useState(true)
  const [airbnbsError, setAirbnbsError] = useState(null)
  const [activeTab, setActiveTab] = useState('buy')
  const [, setAiResponse] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [generating, setGenerating] = useState(false)
  const [progressText, setProgressText] = useState('')
  const [genError, setGenError] = useState(null)
  const listboxRef = useRef(null)

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
    collapseAll()
    clearChatHistory()
    setAiResponse(null)
    setActiveTab('buy')
    if (neighborhood) trackView(id, neighborhood.name)
  }, [id, collapseAll, clearChatHistory, neighborhood, trackView])

  // Fetch all listing types with AbortController for cleanup on navigation
  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    setListingsLoading(true)
    setListingsError(null)
    setListings([])
    setRentalsLoading(true)
    setRentalsError(null)
    setRentals([])
    setAirbnbsLoading(true)
    setAirbnbsError(null)
    setAirbnbs([])

    fetchListings(id, { signal })
      .then((data) => { if (!signal.aborted) setListings(data) })
      .catch((err) => { if (!signal.aborted) setListingsError(err.message) })
      .finally(() => { if (!signal.aborted) setListingsLoading(false) })

    fetchRentals(id, { signal })
      .then((data) => { if (!signal.aborted) setRentals(data) })
      .catch((err) => { if (!signal.aborted) setRentalsError(err.message) })
      .finally(() => { if (!signal.aborted) setRentalsLoading(false) })

    fetchAirbnbs(id, { signal })
      .then((data) => { if (!signal.aborted) setAirbnbs(data) })
      .catch((err) => { if (!signal.aborted) setAirbnbsError(err.message) })
      .finally(() => { if (!signal.aborted) setAirbnbsLoading(false) })

    return () => controller.abort()
  }, [id])

  const handleAIResponse = useCallback((data) => {
    setAiResponse(data)
  }, [])

  const handleSelectNeighborhood = useCallback((nextId) => {
    setSearchQuery('')
    setActiveIndex(-1)
    navigate(`/neighborhood/${nextId}`)
  }, [navigate])

  const handleGenerate = useCallback(async () => {
    setGenerating(true)
    setGenError(null)
    setProgressText('Connecting to AI...')
    try {
      const result = await generateNeighborhood(trimmedQuery, setProgressText, priorities)
      setSearchQuery('')
      setActiveIndex(-1)
      navigate(`/neighborhood/${result.id}`)
    } catch (err) {
      setGenError(err.message)
      setGenerating(false)
    }
  }, [trimmedQuery, navigate, priorities])

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
  const categoryWeights = priorities.length > 0 ? getCategoryWeights(priorities) : {}

  // Memoize median price to avoid re-sorting on every render
  const medianPrice = useMemo(() => {
    const withPrice = listings.filter(l => l.price > 0)
    if (!withPrice.length) return 500000
    withPrice.sort((a, b) => a.price - b.price)
    return withPrice[Math.floor(withPrice.length / 2)]?.price || 500000
  }, [listings])

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
              neighborhoodId={id}
            />

            {/* AI Advisor — sits below map, beside category cards */}
            <AIAdvisor
              currentNeighborhood={neighborhood}
              listings={listings}
              onResponse={handleAIResponse}
              priorities={priorities}
            />
          </motion.div>

          {/* Right: Score + Categories */}
          <div>
            {/* Score + compact search */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-6"
            >
              {/* Compact search bar to switch neighborhoods */}
              <div className="relative mb-5">
                <div className="flex items-center bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] px-3 py-2 focus-within:border-[var(--accent)] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" className="mr-2 flex-shrink-0" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Switch neighborhood..."
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
                        <span className="flex items-center gap-2">
                          {n.name}
                          {n.isGenerated && (
                            <span className="text-[12px] px-1.5 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] font-medium">AI</span>
                          )}
                        </span>
                        <span className="text-[12px] text-[var(--text-muted)]">Score: {priorities.length > 0 ? computePersonalizedScore(n.categories, priorities) : n.overallScore}</span>
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

                {genError && (
                  <div className="mt-2 px-3 py-2 rounded-[8px] bg-[var(--score-low)]/10 border border-[var(--score-low)]/20">
                    <p className="text-[12px] text-[var(--score-low)]">{genError}</p>
                  </div>
                )}

                {generating && (
                  <div className="mt-2 px-3 py-2.5 rounded-[8px] border border-[var(--border)] bg-[var(--bg-surface)]">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin" />
                      <p className="text-[12px] text-[var(--text-muted)]">{progressText || 'Generating...'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Overall Score — always visible */}
              <div className="flex flex-col items-center">
                <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)] mb-3">
                  {priorities.length > 0 ? 'Personalized Score' : 'Overall Score'}
                </span>
                <ScoreCircle score={priorities.length > 0 ? computePersonalizedScore(neighborhood.categories, priorities) : neighborhood.overallScore} size="lg" />
              </div>

              <div className="flex justify-center mt-3">
                <SustainabilityBadge categories={neighborhood.categories} />
              </div>
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
                    weight={categoryWeights[category.label]}
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

            {/* Local Recommendations */}
            <LocalRecommendations
              coordinates={neighborhood.coordinates}
              neighborhoodName={neighborhood.name}
            />
          </div>
        </div>

        {/* Market Snapshot — only on Buy tab */}
        {activeTab === 'buy' && (
          <MarketSnapshot listings={listings} loading={listingsLoading} />
        )}

        {/* Listings Grid */}
        <ListingsGrid
          listings={listings}
          rentals={rentals}
          airbnbs={airbnbs}
          loading={listingsLoading}
          rentalsLoading={rentalsLoading}
          airbnbsLoading={airbnbsLoading}
          error={listingsError}
          rentalsError={rentalsError}
          airbnbsError={airbnbsError}
          neighborhoodName={neighborhood.name}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Mortgage Calculator — only on Buy tab */}
        {activeTab === 'buy' && (
          <MortgageCalculator medianPrice={medianPrice} />
        )}

      </div>
    </div>
  )
}
