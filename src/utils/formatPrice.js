export function formatPrice(price, listingType) {
  if (!price) return 'Price N/A'
  if (listingType === 'airbnb') return `$${price.toLocaleString()}/night`
  if (listingType === 'rent') return `$${price.toLocaleString()}/mo`
  if (price >= 1_000_000) {
    return `$${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 2)}M`
  }
  if (price >= 1000) {
    const k = Math.round(price / 1000)
    if (k >= 1000) return `$${(price / 1_000_000).toFixed(2)}M`
    return `$${k}K`
  }
  return `$${price.toLocaleString()}`
}
