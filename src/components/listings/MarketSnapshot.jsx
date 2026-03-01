import { motion } from 'framer-motion'

function fmt(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

function median(arr) {
  if (!arr.length) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export default function MarketSnapshot({ listings = [], loading }) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-6"
      >
        <h2 className="text-[15px] font-semibold text-[var(--text-primary)] mb-3">Market Snapshot</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] p-4 animate-pulse">
              <div className="h-3 w-16 bg-[var(--bg-elevated)] rounded mb-2" />
              <div className="h-5 w-24 bg-[var(--bg-elevated)] rounded" />
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  if (!listings.length) return null

  const prices = listings.map((l) => l.price).filter((p) => p != null && p > 0)
  const medianPrice = median(prices)
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 0

  const priceSqftValues = listings
    .filter((l) => l.price > 0 && l.sqft > 0)
    .map((l) => l.price / l.sqft)
  const avgPriceSqft = priceSqftValues.length
    ? Math.round(priceSqftValues.reduce((a, b) => a + b, 0) / priceSqftValues.length)
    : null

  const bedValues = listings.map((l) => l.beds).filter((b) => b != null)
  const avgBeds = bedValues.length
    ? (bedValues.reduce((a, b) => a + b, 0) / bedValues.length).toFixed(1)
    : null

  const stats = [
    { label: 'Median Price', value: prices.length ? fmt(medianPrice) : 'N/A' },
    { label: 'Price Range', value: prices.length >= 2 ? `${fmt(minPrice)} – ${fmt(maxPrice)}` : 'N/A' },
    { label: 'Avg $/sqft', value: avgPriceSqft ? `$${avgPriceSqft.toLocaleString()}` : 'N/A' },
    { label: 'Avg Beds', value: avgBeds ?? 'N/A' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-6"
    >
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Market Snapshot</h2>
        <span className="text-[12px] text-[var(--text-muted)]">{listings.length} active listings</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] p-4"
          >
            <p className="text-[12px] font-medium text-[var(--text-muted)] mb-1">{s.label}</p>
            <p className="text-[17px] font-semibold text-[var(--text-primary)]">{s.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
