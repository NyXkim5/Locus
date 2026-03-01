// Google Places API service — uses Maps JS PlacesService to avoid CORS issues
// Cache: in-memory Map + localStorage with 1hr TTL (same pattern as listings.js)
// Falls back to curated local data when API is unavailable

const CACHE_TTL = 60 * 60 * 1000
const memCache = new Map()

function getCached(key) {
  if (memCache.has(key)) {
    const entry = memCache.get(key)
    if (Date.now() - entry.ts < CACHE_TTL) return entry.data
    memCache.delete(key)
  }
  try {
    const raw = localStorage.getItem(`locus_places_${key}`)
    if (raw) {
      const entry = JSON.parse(raw)
      if (Date.now() - entry.ts < CACHE_TTL) {
        memCache.set(key, entry)
        return entry.data
      }
      localStorage.removeItem(`locus_places_${key}`)
    }
  } catch { /* localStorage may be unavailable */ }
  return null
}

function setCache(key, data) {
  const entry = { data, ts: Date.now() }
  memCache.set(key, entry)
  try {
    localStorage.setItem(`locus_places_${key}`, JSON.stringify(entry))
  } catch { /* quota exceeded — cache stays in memory only */ }
}

function normalize(place) {
  const loc = place.geometry?.location
  return {
    id: place.place_id,
    name: place.name,
    rating: place.rating ?? null,
    userRatingsTotal: place.user_ratings_total ?? 0,
    priceLevel: place.price_level ?? null,
    address: place.vicinity || place.formatted_address || '',
    photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 400 }) ?? null,
    types: place.types || [],
    mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    lat: typeof loc?.lat === 'function' ? loc.lat() : loc?.lat ?? null,
    lng: typeof loc?.lng === 'function' ? loc.lng() : loc?.lng ?? null,
  }
}

let _serviceEl = null
function getService() {
  if (!window.google?.maps?.places) return null
  if (!_serviceEl) {
    _serviceEl = document.createElement('div')
  }
  return new window.google.maps.places.PlacesService(_serviceEl)
}

export function fetchNearbyPlaces(lat, lng, type) {
  const cacheKey = `nearby_${lat}_${lng}_${type}`
  const cached = getCached(cacheKey)
  if (cached) return Promise.resolve(cached)

  const service = getService()
  if (!service) {
    const fallback = getFallbackPlaces(lat, lng, type)
    if (fallback.length) setCache(cacheKey, fallback)
    return Promise.resolve(fallback)
  }

  return new Promise((resolve) => {
    service.nearbySearch(
      {
        location: { lat, lng },
        radius: 2000,
        type,
      },
      (results, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !results) {
          const fallback = getFallbackPlaces(lat, lng, type)
          if (fallback.length) setCache(cacheKey, fallback)
          resolve(fallback)
          return
        }
        const data = results.slice(0, 10).map(normalize)
        setCache(cacheKey, data)
        resolve(data)
      }
    )
  })
}

export function searchPlaces(lat, lng, query) {
  const cacheKey = `search_${lat}_${lng}_${query}`
  const cached = getCached(cacheKey)
  if (cached) return Promise.resolve(cached)

  const service = getService()
  if (!service) {
    const fallback = searchFallbackPlaces(lat, lng, query)
    if (fallback.length) setCache(cacheKey, fallback)
    return Promise.resolve(fallback)
  }

  return new Promise((resolve) => {
    service.textSearch(
      {
        query,
        location: { lat, lng },
        radius: 2000,
      },
      (results, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !results) {
          const fallback = searchFallbackPlaces(lat, lng, query)
          if (fallback.length) setCache(cacheKey, fallback)
          resolve(fallback)
          return
        }
        const data = results.slice(0, 10).map(normalize)
        setCache(cacheKey, data)
        resolve(data)
      }
    )
  })
}

// ─── Curated Fallback Data ──────────────────────────────
// Real places for every supported neighborhood so the feature works without Places API

