const API_HOST = 'realtor-search.p.rapidapi.com'

function toNum(val) {
  if (typeof val === 'number' && !isNaN(val)) return val
  if (typeof val === 'string') { const n = parseFloat(val); if (!isNaN(n)) return n }
  return null
}

const LOCATION_MAP = {
  irvine: 'city:Irvine, CA',
  'santa-monica': 'city:Santa Monica, CA',
  pasadena: 'city:Pasadena, CA',
  'west-hollywood': 'city:West Hollywood, CA',
}

// Cache: memory + localStorage (1 hour TTL)
const CACHE_TTL = 60 * 60 * 1000
const memCache = new Map()

function getCached(id) {
  if (memCache.has(id)) {
    const entry = memCache.get(id)
    if (Date.now() - entry.ts < CACHE_TTL) return entry.data
    memCache.delete(id)
  }
  try {
    const raw = localStorage.getItem(`locus_listings_${id}`)
    if (raw) {
      const entry = JSON.parse(raw)
      if (Date.now() - entry.ts < CACHE_TTL) {
        memCache.set(id, entry)
        return entry.data
      }
      localStorage.removeItem(`locus_listings_${id}`)
    }
  } catch {}
  return null
}

function setCache(id, data) {
  const entry = { data, ts: Date.now() }
  memCache.set(id, entry)
  try {
    localStorage.setItem(`locus_listings_${id}`, JSON.stringify(entry))
  } catch {}
}

// Serialize requests to avoid rate limits
let pending = Promise.resolve()

export async function fetchListings(neighborhoodId) {
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY
  if (!apiKey) throw new Error('Missing VITE_RAPIDAPI_KEY — add it to your .env file to fetch listings.')

  const cached = getCached(neighborhoodId)
  if (cached) return cached

  let location = LOCATION_MAP[neighborhoodId]
  if (!location) {
    // Check generated neighborhoods for dynamic city names
    try {
      const raw = localStorage.getItem('locus_generated_neighborhoods')
      const generated = raw ? JSON.parse(raw) : {}
      if (generated[neighborhoodId]) {
        location = `city:${generated[neighborhoodId].name}`
      } else {
        return []
      }
    } catch {
      return []
    }
  }

  const result = pending.then(() => _fetch(neighborhoodId, location, apiKey))
  pending = result.catch(() => {})
  return result
}

async function _fetch(neighborhoodId, location, apiKey, retries = 2) {
  const params = new URLSearchParams({
    location,
    limit: '6',
    offset: '0',
  })

  const res = await fetch(
    `https://${API_HOST}/properties/search-buy?${params}`,
    {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': API_HOST,
      },
    }
  )

  if (res.status === 429 && retries > 0) {
    await new Promise((r) => setTimeout(r, 1500 * (3 - retries)))
    return _fetch(neighborhoodId, location, apiKey, retries - 1)
  }

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Listing API error (${res.status}): ${body}`)
  }

  const json = await res.json()
  const results = Array.isArray(json.data?.results) ? json.data.results : []

  const listings = results.slice(0, 6).map((p) => {
    const addr = p.location?.address
    return {
      id: p.property_id || crypto.randomUUID(),
      address: addr?.line
        ? `${addr.line}, ${addr.city || ''}`
        : addr?.city || 'Address unavailable',
      price: typeof p.list_price === 'number' ? p.list_price : null,
      beds: typeof p.description?.beds === 'number' ? p.description.beds : null,
      baths: typeof p.description?.baths === 'number' ? p.description.baths : null,
      sqft: typeof p.description?.sqft === 'number' ? p.description.sqft : null,
      type: formatType(p.description?.type),
      imgSrc: p.primary_photo?.href
        ? p.primary_photo.href
            .replace(/-w\d+_h\d+/, '-w1080_h810')
            .replace(/\/[a-z]\.jpg/i, '/od.jpg')
        : null,
      detailUrl: p.href || null,
      isNew: Boolean(p.flags?.is_new_construction),
      lat: toNum(addr?.coordinate?.lat),
      lng: toNum(addr?.coordinate?.lon),
    }
  }).filter((l) => l.address !== 'Address unavailable')

  setCache(neighborhoodId, listings)
  return listings
}

function formatType(raw) {
  const map = {
    single_family: 'House',
    condo: 'Condo',
    condos: 'Condo',
    townhomes: 'Townhouse',
    townhouse: 'Townhouse',
    multi_family: 'Multi-family',
    apartment: 'Apartment',
    land: 'Land',
  }
  return map[raw?.toLowerCase()] || raw || 'Home'
}
