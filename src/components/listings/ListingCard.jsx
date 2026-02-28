import { motion } from 'framer-motion'

function formatPrice(price) {
  if (!price) return 'Price N/A'
  if (price >= 1000000) {
    const m = price / 1000000
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2)}M`
  }
  return `$${(price / 1000).toFixed(0)}K`
}

export default function ListingCard({ listing, index }) {
  const card = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden hover:border-[var(--border-active)] transition-colors group"
    >
      {/* Image */}
      <div className="relative h-36 bg-[var(--bg-elevated)] overflow-hidden">
        {listing.imgSrc ? (
          <img
            src={listing.imgSrc}
            alt={listing.address}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[28px] opacity-20">{'\u2302'}</span>
          </div>
        )}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-[4px] bg-[var(--bg-base)]/70 backdrop-blur-sm">
          <span className="text-[10px] font-medium text-[var(--text-muted)]">{listing.type}</span>
        </div>
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-[4px] bg-[var(--accent)]/20 backdrop-blur-sm">
          <span className="text-[10px] font-semibold text-[var(--accent-hover)]">
            {formatPrice(listing.price)}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-3">
        <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate">
          {listing.address}
        </p>

        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[var(--text-muted)]">
          {listing.beds != null && <span>{listing.beds} bd</span>}
          {listing.baths != null && (
            <>
              <span className="opacity-40">|</span>
              <span>{listing.baths} ba</span>
            </>
          )}
          {listing.sqft != null && (
            <>
              <span className="opacity-40">|</span>
              <span>{listing.sqft.toLocaleString()} sqft</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )

  if (listing.detailUrl) {
    return (
      <a
        href={listing.detailUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {card}
      </a>
    )
  }

  return card
}
