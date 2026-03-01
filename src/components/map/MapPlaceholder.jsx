import { useCallback, useRef, useState, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import CommuteEstimator from './CommuteEstimator'
import { getScoreColorHex } from '../../utils/scoreColor'

const LIBRARIES = ['places']

// Bay Area neighborhoods use runtime-fetched data (avoids bundling 27MB)
const BAY_AREA_IDS = new Set(['berkeley', 'san-francisco'])

// Irvine (default) — lazy-loaded via import()
let _cbgGeoJson = null
let _cbgScores = null
let _dataPromise = null

// Bay Area — loaded via fetch() from /public
let _bayAreaGeoJson = null
let _bayAreaScores = null
let _bayAreaPromise = null

function loadIrvineData() {
  if (_cbgGeoJson && _cbgScores) return Promise.resolve()
  if (_dataPromise) return _dataPromise
  _dataPromise = Promise.all([
    import('../../data/irvine_cbgs.json').then((m) => { _cbgGeoJson = m.default }),
    import('../../data/cbg_scores.json').then((m) => { _cbgScores = m.default }),
  ])
  return _dataPromise
}

function loadBayAreaData() {
  if (_bayAreaGeoJson && _bayAreaScores) return Promise.resolve()
  if (_bayAreaPromise) return _bayAreaPromise
  _bayAreaPromise = Promise.all([
    fetch('/bay_area_cbgs.json').then((r) => r.json()).then((d) => { _bayAreaGeoJson = d }),
    fetch('/bay_area_cbg_scores.json').then((r) => r.json()).then((d) => { _bayAreaScores = d }),
  ])
  return _bayAreaPromise
}

function loadCbgData(region) {
  return region === 'bay-area' ? loadBayAreaData() : loadIrvineData()
}

function getGeoJsonForRegion(region) {
  return region === 'bay-area' ? _bayAreaGeoJson : _cbgGeoJson
}

function getScoresForRegion(region) {
  return region === 'bay-area' ? _bayAreaScores : _cbgScores
}

function scoreToColor(score) {
  if (score == null) return '#94a3b8'
  if (score >= 80) return '#22c55e'
  if (score >= 70) return '#84cc16'
  if (score >= 60) return '#f59e0b'
  if (score >= 50) return '#f97316'
  return '#ef4444'
}

function getScores(geoid, scores) {
  if (!scores) return { overall: null, livability: null, community: null, safety: null, growth: null }
  const row = scores[geoid]
  const overall = row?.overall ?? null
  const livability = row?.livability ?? row?.transit ?? null
  const community = row?.community ?? row?.green_space ?? null
  const safety = row?.safety ?? null
  const growth = row?.growth ?? null
  return { overall, livability, community, safety, growth }
}

function MiniPanel({ cbg, onClose, region }) {
  if (!cbg) return null

  const scores = getScores(cbg.geoid, getScoresForRegion(region))

  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 1000,
        background: 'var(--bg-base, white)',
        border: '1px solid var(--border, #e5e7eb)',
        borderRadius: 12,
        padding: '14px 16px',
        width: 220,
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary, #111)' }}>{cbg.city}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted, #9ca3af)', fontFamily: 'monospace' }}>{cbg.geoid}</div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close details panel"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 18,
            color: 'var(--text-muted, #9ca3af)',
            lineHeight: 1,
            padding: 0,
          }}
        >
          x
        </button>
      </div>

      {scores.overall != null && (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
              paddingBottom: 10,
              borderBottom: '1px solid var(--border, #f3f4f6)',
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: getScoreColorHex(scores.overall) }}>{scores.overall}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted, #6b7280)' }}>Overall<br />Score</div>
          </div>

          {[
            { label: 'Livability', score: scores.livability },
            { label: 'Community', score: scores.community },
            { label: 'Safety', score: scores.safety },
            { label: 'Growth', score: scores.growth },
          ]
            .filter((item) => item.score != null)
            .map(({ label, score }) => (
              <div key={label} style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted, #6b7280)' }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: getScoreColorHex(score) }}>{score}</span>
                </div>
                <div style={{ height: 3, background: 'var(--border, #f3f4f6)', borderRadius: 2 }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${score}%`,
                      background: getScoreColorHex(score),
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  )
}

function getFeatureGeoid(feature) {
  return String(feature.getProperty('GEOID') ?? '')
}

function getFeatureCity(feature, region) {
  const geoid = getFeatureGeoid(feature)
  const scores = getScoresForRegion(region)
  return scores?.[geoid]?.city || feature.getProperty('city') || (region === 'bay-area' ? 'Bay Area' : 'Orange County')
}

function getFeatureStyle(feature, region) {
  const geoid = getFeatureGeoid(feature)
  const scores = getScoresForRegion(region)
  const score = geoid ? scores?.[geoid]?.overall ?? null : null
  const fill = scoreToColor(score)
  const isSelected = Boolean(feature.getProperty('__selected'))
  const isHover = Boolean(feature.getProperty('__hover'))

  if (isSelected) {
    return {
      fillColor: fill,
      fillOpacity: 0.75,
      strokeColor: '#1e1b4b',
      strokeOpacity: 0.95,
      strokeWeight: 2.5,
      clickable: true,
      zIndex: 30,
    }
  }

  if (isHover) {
    return {
      fillColor: fill,
      fillOpacity: 0.6,
      strokeColor: '#312e81',
      strokeOpacity: 0.85,
      strokeWeight: 1.5,
      clickable: true,
      zIndex: 20,
    }
  }

  return {
    fillColor: fill,
    fillOpacity: 0.38,
    strokeColor: '#6366f1',
    strokeOpacity: 0.2,
    strokeWeight: 0.6,
    clickable: true,
    zIndex: 10,
  }
}

const HIDDEN_STYLE = { fillOpacity: 0, strokeOpacity: 0, clickable: false, zIndex: 0 }

export default function MapPlaceholder({ name, coordinates, listings = [], neighborhoodId }) {
  const region = BAY_AREA_IDS.has(neighborhoodId) ? 'bay-area' : 'irvine'

  const [selectedCbg, setSelectedCbg] = useState(null)
  const [dataReady, setDataReady] = useState(false)
  const [overlayOn, setOverlayOn] = useState(true)

  const mapRef = useRef(null)
  const selectedFeatureRef = useRef(null)
  const hoveredFeatureRef = useRef(null)
  const listenersRef = useRef([])

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
    libraries: LIBRARIES,
  })

  // Load CBG data for the current region
  useEffect(() => {
    setDataReady(false)
    loadCbgData(region).then(() => setDataReady(true))
  }, [region])

  const removeListeners = useCallback(() => {
    listenersRef.current.forEach((listener) => listener.remove())
    listenersRef.current = []
  }, [])

  const resetFeatureState = useCallback((feature) => {
    if (!feature) return
    feature.setProperty('__hover', false)
    feature.setProperty('__selected', false)
  }, [])

  const clearSelection = useCallback(() => {
    if (selectedFeatureRef.current) {
      resetFeatureState(selectedFeatureRef.current)
      selectedFeatureRef.current = null
    }
    setSelectedCbg(null)
  }, [resetFeatureState])

  const clearHover = useCallback(() => {
    if (hoveredFeatureRef.current && hoveredFeatureRef.current !== selectedFeatureRef.current) {
      hoveredFeatureRef.current.setProperty('__hover', false)
    }
    hoveredFeatureRef.current = null
  }, [])

  const handleMapLoad = useCallback((map) => {
    mapRef.current = map
    removeListeners()

    const geoJson = getGeoJsonForRegion(region)

    // Add GeoJSON data if ready
    if (geoJson) {
      map.data.forEach((feature) => map.data.remove(feature))
      map.data.addGeoJson(geoJson)
      map.data.setStyle((feature) => getFeatureStyle(feature, region))
    }

    const overListener = map.data.addListener('mouseover', (event) => {
      clearHover()
      if (event.feature !== selectedFeatureRef.current) {
        event.feature.setProperty('__hover', true)
        hoveredFeatureRef.current = event.feature
      }
    })

    const outListener = map.data.addListener('mouseout', (event) => {
      if (event.feature !== selectedFeatureRef.current) {
        event.feature.setProperty('__hover', false)
      }
      if (hoveredFeatureRef.current === event.feature) {
        hoveredFeatureRef.current = null
      }
    })

    const clickListener = map.data.addListener('click', (event) => {
      clearHover()

      if (selectedFeatureRef.current && selectedFeatureRef.current !== event.feature) {
        resetFeatureState(selectedFeatureRef.current)
      }

      event.feature.setProperty('__selected', true)
      event.feature.setProperty('__hover', false)
      selectedFeatureRef.current = event.feature

      setSelectedCbg({
        geoid: getFeatureGeoid(event.feature),
        city: getFeatureCity(event.feature, region),
      })
    })

    const mapClickListener = map.addListener('click', () => {
      clearHover()
      clearSelection()
    })

    listenersRef.current = [overListener, outListener, clickListener, mapClickListener]
  }, [region, clearHover, clearSelection, removeListeners, resetFeatureState])

  // When data finishes loading after map is already up, inject the GeoJSON
  useEffect(() => {
    const geoJson = getGeoJsonForRegion(region)
    if (dataReady && mapRef.current && geoJson) {
      const map = mapRef.current
      map.data.forEach((feature) => map.data.remove(feature))
      map.data.addGeoJson(geoJson)
      map.data.setStyle((feature) => getFeatureStyle(feature, region))
    }
  }, [dataReady, region])

  const handleMapUnmount = useCallback(() => {
    removeListeners()
    selectedFeatureRef.current = null
    hoveredFeatureRef.current = null
    mapRef.current = null
  }, [removeListeners])

  // Toggle overlay visibility
  useEffect(() => {
    if (!mapRef.current || !dataReady) return
    const map = mapRef.current
    if (overlayOn) {
      map.data.setStyle((feature) => getFeatureStyle(feature, region))
    } else {
      map.data.setStyle(() => HIDDEN_STYLE)
      clearHover()
      clearSelection()
    }
  }, [overlayOn, dataReady, region, clearHover, clearSelection])

  const handleClosePanel = () => {
    clearHover()
    clearSelection()
  }

  if (!googleMapsApiKey) {
    return (
      <div className="relative w-full rounded-[10px] overflow-hidden border border-[var(--border)] h-[250px] sm:h-[350px] md:h-[420px] shadow-sm bg-[var(--bg-surface)] flex items-center justify-center">
        <p className="text-[13px] text-[var(--text-muted)]">Missing Google Maps API key</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="relative w-full rounded-[10px] overflow-hidden border border-[var(--border)] h-[250px] sm:h-[350px] md:h-[420px] shadow-sm bg-[var(--bg-surface)] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin" />
          <span className="text-[13px] text-[var(--text-muted)]">Loading map...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full rounded-[10px] overflow-hidden border border-[var(--border)] h-[250px] sm:h-[350px] md:h-[420px] shadow-sm">
      <GoogleMap
        key={neighborhoodId}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={{ lat: coordinates.lat, lng: coordinates.lng }}
        zoom={13}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
        }}
        onLoad={handleMapLoad}
        onUnmount={handleMapUnmount}
      >
        <Marker
          position={{ lat: coordinates.lat, lng: coordinates.lng }}
          icon={{
            path: window.google?.maps?.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: '#6366f1',
            fillOpacity: 0.95,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          }}
        />
        {listings
          .filter((l) => l.lat != null && l.lng != null)
          .map((l) => (
            <Marker
              key={l.id}
              position={{ lat: l.lat, lng: l.lng }}
              label={l.price ? {
                text: `$${l.price >= 1_000_000 ? (l.price / 1_000_000).toFixed(1) + 'M' : Math.round(l.price / 1_000) + 'K'}`,
                fontSize: '11px',
                fontWeight: '700',
                color: '#065f46',
                className: 'listing-marker-label',
              } : undefined}
              icon={{
                path: window.google?.maps?.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#10b981',
                fillOpacity: 0.95,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                labelOrigin: window.google ? new window.google.maps.Point(0, 3) : undefined,
              }}
            />
          ))}
      </GoogleMap>

      <CommuteEstimator origin={coordinates} mapRef={mapRef} />

      {/* Score overlay toggle */}
      {dataReady && (
        <button
          onClick={() => setOverlayOn((v) => !v)}
          aria-label={overlayOn ? 'Hide score overlay' : 'Show score overlay'}
          className={`
            absolute top-3 left-3 z-[1000] flex items-center gap-1.5
            px-2.5 py-1.5 rounded-lg border text-[12px] font-medium
            transition-all duration-200 cursor-pointer shadow-sm
            ${overlayOn
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : 'bg-[var(--bg-base,white)] border-[var(--border,#e5e7eb)] text-[var(--text-muted,#9ca3af)]'
            }
          `}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          Scores
        </button>
      )}

      {/* Legend — only visible when overlay is on */}
      {dataReady && overlayOn && (
        <div
          className="absolute bottom-3 right-3 z-[1000] bg-[var(--bg-base,white)] border border-[var(--border,#e5e7eb)] rounded-lg px-3 py-2 shadow-sm"
        >
          <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted,#9ca3af)] mb-1.5">
            Overall Score
          </div>
          {[
            { label: '80-100', color: '#22c55e' },
            { label: '70-79', color: '#84cc16' },
            { label: '60-69', color: '#f59e0b' },
            { label: '50-59', color: '#f97316' },
            { label: '< 50', color: '#ef4444' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5 mb-0.5">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: color }} />
              <span className="text-[12px] text-[var(--text-secondary,#6b7280)]">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* City name label */}
      <div
        className="absolute bottom-3 left-3 z-[1000] bg-[var(--bg-base)]/90 rounded-md px-2.5 py-1 text-[13px] font-medium text-[var(--text-secondary,#374151)] shadow-sm"
      >
        {name}
      </div>

      {/* Mini panel — only when overlay is on */}
      {overlayOn && <MiniPanel cbg={selectedCbg} onClose={handleClosePanel} region={region} />}
    </div>
  )
}
