import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'
import { getNeighborhoodById, neighborhoods } from '../data/neighborhoods'
import TopBar from '../components/shared/TopBar'
import FramingToggle from '../components/framing/FramingToggle'
import ScoreCircle from '../components/shared/ScoreCircle'
import ScoreBar from '../components/shared/ScoreBar'
import { useState } from 'react'

function getScoreColor(score) {
  if (score >= 70) return '#34D399'
  if (score >= 40) return '#FBBF24'
  return '#F87171'
}

function ComparisonColumn({ neighborhood }) {
  const framingMode = useStore((s) => s.framingMode)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 min-w-0"
    >
      {/* Name + Score */}
      <div className="text-center mb-5">
        <h3 className="text-[15px] font-semibold mb-3">{neighborhood.name}</h3>
        <div className="flex justify-center">
          <ScoreCircle score={neighborhood.overallScore} size="sm" />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {neighborhood.categories.map((cat, i) => (
          <div key={cat.label} className="bg-[#161618] rounded-[10px] border border-[#2A2A2E] px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-[#A1A1AA]">{cat.label}</span>
              <span
                className="text-[14px] font-semibold"
                style={{ color: getScoreColor(cat.score) }}
              >
                {cat.score}
              </span>
            </div>
            <ScoreBar score={cat.score} />
            <AnimatePresence mode="wait">
              <motion.p
                key={framingMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[11px] text-[#71717A] mt-2"
              >
                {cat.factors[0]?.frames[framingMode]}
              </motion.p>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function generateInsight(a, b) {
  const diffs = a.categories.map((cat, i) => ({
    label: cat.label,
    diff: (b.categories[i]?.score || 0) - cat.score,
    aScore: cat.score,
    bScore: b.categories[i]?.score || 0,
  }))

  const biggest = diffs.reduce((max, d) => Math.abs(d.diff) > Math.abs(max.diff) ? d : max)
  const winner = biggest.diff > 0 ? b.name : a.name

  return `${winner} scores significantly higher on ${biggest.label} (${Math.max(biggest.aScore, biggest.bScore)} vs ${Math.min(biggest.aScore, biggest.bScore)}). Overall, ${a.overallScore > b.overallScore ? a.name : b.name} has a higher composite score, but individual category differences may matter more for your priorities.`
}

export default function ComparePage() {
  const navigate = useNavigate()
  const { comparisonIds, addToComparison, removeFromComparison } = useStore()
  const [showPicker, setShowPicker] = useState(false)

  const comparedNeighborhoods = comparisonIds
    .map(getNeighborhoodById)
    .filter(Boolean)

  const availableToAdd = neighborhoods.filter(
    (n) => !comparisonIds.includes(n.id)
  )

  return (
    <div className="min-h-screen">
      <TopBar title={`Comparing ${comparedNeighborhoods.length} neighborhood${comparedNeighborhoods.length !== 1 ? 's' : ''}`} showBack />

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Framing toggle */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-[12px] text-[#71717A]">
            Framing affects all descriptions simultaneously
          </p>
          <FramingToggle />
        </div>

        {/* Empty state */}
        {comparedNeighborhoods.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#71717A] text-[14px] mb-4">No neighborhoods selected for comparison.</p>
            <button
              onClick={() => setShowPicker(true)}
              className="px-4 py-2 bg-[#6366F1] text-white text-[13px] font-medium rounded-[6px] hover:bg-[#818CF8] transition-colors"
            >
              Add a neighborhood
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Compared neighborhoods */}
          {comparedNeighborhoods.map((n) => (
            <div key={n.id} className="flex-1 relative">
              <button
                onClick={() => removeFromComparison(n.id)}
                className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-[#1C1C1F] border border-[#2A2A2E] flex items-center justify-center text-[#71717A] hover:text-[#F87171] hover:border-[#F87171] transition-colors text-[12px]"
              >
                ×
              </button>
              <ComparisonColumn neighborhood={n} />
            </div>
          ))}

          {/* Add neighborhood slot */}
          {comparisonIds.length < 2 && (
            <div className="flex-1 min-w-0">
              {showPicker ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#161618] border border-[#2A2A2E] rounded-[10px] p-4"
                >
                  <h3 className="text-[13px] font-medium mb-3">Add neighborhood</h3>
                  <div className="space-y-1">
                    {availableToAdd.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          addToComparison(n.id)
                          setShowPicker(false)
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-[6px] text-[13px] hover:bg-[#1C1C1F] transition-colors flex items-center justify-between"
                      >
                        <span>{n.name}</span>
                        <span className="text-[12px] text-[#71717A]">{n.overallScore}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={() => setShowPicker(true)}
                  className="w-full h-full min-h-[400px] border-2 border-dashed border-[#2A2A2E] rounded-[10px] flex flex-col items-center justify-center gap-2 text-[#71717A] hover:border-[#6366F1] hover:text-[#6366F1] transition-all"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span className="text-[13px]">Add neighborhood</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Key difference insight */}
        {comparedNeighborhoods.length === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-4 bg-[#161618] border border-[#2A2A2E] rounded-[10px]"
          >
            <h4 className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#71717A] mb-2">
              Key Differences
            </h4>
            <p className="text-[13px] text-[#A1A1AA] leading-relaxed">
              {generateInsight(comparedNeighborhoods[0], comparedNeighborhoods[1])}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
