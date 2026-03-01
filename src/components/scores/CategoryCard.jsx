import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import FactorRow from './FactorRow'
import { getScoreColor } from '../../utils/scoreColor'

export default function CategoryCard({ categoryKey, category, neighborhoodId, onChallengeFactor, weight }) {
  const expandedCategory = useStore((s) => s.expandedCategory)
  const toggleCategory = useStore((s) => s.toggleCategory)
  const challengedFactors = useStore((s) => s.challengedFactors)
  const isExpanded = expandedCategory === categoryKey

  // Resolve challenged factors — fall back to static data
  const resolvedFactors = category.factors.map((factor, i) => {
    const key = `${neighborhoodId}.${categoryKey}.${i}`
    return challengedFactors[key] || factor
  })

  return (
    <div
      className={`bg-[var(--bg-surface)] border rounded-[10px] overflow-hidden hover:border-[var(--border-active)] transition-colors ${
        category.label === 'Sustainability'
          ? 'border-[var(--color-sustainability-border)] ring-1 ring-[var(--color-sustainability-muted)]'
          : 'border-[var(--border)]'
      }`}
    >
      {/* Header */}
      <button
        className="flex items-center justify-between px-4 py-3 w-full text-left cursor-pointer"
        onClick={() => toggleCategory(categoryKey)}
        aria-expanded={isExpanded}
        aria-label={`${category.label} category, score ${category.score}`}
      >
        <span className="text-[14px] font-medium flex items-center gap-1.5">
          {category.label === 'Sustainability' && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true" style={{ stroke: 'var(--color-sustainability)' }}>
              <path d="M12 22c5-3 9-8.5 9-13a9 9 0 0 0-18 0c0 4.5 4 10 9 13z" />
              <path d="M12 11v6M9 14h6" />
            </svg>
          )}
          {category.label}
          {weight > 1.0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] text-[12px] font-medium">
              {weight}x
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          <span
            className="text-[15px] font-semibold"
            style={{ color: getScoreColor(category.score) }}
          >
            {category.score}
          </span>
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </div>
      </button>

      {/* Expanded factors */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-3 pb-3 border-t border-[var(--border)]">
              {resolvedFactors.map((factor, i) => (
                <FactorRow
                  key={factor.name}
                  factor={factor}
                  index={i}
                  onChallenge={() => onChallengeFactor?.(categoryKey, i)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
