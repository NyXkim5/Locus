import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'
import { getNeighborhoodById, neighborhoods } from '../data/neighborhoods'
import TopBar from '../components/shared/TopBar'
import FramingToggle from '../components/framing/FramingToggle'
import ScoreCircle from '../components/shared/ScoreCircle'
import ScoreBar from '../components/shared/ScoreBar'
import { getScoreColor } from '../utils/scoreColor'
import { useState } from 'react'

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
        {neighborhood.categories.map((cat) => (
          <div key={cat.label} className={`bg-[var(--bg-surface)] rounded-[10px] border px-4 py-3 ${
            cat.label === 'Sustainability' ? 'border-[#22C55E]/30' : 'border-[var(--border)]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-[var(--text-secondary)] flex items-center gap-1.5">
                {cat.label === 'Sustainability' && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22c5.523 0 7-6.477 7-12 0 0-3.5.5-7 3s-4.5 5-4.5 5" />
                    <path d="M5 14c2.5-2.5 5-3.5 7-3.5" />
                    <path d="M12 22V10" />
                  </svg>
                )}
                {cat.label}
              </span>
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
                className="text-[11px] text-[var(--text-muted)] mt-2"
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

  if (biggest.diff === 0) {
    return `${a.name} and ${b.name} score identically across all categories. Both are strong options — your decision may come down to personal preference, commute, or lifestyle fit.`
  }

  const winner = biggest.diff > 0 ? b.name : a.name

  const overallClause = a.overallScore === b.overallScore
    ? `Both share the same composite score of ${a.overallScore}`
    : `Overall, ${a.overallScore > b.overallScore ? a.name : b.name} has a higher composite score`

  return `${winner} scores significantly higher on ${biggest.label} (${Math.max(biggest.aScore, biggest.bScore)} vs ${Math.min(biggest.aScore, biggest.bScore)}). ${overallClause}, but individual category differences may matter more for your priorities.`
}

export default function ComparePage() {
  const comparisonIds = useStore((s) => s.comparisonIds)
  const addToComparison = useStore((s) => s.addToComparison)
  const removeFromComparison = useStore((s) => s.removeFromComparison)
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
          <p className="text-[12px] text-[var(--text-muted)]">
            Framing affects all descriptions simultaneously
          </p>
          <FramingToggle />
        </div>

        {/* Empty state */}
        {comparedNeighborhoods.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--text-muted)] text-[14px] mb-4">No neighborhoods selected for comparison.</p>
            <button
              onClick={() => setShowPicker(true)}
              className="px-4 py-2 bg-[var(--accent)] text-white text-[13px] font-medium rounded-[6px] hover:bg-[var(--accent-hover)] transition-colors"
            >
              Add a neighborhood
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Compared neighborhoods */}
          {comparedNeighborhoods.map((n) => (
            <div key={n.id} className="flex-1 relative">
              <button
                onClick={() => removeFromComparison(n.id)}
                aria-label={`Remove ${n.name} from comparison`}
                className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--score-low)] hover:border-[var(--score-low)] transition-colors text-[12px]"
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
                  className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] p-4"
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
                        className="w-full text-left px-3 py-2.5 rounded-[6px] text-[13px] hover:bg-[var(--bg-elevated)] transition-colors flex items-center justify-between"
                      >
                        <span>{n.name}</span>
                        <span className="text-[12px] text-[var(--text-muted)]">{n.overallScore}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={() => setShowPicker(true)}
                  aria-label="Add a neighborhood to compare"
                  className="w-full h-full min-h-[400px] border-2 border-dashed border-[var(--border)] rounded-[10px] flex flex-col items-center justify-center gap-2 text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
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
            className="mt-8 p-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px]"
          >
            <h4 className="text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)] mb-2">
              Key Differences
            </h4>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
              {generateInsight(comparedNeighborhoods[0], comparedNeighborhoods[1])}
            </p>
          </motion.div>
        )}

        {/* Carbon savings insight */}
        {comparedNeighborhoods.length === 2 && (() => {
          const a = comparedNeighborhoods[0]
          const b = comparedNeighborhoods[1]
          const getSusFactor = (n, name) => {
            const sus = n.categories.find(c => c.label === 'Sustainability')
            if (!sus) return null
            return sus.factors.find(f => f.name === name)
          }
          const carbonA = getSusFactor(a, 'Carbon Footprint')?.score
          const carbonB = getSusFactor(b, 'Carbon Footprint')?.score
          const transitA = getSusFactor(a, 'Green Transit Score')?.score
          const transitB = getSusFactor(b, 'Green Transit Score')?.score
          const bikeA = getSusFactor(a, 'Bike Infrastructure')?.score
          const bikeB = getSusFactor(b, 'Bike Infrastructure')?.score
          if (carbonA == null || carbonB == null) return null

          const avgA = (carbonA + (transitA || 0) + (bikeA || 0)) / 3
          const avgB = (carbonB + (transitB || 0) + (bikeB || 0)) / 3
          const diff = Math.abs(avgA - avgB)
          const co2Saved = (diff * 0.08).toFixed(1)
          const greener = avgA > avgB ? a : b

          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-4 p-4 rounded-[10px] border"
              style={{ borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.06)' }}
            >
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" className="flex-shrink-0 mt-0.5" aria-hidden="true">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75" />
                </svg>
                <div>
                  <h4 className="text-[11px] font-medium uppercase tracking-[0.04em] mb-1.5" style={{ color: '#16A34A' }}>
                    Carbon Savings Insight
                  </h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                    Choosing <strong>{greener.name}</strong> over {greener === a ? b.name : a.name} could save an estimated <strong style={{ color: '#16A34A' }}>{co2Saved} tons of CO₂ per year</strong> based on differences in carbon footprint ({carbonA} vs {carbonB}), green transit ({transitA} vs {transitB}), and bike infrastructure ({bikeA} vs {bikeB}) scores.
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-2 leading-relaxed">
                    Estimate based on EPA household emissions data — each sustainability score point corresponds to approximately 0.08 metric tons CO₂/year, derived from the national average household footprint of 8.1 metric tons mapped across a 0–100 sustainability scale.
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })()}
      </div>
    </div>
  )
}
