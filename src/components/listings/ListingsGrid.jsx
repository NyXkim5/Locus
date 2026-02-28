import { motion } from 'framer-motion'
import ListingCard from './ListingCard'

export default function ListingsGrid({ listings, loading, error, neighborhoodName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="mt-8"
    >
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">
            Homes in {neighborhoodName}
          </h2>
          {!loading && !error && listings.length > 0 && (
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              {listings.length} listings from Realtor.com
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden animate-pulse"
            >
              <div className="h-36 bg-[var(--bg-elevated)]" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-[var(--bg-elevated)] rounded w-3/4" />
                <div className="h-2.5 bg-[var(--bg-elevated)] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && error.includes('RAPIDAPI_KEY') && (
        <div className="rounded-[10px] border border-dashed border-[var(--border)] p-6 text-center">
          <p className="text-[13px] text-[var(--text-muted)]">
            Add <span className="font-mono text-[var(--text-secondary)]">VITE_RAPIDAPI_KEY</span> to your .env to show real listings
          </p>
        </div>
      )}

      {error && !error.includes('RAPIDAPI_KEY') && (
        <div className="rounded-[10px] border border-[var(--score-low)]/20 bg-[var(--score-low)]/5 p-4">
          <p className="text-[12px] text-[var(--score-low)]">{error}</p>
        </div>
      )}

      {!loading && !error && listings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {listings.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      )}

      {!loading && !error && listings.length === 0 && (
        <div className="rounded-[10px] border border-dashed border-[var(--border)] p-6 text-center">
          <p className="text-[13px] text-[var(--text-muted)]">
            No listings found in {neighborhoodName}
          </p>
        </div>
      )}
    </motion.div>
  )
}
