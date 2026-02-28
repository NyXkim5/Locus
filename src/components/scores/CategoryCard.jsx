import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import FactorRow from './FactorRow'

function getScoreColor(score) {
  if (score >= 70) return '#34D399'
  if (score >= 40) return '#FBBF24'
  return '#F87171'
}

export default function CategoryCard({ categoryKey, category, neighborhoodId, onChallengeFactor }) {
  const { expandedCategory, toggleCategory } = useStore()
  const isExpanded = expandedCategory === categoryKey

  return (
    <motion.div
      layout
      className="bg-[#161618] border border-[#2A2A2E] rounded-[10px] overflow-hidden hover:border-[#3A3A40] transition-colors cursor-pointer"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        onClick={() => toggleCategory(categoryKey)}
      >
        <span className="text-[14px] font-medium">{category.label}</span>
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
            stroke="#71717A"
            strokeWidth="2"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </div>
      </div>

      {/* Expanded factors */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-3 pb-3 border-t border-[#2A2A2E]">
              {category.factors.map((factor, i) => (
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
    </motion.div>
  )
}
