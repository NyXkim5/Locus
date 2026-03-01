const API_HOST = 'realtor-search.p.rapidapi.com'
const AIRBNB_HOST = 'airbnb13.p.rapidapi.com'

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
  berkeley: 'city:Berkeley, CA',
  'san-francisco': 'city:San Francisco, CA',
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
    const raw = localStorage.getItem(`locus_listings_v3_${id}`)
    if (raw) {
      const entry = JSON.parse(raw)
      if (Date.now() - entry.ts < CACHE_TTL) {
        memCache.set(id, entry)
        return entry.data
      }
      localStorage.removeItem(`locus_listings_v3_${id}`)
    }
  } catch { /* localStorage may be unavailable */ }
  return null
}

function setCache(id, data) {
  const entry = { data, ts: Date.now() }
  memCache.set(id, entry)
  try {
    localStorage.setItem(`locus_listings_v3_${id}`, JSON.stringify(entry))
  } catch { /* quota exceeded — cache stays in memory only */ }
}

// Separate queues: buy + rent share one (same API host / rate limit),
// Airbnb gets its own (different host). This avoids serializing unrelated hosts
// while still protecting against per-host 429s.
let realtorPending = Promise.resolve()
let airbnbPending = Promise.resolve()

function resolveLocation(neighborhoodId) {
  const location = LOCATION_MAP[neighborhoodId]
  if (location) return location
  try {
    const raw = localStorage.getItem('locus_generated_neighborhoods')
    const generated = raw ? JSON.parse(raw) : {}
    if (generated[neighborhoodId]) return `city:${generated[neighborhoodId].name}`
  } catch {}
  return null
}

function safeUrl(url) {
  if (!url || typeof url !== 'string') return null
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? url : null
  } catch {
    return null
  }
}

function parseRealtorResults(json, listingType) {
  const results = Array.isArray(json.data?.results) ? json.data.results : []
  return results.map((p) => {
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
      detailUrl: safeUrl(p.href),
      isNew: Boolean(p.flags?.is_new_construction),
      lat: toNum(addr?.coordinate?.lat),
      lng: toNum(addr?.coordinate?.lon),
      listingType,
    }
  }).filter((l) => l.address !== 'Address unavailable')
}

function friendlyApiError(status, body, apiName) {
  if (status === 403 || status === 401) {
    return `${apiName} requires a RapidAPI subscription. Enable this endpoint in your RapidAPI dashboard.`
  }
  if (status === 429) {
    return `${apiName} rate limit reached. Please wait a moment and try again.`
  }
  return `${apiName} error (${status}): ${typeof body === 'string' ? body.slice(0, 200) : 'Unknown error'}`
}

// ─── Buy Listings ────────────────────────────────────────

export async function fetchListings(neighborhoodId, { signal } = {}) {
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY
  if (!apiKey) throw new Error('Missing VITE_RAPIDAPI_KEY — add it to your .env file to fetch listings.')

  const cached = getCached(neighborhoodId)
  if (cached) return cached

  const location = resolveLocation(neighborhoodId)
  if (!location) return []

  const result = realtorPending.then(() => _fetchBuy(neighborhoodId, location, apiKey, 2, signal))
  realtorPending = result.catch(() => {})
  return result
}

