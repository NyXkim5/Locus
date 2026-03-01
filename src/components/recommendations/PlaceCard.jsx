import { motion } from 'framer-motion'

function PriceIndicator({ level }) {
  if (level == null) return null
  return (
    <span className="text-[12px] text-[var(--text-muted)]">
      {'$'.repeat(level)}
      <span className="opacity-30">{'$'.repeat(4 - level)}</span>
    </span>
  )
}

function Stars({ rating }) {
  if (rating == null) return null
  return (
    <span className="flex items-center gap-1 text-[12px]">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="font-medium text-[var(--text-secondary)]">{rating.toFixed(1)}</span>
      <span className="text-[var(--text-muted)]">({rating >= 4.5 ? 'Excellent' : rating >= 4 ? 'Very Good' : rating >= 3.5 ? 'Good' : 'OK'})</span>
    </span>
  )
}

export default function PlaceCard({ place, index }) {
  return (
    <motion.a
      href={place.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex gap-3 p-2.5 rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-active)] transition-colors group"
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-[8px] overflow-hidden bg-[var(--bg-elevated)] flex-shrink-0">
        {place.photoUrl ? (
          <img
            src={place.photoUrl}
            alt={place.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-[20px]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-[var(--text-primary)] truncate leading-tight">
          {place.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <Stars rating={place.rating} />
          <PriceIndicator level={place.priceLevel} />
        </div>
        <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
          {place.address}
        </p>
      </div>
    </motion.a>
  )
}
