import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ListingCard from './ListingCard'

const PAGE_SIZE = 4

const TABS = [
  { key: 'buy', label: 'Buy' },
  { key: 'rent', label: 'Rent' },
  { key: 'airbnb', label: 'Airbnb' },
]

export default function ListingsGrid({
  listings,
  rentals = [],
  airbnbs = [],
  loading,
  rentalsLoading = false,
  airbnbsLoading = false,
  error,
  rentalsError,
  airbnbsError,
  neighborhoodName,
  activeTab,
  onTabChange,
}) {
  const [page, setPage] = useState(0)

  useEffect(() => { setPage(0) }, [activeTab])

  const activeListings = activeTab === 'buy' ? listings
    : activeTab === 'rent' ? rentals
    : airbnbs
  const activeLoading = activeTab === 'buy' ? loading
    : activeTab === 'rent' ? rentalsLoading
    : airbnbsLoading
  const activeError = activeTab === 'buy' ? error
    : activeTab === 'rent' ? rentalsError
    : airbnbsError

  const heading = activeTab === 'buy'
    ? `Homes for Sale in ${neighborhoodName}`
    : activeTab === 'rent'
    ? `Rentals in ${neighborhoodName}`
    : `Airbnb Stays in ${neighborhoodName}`

  const source = activeTab === 'airbnb' ? 'Airbnb' : 'Realtor.com'
  const emptyLabel = activeTab === 'buy' ? 'homes for sale'
    : activeTab === 'rent' ? 'rentals' : 'Airbnb stays'

  const totalPages = Math.max(1, Math.ceil(activeListings.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const visible = activeListings.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

  const prev = () => setPage((p) => Math.max(0, p - 1))
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="mt-8"
    >
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 p-1 bg-[var(--bg-surface)] rounded-[10px] border border-[var(--border)] w-fit">
        {TABS.map((tab) => {
          const count = tab.key === 'buy' ? listings.length
            : tab.key === 'rent' ? rentals.length
            : airbnbs.length
          const isTabLoading = tab.key === 'buy' ? loading
            : tab.key === 'rent' ? rentalsLoading
            : airbnbsLoading
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`px-3.5 py-1.5 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {tab.label}
              {isTabLoading && (
                <span className="ml-1.5 inline-block w-2.5 h-2.5 rounded-full border border-current border-t-transparent animate-spin align-middle" />
              )}
              {!isTabLoading && count > 0 && (
                <span className={`ml-1.5 text-[11px] ${
                  activeTab === tab.key ? 'text-white/70' : 'text-[var(--text-muted)]'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">
            {heading}
          </h2>
          {!activeLoading && !activeError && activeListings.length > 0 && (
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
              {activeListings.length} listings from {source}
            </p>
          )}
        </div>

        {!activeLoading && !activeError && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={safePage === 0}
              aria-label="Previous listings"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="text-[12px] text-[var(--text-muted)] min-w-[3rem] text-center">
              {safePage + 1} / {totalPages}
            </span>
            <button
              onClick={next}
              disabled={safePage === totalPages - 1}
              aria-label="Next listings"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {activeLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
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

      {activeError && activeError.includes('RAPIDAPI_KEY') && (
        <div className="rounded-[10px] border border-dashed border-[var(--border)] p-6 text-center">
          <p className="text-[13px] text-[var(--text-muted)]">
            Add <span className="font-mono text-[var(--text-secondary)]">VITE_RAPIDAPI_KEY</span> to your .env to show real listings
          </p>
        </div>
      )}

      {activeError && !activeError.includes('RAPIDAPI_KEY') && (
        <div className="rounded-[10px] border border-[var(--score-low)]/20 bg-[var(--score-low)]/5 p-4">
          <p className="text-[12px] text-[var(--score-low)]">{activeError}</p>
        </div>
      )}

      {!activeLoading && !activeError && activeListings.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${safePage}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {visible.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {!activeLoading && !activeError && activeListings.length === 0 && (
        <div className="rounded-[10px] border border-dashed border-[var(--border)] p-6 text-center">
          <p className="text-[13px] text-[var(--text-muted)]">
            No {emptyLabel} found in {neighborhoodName}
          </p>
        </div>
      )}
    </motion.div>
  )
}