async function _fetchBuy(neighborhoodId, location, apiKey, retries = 2, signal) {
  const params = new URLSearchParams({ location, limit: '200', offset: '0' })

  const res = await fetch(
    `https://${API_HOST}/properties/search-buy?${params}`,
    { headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': API_HOST }, signal }
  )

  if (res.status === 429 && retries > 0) {
    await new Promise((r) => setTimeout(r, 1500 * (3 - retries)))
    return _fetchBuy(neighborhoodId, location, apiKey, retries - 1, signal)
  }

  if (!res.ok) {
    const body = await res.text()
    throw new Error(friendlyApiError(res.status, body, 'Listings'))
  }

  const json = await res.json()
  const listings = parseRealtorResults(json, 'buy')
  setCache(neighborhoodId, listings)
  return listings
}

// ─── Rental Listings ─────────────────────────────────────

export async function fetchRentals(neighborhoodId, { signal } = {}) {
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY
  if (!apiKey) throw new Error('Missing VITE_RAPIDAPI_KEY — add it to your .env file to fetch listings.')

  const cached = getCached(`rent_${neighborhoodId}`)
  if (cached) return cached

  const location = resolveLocation(neighborhoodId)
  if (!location) return []

  const result = realtorPending.then(() => _fetchRent(neighborhoodId, location, apiKey, 2, signal))
  realtorPending = result.catch(() => {})
  return result
}

async function _fetchRent(neighborhoodId, location, apiKey, retries = 2, signal) {
  const params = new URLSearchParams({ location, limit: '200', offset: '0' })

  const res = await fetch(
    `https://${API_HOST}/properties/search-rent?${params}`,
    { headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': API_HOST }, signal }
  )

  if (res.status === 429 && retries > 0) {
    await new Promise((r) => setTimeout(r, 1500 * (3 - retries)))
    return _fetchRent(neighborhoodId, location, apiKey, retries - 1, signal)
  }

  if (!res.ok) {
    const body = await res.text()
    throw new Error(friendlyApiError(res.status, body, 'Rental'))
  }

  const json = await res.json()
  const listings = parseRealtorResults(json, 'rent')
  setCache(`rent_${neighborhoodId}`, listings)
  return listings
}

// ─── Airbnb Listings ─────────────────────────────────────

export async function fetchAirbnbs(neighborhoodId, { signal } = {}) {
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY
  if (!apiKey) throw new Error('Missing VITE_RAPIDAPI_KEY — add it to your .env file to fetch listings.')

  const cached = getCached(`airbnb_${neighborhoodId}`)
  if (cached) return cached

  const location = resolveLocation(neighborhoodId)
  if (!location) return []

  const cityName = location.replace(/^city:/, '')

  const result = airbnbPending.then(() => _fetchAirbnb(neighborhoodId, cityName, apiKey, 2, signal))
  airbnbPending = result.catch(() => {})
  return result
}

async function _fetchAirbnb(neighborhoodId, cityName, apiKey, retries = 2, signal) {
  // Next Friday → Sunday (or next week's if today is Friday)
  const checkin = new Date()
  const daysTillFriday = (5 - checkin.getDay() + 7) % 7
  checkin.setDate(checkin.getDate() + (daysTillFriday === 0 ? 7 : daysTillFriday))
  const checkout = new Date(checkin)
  checkout.setDate(checkout.getDate() + 2)

  const params = new URLSearchParams({
    location: cityName,
    checkin: checkin.toISOString().split('T')[0],
    checkout: checkout.toISOString().split('T')[0],
    adults: '2',
    page: '1',
    currency: 'USD',
  })

  const res = await fetch(
    `https://${AIRBNB_HOST}/search-location?${params}`,
    { headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': AIRBNB_HOST }, signal }
  )

  if (res.status === 429 && retries > 0) {
    await new Promise((r) => setTimeout(r, 1500 * (3 - retries)))
    return _fetchAirbnb(neighborhoodId, cityName, apiKey, retries - 1, signal)
  }

  if (!res.ok) {
    const body = await res.text()
    throw new Error(friendlyApiError(res.status, body, 'Airbnb'))
  }

  const json = await res.json()
  const results = Array.isArray(json.results) ? json.results : []

  const listings = results.map((p) => ({
    id: String(p.id || crypto.randomUUID()),
    address: p.name || p.address || 'Airbnb listing',
    price: p.price?.rate != null ? Math.round(p.price.rate) : null,
    beds: typeof p.bedrooms === 'number' ? p.bedrooms : null,
    baths: typeof p.bathrooms === 'number' ? p.bathrooms : null,
    sqft: null,
    type: p.type || 'Airbnb',
    imgSrc: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.thumbnail || null,
    detailUrl: safeUrl(p.url || p.deeplink || (p.id ? `https://www.airbnb.com/rooms/${p.id}` : null)),
    isNew: false,
    lat: toNum(p.position?.lat ?? p.lat),
    lng: toNum(p.position?.lng ?? p.lng),
    listingType: 'airbnb',
    rating: typeof p.rating === 'number' ? p.rating : null,
    reviewsCount: typeof p.reviewsCount === 'number' ? p.reviewsCount : null,
  }))

  setCache(`airbnb_${neighborhoodId}`, listings)
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
