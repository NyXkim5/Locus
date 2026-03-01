import { useCallback, useRef, useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import CBGS_GEOJSON from '../../data/irvine_cbgs.json'
import CBG_SCORES from '../../data/cbg_scores.json'

const BAY_AREA_IDS = new Set(['berkeley'])
const _geoCache = {}
const _scoreCache = {}
async function loadBayArea() {
  if (!_geoCache.bay) {
    const [g, s] = await Promise.all([fetch('/bay_area_cbgs.json'), fetch('/bay_area_cbg_scores.json')])
    _geoCache.bay = await g.json()
    _scoreCache.bay = await s.json()
  }
  return { geo: _geoCache.bay, scores: _scoreCache.bay }
}

function scoreToColor(score) {
  if (score == null) return '#94a3b8'
  if (score >= 80) return '#22c55e'
  if (score >= 70) return '#84cc16'
  if (score >= 60) return '#f59e0b'
  if (score >= 50) return '#f97316'
  return '#ef4444'
}

function getScores(geoid, CBG_SCORES) {
  const row = (CBG_SCORES||{})[geoid]
  const overall = row?.overall ?? null
  const livability = row?.livability ?? row?.transit ?? null
  const community = row?.community ?? row?.green_space ?? null
  const safety = row?.safety ?? null
  const growth = row?.growth ?? null
  return { overall, livability, community, safety, growth }
}

function scoreColor(score) {
  if (score == null) return '#94a3b8'
  return score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'
}

function MiniPanel({ cbg, cbgScores, onClose }) {
  if (!cbg) return null

  const scores = getScores(cbg.geoid, cbgScores)

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
          <div style={{ fontSize: 10, color: 'var(--text-muted, #9ca3af)', fontFamily: 'monospace' }}>{cbg.geoid}</div>
        </div>
        <button
          onClick={onClose}
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
            <div style={{ fontSize: 28, fontWeight: 700, color: scoreColor(scores.overall) }}>{scores.overall}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted, #6b7280)' }}>Overall<br />Score</div>
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
                  <span style={{ fontSize: 11, color: 'var(--text-muted, #6b7280)' }}>{label}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: scoreColor(score) }}>{score}</span>
                </div>
                <div style={{ height: 3, background: 'var(--border, #f3f4f6)', borderRadius: 2 }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${score}%`,
                      background: scoreColor(score),
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

function getFeatureCity(feature, CBG_SCORES) {
  const geoid = getFeatureGeoid(feature)
  return (CBG_SCORES||{})[geoid]?.city || feature.getProperty('city') || 'Unknown'
}

function getFeatureStyle(feature, CBG_SCORES) {
  const geoid = getFeatureGeoid(feature)
  const score = geoid ? (CBG_SCORES||{})[geoid]?.overall ?? null : null
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

export default function MapPlaceholder({ name, coordinates, neighborhoodId }) {
  const isBayArea = BAY_AREA_IDS.has(neighborhoodId)
  const [selectedCbg, setSelectedCbg] = useState(null)
  const [cbgGeo, setCbgGeo]       = useState(isBayArea ? null : CBGS_GEOJSON)
  const [cbgScores, setCbgScores] = useState(isBayArea ? {} : CBG_SCORES)
  const [mapReady, setMapReady]   = useState(false)

  const initialCenter = useRef({ lat: coordinates.lat, lng: coordinates.lng })
  const mapRef = useRef(null)
  const selectedFeatureRef = useRef(null)
  const hoveredFeatureRef = useRef(null)
  const listenersRef = useRef([])

  useEffect(() => {
    if (isBayArea) {
      loadBayArea().then(({ geo, scores }) => { setCbgGeo(geo); setCbgScores(scores) })
    } else {
      setCbgGeo(CBGS_GEOJSON)
      setCbgScores(CBG_SCORES)
    }
  }, [isBayArea])

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

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
    setMapReady(true)
  }, [])

  const handleMapUnmount = useCallback(() => {
    removeListeners()
    selectedFeatureRef.current = null
    hoveredFeatureRef.current = null
    mapRef.current = null
  }, [removeListeners])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !cbgGeo) return

    map.data.forEach((f) => map.data.remove(f))
    listenersRef.current.forEach((l) => l.remove())
    listenersRef.current = []

    map.data.addGeoJson(cbgGeo)
    map.data.setStyle((f) => getFeatureStyle(f, cbgScores))

    const overListener = map.data.addListener('mouseover', (event) => {
      if (hoveredFeatureRef.current && hoveredFeatureRef.current !== selectedFeatureRef.current) {
        hoveredFeatureRef.current.setProperty('__hover', false)
      }
      if (event.feature !== selectedFeatureRef.current) {
        event.feature.setProperty('__hover', true)
        hoveredFeatureRef.current = event.feature
      }
    })
    const outListener = map.data.addListener('mouseout', (event) => {
      if (event.feature !== selectedFeatureRef.current) {
        event.feature.setProperty('__hover', false)
      }
      if (hoveredFeatureRef.current === event.feature) hoveredFeatureRef.current = null
    })
    const clickListener = map.data.addListener('click', (event) => {
      if (hoveredFeatureRef.current && hoveredFeatureRef.current !== selectedFeatureRef.current) {
        hoveredFeatureRef.current.setProperty('__hover', false)
      }
      hoveredFeatureRef.current = null
      if (selectedFeatureRef.current && selectedFeatureRef.current !== event.feature) {
        selectedFeatureRef.current.setProperty('__hover', false)
        selectedFeatureRef.current.setProperty('__selected', false)
      }
      event.feature.setProperty('__selected', true)
      event.feature.setProperty('__hover', false)
      selectedFeatureRef.current = event.feature
      setSelectedCbg({
        geoid: getFeatureGeoid(event.feature),
        city: getFeatureCity(event.feature, cbgScores),
      })
    })
    const mapClickListener = map.addListener('click', () => {
      if (hoveredFeatureRef.current && hoveredFeatureRef.current !== selectedFeatureRef.current) {
        hoveredFeatureRef.current.setProperty('__hover', false)
      }
      hoveredFeatureRef.current = null
      if (selectedFeatureRef.current) {
        selectedFeatureRef.current.setProperty('__hover', false)
        selectedFeatureRef.current.setProperty('__selected', false)
        selectedFeatureRef.current = null
      }
      setSelectedCbg(null)
    })
    listenersRef.current = [overListener, outListener, clickListener, mapClickListener]
  }, [cbgGeo, cbgScores, mapReady])

  const handleClosePanel = () => {
    clearHover()
    clearSelection()
  }

  if (!googleMapsApiKey) {
    return (
      <div className="relative w-full rounded-[10px] overflow-hidden border border-[var(--border)] h-[250px] sm:h-[350px] md:h-full md:min-h-[400px] shadow-sm bg-[var(--bg-surface)] flex items-center justify-center">
        <p className="text-[13px] text-[var(--text-muted)]">Missing Google Maps API key</p>
      </div>
    )
  }

  return (
    <div className="relative w-full rounded-[10px] overflow-hidden border border-[var(--border)] h-[250px] sm:h-[350px] md:h-full md:min-h-[400px] shadow-sm">
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={initialCenter.current}
          zoom={13}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            clickableIcons: false,
          }}
          onLoad={handleMapLoad}
          onUnmount={handleMapUnmount}
          key={neighborhoodId}
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
        </GoogleMap>
      </LoadScript>

      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          zIndex: 1000,
          background: 'var(--bg-base, white)',
          border: '1px solid var(--border, #e5e7eb)',
          borderRadius: 8,
          padding: '8px 12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted, #9ca3af)',
            marginBottom: 6,
          }}
        >
          Overall Score
        </div>
        {[
          { label: '80-100', color: '#22c55e' },
          { label: '70-79', color: '#84cc16' },
          { label: '60-69', color: '#f59e0b' },
          { label: '50-59', color: '#f97316' },
          { label: '< 50', color: '#ef4444' },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: 'var(--text-secondary, #6b7280)' }}>{label}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          zIndex: 1000,
          background: 'rgba(255,255,255,0.9)',
          borderRadius: 6,
          padding: '4px 10px',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--text-secondary, #374151)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        {name}
      </div>

      <MiniPanel cbg={selectedCbg} cbgScores={cbgScores} onClose={handleClosePanel} />
    </div>
  )
}