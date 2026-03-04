// Lightweight routing/estimation helper.
// Uses server endpoints so API keys stay on the backend.

export async function geocodeAddress(address) {
  const latlngMatch = String(address).trim().match(/^\s*([+-]?\d+(?:\.\d+)?),\s*([+-]?\d+(?:\.\d+)?)\s*$/)
  if (latlngMatch) {
    return { lat: parseFloat(latlngMatch[1]), lng: parseFloat(latlngMatch[2]) }
  }

  const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`)
  const data = await res.json().catch(() => null)
  if (!res.ok || typeof data?.lat !== 'number' || typeof data?.lng !== 'number') {
    throw new Error(data?.error || 'Geocode failed')
  }
  return { lat: data.lat, lng: data.lng }
}

export async function estimateRoute(origin, destinationAddress, mode = 'driving') {
  const res = await fetch('/api/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination: destinationAddress, mode }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data) {
    throw new Error(data?.error || 'Route estimation failed')
  }
  return data
}

export default { estimateRoute }
