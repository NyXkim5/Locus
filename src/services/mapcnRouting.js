// Lightweight routing/estimation helper.
// Tries MapCN directions API when `VITE_MAPCN_API_KEY` is present.
// Falls back to a simple haversine-based estimate when the API/key is unavailable.

const AVG_SPEED_KMH = {
  driving: 50,
  walking: 5,
  transit: 30,
}

function haversineDistanceMeters(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const sinDLat = Math.sin(dLat / 2)
  const sinDLon = Math.sin(dLon / 2)
  const aa = sinDLat * sinDLat + sinDLon * sinDLon * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa))
  return R * c
}

function formatDistance(meters) {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
  return `${Math.round(meters)} m`
}

function formatDuration(seconds) {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  const hrs = Math.floor(mins / 60)
  const rem = mins % 60
  return rem === 0 ? `${hrs} hr` : `${hrs} hr ${rem} min`
}

export async function geocodeAddress(address) {
  // Accept lat,lng strings like "33.645,-117.84"
  const latlngMatch = String(address).trim().match(/^\s*([+-]?\d+(?:\.\d+)?),\s*([+-]?\d+(?:\.\d+)?)\s*$/)
  if (latlngMatch) {
    return { lat: parseFloat(latlngMatch[1]), lng: parseFloat(latlngMatch[2]) }
  }

  const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  if (!googleKey) throw new Error('No geocoder available (set VITE_GOOGLE_MAPS_API_KEY)')

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleKey}`
  const res = await fetch(url)
  const data = await res.json()
  if (!data || data.status !== 'OK' || !data.results || data.results.length === 0) {
    throw new Error('Geocode failed')
  }
  const loc = data.results[0].geometry.location
  return { lat: loc.lat, lng: loc.lng }
}

export async function estimateRoute(origin, destinationAddress, mode = 'driving') {
  // origin: {lat,lng} or address string
  // destinationAddress: address string or lat,lng
  let originCoord = null
  if (typeof origin === 'string') {
    originCoord = await geocodeAddress(origin)
  } else {
    originCoord = origin
  }

  const destCoord = await geocodeAddress(destinationAddress)

  const mapcnKey = import.meta.env.VITE_MAPCN_API_KEY
  if (mapcnKey) {
    try {
      // NOTE: MapCN API URL/params may differ; this is a generic placeholder.
      const modeMap = { driving: 'driving', walking: 'walking', transit: 'transit' }
      const profile = modeMap[mode] || 'driving'
      const url = `https://apis.map.cn/directions/v1?origin=${originCoord.lng},${originCoord.lat}&destination=${destCoord.lng},${destCoord.lat}&mode=${profile}&key=${mapcnKey}`
      const r = await fetch(url)
      const j = await r.json()
      // Attempt to parse a few common response shapes; fall back to calculation if unexpected.
      if (j && j.route && (j.route.distance || j.route.duration)) {
        const distanceMeters = j.route.distance || j.route.distance_in_meters || 0
        const durationSec = j.route.duration || j.route.duration_in_seconds || 0
        return {
          distanceMeters,
          durationSeconds: durationSec,
          distanceText: formatDistance(distanceMeters),
          durationText: formatDuration(durationSec),
          mode,
        }
      }
    } catch (err) {
      // fall through to haversine-based estimate
    }
  }

  // Fallback estimate using haversine + average speed
  const meters = haversineDistanceMeters(originCoord, destCoord)
  const km = meters / 1000
  const speed = AVG_SPEED_KMH[mode] || AVG_SPEED_KMH.driving
  const hours = km / speed
  const seconds = Math.max(30, Math.round(hours * 3600))

  return {
    distanceMeters: Math.round(meters),
    durationSeconds: seconds,
    distanceText: formatDistance(meters),
    durationText: formatDuration(seconds),
    mode,
    mocked: !mapcnKey,
  }
}

export default { estimateRoute }
