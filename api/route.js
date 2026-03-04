/* global process */

const AVG_SPEED_KMH = {
  driving: 50,
  walking: 5,
  transit: 30,
}

function toRad(deg) {
  return (deg * Math.PI) / 180
}

function haversineDistanceMeters(a, b) {
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

async function geocode(address, googleKey) {
  const latlngMatch = String(address)
    .trim()
    .match(/^\s*([+-]?\d+(?:\.\d+)?),\s*([+-]?\d+(?:\.\d+)?)\s*$/)
  if (latlngMatch) {
    return { lat: parseFloat(latlngMatch[1]), lng: parseFloat(latlngMatch[2]) }
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleKey}`
  const res = await fetch(url)
  const data = await res.json()
  if (!data || data.status !== 'OK' || !data.results || data.results.length === 0) {
    throw new Error('Geocode failed')
  }
  const loc = data.results[0].geometry.location
  return { lat: loc.lat, lng: loc.lng }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const googleKey = process.env.GOOGLE_MAPS_SERVER_API_KEY
  if (!googleKey) {
    return res.status(500).json({ error: 'Server missing GOOGLE_MAPS_SERVER_API_KEY' })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
  const origin = body?.origin
  const destination = body?.destination
  const mode = String(body?.mode || 'driving')

  if (!origin || !destination) {
    return res.status(400).json({ error: 'Missing origin or destination' })
  }

  try {
    const originCoord = typeof origin === 'string' ? await geocode(origin, googleKey) : origin
    const destCoord = await geocode(destination, googleKey)

    const mapcnKey = process.env.MAPCN_API_KEY
    if (mapcnKey) {
      try {
        const modeMap = { driving: 'driving', walking: 'walking', transit: 'transit' }
        const profile = modeMap[mode] || 'driving'
        const url = `https://apis.map.cn/directions/v1?origin=${originCoord.lng},${originCoord.lat}&destination=${destCoord.lng},${destCoord.lat}&mode=${profile}&key=${mapcnKey}`
        const r = await fetch(url)
        const j = await r.json()
        if (j && j.route && (j.route.distance || j.route.duration)) {
          const distanceMeters = j.route.distance || j.route.distance_in_meters || 0
          const durationSec = j.route.duration || j.route.duration_in_seconds || 0
          return res.status(200).json({
            distanceMeters,
            durationSeconds: durationSec,
            distanceText: formatDistance(distanceMeters),
            durationText: formatDuration(durationSec),
            mode,
            mocked: false,
            originCoord,
            destCoord,
          })
        }
      } catch {
        // Falls through to approximate estimate.
      }
    }

    const meters = haversineDistanceMeters(originCoord, destCoord)
    const speed = AVG_SPEED_KMH[mode] || AVG_SPEED_KMH.driving
    const seconds = Math.max(30, Math.round(((meters / 1000) / speed) * 3600))

    return res.status(200).json({
      distanceMeters: Math.round(meters),
      durationSeconds: seconds,
      distanceText: formatDistance(meters),
      durationText: formatDuration(seconds),
      mode,
      mocked: true,
      originCoord,
      destCoord,
    })
  } catch (err) {
    return res.status(400).json({ error: err?.message || 'Route estimation failed' })
  }
}
