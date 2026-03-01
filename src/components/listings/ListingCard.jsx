import { motion } from 'framer-motion'
import { formatPrice } from '../../utils/formatPrice'

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
            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[28px] opacity-40">{'\u2302'}</span>
          </div>
        )}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-[4px] bg-[var(--bg-base)]/70 backdrop-blur-sm">
          <span className="text-[12px] font-medium text-[var(--text-muted)]">{listing.type}</span>
        </div>
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-[4px] bg-[var(--accent)]/20 backdrop-blur-sm">
          <span className="text-[12px] font-semibold text-[var(--accent-hover)]">
            {formatPrice(listing.price, listing.listingType)}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-3">
        <p className="text-[14px] font-semibold text-[var(--text-primary)] truncate" title={listing.address}>
          {listing.address}
        </p>

        <div className="flex items-center gap-2 mt-1.5 text-[12px] text-[var(--text-muted)]">
          {listing.beds != null && <span>{listing.beds} bd</span>}
          {listing.baths != null && (
            <>
              <span className="opacity-50">|</span>
              <span>{listing.baths} ba</span>
            </>
          )}
          {listing.sqft != null && (
            <>
              <span className="opacity-50">|</span>
              <span>{listing.sqft.toLocaleString()} sqft</span>
            </>
          )}
          {listing.rating != null && (
            <>
              <span className="opacity-50">|</span>
              <span>&#9733; {listing.rating.toFixed(1)}</span>
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
