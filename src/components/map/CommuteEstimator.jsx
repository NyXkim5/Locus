import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { estimateRoute, geocodeAddress } from '../../services/mapcnRouting'

const MODE_OPTIONS = [
  {
    value: 'driving',
    label: 'Driving',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l1.5-4.5A2 2 0 0 1 6.4 5h11.2a2 2 0 0 1 1.9 1.5L21 11v6a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-6z" />
      </svg>
    ),
  },
  {
    value: 'transit',
    label: 'Transit',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M4 6h16v10H4z" fill="none" />
        <path d="M6 16v2M18 16v2M4 10h16M7 7v2M17 7v2" />
      </svg>
    ),
  },
  {
    value: 'walking',
    label: 'Walking',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <circle cx="12" cy="3" r="1.5" fill="none" />
        <path d="M12 5v4M10 9l-3 6M14 9l3 6M10 15v4M14 15v4" />
      </svg>
    ),
  },
]

export default function CommuteEstimator({ origin, mapRef }) {
  const [destination, setDestination] = useState('')
  const [mode, setMode] = useState('driving')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)


  const rendererRef = useRef(null)
  const inputRef = useRef(null)
  const autocompleteRef = useRef(null)
  const panelRef = useRef(null)
  const destinationRef = useRef('')

  // Keep a ref in sync so the auto-estimate callback always has latest destination
  destinationRef.current = destination

  const clearRoute = useCallback(() => {
    if (rendererRef.current) {
      rendererRef.current.setMap(null)
      rendererRef.current = null
    }
  }, [])

  const runEstimate = useCallback(async (dest, travelMode) => {
    if (!dest) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await estimateRoute(origin, dest, travelMode)
      setResult(res)

      // Render route on the Google Map
      try {
        if (window.google && mapRef?.current) {
          clearRoute()
          const originCoord = typeof origin === 'string' ? await geocodeAddress(origin) : origin
          const destCoord = await geocodeAddress(dest)
          const directionsService = new window.google.maps.DirectionsService()
          const travelModeMap = {
            driving: window.google.maps.TravelMode.DRIVING,
            transit: window.google.maps.TravelMode.TRANSIT,
            walking: window.google.maps.TravelMode.WALKING,
          }
          directionsService.route(
            {
              origin: new window.google.maps.LatLng(originCoord.lat, originCoord.lng),
              destination: new window.google.maps.LatLng(destCoord.lat, destCoord.lng),
              travelMode: travelModeMap[travelMode] || travelModeMap.driving,
            },
            (response, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                const renderer = new window.google.maps.DirectionsRenderer({
                  suppressMarkers: false,
                  map: mapRef.current,
                  polylineOptions: { strokeColor: '#6366f1', strokeWeight: 5, strokeOpacity: 0.95 },
                })
                renderer.setDirections(response)
                rendererRef.current = renderer
              }
            }
          )
        }
      } catch {
        // route rendering is best-effort
      }
    } catch (err) {
      setError(err.message || 'Estimate failed')
    } finally {
      setLoading(false)
    }
  }, [origin, mapRef, clearRoute])

  // Set up Google Places Autocomplete when the panel opens
  useEffect(() => {
    if (!open || !inputRef.current || !window.google?.maps?.places) return
    if (autocompleteRef.current) return // already initialized

    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['establishment', 'geocode'],
      fields: ['formatted_address', 'name', 'geometry'],
    })

    // Bias toward the neighborhood's location
    if (origin?.lat && origin?.lng) {
      ac.setBounds(new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(origin.lat - 0.15, origin.lng - 0.15),
        new window.google.maps.LatLng(origin.lat + 0.15, origin.lng + 0.15)
      ))
      ac.setOptions({ strictBounds: false })
    }

    ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      const addr = place?.formatted_address || place?.name || ''
      if (addr) {
        setDestination(addr)
        destinationRef.current = addr
        // Auto-estimate immediately after place selection
        runEstimate(addr, mode)
      }
    })

    autocompleteRef.current = ac
  }, [open, origin, mode, runEstimate])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRoute()
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }
    }
  }, [clearRoute])

  // Close panel on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        // Don't close if clicking on pac-container (autocomplete dropdown)
        if (e.target.closest('.pac-container')) return
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleModeSelect = (newMode) => {
    setMode(newMode)
    // Auto-estimate if destination is already filled
    if (destinationRef.current) {
      runEstimate(destinationRef.current, newMode)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && destination) {
      runEstimate(destination, mode)
    }
  }

  return (
    <div className="absolute top-3 right-3 z-[1100]" ref={panelRef}>
      {/* Toggle button */}
      <button
        aria-label="Toggle commute estimator"
        onClick={() => setOpen((v) => !v)}
        className={`
          w-11 h-11 rounded-xl border border-[var(--border,#e5e7eb)]
          bg-[var(--bg-base,white)] flex items-center justify-center
          shadow-sm hover:shadow-md transition-all duration-200
          ${open ? 'ring-2 ring-indigo-500/30' : ''}
        `}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary,#111827)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11l1.5-4.5A2 2 0 0 1 6.4 5h11.2a2 2 0 0 1 1.9 1.5L21 11v6a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-6z" />
        </svg>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-[280px] mt-2 bg-[var(--bg-base,white)] border border-[var(--border,#e5e7eb)] rounded-xl p-3 shadow-lg"
          >
            <div className="text-[12px] font-bold text-[var(--text-primary,#111)] mb-2">
              Estimate Commute
            </div>

            {/* Destination input with Places Autocomplete */}
            <input
              ref={inputRef}
              aria-label="Destination address"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search a destination..."
              className="w-full px-3 py-2 mb-2 rounded-lg border border-[var(--border,#e5e7eb)] bg-[var(--bg-surface,#fafafa)] text-[13px] text-[var(--text-primary,#111)] placeholder:text-[var(--text-muted,#9ca3af)] outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-150"
            />

            {/* Mode selector - pill buttons instead of dropdown */}
            <div className="flex gap-1 mb-2">
              {MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleModeSelect(opt.value)}
                  aria-pressed={mode === opt.value}
                  className={`
                    flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-medium
                    transition-all duration-150 cursor-pointer border
                    ${mode === opt.value
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-[var(--bg-surface,#fafafa)] border-[var(--border,#e5e7eb)] text-[var(--text-muted,#6b7280)] hover:bg-[var(--bg-base,#f3f4f6)] hover:text-[var(--text-primary,#111)]'
                    }
                  `}
                >
                  <span className="flex items-center justify-center w-4 h-4">{opt.icon}</span>
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Loading indicator */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 py-2"
                >
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[var(--border,#e5e7eb)] border-t-indigo-500 animate-spin" />
                  <span className="text-[12px] text-[var(--text-muted,#9ca3af)]">Estimating...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[12px] text-[var(--danger,#ef4444)] py-1"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result */}
            <AnimatePresence>
              {result && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="mt-1 pt-2 border-t border-[var(--border,#f3f4f6)]"
                >
                  <div className="text-[15px] font-bold text-[var(--text-primary,#111)]">
                    {result.durationText}
                  </div>
                  <div className="text-[12px] text-[var(--text-muted,#6b7280)] mt-0.5">
                    {result.distanceText} &middot; {result.mode}
                  </div>
                  {result.mocked && (
                    <div className="text-[12px] text-[var(--text-muted,#9ca3af)] mt-1.5 italic">
                      Approximate estimate
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
