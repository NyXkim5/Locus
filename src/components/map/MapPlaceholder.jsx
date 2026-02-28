import { useState, useCallback, useEffect, useRef } from 'react'
import { GoogleMap, useJsApiLoader, OverlayViewF, OverlayView } from '@react-google-maps/api'
import { motion, AnimatePresence } from 'framer-motion'
import { getScoreColor } from '../../utils/scoreColor'
import useStore from '../../store/useStore'

const lightStyle = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d7e8' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f0f0f3' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e2e2e7' }] },
]

const darkStyle = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { elementType: 'geometry', stylers: [{ color: '#1A1A20' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1A1A20' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6A6A7A' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0F0F12' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#242430' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#2E2E3A' }] },
]

function formatPrice(price) {
  if (!price) return ''
  if (price >= 1000000) {
    const m = price / 1000000
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2)}M`
  }
  return `$${(price / 1000).toFixed(0)}K`
}

const LISTING_MARKER_ICON_URL = (() => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="14" fill="%236366F1" stroke="white" stroke-width="2.5"/>
    <text x="16" y="21" text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="700" fill="white">$</text>
  </svg>`
  return `data:image/svg+xml,${svg}`
})()

export default function MapPlaceholder({ name, coordinates, overallScore, listings = [] }) {
  const [showPopup, setShowPopup] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [activeListing, setActiveListing] = useState(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const infoRef = useRef(null)
  const theme = useStore((s) => s.theme)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  const center = { lat: coordinates.lat, lng: coordinates.lng }
  const isDark = theme === 'dark'

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: { position: 3 },
    styles: isDark ? darkStyle : lightStyle,
    backgroundColor: isDark ? '#1A1A20' : '#f0f0f3',
  }

  const onLoad = useCallback((map) => {
    mapRef.current = map
    if (window.google?.maps?.ControlPosition) {
      map.setOptions({
        zoomControlOptions: { position: window.google.maps.ControlPosition.TOP_RIGHT },
      })
    }
  }, [])

  // Update map styles when theme changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setOptions({
        styles: isDark ? darkStyle : lightStyle,
        backgroundColor: isDark ? '#1A1A20' : '#f0f0f3',
      })
    }
  }, [isDark])

  // Create/update listing markers imperatively
  useEffect(() => {
    const map = mapRef.current
    if (!map || !window.google) return

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []
    if (infoRef.current) { infoRef.current.close(); infoRef.current = null }

    const withCoords = listings.filter((l) => l.lat && l.lng)
    if (!withCoords.length) return

    const icon = {
      url: LISTING_MARKER_ICON_URL,
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16),
    }

    const bounds = new window.google.maps.LatLngBounds()
    bounds.extend({ lat: coordinates.lat, lng: coordinates.lng })

    withCoords.forEach((listing) => {
      const pos = { lat: listing.lat, lng: listing.lng }
      bounds.extend(pos)

      const marker = new window.google.maps.Marker({
        position: pos,
        map,
        icon,
        title: listing.address,
        optimized: false,
      })

      marker.addListener('click', () => {
        if (infoRef.current) infoRef.current.close()

        const content = `
          <div style="font-family:Inter,sans-serif;width:220px;background:var(--bg-base);border-radius:8px;overflow:hidden;">
            ${listing.imgSrc ? `<img src="${listing.imgSrc}" style="width:100%;height:100px;object-fit:cover;" />` : ''}
            <div style="padding:10px 12px;">
              <div style="font-size:14px;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${listing.address}</div>
              <div style="font-size:14px;font-weight:700;color:var(--accent);margin-top:3px;">${formatPrice(listing.price)}</div>
              <div style="font-size:12px;color:var(--text-muted);margin-top:3px;">${[
                listing.beds != null ? `${listing.beds} bd` : '',
                listing.baths != null ? `${listing.baths} ba` : '',
                listing.sqft != null ? `${listing.sqft.toLocaleString()} sqft` : '',
              ].filter(Boolean).join(' \u00b7 ')}</div>
            </div>
          </div>`

        const info = new window.google.maps.InfoWindow({
          content,
          pixelOffset: new window.google.maps.Size(0, -4),
        })
        info.open(map, marker)
        infoRef.current = info
      })

      markersRef.current.push(marker)
    })

    map.fitBounds(bounds, { top: 40, right: 40, bottom: 50, left: 40 })

    return () => {
      markersRef.current.forEach((m) => m.setMap(null))
      markersRef.current = []
      if (infoRef.current) infoRef.current.close()
    }
  }, [listings, coordinates.lat, coordinates.lng])

  const dismissPopups = () => {
    setShowPopup(false)
    setActiveListing(null)
    if (infoRef.current) { infoRef.current.close(); infoRef.current = null }
  }

  if (!isLoaded) {
    return (
      <div className="relative w-full rounded-[10px] overflow-hidden border border-[var(--border)] h-[250px] sm:h-[350px] md:h-full md:min-h-[400px] bg-[var(--bg-elevated)] animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
            <span className="text-[14px] text-[var(--text-muted)]">Loading map</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full rounded-[10px] overflow-hidden border border-[var(--border)] h-[250px] sm:h-[350px] md:h-full md:min-h-[400px] shadow-sm">
      <style>{`
        @keyframes marker-pulse {
          0%, 100% { box-shadow: 0 0 12px color-mix(in srgb, var(--accent) 40%, transparent); }
          50% { box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 60%, transparent), 0 0 40px color-mix(in srgb, var(--accent) 20%, transparent); }
        }
        .gm-style-iw-c { background: var(--bg-base) !important; border: 1px solid var(--border) !important; border-radius: 10px !important; padding: 0 !important; box-shadow: 0 4px 20px rgba(0,0,0,0.12) !important; }
        .gm-style-iw-d { overflow: hidden !important; padding: 0 !important; }
        .gm-style-iw-tc::after { background: var(--bg-base) !important; }
        .gm-ui-hover-effect { top: 2px !important; right: 2px !important; }
        .gm-ui-hover-effect > span { background-color: var(--text-muted) !important; }
      `}</style>

      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={center}
        zoom={13}
        options={mapOptions}
        onLoad={onLoad}
        onClick={dismissPopups}
      >
        {/* Neighborhood center marker */}
        <OverlayViewF
          position={center}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            role="button"
            aria-label={`${name} neighborhood center, score ${overallScore}`}
            onClick={(e) => { e.stopPropagation(); dismissPopups(); setShowPopup((v) => !v) }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: 'var(--accent)',
              animation: 'marker-pulse 2s ease-in-out infinite',
              border: '2.5px solid var(--bg-base)',
              cursor: 'pointer',
              transform: `translate(-50%, -50%) scale(${hovered ? 1.3 : 1})`,
              transition: 'transform 0.2s ease',
              boxShadow: '0 2px 8px color-mix(in srgb, var(--accent) 30%, transparent)',
            }}
          />
        </OverlayViewF>

        {/* Neighborhood popup */}
        <OverlayViewF
          position={center}
          mapPaneName={OverlayView.FLOAT_PANE}
        >
          <div style={{ transform: 'translate(-50%, calc(-100% - 14px))' }}>
            <AnimatePresence>
              {showPopup && (
                <motion.div
                  key="popup"
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    background: 'var(--bg-base)',
                    padding: '8px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {name}
                  </span>
                  {overallScore != null && (
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: getScoreColor(overallScore) }}>
                      {overallScore}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </OverlayViewF>
      </GoogleMap>

      <div className="absolute bottom-3 left-3 px-2.5 py-1.5 bg-[var(--bg-base)]/90 shadow-sm rounded-[6px]">
        <span className="text-[13px] text-[var(--text-secondary)] font-medium">{name}</span>
        <span className="text-[12px] text-[var(--text-muted)] ml-2">
          {coordinates.lat.toFixed(2)}{'\u00b0'}{coordinates.lat >= 0 ? 'N' : 'S'}, {Math.abs(coordinates.lng).toFixed(2)}{'\u00b0'}{coordinates.lng >= 0 ? 'E' : 'W'}
        </span>
      </div>
    </div>
  )
}
