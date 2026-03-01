import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useJsApiLoader } from '@react-google-maps/api'
import { fetchNearbyPlaces, searchPlaces } from '../../services/places'
import useStore from '../../store/useStore'
import PlaceCard from './PlaceCard'
import InterestTags from './InterestTags'

const LIBRARIES = ['places']

const TABS = [
  { key: 'restaurant', label: 'Restaurants', type: 'restaurant' },
  { key: 'cafe', label: 'Cafes', type: 'cafe' },
  { key: 'things', label: 'Things to Do', type: 'tourist_attraction' },
]

function SkeletonCard() {
  return (
    <div className="flex gap-3 p-2.5 rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] animate-pulse">
      <div className="w-14 h-14 rounded-[8px] bg-[var(--bg-elevated)] flex-shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 bg-[var(--bg-elevated)] rounded w-3/4" />
        <div className="h-2.5 bg-[var(--bg-elevated)] rounded w-1/2" />
        <div className="h-2 bg-[var(--bg-elevated)] rounded w-2/3" />
      </div>
    </div>
  )
}

export default function LocalRecommendations({ coordinates, neighborhoodName }) {
  const interests = useStore((s) => s.interests)
  const [activeTab, setActiveTab] = useState('restaurant')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const coordsRef = useRef(null)

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  // Share the same singleton loader as MapPlaceholder — won't double-load
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey || '',
    libraries: LIBRARIES,
  })

  // Reset data when neighborhood changes
  useEffect(() => {
    const key = `${coordinates.lat},${coordinates.lng}`
    if (coordsRef.current !== key) {
      coordsRef.current = key
      setData({})
      setError(null)
    }
  }, [coordinates])

  const allTabs = interests.length > 0
    ? [...TABS, { key: 'picks', label: 'Your Picks', type: null }]
    : TABS

  // Auto-switch to "Your Picks" when first interest is added
  const prevInterestCount = useRef(interests.length)
  useEffect(() => {
    if (interests.length > 0 && prevInterestCount.current === 0) {
      setActiveTab('picks')
    }
    prevInterestCount.current = interests.length
  }, [interests.length])

  // Lazy fetch: only active tab's data
  const fetchTab = useCallback(async (tabKey) => {
    if (!coordinates) return

    setLoading(true)
    setError(null)

    try {
      const { lat, lng } = coordinates

      if (tabKey === 'picks') {
        const seen = new Set()
        const results = []
        for (const interest of interests) {
          // Pass just the interest keyword — searchFallbackPlaces extracts it from the query
          const places = await searchPlaces(lat, lng, `best ${interest} near ${neighborhoodName}`)
          for (const p of places) {
            if (!seen.has(p.id)) {
              seen.add(p.id)
              results.push(p)
            }
          }
        }
        setData((prev) => ({ ...prev, picks: results.slice(0, 10) }))
      } else {
        const tab = TABS.find((t) => t.key === tabKey)
        if (!tab) return
        const places = await fetchNearbyPlaces(lat, lng, tab.type)
        setData((prev) => ({ ...prev, [tabKey]: places }))
      }
    } catch (err) {
      setError(err.message || 'Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }, [coordinates, interests, neighborhoodName])

  // Fetch when tab changes, data is missing, or Google Maps finishes loading
  useEffect(() => {
    if (!data[activeTab]) {
      fetchTab(activeTab)
    }
  }, [activeTab, data, fetchTab, isLoaded])

  // Re-fetch "picks" when interests change
  useEffect(() => {
    if (activeTab === 'picks' && interests.length > 0) {
      setData((prev) => {
        const next = { ...prev }
        delete next.picks
        return next
      })
    }
  }, [interests, activeTab])

  const places = data[activeTab] || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.4 }}
      className="mt-5"
    >
      {/* Header */}
      <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)] mb-3">
        Local Picks
      </h3>

      {/* Interest input */}
      <div className="mb-3">
        <InterestTags />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3 overflow-x-auto">
        {allTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && !places.length ? (
        <div className="space-y-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <div className="p-3 rounded-[10px] border border-[var(--score-low)]/20 bg-[var(--score-low)]/5">
          <p className="text-[12px] text-[var(--score-low)]">{error}</p>
        </div>
      ) : places.length === 0 && !loading ? (
        <div className="p-4 rounded-[10px] border border-dashed border-[var(--border)] text-center">
          <p className="text-[12px] text-[var(--text-muted)]">
            {activeTab === 'picks'
              ? 'Add interests above to get personalized picks!'
              : 'No places found nearby.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {places.map((place, i) => (
            <PlaceCard key={place.id} place={place} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