function makeFallback(id, name, rating, priceLevel, address, types, lat, lng) {
  return {
    id,
    name,
    rating,
    userRatingsTotal: Math.floor(Math.random() * 800) + 50,
    priceLevel,
    address,
    photoUrl: null,
    types,
    mapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(name + ' ' + address)}`,
    lat,
    lng,
  }
}

const FALLBACK_DATA = {
  // ── Irvine ──
  'irvine': {
    restaurant: [
      makeFallback('irv-r1', 'TenRaku', 4.5, 2, '14522 Culver Dr, Irvine', ['restaurant', 'japanese'], 33.6936, -117.7983),
      makeFallback('irv-r2', 'Eureka!', 4.3, 2, '4989 Verdugo Way, Irvine', ['restaurant', 'american'], 33.6558, -117.7473),
      makeFallback('irv-r3', 'North Italia', 4.4, 3, '2957 Michelson Dr, Irvine', ['restaurant', 'italian'], 33.6762, -117.8390),
      makeFallback('irv-r4', 'Cucina Enoteca', 4.3, 3, '532 Spectrum Center Dr, Irvine', ['restaurant', 'italian'], 33.6499, -117.7474),
      makeFallback('irv-r5', 'BRIO Coastal Bar', 4.2, 2, '71 Fortune Dr, Irvine', ['restaurant', 'seafood'], 33.6530, -117.7415),
      makeFallback('irv-r6', 'Slapfish', 4.4, 2, '19696 Beach Blvd, Huntington Beach', ['restaurant', 'seafood'], 33.7158, -117.9928),
      makeFallback('irv-r7', 'Gen Korean BBQ', 4.3, 2, '3265 Michelson Dr, Irvine', ['restaurant', 'korean'], 33.6773, -117.8363),
      makeFallback('irv-r8', 'Javier\'s', 4.4, 3, '7832 Edinger Ave, Newport Beach', ['restaurant', 'mexican'], 33.6614, -117.8561),
    ],
    cafe: [
      makeFallback('irv-c1', 'Stereoscope Coffee', 4.6, 1, '4280 Barranca Pkwy, Irvine', ['cafe'], 33.6820, -117.7787),
      makeFallback('irv-c2', 'Philz Coffee', 4.5, 2, '6485 Irvine Blvd, Irvine', ['cafe'], 33.6990, -117.7665),
      makeFallback('irv-c3', 'Cha for Tea', 4.2, 1, '2029 Jeffrey Rd, Irvine', ['cafe', 'tea'], 33.6898, -117.7896),
      makeFallback('irv-c4', 'Blk Dot Coffee', 4.5, 1, '82 Fortune Dr, Irvine', ['cafe'], 33.6530, -117.7414),
      makeFallback('irv-c5', 'Boba Guys', 4.3, 1, '6213 Irvine Blvd, Irvine', ['cafe', 'bubble_tea'], 33.6981, -117.7704),
      makeFallback('irv-c6', 'Vitality Bowls', 4.4, 2, '6222 Irvine Blvd, Irvine', ['cafe', 'health'], 33.6982, -117.7700),
    ],
    tourist_attraction: [
      makeFallback('irv-t1', 'Irvine Spectrum Center', 4.5, 2, '670 Spectrum Center Dr, Irvine', ['tourist_attraction', 'shopping'], 33.6494, -117.7430),
      makeFallback('irv-t2', 'Great Park Balloon', 4.4, 0, '8000 Great Park Blvd, Irvine', ['tourist_attraction', 'park'], 33.6641, -117.7648),
      makeFallback('irv-t3', 'San Joaquin Wildlife Sanctuary', 4.6, 0, '5 Riparian View, Irvine', ['tourist_attraction', 'park'], 33.6600, -117.8467),
      makeFallback('irv-t4', 'Pretend City Children\'s Museum', 4.4, 2, '29 Hubble, Irvine', ['tourist_attraction', 'museum'], 33.6765, -117.8285),
      makeFallback('irv-t5', 'Turtle Rock Nature Trail', 4.3, 0, 'Turtle Rock Dr, Irvine', ['tourist_attraction', 'park', 'hiking'], 33.6366, -117.8036),
      makeFallback('irv-t6', 'Tanaka Farms', 4.5, 2, '5380 3/4 University Dr, Irvine', ['tourist_attraction', 'farm'], 33.6455, -117.7866),
    ],
  },

  // ── Santa Monica ──
  'santa-monica': {
    restaurant: [
      makeFallback('sm-r1', 'Cassia', 4.5, 3, '1314 7th St, Santa Monica', ['restaurant', 'southeast_asian'], 34.0181, -118.4934),
      makeFallback('sm-r2', 'Forma Restaurant', 4.5, 3, '1610 Montana Ave, Santa Monica', ['restaurant', 'italian'], 34.0360, -118.5000),
      makeFallback('sm-r3', 'Bay Cities Italian Deli', 4.7, 1, '1517 Lincoln Blvd, Santa Monica', ['restaurant', 'deli'], 34.0123, -118.4930),
      makeFallback('sm-r4', 'Sushi Roku', 4.3, 3, '1401 Ocean Ave, Santa Monica', ['restaurant', 'japanese'], 34.0163, -118.5000),
      makeFallback('sm-r5', 'Tar & Roses', 4.5, 3, '602 Santa Monica Blvd, Santa Monica', ['restaurant', 'american'], 34.0156, -118.4901),
      makeFallback('sm-r6', 'Father\'s Office', 4.4, 2, '1018 Montana Ave, Santa Monica', ['restaurant', 'gastropub'], 34.0335, -118.4955),
      makeFallback('sm-r7', 'Huckleberry', 4.5, 2, '1014 Wilshire Blvd, Santa Monica', ['restaurant', 'bakery'], 34.0285, -118.4898),
      makeFallback('sm-r8', 'Elephante', 4.3, 3, '1332 2nd St, Santa Monica', ['restaurant', 'italian'], 34.0183, -118.4952),
    ],
    cafe: [
      makeFallback('sm-c1', 'Dogtown Coffee', 4.5, 1, '2003 Main St, Santa Monica', ['cafe'], 34.0038, -118.4907),
      makeFallback('sm-c2', 'Caffe Luxxe', 4.6, 2, '925 Montana Ave, Santa Monica', ['cafe'], 34.0335, -118.4942),
      makeFallback('sm-c3', 'Espresso Cielo', 4.5, 1, '3101 Main St, Santa Monica', ['cafe'], 34.0007, -118.4917),
      makeFallback('sm-c4', 'Cafe Gratitude', 4.3, 2, '512 Rose Ave, Venice', ['cafe', 'vegan'], 33.9940, -118.4670),
      makeFallback('sm-c5', 'Intelligentsia Coffee', 4.4, 2, '1331 Abbot Kinney Blvd, Venice', ['cafe'], 33.9928, -118.4650),
      makeFallback('sm-c6', 'Urth Caffe', 4.4, 2, '2327 Main St, Santa Monica', ['cafe'], 34.0015, -118.4912),
    ],
    tourist_attraction: [
      makeFallback('sm-t1', 'Santa Monica Pier', 4.5, 1, '200 Santa Monica Pier, Santa Monica', ['tourist_attraction'], 34.0082, -118.4987),
      makeFallback('sm-t2', 'Third Street Promenade', 4.4, 2, '1351 3rd Street Promenade, Santa Monica', ['tourist_attraction', 'shopping'], 34.0163, -118.4959),
      makeFallback('sm-t3', 'Palisades Park', 4.6, 0, 'Ocean Ave, Santa Monica', ['tourist_attraction', 'park'], 34.0210, -118.5030),
      makeFallback('sm-t4', 'Tongva Park', 4.5, 0, '1615 Ocean Ave, Santa Monica', ['tourist_attraction', 'park'], 34.0110, -118.5000),
      makeFallback('sm-t5', 'Bergamot Station Arts Center', 4.4, 0, '2525 Michigan Ave, Santa Monica', ['tourist_attraction', 'gallery'], 34.0220, -118.4718),
      makeFallback('sm-t6', 'Muscle Beach', 4.3, 0, '1800 Ocean Front Walk, Santa Monica', ['tourist_attraction', 'fitness'], 34.0048, -118.4825),
    ],
  },

  // ── Pasadena ──
  'pasadena': {
    restaurant: [
      makeFallback('pas-r1', 'Union Restaurant', 4.5, 3, '37 E Union St, Pasadena', ['restaurant', 'italian'], 34.1474, -118.1434),
      makeFallback('pas-r2', 'Bone Kettle', 4.6, 2, '67 N Raymond Ave, Pasadena', ['restaurant', 'southeast_asian'], 34.1465, -118.1487),
      makeFallback('pas-r3', 'Luggage Room Pizzeria', 4.5, 2, '260 S Raymond Ave, Pasadena', ['restaurant', 'pizza'], 34.1424, -118.1487),
      makeFallback('pas-r4', 'The Raymond 1886', 4.4, 3, '1250 S Fair Oaks Ave, Pasadena', ['restaurant', 'american'], 34.1299, -118.1491),
      makeFallback('pas-r5', 'Din Tai Fung', 4.4, 2, '1108 S Baldwin Ave, Arcadia', ['restaurant', 'chinese'], 34.1289, -118.0854),
      makeFallback('pas-r6', 'Sushi Kimagure', 4.7, 3, '87 N Raymond Ave, Pasadena', ['restaurant', 'japanese'], 34.1471, -118.1487),
      makeFallback('pas-r7', 'Russell\'s', 4.3, 2, '30 N Fair Oaks Ave, Pasadena', ['restaurant', 'seafood'], 34.1475, -118.1491),
      makeFallback('pas-r8', 'Maestro', 4.4, 2, '110 E Union St, Pasadena', ['restaurant', 'mexican'], 34.1473, -118.1422),
    ],
    cafe: [
      makeFallback('pas-c1', 'Copa Vida', 4.6, 2, '34 S Raymond Ave, Pasadena', ['cafe'], 34.1454, -118.1487),
      makeFallback('pas-c2', 'Jones Coffee Roasters', 4.6, 1, '537 S Raymond Ave, Pasadena', ['cafe'], 34.1397, -118.1487),
      makeFallback('pas-c3', 'Intelligentsia Coffee', 4.5, 2, '55 E Colorado Blvd, Pasadena', ['cafe'], 34.1459, -118.1445),
      makeFallback('pas-c4', 'Jameson Brown Coffee', 4.5, 1, '542 S Fair Oaks Ave, Pasadena', ['cafe'], 34.1395, -118.1491),
      makeFallback('pas-c5', 'Lavender & Honey', 4.4, 2, '17 S El Molino Ave, Pasadena', ['cafe', 'tea'], 34.1456, -118.1384),
      makeFallback('pas-c6', 'Tierra Mia Coffee', 4.3, 1, '960 E Colorado Blvd, Pasadena', ['cafe'], 34.1458, -118.1255),
    ],
    tourist_attraction: [
      makeFallback('pas-t1', 'The Huntington Library', 4.8, 2, '1151 Oxford Rd, San Marino', ['tourist_attraction', 'museum'], 34.1293, -118.1146),
      makeFallback('pas-t2', 'Norton Simon Museum', 4.7, 2, '411 W Colorado Blvd, Pasadena', ['tourist_attraction', 'museum'], 34.1459, -118.1521),
      makeFallback('pas-t3', 'Old Town Pasadena', 4.5, 2, 'W Colorado Blvd, Pasadena', ['tourist_attraction', 'shopping'], 34.1461, -118.1487),
      makeFallback('pas-t4', 'Eaton Canyon Nature Center', 4.5, 0, '1750 N Altadena Dr, Pasadena', ['tourist_attraction', 'park', 'hiking'], 34.1801, -118.1020),
      makeFallback('pas-t5', 'Rose Bowl Stadium', 4.6, 0, '1001 Rose Bowl Dr, Pasadena', ['tourist_attraction', 'stadium'], 34.1613, -118.1676),
      makeFallback('pas-t6', 'Gamble House', 4.6, 2, '4 Westmoreland Pl, Pasadena', ['tourist_attraction', 'museum'], 34.1590, -118.1599),
    ],
  },

  // ── West Hollywood ──
  'west-hollywood': {
    restaurant: [
      makeFallback('wh-r1', 'Craig\'s', 4.3, 3, '8826 Melrose Ave, West Hollywood', ['restaurant', 'american'], 34.0808, -118.3821),
      makeFallback('wh-r2', 'Catch LA', 4.2, 4, '8715 Melrose Ave, West Hollywood', ['restaurant', 'seafood'], 34.0803, -118.3800),
      makeFallback('wh-r3', 'Nobu West Hollywood', 4.3, 4, '8764 Melrose Ave, West Hollywood', ['restaurant', 'japanese'], 34.0806, -118.3810),
      makeFallback('wh-r4', 'Night + Market Sahara', 4.5, 2, '9043 Sunset Blvd, West Hollywood', ['restaurant', 'thai'], 34.0901, -118.3874),
      makeFallback('wh-r5', 'Dan Tana\'s', 4.4, 3, '9071 Santa Monica Blvd, West Hollywood', ['restaurant', 'italian'], 34.0825, -118.3874),
      makeFallback('wh-r6', 'Sushi Park', 4.6, 3, '8539 Sunset Blvd, West Hollywood', ['restaurant', 'japanese'], 34.0897, -118.3750),
      makeFallback('wh-r7', 'Connie & Ted\'s', 4.4, 3, '8171 Santa Monica Blvd, West Hollywood', ['restaurant', 'seafood'], 34.0831, -118.3664),
      makeFallback('wh-r8', 'Petit Trois', 4.5, 3, '718 N Highland Ave, Los Angeles', ['restaurant', 'french'], 34.0837, -118.3385),
    ],
    cafe: [
      makeFallback('wh-c1', 'Alfred Coffee', 4.4, 2, '8428 Melrose Pl, West Hollywood', ['cafe'], 34.0828, -118.3720),
      makeFallback('wh-c2', 'Verve Coffee Roasters', 4.5, 2, '8925 Melrose Ave, West Hollywood', ['cafe'], 34.0811, -118.3858),
      makeFallback('wh-c3', 'Urth Caffe', 4.4, 2, '8565 Melrose Ave, West Hollywood', ['cafe'], 34.0799, -118.3765),
      makeFallback('wh-c4', 'Carrera Cafe', 4.3, 2, '8251 Melrose Ave, West Hollywood', ['cafe'], 34.0825, -118.3680),
      makeFallback('wh-c5', 'Dialogue', 4.5, 1, '8766 Holloway Dr, West Hollywood', ['cafe'], 34.0861, -118.3792),
      makeFallback('wh-c6', 'Blu Jam Cafe', 4.4, 2, '7371 Melrose Ave, Los Angeles', ['cafe', 'brunch'], 34.0835, -118.3520),
    ],
    tourist_attraction: [
      makeFallback('wh-t1', 'Sunset Strip', 4.4, 0, 'Sunset Blvd, West Hollywood', ['tourist_attraction'], 34.0901, -118.3750),
      makeFallback('wh-t2', 'The Comedy Store', 4.6, 2, '8433 Sunset Blvd, West Hollywood', ['tourist_attraction', 'comedy'], 34.0901, -118.3735),
      makeFallback('wh-t3', 'Melrose Avenue Shopping', 4.4, 2, 'Melrose Ave, West Hollywood', ['tourist_attraction', 'shopping'], 34.0833, -118.3617),
      makeFallback('wh-t4', 'Pacific Design Center', 4.3, 0, '8687 Melrose Ave, West Hollywood', ['tourist_attraction', 'architecture'], 34.0849, -118.3790),
      makeFallback('wh-t5', 'Runyon Canyon Park', 4.5, 0, '2000 N Fuller Ave, Los Angeles', ['tourist_attraction', 'park', 'hiking'], 34.1055, -118.3498),
      makeFallback('wh-t6', 'West Hollywood Library', 4.5, 0, '625 N San Vicente Blvd, West Hollywood', ['tourist_attraction', 'library'], 34.0858, -118.3798),
    ],
  },

  // ── Berkeley ──
  'berkeley': {
    restaurant: [
      makeFallback('bk-r1', 'Chez Panisse', 4.5, 4, '1517 Shattuck Ave, Berkeley', ['restaurant', 'american'], 37.8797, -122.2691),
      makeFallback('bk-r2', 'Ippuku', 4.5, 2, '2130 Center St, Berkeley', ['restaurant', 'japanese'], 37.8697, -122.2686),
      makeFallback('bk-r3', 'Comal', 4.4, 2, '2020 Shattuck Ave, Berkeley', ['restaurant', 'mexican'], 37.8717, -122.2690),
      makeFallback('bk-r4', 'Rivoli', 4.5, 3, '1539 Solano Ave, Berkeley', ['restaurant', 'american'], 37.8908, -122.2797),
      makeFallback('bk-r5', 'Gather', 4.3, 2, '2200 Oxford St, Berkeley', ['restaurant', 'american'], 37.8709, -122.2662),
      makeFallback('bk-r6', 'Great China', 4.4, 2, '2115 Kittredge St, Berkeley', ['restaurant', 'chinese'], 37.8684, -122.2683),
      makeFallback('bk-r7', 'La Note', 4.4, 2, '2377 Shattuck Ave, Berkeley', ['restaurant', 'french'], 37.8658, -122.2680),
      makeFallback('bk-r8', 'Smoke Berkeley', 4.3, 2, '2518 Durant Ave, Berkeley', ['restaurant', 'bbq'], 37.8674, -122.2574),
    ],
    cafe: [
      makeFallback('bk-c1', '1951 Coffee Company', 4.6, 1, '2410 Channing Way, Berkeley', ['cafe'], 37.8664, -122.2611),
      makeFallback('bk-c2', 'Asha Tea House', 4.5, 1, '2086 University Ave, Berkeley', ['cafe', 'tea', 'matcha'], 37.8719, -122.2679),
      makeFallback('bk-c3', 'Caffe Strada', 4.4, 1, '2300 College Ave, Berkeley', ['cafe'], 37.8690, -122.2540),
      makeFallback('bk-c4', 'Philz Coffee', 4.5, 2, '2435 Telegraph Ave, Berkeley', ['cafe'], 37.8668, -122.2590),
      makeFallback('bk-c5', 'Yali\'s Cafe', 4.3, 1, '1920 Oxford St, Berkeley', ['cafe'], 37.8733, -122.2662),
      makeFallback('bk-c6', 'Peet\'s Coffee (Original)', 4.5, 1, '2124 Vine St, Berkeley', ['cafe'], 37.8792, -122.2695),
    ],
    tourist_attraction: [
      makeFallback('bk-t1', 'UC Berkeley Campus', 4.7, 0, 'Berkeley, CA', ['tourist_attraction', 'university'], 37.8719, -122.2585),
      makeFallback('bk-t2', 'Tilden Regional Park', 4.7, 0, '2501 Grizzly Peak Blvd, Berkeley', ['tourist_attraction', 'park', 'hiking'], 37.9051, -122.2446),
      makeFallback('bk-t3', 'Berkeley Rose Garden', 4.6, 0, '1200 Euclid Ave, Berkeley', ['tourist_attraction', 'garden'], 37.8865, -122.2610),
      makeFallback('bk-t4', 'Indian Rock Park', 4.6, 0, '950 Indian Rock Ave, Berkeley', ['tourist_attraction', 'park'], 37.8917, -122.2729),
      makeFallback('bk-t5', 'Sather Tower (Campanile)', 4.5, 1, 'UC Berkeley, Berkeley', ['tourist_attraction', 'landmark'], 37.8722, -122.2578),
      makeFallback('bk-t6', 'Berkeley Marina', 4.4, 0, '201 University Ave, Berkeley', ['tourist_attraction', 'park'], 37.8652, -122.3110),
    ],
  },

  // ── San Francisco ──
  'san-francisco': {
    restaurant: [
      makeFallback('sf-r1', 'Tartine Manufactory', 4.4, 2, '595 Alabama St, San Francisco', ['restaurant', 'bakery'], 37.7634, -122.4113),
      makeFallback('sf-r2', 'Swan Oyster Depot', 4.7, 2, '1517 Polk St, San Francisco', ['restaurant', 'seafood'], 37.7899, -122.4210),
      makeFallback('sf-r3', 'Burma Superstar', 4.4, 2, '309 Clement St, San Francisco', ['restaurant', 'burmese'], 37.7830, -122.4626),
      makeFallback('sf-r4', 'Nopa', 4.5, 3, '560 Divisadero St, San Francisco', ['restaurant', 'american'], 37.7745, -122.4378),
      makeFallback('sf-r5', 'Liholiho Yacht Club', 4.5, 3, '871 Sutter St, San Francisco', ['restaurant', 'hawaiian'], 37.7880, -122.4137),
      makeFallback('sf-r6', 'Mister Jiu\'s', 4.5, 3, '28 Waverly Pl, San Francisco', ['restaurant', 'chinese'], 37.7943, -122.4070),
      makeFallback('sf-r7', 'La Taqueria', 4.5, 1, '2889 Mission St, San Francisco', ['restaurant', 'mexican'], 37.7512, -122.4183),
      makeFallback('sf-r8', 'State Bird Provisions', 4.5, 3, '1529 Fillmore St, San Francisco', ['restaurant', 'american'], 37.7832, -122.4327),
    ],
    cafe: [
      makeFallback('sf-c1', 'Sightglass Coffee', 4.5, 2, '270 7th St, San Francisco', ['cafe'], 37.7774, -122.4078),
      makeFallback('sf-c2', 'Blue Bottle Coffee', 4.4, 2, '315 Linden St, San Francisco', ['cafe'], 37.7765, -122.4235),
      makeFallback('sf-c3', 'Ritual Coffee Roasters', 4.4, 2, '1026 Valencia St, San Francisco', ['cafe'], 37.7565, -122.4210),
      makeFallback('sf-c4', 'Saint Frank Coffee', 4.5, 2, '2340 Polk St, San Francisco', ['cafe'], 37.7962, -122.4222),
      makeFallback('sf-c5', 'Stonemill Matcha', 4.5, 2, '561 Valencia St, San Francisco', ['cafe', 'matcha'], 37.7640, -122.4213),
      makeFallback('sf-c6', 'Andytown Coffee', 4.6, 1, '3655 Lawton St, San Francisco', ['cafe'], 37.7575, -122.5012),
    ],
    tourist_attraction: [
      makeFallback('sf-t1', 'Golden Gate Bridge', 4.8, 0, 'Golden Gate Bridge, San Francisco', ['tourist_attraction', 'landmark'], 37.8199, -122.4783),
      makeFallback('sf-t2', 'Dolores Park', 4.6, 0, 'Dolores St, San Francisco', ['tourist_attraction', 'park'], 37.7596, -122.4269),
      makeFallback('sf-t3', 'Fisherman\'s Wharf', 4.3, 2, 'Fisherman\'s Wharf, San Francisco', ['tourist_attraction'], 37.8080, -122.4177),
      makeFallback('sf-t4', 'Alcatraz Island', 4.7, 2, 'Alcatraz Island, San Francisco', ['tourist_attraction', 'museum'], 37.8267, -122.4230),
      makeFallback('sf-t5', 'Golden Gate Park', 4.7, 0, 'Golden Gate Park, San Francisco', ['tourist_attraction', 'park'], 37.7694, -122.4862),
      makeFallback('sf-t6', 'Chinatown', 4.5, 1, 'Grant Ave, San Francisco', ['tourist_attraction', 'shopping'], 37.7941, -122.4078),
    ],
  },
}

// ─── Interest-Specific Fallback Data ────────────────────
// Maps interest keywords to curated places per neighborhood

const INTEREST_DATA = {
  'irvine': {
    hiking: [
      makeFallback('irv-h1', 'Bommer Canyon Trail', 4.5, 0, 'Bommer Canyon Rd, Irvine', ['hiking', 'park', 'outdoor'], 33.6180, -117.8020),
      makeFallback('irv-h2', 'Quail Hill Loop Trail', 4.4, 0, 'Shady Canyon Dr, Irvine', ['hiking', 'park', 'outdoor'], 33.6280, -117.8100),
      makeFallback('irv-h3', 'Turtle Rock Nature Trail', 4.3, 0, 'Turtle Rock Dr, Irvine', ['hiking', 'park', 'outdoor'], 33.6366, -117.8036),
      makeFallback('irv-h4', 'San Joaquin Wildlife Sanctuary', 4.6, 0, '5 Riparian View, Irvine', ['hiking', 'nature', 'outdoor'], 33.6600, -117.8467),
      makeFallback('irv-h5', 'Crystal Cove State Park', 4.7, 1, '8471 N Coast Hwy, Laguna Beach', ['hiking', 'beach', 'outdoor'], 33.5742, -117.8369),
    ],
    studying: [
      makeFallback('irv-s1', 'Irvine Valley College Library', 4.3, 0, '5500 Irvine Center Dr, Irvine', ['library', 'studying', 'quiet'], 33.6556, -117.7764),
      makeFallback('irv-s2', 'UCI Langson Library', 4.4, 0, 'UCI Campus, Irvine', ['library', 'studying', 'university'], 33.6470, -117.8414),
      makeFallback('irv-s3', 'Heritage Park Library', 4.5, 0, '14361 Yale Ave, Irvine', ['library', 'studying', 'quiet'], 33.7010, -117.7988),
      makeFallback('irv-s4', 'Stereoscope Coffee', 4.6, 1, '4280 Barranca Pkwy, Irvine', ['cafe', 'studying', 'wifi'], 33.6820, -117.7787),
      makeFallback('irv-s5', 'Blk Dot Coffee', 4.5, 1, '82 Fortune Dr, Irvine', ['cafe', 'studying', 'wifi'], 33.6530, -117.7414),
    ],
    pickleball: [
      makeFallback('irv-p1', 'Heritage Community Park Courts', 4.4, 0, '14301 Yale Ave, Irvine', ['pickleball', 'sports', 'recreation'], 33.7010, -117.7988),
      makeFallback('irv-p2', 'Woodbridge Tennis & Pickleball', 4.3, 1, '31 Creek Rd, Irvine', ['pickleball', 'tennis', 'sports'], 33.6940, -117.7960),
      makeFallback('irv-p3', 'Great Park Sports Complex', 4.5, 0, '8000 Great Park Blvd, Irvine', ['pickleball', 'sports', 'recreation'], 33.6641, -117.7648),
      makeFallback('irv-p4', 'Deerfield Community Park', 4.2, 0, '55 Deerfield Ave, Irvine', ['pickleball', 'sports', 'park'], 33.6770, -117.7700),
    ],
    gym: [
      makeFallback('irv-g1', 'Equinox Irvine', 4.4, 3, '3100 Park Pl, Irvine', ['gym', 'fitness'], 33.6769, -117.8374),
      makeFallback('irv-g2', 'LA Fitness Irvine', 4.1, 2, '3960 Barranca Pkwy, Irvine', ['gym', 'fitness'], 33.6826, -117.7830),
      makeFallback('irv-g3', 'Orangetheory Fitness', 4.5, 2, '6222 Irvine Blvd, Irvine', ['gym', 'fitness'], 33.6982, -117.7700),
    ],
    yoga: [
      makeFallback('irv-y1', 'CorePower Yoga', 4.4, 2, '6416 Irvine Blvd, Irvine', ['yoga', 'fitness', 'wellness'], 33.6989, -117.7672),
      makeFallback('irv-y2', 'YogaWorks', 4.3, 2, '2646 Dupont Dr, Irvine', ['yoga', 'fitness', 'wellness'], 33.6900, -117.8340),
    ],
    shopping: [
      makeFallback('irv-sh1', 'Irvine Spectrum Center', 4.5, 2, '670 Spectrum Center Dr, Irvine', ['shopping', 'mall'], 33.6494, -117.7430),
      makeFallback('irv-sh2', 'Diamond Jamboree', 4.3, 2, '2710 Alton Pkwy, Irvine', ['shopping', 'food_court', 'asian'], 33.6810, -117.8370),
    ],
  },
  'santa-monica': {
    hiking: [
      makeFallback('sm-h1', 'Temescal Gateway Park', 4.5, 1, '15601 Sunset Blvd, Pacific Palisades', ['hiking', 'park', 'outdoor'], 34.0470, -118.5296),
      makeFallback('sm-h2', 'Will Rogers State Park', 4.6, 1, '1501 Will Rogers Park Rd, Pacific Palisades', ['hiking', 'outdoor'], 34.0530, -118.5136),
      makeFallback('sm-h3', 'Santa Monica Mountains Backbone Trail', 4.7, 0, 'Santa Monica Mountains', ['hiking', 'outdoor', 'nature'], 34.0700, -118.5600),
      makeFallback('sm-h4', 'Palisades Park Bluffs Walk', 4.5, 0, 'Ocean Ave, Santa Monica', ['hiking', 'walking', 'scenic'], 34.0210, -118.5030),
    ],
    studying: [
      makeFallback('sm-s1', 'Santa Monica Public Library', 4.6, 0, '601 Santa Monica Blvd, Santa Monica', ['library', 'studying', 'quiet'], 34.0156, -118.4905),
      makeFallback('sm-s2', 'Dogtown Coffee', 4.5, 1, '2003 Main St, Santa Monica', ['cafe', 'studying', 'wifi'], 34.0038, -118.4907),
      makeFallback('sm-s3', 'Caffe Luxxe', 4.6, 2, '925 Montana Ave, Santa Monica', ['cafe', 'studying', 'wifi'], 34.0335, -118.4942),
      makeFallback('sm-s4', 'SMC Library', 4.3, 0, '1900 Pico Blvd, Santa Monica', ['library', 'studying', 'university'], 34.0145, -118.4720),
    ],
    pickleball: [
      makeFallback('sm-p1', 'Memorial Park Pickleball Courts', 4.4, 0, '1401 Olympic Blvd, Santa Monica', ['pickleball', 'sports'], 34.0198, -118.4870),
      makeFallback('sm-p2', 'Penmar Park Recreation Center', 4.3, 0, '1341 Lake St, Venice', ['pickleball', 'tennis', 'sports'], 33.9920, -118.4590),
      makeFallback('sm-p3', 'Marine Park Courts', 4.2, 0, '1406 Marine St, Santa Monica', ['pickleball', 'sports', 'recreation'], 34.0065, -118.4880),
    ],
    surfing: [
      makeFallback('sm-su1', 'Surfrider Beach', 4.6, 0, 'Pacific Coast Hwy, Malibu', ['surfing', 'beach', 'outdoor'], 34.0362, -118.6811),
      makeFallback('sm-su2', 'Venice Breakwater', 4.4, 0, 'Venice Beach, Los Angeles', ['surfing', 'beach'], 33.9830, -118.4770),
      makeFallback('sm-su3', 'Aqua Surf School', 4.5, 2, '2620 Ocean Front Walk, Venice', ['surfing', 'lessons'], 33.9880, -118.4740),
    ],
    yoga: [
      makeFallback('sm-y1', 'YogaWorks Santa Monica', 4.4, 2, '1426 Montana Ave, Santa Monica', ['yoga', 'wellness'], 34.0353, -118.4975),
      makeFallback('sm-y2', 'Santa Monica Yoga', 4.5, 2, '1640 Ocean Park Blvd, Santa Monica', ['yoga', 'wellness'], 34.0043, -118.4686),
    ],
  },
  'pasadena': {
    hiking: [
      makeFallback('pas-h1', 'Eaton Canyon Falls Trail', 4.5, 0, '1750 N Altadena Dr, Pasadena', ['hiking', 'waterfall', 'outdoor'], 34.1801, -118.1020),
      makeFallback('pas-h2', 'Echo Mountain Trail', 4.6, 0, 'Lake Ave, Altadena', ['hiking', 'outdoor', 'scenic'], 34.2000, -118.1300),
      makeFallback('pas-h3', 'Millard Canyon Falls', 4.4, 0, 'Chaney Trail, Altadena', ['hiking', 'waterfall', 'nature'], 34.2060, -118.1510),
      makeFallback('pas-h4', 'Lower Arroyo Seco Trail', 4.3, 0, 'Arroyo Blvd, Pasadena', ['hiking', 'nature', 'outdoor'], 34.1487, -118.1665),
    ],
    studying: [
      makeFallback('pas-s1', 'Pasadena Central Library', 4.6, 0, '285 E Walnut St, Pasadena', ['library', 'studying', 'quiet'], 34.1494, -118.1430),
      makeFallback('pas-s2', 'Copa Vida', 4.6, 2, '34 S Raymond Ave, Pasadena', ['cafe', 'studying', 'wifi'], 34.1454, -118.1487),
      makeFallback('pas-s3', 'Intelligentsia Coffee', 4.5, 2, '55 E Colorado Blvd, Pasadena', ['cafe', 'studying', 'wifi'], 34.1459, -118.1445),
      makeFallback('pas-s4', 'Caltech Sherman Fairchild Library', 4.5, 0, '1201 E California Blvd, Pasadena', ['library', 'studying', 'university'], 34.1378, -118.1253),
    ],
    pickleball: [
      makeFallback('pas-p1', 'Robinson Park Pickleball Courts', 4.3, 0, '1081 N Fair Oaks Ave, Pasadena', ['pickleball', 'sports'], 34.1590, -118.1491),
      makeFallback('pas-p2', 'Victory Park Courts', 4.2, 0, '2575 Paloma St, Pasadena', ['pickleball', 'tennis', 'sports'], 34.1650, -118.1510),
      makeFallback('pas-p3', 'Brookside Park Recreation', 4.4, 0, '360 N Arroyo Blvd, Pasadena', ['pickleball', 'sports', 'recreation'], 34.1560, -118.1640),
    ],
    museums: [
      makeFallback('pas-m1', 'Norton Simon Museum', 4.7, 2, '411 W Colorado Blvd, Pasadena', ['museum', 'art'], 34.1459, -118.1521),
      makeFallback('pas-m2', 'The Huntington Library', 4.8, 2, '1151 Oxford Rd, San Marino', ['museum', 'garden', 'library'], 34.1293, -118.1146),
      makeFallback('pas-m3', 'Pasadena Museum of History', 4.3, 1, '470 W Walnut St, Pasadena', ['museum', 'history'], 34.1499, -118.1533),
    ],
  },
  'west-hollywood': {
    hiking: [
      makeFallback('wh-h1', 'Runyon Canyon Park', 4.5, 0, '2000 N Fuller Ave, Los Angeles', ['hiking', 'outdoor', 'scenic'], 34.1055, -118.3498),
      makeFallback('wh-h2', 'TreePeople Park', 4.4, 0, '12601 Mulholland Dr, Beverly Hills', ['hiking', 'nature', 'outdoor'], 34.1215, -118.4060),
      makeFallback('wh-h3', 'Franklin Canyon Park', 4.5, 0, '2600 Franklin Canyon Dr, Beverly Hills', ['hiking', 'nature', 'outdoor'], 34.1150, -118.4100),
      makeFallback('wh-h4', 'Griffith Observatory Trail', 4.7, 0, '2800 E Observatory Rd, Los Angeles', ['hiking', 'scenic', 'landmark'], 34.1184, -118.3004),
    ],
    studying: [
      makeFallback('wh-s1', 'West Hollywood Library', 4.5, 0, '625 N San Vicente Blvd, West Hollywood', ['library', 'studying', 'quiet'], 34.0858, -118.3798),
      makeFallback('wh-s2', 'Alfred Coffee', 4.4, 2, '8428 Melrose Pl, West Hollywood', ['cafe', 'studying', 'wifi'], 34.0828, -118.3720),
      makeFallback('wh-s3', 'Verve Coffee Roasters', 4.5, 2, '8925 Melrose Ave, West Hollywood', ['cafe', 'studying', 'wifi'], 34.0811, -118.3858),
      makeFallback('wh-s4', 'Dialogue', 4.5, 1, '8766 Holloway Dr, West Hollywood', ['cafe', 'studying', 'wifi'], 34.0861, -118.3792),
    ],
    pickleball: [
      makeFallback('wh-p1', 'Plummer Park Courts', 4.3, 0, '7377 Santa Monica Blvd, West Hollywood', ['pickleball', 'sports'], 34.0830, -118.3600),
      makeFallback('wh-p2', 'West Hollywood Park Courts', 4.4, 0, '647 N San Vicente Blvd, West Hollywood', ['pickleball', 'sports', 'recreation'], 34.0862, -118.3798),
      makeFallback('wh-p3', 'Pan Pacific Park Recreation', 4.2, 0, '7600 Beverly Blvd, Los Angeles', ['pickleball', 'sports', 'park'], 34.0760, -118.3610),
    ],
    nightlife: [
      makeFallback('wh-n1', 'The Abbey', 4.4, 2, '692 N Robertson Blvd, West Hollywood', ['bar', 'nightlife', 'club'], 34.0838, -118.3850),
      makeFallback('wh-n2', 'Whisky a Go Go', 4.4, 2, '8901 Sunset Blvd, West Hollywood', ['nightlife', 'live_music', 'bar'], 34.0902, -118.3866),
      makeFallback('wh-n3', 'The Troubadour', 4.5, 2, '9081 Santa Monica Blvd, West Hollywood', ['nightlife', 'live_music', 'venue'], 34.0826, -118.3895),
      makeFallback('wh-n4', 'The Comedy Store', 4.6, 2, '8433 Sunset Blvd, West Hollywood', ['nightlife', 'comedy', 'entertainment'], 34.0901, -118.3735),
    ],
  },
  'berkeley': {
    hiking: [
      makeFallback('bk-h1', 'Tilden Regional Park', 4.7, 0, '2501 Grizzly Peak Blvd, Berkeley', ['hiking', 'park', 'outdoor'], 37.9051, -122.2446),
      makeFallback('bk-h2', 'Strawberry Canyon Fire Trail', 4.4, 0, 'Centennial Dr, Berkeley', ['hiking', 'outdoor', 'nature'], 37.8760, -122.2430),
      makeFallback('bk-h3', 'Grizzly Peak Trail', 4.5, 0, 'Grizzly Peak Blvd, Berkeley', ['hiking', 'scenic', 'outdoor'], 37.8890, -122.2400),
      makeFallback('bk-h4', 'Claremont Canyon Regional Preserve', 4.5, 0, 'Stonewall Rd, Berkeley', ['hiking', 'nature', 'outdoor'], 37.8610, -122.2350),
      makeFallback('bk-h5', 'Indian Rock Park', 4.6, 0, '950 Indian Rock Ave, Berkeley', ['hiking', 'climbing', 'scenic'], 37.8917, -122.2729),
    ],
    studying: [
      makeFallback('bk-s1', 'Doe Memorial Library', 4.6, 0, 'UC Berkeley Campus', ['library', 'studying', 'university', 'quiet'], 37.8724, -122.2594),
      makeFallback('bk-s2', 'Moffitt Library', 4.4, 0, 'UC Berkeley Campus', ['library', 'studying', 'university'], 37.8726, -122.2608),
      makeFallback('bk-s3', 'Berkeley Public Library', 4.5, 0, '2090 Kittredge St, Berkeley', ['library', 'studying', 'quiet'], 37.8686, -122.2683),
      makeFallback('bk-s4', 'Caffe Strada', 4.4, 1, '2300 College Ave, Berkeley', ['cafe', 'studying', 'wifi', 'outdoor_seating'], 37.8690, -122.2540),
      makeFallback('bk-s5', '1951 Coffee Company', 4.6, 1, '2410 Channing Way, Berkeley', ['cafe', 'studying', 'wifi'], 37.8664, -122.2611),
      makeFallback('bk-s6', 'Free Speech Movement Cafe', 4.3, 1, 'UC Berkeley Campus', ['cafe', 'studying', 'wifi', 'university'], 37.8726, -122.2605),
    ],
    pickleball: [
      makeFallback('bk-p1', 'San Pablo Park Courts', 4.3, 0, '2800 Park St, Berkeley', ['pickleball', 'sports', 'recreation'], 37.8600, -122.2870),
      makeFallback('bk-p2', 'King Park Recreation', 4.2, 0, '1 Lawson Rd, Berkeley', ['pickleball', 'sports'], 37.8780, -122.2660),
      makeFallback('bk-p3', 'Berkeley Tennis Club', 4.4, 2, '2501 Bancroft Way, Berkeley', ['pickleball', 'tennis', 'sports'], 37.8684, -122.2560),
    ],
    matcha: [
      makeFallback('bk-ma1', 'Asha Tea House', 4.5, 1, '2086 University Ave, Berkeley', ['cafe', 'tea', 'matcha'], 37.8719, -122.2679),
      makeFallback('bk-ma2', 'Ippodo Tea', 4.6, 2, '1906 University Ave, Berkeley', ['tea', 'matcha', 'japanese'], 37.8720, -122.2700),
      makeFallback('bk-ma3', 'Shuhari Matcha Cafe', 4.5, 2, 'Telegraph Ave, Berkeley', ['cafe', 'matcha'], 37.8668, -122.2590),
    ],
    sushi: [
      makeFallback('bk-su1', 'Ippuku', 4.5, 2, '2130 Center St, Berkeley', ['restaurant', 'japanese', 'sushi'], 37.8697, -122.2686),
      makeFallback('bk-su2', 'Kiraku', 4.5, 2, '2566 Telegraph Ave, Berkeley', ['restaurant', 'japanese', 'sushi'], 37.8641, -122.2584),
      makeFallback('bk-su3', 'Musashi', 4.3, 2, '2126 Dwight Way, Berkeley', ['restaurant', 'japanese', 'sushi'], 37.8649, -122.2680),
    ],
    bookstores: [
      makeFallback('bk-bk1', 'Moe\'s Books', 4.6, 1, '2476 Telegraph Ave, Berkeley', ['bookstore', 'shopping'], 37.8660, -122.2586),
      makeFallback('bk-bk2', 'Shakespeare & Co.', 4.3, 1, '2499 Telegraph Ave, Berkeley', ['bookstore', 'shopping'], 37.8657, -122.2586),
      makeFallback('bk-bk3', 'Pegasus Books', 4.5, 1, '2349 Shattuck Ave, Berkeley', ['bookstore', 'shopping'], 37.8662, -122.2685),
    ],
  },
  'san-francisco': {
    hiking: [
      makeFallback('sf-h1', 'Lands End Trail', 4.7, 0, 'Lands End Trail, San Francisco', ['hiking', 'scenic', 'outdoor'], 37.7870, -122.5050),
      makeFallback('sf-h2', 'Twin Peaks', 4.6, 0, '501 Twin Peaks Blvd, San Francisco', ['hiking', 'scenic', 'viewpoint'], 37.7544, -122.4477),
      makeFallback('sf-h3', 'Batteries to Bluffs Trail', 4.5, 0, 'Presidio, San Francisco', ['hiking', 'outdoor', 'scenic'], 37.7990, -122.4770),
      makeFallback('sf-h4', 'Mount Sutro Open Space', 4.4, 0, 'Medical Center Way, San Francisco', ['hiking', 'nature', 'forest'], 37.7590, -122.4580),
      makeFallback('sf-h5', 'Glen Canyon Park', 4.4, 0, 'Bosworth St, San Francisco', ['hiking', 'nature', 'outdoor'], 37.7410, -122.4420),
    ],
    studying: [
      makeFallback('sf-s1', 'SF Public Library (Main)', 4.5, 0, '100 Larkin St, San Francisco', ['library', 'studying', 'quiet'], 37.7791, -122.4156),
      makeFallback('sf-s2', 'Sightglass Coffee', 4.5, 2, '270 7th St, San Francisco', ['cafe', 'studying', 'wifi'], 37.7774, -122.4078),
      makeFallback('sf-s3', 'Ritual Coffee Roasters', 4.4, 2, '1026 Valencia St, San Francisco', ['cafe', 'studying', 'wifi'], 37.7565, -122.4210),
      makeFallback('sf-s4', 'The Mill', 4.4, 2, '736 Divisadero St, San Francisco', ['cafe', 'studying', 'wifi', 'bakery'], 37.7764, -122.4378),
      makeFallback('sf-s5', 'Mechanics\' Institute Library', 4.7, 1, '57 Post St, San Francisco', ['library', 'studying', 'quiet', 'coworking'], 37.7889, -122.4030),
    ],
    pickleball: [
      makeFallback('sf-p1', 'Alice Marble Tennis Courts', 4.3, 0, '1725 Hyde St, San Francisco', ['pickleball', 'tennis', 'sports'], 37.7993, -122.4185),
      makeFallback('sf-p2', 'Dolores Park Courts', 4.4, 0, 'Dolores St, San Francisco', ['pickleball', 'sports', 'recreation'], 37.7596, -122.4269),
      makeFallback('sf-p3', 'Goldman Tennis Center', 4.3, 1, '501 Golden Gate Park, San Francisco', ['pickleball', 'tennis', 'sports'], 37.7700, -122.4580),
      makeFallback('sf-p4', 'Moscone Recreation Center', 4.2, 0, '1800 Chestnut St, San Francisco', ['pickleball', 'sports', 'recreation'], 37.8010, -122.4320),
    ],
    matcha: [
      makeFallback('sf-ma1', 'Stonemill Matcha', 4.5, 2, '561 Valencia St, San Francisco', ['cafe', 'matcha', 'japanese'], 37.7640, -122.4213),
      makeFallback('sf-ma2', 'Nombe', 4.3, 2, '2491 Mission St, San Francisco', ['restaurant', 'japanese', 'matcha'], 37.7570, -122.4190),
      makeFallback('sf-ma3', 'Matcha Cafe Maiko', 4.4, 1, '1581 Webster St, San Francisco', ['cafe', 'matcha', 'japanese'], 37.7850, -122.4310),
    ],
    sushi: [
      makeFallback('sf-su1', 'Sushi Ran', 4.6, 3, '107 Caledonia St, Sausalito', ['restaurant', 'japanese', 'sushi'], 37.8590, -122.4850),
      makeFallback('sf-su2', 'Omakase', 4.6, 4, '665 Townsend St, San Francisco', ['restaurant', 'japanese', 'sushi'], 37.7702, -122.3994),
      makeFallback('sf-su3', 'Kusakabe', 4.6, 4, '584 Washington St, San Francisco', ['restaurant', 'japanese', 'sushi'], 37.7953, -122.4031),
    ],
    nightlife: [
      makeFallback('sf-n1', 'Trick Dog', 4.5, 2, '3010 20th St, San Francisco', ['bar', 'nightlife', 'cocktails'], 37.7588, -122.4197),
      makeFallback('sf-n2', 'Smuggler\'s Cove', 4.6, 2, '650 Gough St, San Francisco', ['bar', 'nightlife', 'cocktails', 'tiki'], 37.7786, -122.4245),
      makeFallback('sf-n3', 'The Fillmore', 4.6, 2, '1805 Geary Blvd, San Francisco', ['nightlife', 'live_music', 'venue'], 37.7842, -122.4330),
      makeFallback('sf-n4', 'Zeitgeist', 4.3, 1, '199 Valencia St, San Francisco', ['bar', 'nightlife', 'beer_garden'], 37.7702, -122.4222),
    ],
  },
}

// Keyword synonyms — maps user input to the interest keys used in INTEREST_DATA
const INTEREST_SYNONYMS = {
  hike: 'hiking', hikes: 'hiking', trails: 'hiking', trail: 'hiking', walking: 'hiking', walks: 'hiking', nature: 'hiking',
  study: 'studying', 'study spots': 'studying', library: 'studying', libraries: 'studying', 'quiet places': 'studying', coworking: 'studying', 'work from': 'studying',
  pickle: 'pickleball', 'pickle ball': 'pickleball', tennis: 'pickleball', racquet: 'pickleball',
  surf: 'surfing', 'surf lessons': 'surfing', waves: 'surfing',
  coffee: 'cafe', 'coffee shops': 'cafe', espresso: 'cafe',
  tea: 'matcha', 'green tea': 'matcha', boba: 'matcha',
  sashimi: 'sushi', japanese: 'sushi', ramen: 'sushi',
  workout: 'gym', fitness: 'gym', exercise: 'gym', 'weight training': 'gym',
  bar: 'nightlife', bars: 'nightlife', clubs: 'nightlife', 'live music': 'nightlife', cocktails: 'nightlife', drinks: 'nightlife',
  museum: 'museums', art: 'museums', gallery: 'museums',
  books: 'bookstores', bookstore: 'bookstores', reading: 'bookstores',
  shop: 'shopping', shops: 'shopping', mall: 'shopping',
  stretch: 'yoga', pilates: 'yoga', meditation: 'yoga',
}

// Map coordinates to neighborhood ID for fallback lookup
const COORD_TO_NEIGHBORHOOD = [
  { lat: 33.6846, lng: -117.8265, id: 'irvine' },
  { lat: 34.0195, lng: -118.4912, id: 'santa-monica' },
  { lat: 34.1478, lng: -118.1445, id: 'pasadena' },
  { lat: 34.0900, lng: -118.3617, id: 'west-hollywood' },
  { lat: 37.8716, lng: -122.2727, id: 'berkeley' },
  { lat: 37.7749, lng: -122.4194, id: 'san-francisco' },
]

function findNeighborhoodId(lat, lng) {
  let best = null
  let bestDist = Infinity
  for (const entry of COORD_TO_NEIGHBORHOOD) {
    const dist = Math.abs(entry.lat - lat) + Math.abs(entry.lng - lng)
    if (dist < bestDist) {
      bestDist = dist
      best = entry.id
    }
  }
  return bestDist < 0.15 ? best : null
}

function getFallbackPlaces(lat, lng, type) {
  const id = findNeighborhoodId(lat, lng)
  if (!id || !FALLBACK_DATA[id]) return []
  return FALLBACK_DATA[id][type] || []
}

// Resolve an interest keyword to the canonical key used in INTEREST_DATA
function resolveInterestKey(interest) {
  const lower = interest.toLowerCase().trim()
  // Direct match
  if (INTEREST_SYNONYMS[lower]) return INTEREST_SYNONYMS[lower]
  // Check if the interest itself is a key in INTEREST_DATA (e.g. "hiking", "studying")
  // We check against a merged set of all keys across neighborhoods
  const allKeys = new Set()
  for (const nData of Object.values(INTEREST_DATA)) {
    for (const k of Object.keys(nData)) allKeys.add(k)
  }
  if (allKeys.has(lower)) return lower
  // Partial match on synonyms
  for (const [syn, key] of Object.entries(INTEREST_SYNONYMS)) {
    if (lower.includes(syn) || syn.includes(lower)) return key
  }
  return lower
}

function searchFallbackPlaces(lat, lng, query) {
  const id = findNeighborhoodId(lat, lng)
  if (!id) return []

  // Extract the interest from the query (strip "best ... near Neighborhood")
  const interest = query
    .toLowerCase()
    .replace(/^best\s+/, '')
    .replace(/\s+near\s+.*$/, '')
    .trim()

  const resolved = resolveInterestKey(interest)

  // 1. Try interest-specific data first
  const interestPlaces = INTEREST_DATA[id]?.[resolved] || []
  if (interestPlaces.length > 0) return interestPlaces

  // 2. Fall back to searching across all fallback data by keyword
  const allPlaces = [
    ...(FALLBACK_DATA[id]?.restaurant || []),
    ...(FALLBACK_DATA[id]?.cafe || []),
    ...(FALLBACK_DATA[id]?.tourist_attraction || []),
    ...Object.values(INTEREST_DATA[id] || {}).flat(),
  ]

  // Deduplicate by id
  const seen = new Set()
  const unique = []
  for (const p of allPlaces) {
    if (!seen.has(p.id)) {
      seen.add(p.id)
      unique.push(p)
    }
  }

  return unique.filter((p) => {
    const searchable = `${p.name} ${p.types.join(' ')}`.toLowerCase()
    return searchable.includes(interest) || searchable.includes(resolved)
  }).slice(0, 10)
}
