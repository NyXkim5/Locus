import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import { recalculateFactor } from '../../engine/recalculate'
import { getNeighborhoodById } from '../../data/neighborhoods'

function getSourceColor(type) {
  return type === 'measured' ? '#34D399' : '#FBBF24'
}

export default function ChallengePanel() {
  const { challengeFactor, closeChallenge, setChallengedFactor, challengedFactors } = useStore()
  const [challengeText, setChallengeText] = useState('')

  if (!challengeFactor) return null

  const { neighborhoodId, categoryKey: categoryIndex, factorIndex } = challengeFactor
  const neighborhood = getNeighborhoodById(neighborhoodId)
  if (!neighborhood) return null

  const category = neighborhood.categories[categoryIndex]
  if (!category) return null
  const challengeKey = `${neighborhoodId}.${categoryIndex}.${factorIndex}`
  const factor = challengedFactors[challengeKey] || category.factors[factorIndex]

  const handleRecalculate = (direction) => {
    const updated = recalculateFactor(factor, direction)
    setChallengedFactor(challengeKey, updated)
    setChallengeText('')
  }

  return (
    <AnimatePresence>
      {challengeFactor && (
        <motion.div
          key="challenge-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end"
          onClick={closeChallenge}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md bg-[#161618] border-l border-[#2A2A2E] p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[15px] font-semibold">Challenge: {factor.name}</h3>
                <p className="text-[12px] text-[#71717A] mt-0.5">
                  Current score: {factor.score} · Confidence: {factor.confidence}%
                </p>
              </div>
              <button
                onClick={closeChallenge}
                className="text-[#71717A] hover:text-[#F4F4F5] transition-colors p-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Source Breakdown */}
            <div className="mb-6">
              <h4 className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#71717A] mb-3">
                Data Sources
              </h4>
              <div className="space-y-2">
                {factor.sources.map((source, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 px-3 bg-[#1C1C1F] rounded-[6px]"
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ color: getSourceColor(source.type) }}>
                        {source.type === 'measured' ? '\u2713' : '\u26A0'}
                      </span>
                      <div>
                        <span className="text-[13px] text-[#F4F4F5]">{source.name}</span>
                        <span className="text-[11px] text-[#71717A] ml-2">
                          weight: {(source.weight * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-[#A1A1AA]">{source.value}</span>
                      {source.challenged && (
                        <span className="text-[10px] text-[#6366F1]">adjusted</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div className="mb-6 p-3 bg-[#0C0C0E] rounded-[6px] border border-[#2A2A2E]">
              <p className="text-[12px] text-[#A1A1AA] leading-relaxed">
                {factor.sources.some(s => s.type === 'estimated')
                  ? 'This score includes AI-estimated components with lower confidence. Challenging will reduce AI weight and increase measured data weight.'
                  : 'All sources for this score are measured data. Challenge will still be applied to adjust scoring.'
                }
              </p>
            </div>

            {/* Challenge Input */}
            <div className="mb-4">
              <h4 className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#71717A] mb-2">
                What's your experience?
              </h4>
              <textarea
                value={challengeText}
                onChange={(e) => setChallengeText(e.target.value)}
                placeholder="I've lived/visited this area and believe..."
                className="w-full bg-[#0C0C0E] border border-[#2A2A2E] rounded-[6px] p-3 text-[13px] text-[#F4F4F5] placeholder-[#71717A] outline-none focus:border-[#6366F1] transition-colors resize-none h-24"
              />
            </div>

            {/* Challenge Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleRecalculate('higher')}
                className="flex-1 py-2.5 rounded-[6px] text-[13px] font-medium bg-[rgba(52,211,153,0.12)] text-[#34D399] hover:bg-[rgba(52,211,153,0.2)] transition-colors"
              >
                Should be higher
              </button>
              <button
                onClick={() => handleRecalculate('lower')}
                className="flex-1 py-2.5 rounded-[6px] text-[13px] font-medium bg-[rgba(248,113,113,0.12)] text-[#F87171] hover:bg-[rgba(248,113,113,0.2)] transition-colors"
              >
                Should be lower
              </button>
            </div>

            {/* How it works */}
            <div className="mt-6 pt-4 border-t border-[#2A2A2E]">
              <h4 className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#71717A] mb-2">
                How recalculation works
              </h4>
              <p className="text-[12px] text-[#71717A] leading-relaxed">
                Your input adjusts the AI-estimated component weights. Measured data sources remain unchanged. The score recalculates with higher weight on verified sources.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
