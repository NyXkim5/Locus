import { useCallback, useRef, useState, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import CBGS_GEOJSON from '../../data/irvine_cbgs.json'
import CBG_SCORES from '../../data/cbg_scores.json'

function scoreToColor(score) {
  if (score == null) return '#94a3b8'
  if (score >= 80) return '#22c55e'
  if (score >= 70) return '#84cc16'
  if (score >= 60) return '#f59e0b'
  if (score >= 50) return '#f97316'
  return '#ef4444'
}

function cbgStyle(feature, isHover = false, isSelected = false) {
  const geoid = feature?.properties?.GEOID
  const score = geoid ? (CBG_SCORES[geoid]?.overall ?? null) : null
  const fill = scoreToColor(score)
  if (isSelected) return { weight: 2.5, color: '#1e1b4b', fillColor: fill, fillOpacity: 0.75 }
  if (isHover)    return { weight: 1.5, color: '#312e81', fillColor: fill, fillOpacity: 0.60 }
  return { weight: 0.6, color: '#6366f133', fillColor: fill, fillOpacity: 0.38 }
}

function getScores(geoid) {
  const r = CBG_SCORES[geoid]
  const overall = r?.overall ?? null
  const livability = r?.livability ?? r?.transit ?? null
  const community = r?.community ?? r?.green_space ?? null
  const safety = r?.safety ?? null
  const growth = r?.growth ?? null
  return { overall, livability, community, safety, growth }
}

function MapCenter({ lat, lng, zoom }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng], zoom) }, [map, lat, lng, zoom])
  return null
}

function scoreColor(s) {
  if (s == null) return '#94a3b8'
  return s >= 80 ? '#22c55e' : s >= 60 ? '#f59e0b' : '#ef4444'
}

function MiniPanel({ cbg, onClose }) {
  if (!cbg) return null
  const geoid = cbg.properties.GEOID
  const city = CBG_SCORES[geoid]?.city || cbg.properties.city || 'Orange County'
  const scores = getScores(geoid)

  return (
    <div style={{
      position: 'absolute', top: 12, left: 12, zIndex: 1000,
      background: 'var(--bg-base, white)', border: '1px solid var(--border, #e5e7eb)',
      borderRadius: 12, padding: '14px 16px', width: 220,
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary, #111)' }}>{city}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted, #9ca3af)', fontFamily: 'monospace' }}>{geoid}</div>
        </div>
        <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: 'var(--text-muted, #9ca3af)', lineHeight: 1, padding: 0 }}>×</button>
      </div>
      {scores.overall != null && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid var(--border, #f3f4f6)' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: scoreColor(scores.overall) }}>{scores.overall}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted, #6b7280)' }}>Overall<br/>Score</div>
          </div>
          {[
            { label: 'Livability', score: scores.livability },
            { label: 'Community',  score: scores.community  },
            { label: 'Safety',     score: scores.safety     },
            { label: 'Growth',     score: scores.growth     },
          ].filter(x => x.score != null).map(({ label, score }) => (
            <div key={label} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted, #6b7280)' }}>{label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: scoreColor(score) }}>{score}</span>
              </div>
              <div style={{ height: 3, background: 'var(--border, #f3f4f6)', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${score}%`, background: scoreColor(score), borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default function MapPlaceholder({ name, coordinates, overallScore, listings = [] }) {
  const [selectedCbg, setSelectedCbg] = useState(null)
  const selectedLayerRef = useRef(null)
  const hoveredLayerRef  = useRef(null)

  const clearHover = useCallback(() => {
    if (hoveredLayerRef.current && hoveredLayerRef.current !== selectedLayerRef.current) {
      hoveredLayerRef.current.setStyle(cbgStyle(hoveredLayerRef.current.feature))
    }
    hoveredLayerRef.current = null
  }, [])

  const onEachFeature = useCallback((feature, layer) => {
    layer.setStyle(cbgStyle(feature))
    layer.on({
      mouseover(e) {
        clearHover()
        if (e.target !== selectedLayerRef.current) {
          e.target.setStyle(cbgStyle(feature, true))
          e.target.bringToFront()
          hoveredLayerRef.current = e.target
        }
      },
      mouseout(e) {
        if (e.target !== selectedLayerRef.current) e.target.setStyle(cbgStyle(feature))
        if (hoveredLayerRef.current === e.target) hoveredLayerRef.current = null
      },
      click(e) {
        clearHover()
        if (selectedLayerRef.current && selectedLayerRef.current !== e.target) {
          selectedLayerRef.current.setStyle(cbgStyle(selectedLayerRef.current.feature))
        }
        e.target.setStyle(cbgStyle(feature, false, true))
        e.target.bringToFront()
        selectedLayerRef.current = e.target
        setSelectedCbg(feature)
      },
    })
  }, [clearHover])

  const handleClose = () => {
    if (selectedLayerRef.current) {
      selectedLayerRef.current.setStyle(cbgStyle(selectedLayerRef.current.feature))
      selectedLayerRef.current = null
    }
    setSelectedCbg(null)
  }

  return (
    <div className="relative w-full rounded-[10px] overflow-hidden border border-[var(--border)] h-[250px] sm:h-[350px] md:h-full md:min-h-[400px] shadow-sm">
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <MapCenter lat={coordinates.lat} lng={coordinates.lng} zoom={13} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <GeoJSON
          data={CBGS_GEOJSON}
          onEachFeature={onEachFeature}
          style={(feature) => cbgStyle(feature)}
        />
      </MapContainer>

      {/* Score legend */}
      <div style={{
        position: 'absolute', bottom: 12, right: 12, zIndex: 1000,
        background: 'var(--bg-base, white)', border: '1px solid var(--border, #e5e7eb)',
        borderRadius: 8, padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted, #9ca3af)', marginBottom: 6 }}>Overall Score</div>
        {[
          { label: '80–100', color: '#22c55e' },
          { label: '70–79',  color: '#84cc16' },
          { label: '60–69',  color: '#f59e0b' },
          { label: '50–59',  color: '#f97316' },
          { label: '< 50',   color: '#ef4444' },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: 'var(--text-secondary, #6b7280)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* City label */}
      <div style={{
        position: 'absolute', bottom: 12, left: 12, zIndex: 1000,
        background: 'rgba(255,255,255,0.9)', borderRadius: 6,
        padding: '4px 10px', fontSize: 13, fontWeight: 500,
        color: 'var(--text-secondary, #374151)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        {name}
      </div>

      <MiniPanel cbg={selectedCbg} onClose={handleClose} />
    </div>
  )
}