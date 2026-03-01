import { useState, useRef, useEffect } from 'react'
import { estimateRoute, geocodeAddress } from '../../services/mapcnRouting'

export default function CommuteEstimator({ origin, mapRef }) {
  const [destination, setDestination] = useState('')
  const [mode, setMode] = useState('driving')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)
  const rendererRef = useRef(null)

  const handleEstimate = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await estimateRoute(origin, destination, mode)
      setResult(res)

      // Attempt to render a route on the Google Map if available
      try {
        if (window.google && mapRef && mapRef.current) {
          // clear previous renderer
          if (rendererRef.current) {
            rendererRef.current.setMap(null)
            rendererRef.current = null
          }

          const originCoord = typeof origin === 'string' ? await geocodeAddress(origin) : origin
          const destCoord = await geocodeAddress(destination)

          const directionsService = new window.google.maps.DirectionsService()
          const travelMode =
            mode === 'walking'
              ? window.google.maps.TravelMode.WALKING
              : mode === 'transit'
              ? window.google.maps.TravelMode.TRANSIT
              : window.google.maps.TravelMode.DRIVING

          const request = {
            origin: new window.google.maps.LatLng(originCoord.lat, originCoord.lng),
            destination: new window.google.maps.LatLng(destCoord.lat, destCoord.lng),
            travelMode,
          }

          directionsService.route(request, (response, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              const renderer = new window.google.maps.DirectionsRenderer({
                suppressMarkers: false,
                map: mapRef.current,
                polylineOptions: { strokeColor: '#6366f1', strokeWeight: 5, strokeOpacity: 0.95 },
              })
              renderer.setDirections(response)
              rendererRef.current = renderer
            }
          })
        }
      } catch (err) {
        // non-fatal: route rendering is best-effort
      }
    } catch (err) {
      setError(err.message || 'Estimate failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // clear renderer when component unmounts
    return () => {
      if (rendererRef.current) {
        rendererRef.current.setMap(null)
        rendererRef.current = null
      }
    }
  }, [])

  return (
    <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 1100 }}>
      <button
        aria-label="Toggle commute"
        onClick={() => setOpen((v) => !v)}
        title="Commute"
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          border: '1px solid var(--border, #e5e7eb)',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
          cursor: 'pointer',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 11l1.5-4.5A2 2 0 0 1 6.4 5h11.2a2 2 0 0 1 1.9 1.5L21 11v6a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-6z" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            width: 280,
            marginTop: 8,
            background: 'var(--bg-base, white)',
            border: '1px solid var(--border, #e5e7eb)',
            borderRadius: 10,
            padding: 10,
            boxShadow: '0 6px 22px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Estimate Commute</div>

          <input
            aria-label="Destination address"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Work address or lat,lng"
            style={{ width: '100%', padding: '8px 10px', marginBottom: 8, borderRadius: 6, border: '1px solid var(--border)' }}
          />

          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: 6 }}>
              <option value="driving">Driving</option>
              <option value="transit">Transit</option>
              <option value="walking">Walking</option>
            </select>

            <button
              onClick={handleEstimate}
              disabled={loading || !destination}
              style={{ padding: '8px 10px', borderRadius: 6, background: '#6366f1', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              {loading ? '…' : 'Estimate'}
            </button>
          </div>

          {error && <div style={{ color: 'var(--danger, #ef4444)', fontSize: 12 }}>{error}</div>}

          {result && (
            <div style={{ marginTop: 6, fontSize: 13 }}>
              <div style={{ fontWeight: 700 }}>{result.durationText}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{result.distanceText} • {result.mode}</div>
              {result.mocked && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Approximate estimate (no routing key)</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
