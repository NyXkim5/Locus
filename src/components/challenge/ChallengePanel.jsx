import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import { recalculateFactor } from '../../engine/recalculate'
import { getNeighborhoodById } from '../../data/neighborhoods'

function getSourceColor(type) {
  return type === 'measured' ? 'var(--score-high)' : 'var(--score-mid)'
}

function ChallengePanelInner() {
  const challengeFactor = useStore((s) => s.challengeFactor)
  const closeChallenge = useStore((s) => s.closeChallenge)
  const setChallengedFactor = useStore((s) => s.setChallengedFactor)
  const challengedFactors = useStore((s) => s.challengedFactors)
  const showToast = useStore((s) => s.showToast)
  const [challengeText, setChallengeText] = useState('')
  const panelRef = useRef(null)

  const handleFocusTrap = useCallback((e) => {
    if (e.key !== 'Tab' || !panelRef.current) return
    const focusable = panelRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeChallenge()
      handleFocusTrap(e)
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [closeChallenge, handleFocusTrap])

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
    showToast(`${factor.name} score adjusted ${direction === 'higher' ? 'up' : 'down'} to ${updated.score}`)
  }

  return (
    <motion.div
      key="challenge-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end"
      onClick={closeChallenge}
      role="dialog"
      aria-modal="true"
      aria-labelledby="challenge-panel-title"
    >
      <div className="absolute inset-0 bg-black/40" />

      <motion.div
        ref={panelRef}
        tabIndex={-1}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-md bg-[var(--bg-surface)] border-l border-[var(--border)] p-6 overflow-y-auto outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 id="challenge-panel-title" className="text-[15px] font-semibold">Challenge: {factor.name}</h3>
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
              Current score: {factor.score} · Confidence: {factor.confidence}%
            </p>
          </div>
          <button
            onClick={closeChallenge}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
            aria-label="Close challenge panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)] mb-3">
            Data Sources
          </h4>
          <div className="space-y-2">
            {factor.sources.map((source, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 px-3 bg-[var(--bg-elevated)] rounded-[6px]"
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: getSourceColor(source.type) }} aria-hidden="true">
                    {source.type === 'measured' ? '\u2713' : '\u26A0'}
                  </span>
                  <div>
                    <span className="text-[13px] text-[var(--text-primary)]">{source.name}</span>
                    <span className="text-[11px] text-[var(--text-muted)] ml-2">
                      weight: {(source.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[var(--text-secondary)]">{source.value}</span>
                  {source.challenged && (
                    <span className="text-[10px] text-[var(--accent)]">adjusted</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 p-3 bg-[var(--bg-base)] rounded-[6px] border border-[var(--border)]">
          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
            {factor.sources.some(s => s.type === 'estimated')
              ? 'This score includes AI-estimated components with lower confidence. Challenging will reduce AI weight and increase measured data weight.'
              : 'All sources for this score are measured data. Challenge will still be applied to adjust scoring.'
            }
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="challenge-input" className="text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)] mb-2 block">
            What's your experience?
          </label>
          <textarea
            id="challenge-input"
            value={challengeText}
            onChange={(e) => setChallengeText(e.target.value.slice(0, 500))}
            placeholder="I've lived/visited this area and believe..."
            className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-[6px] p-3 text-[13px] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors resize-none h-24"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleRecalculate('higher')}
            className="flex-1 py-2.5 rounded-[6px] text-[13px] font-medium text-[var(--score-high)] transition-colors"
            style={{ backgroundColor: 'color-mix(in srgb, var(--score-high) 12%, transparent)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--score-high) 20%, transparent)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--score-high) 12%, transparent)'}
          >
            Should be higher
          </button>
          <button
            onClick={() => handleRecalculate('lower')}
            className="flex-1 py-2.5 rounded-[6px] text-[13px] font-medium text-[var(--score-low)] transition-colors"
            style={{ backgroundColor: 'color-mix(in srgb, var(--score-low) 12%, transparent)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--score-low) 20%, transparent)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--score-low) 12%, transparent)'}
          >
            Should be lower
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border)]">
          <h4 className="text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)] mb-2">
            How recalculation works
          </h4>
          <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
            Your input adjusts the AI-estimated component weights. Measured data sources remain unchanged. The score recalculates with higher weight on verified sources.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ChallengePanel() {
  const challengeFactor = useStore((s) => s.challengeFactor)

  return (
    <AnimatePresence>
      {challengeFactor && <ChallengePanelInner />}
    </AnimatePresence>
  )
}
