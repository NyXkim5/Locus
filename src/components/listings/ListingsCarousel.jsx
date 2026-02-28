import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EnhancedListingCard from './EnhancedListingCard'

export default function ListingsCarousel({ listings }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const goTo = useCallback((idx) => {
    setDirection(idx > activeIndex ? 1 : -1)
    setActiveIndex(idx)
  }, [activeIndex])

  const advance = useCallback((dir) => {
    const next = activeIndex + dir
    if (next >= 0 && next < (listings?.length || 0)) {
      setDirection(dir)
      setActiveIndex(next)
    }
  }, [activeIndex, listings?.length])

  const handleDragEnd = useCallback((_e, info) => {
    const swipe = info.offset.x * info.velocity.x
    if (swipe < -3000) {
      advance(1)
    } else if (swipe > 3000) {
      advance(-1)
    }
  }, [advance])

  if (!listings?.length) {
    return (
      <div className="rounded-[10px] border border-dashed border-[var(--border)] p-6 text-center">
        <p className="text-[14px] text-[var(--text-muted)]">
          No matching listings found
        </p>
      </div>
    )
  }

  const canPrev = activeIndex > 0
  const canNext = activeIndex < listings.length - 1

  return (
    <div className="min-w-0">
      {/* Navigation header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[14px] font-medium text-[var(--text-muted)]">
          {activeIndex + 1} of {listings.length} picks
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => advance(-1)}
            disabled={!canPrev}
            aria-label="Previous listing"
            className="w-10 h-10 rounded-[8px] border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)] flex items-center justify-center text-[20px] font-bold hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-[var(--bg-elevated)] disabled:hover:border-[var(--border)] disabled:hover:text-[var(--text-primary)] disabled:cursor-not-allowed"
          >
            {'\u2190'}
          </button>
          <button
            onClick={() => advance(1)}
            disabled={!canNext}
            aria-label="Next listing"
            className="w-10 h-10 rounded-[8px] border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-primary)] flex items-center justify-center text-[20px] font-bold hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-[var(--bg-elevated)] disabled:hover:border-[var(--border)] disabled:hover:text-[var(--text-primary)] disabled:cursor-not-allowed"
          >
            {'\u2192'}
          </button>
        </div>
      </div>

      {/* Single card view with swipe + animation */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ cursor: 'grab', touchAction: 'pan-y' }}
          >
            <EnhancedListingCard
              listing={listings[activeIndex]}
              index={0}
              animateMetrics
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      {listings.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {listings.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to listing ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === activeIndex
                  ? 'bg-[var(--accent)] w-5'
                  : 'bg-[var(--border)] w-2 hover:bg-[var(--text-muted)]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
