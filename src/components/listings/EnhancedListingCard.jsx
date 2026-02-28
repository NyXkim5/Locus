import { motion } from 'framer-motion'
import { getScoreColor, getScoreColorHex } from '../../utils/scoreColor'

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function formatPrice(price) {
  if (!price) return 'Price N/A'
  if (price >= 1000000) {
    const m = price / 1000000
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2)}M`
  }
  return `$${(price / 1000).toFixed(0)}K`
}

export default function EnhancedListingCard({ listing, animateMetrics }) {
  const card = (
    <div className="rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden hover:border-[var(--border-active)] transition-colors group flex flex-col shadow-sm">
      {/* Image */}
      <div className="relative h-52 bg-[var(--bg-elevated)] overflow-hidden shrink-0">
        {listing.imgSrc ? (
          <img
            src={listing.imgSrc}
            alt={listing.address}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[40px] opacity-20">{'\u2302'}</span>
          </div>
        )}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-[6px] bg-[var(--bg-base)]/90 shadow-sm">
          <span className="text-[14px] font-medium text-[var(--text-secondary)]">{listing.type}</span>
        </div>
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-[6px] bg-[var(--accent)] shadow-sm">
          <span className="text-[16px] font-bold text-white">
            {formatPrice(listing.price)}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[18px] font-semibold text-[var(--text-primary)] truncate">
          {listing.address}
        </p>

        <div className="flex items-center gap-3 mt-2 text-[15px] text-[var(--text-muted)]">
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

        {/* AI explanation */}
        {listing.aiExplanation && (
          <div className="mt-3.5 pt-3.5 border-t border-[var(--border)]">
            <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-[var(--accent)] mb-2">
              Why this home
            </p>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
              {listing.aiExplanation}
            </p>
          </div>
        )}

        {/* Metric pills — animate in one by one */}
        {listing.relevantMetrics?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3.5">
            {listing.relevantMetrics.map((m, i) => {
              // Normalize score for color: scores <= 10 are on a /10 scale (e.g. school ratings)
              const colorScore = m.score <= 10 ? m.score * 10 : m.score
              const pill = (
                <span
                  key={m.label}
                  title={m.reason}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[14px] font-medium"
                  style={{
                    backgroundColor: hexToRgba(getScoreColorHex(colorScore), 0.08),
                    color: getScoreColor(colorScore),
                  }}
                >
                  {m.label}
                  <span className="font-bold">{m.score}</span>
                </span>
              )

              if (animateMetrics) {
                return (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, scale: 0.6, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + i * 0.15,
                      duration: 0.35,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {pill}
                  </motion.div>
                )
              }

              return pill
            })}
          </div>
        )}
      </div>
    </div>
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
