/* global process */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const address = String(req.query?.address || '').trim()
  if (!address) return res.status(400).json({ error: 'Missing address' })

  const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing GOOGLE_MAPS_SERVER_API_KEY' })
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    const upstream = await fetch(url)
    const data = await upstream.json().catch(() => null)

    if (!upstream.ok || !data || data.status !== 'OK' || !Array.isArray(data.results) || data.results.length === 0) {
      return res.status(400).json({ error: 'Geocode failed' })
    }

    const loc = data.results[0]?.geometry?.location
    if (typeof loc?.lat !== 'number' || typeof loc?.lng !== 'number') {
      return res.status(400).json({ error: 'Geocode failed' })
    }

    return res.status(200).json({ lat: loc.lat, lng: loc.lng })
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Unexpected server error' })
  }
}
