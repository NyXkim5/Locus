/* global process */

const API_HOST = 'realtor-search.p.rapidapi.com'
const AIRBNB_HOST = 'airbnb13.p.rapidapi.com'

const TYPE_CONFIG = {
  buy: { host: API_HOST, path: '/properties/search-buy' },
  rent: { host: API_HOST, path: '/properties/search-rent' },
  airbnb: { host: AIRBNB_HOST, path: '/search-location' },
}

function mapStatus(status) {
  if (status === 401 || status === 403) return 502
  if (status === 429) return 429
  return 502
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.RAPIDAPI_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing RAPIDAPI_KEY' })
  }

  const type = String(req.query?.type || '')
  const location = String(req.query?.location || '')
  const config = TYPE_CONFIG[type]

  if (!config || !location) {
    return res.status(400).json({ error: 'Missing or invalid query params' })
  }

  const params = new URLSearchParams()
  if (type === 'airbnb') {
    params.set('location', location)
    params.set('checkin', String(req.query?.checkin || ''))
    params.set('checkout', String(req.query?.checkout || ''))
    params.set('adults', String(req.query?.adults || '2'))
    params.set('page', '1')
    params.set('currency', 'USD')
  } else {
    params.set('location', location)
    params.set('limit', '200')
    params.set('offset', '0')
  }

  const url = `https://${config.host}${config.path}?${params}`

  try {
    const upstream = await fetch(url, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': config.host,
      },
    })

    const text = await upstream.text()
    let json = null
    try {
      json = JSON.parse(text)
    } catch {
      json = null
    }

    if (!upstream.ok) {
      const message =
        json?.message ||
        json?.error ||
        (typeof text === 'string' ? text.slice(0, 220) : '') ||
        `Upstream request failed (${upstream.status})`
      return res.status(mapStatus(upstream.status)).json({ error: message })
    }

    return res.status(200).json(json ?? {})
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Unexpected server error' })
  }
}
