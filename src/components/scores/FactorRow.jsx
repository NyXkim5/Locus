import { motion, AnimatePresence } from 'framer-motion'
import ScoreBar from '../shared/ScoreBar'
import ConfidenceShield from '../shared/ConfidenceShield'
import useStore from '../../store/useStore'
import { getScoreColor } from '../../utils/scoreColor'

export default function FactorRow({ factor, index, onChallenge }) {
  const framingMode = useStore((s) => s.framingMode)
  const description = factor.frames[framingMode]

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group py-3 px-3 rounded-[6px] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
      onClick={() => onChallenge?.()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChallenge?.() } }}
      aria-label={`${factor.name}: score ${factor.score}, confidence ${factor.confidence}%. Click to challenge.`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[14px] text-[var(--text-primary)]">{factor.name}</span>
        <div className="flex items-center gap-3">
          <span
            className="text-[14px] font-semibold"
            style={{ color: getScoreColor(factor.score) }}
          >
            {factor.score}
          </span>
          <ConfidenceShield confidence={factor.confidence} />
        </div>
      </div>
      <ScoreBar score={factor.score} delay={index * 0.05} />
      <AnimatePresence mode="wait">
        <motion.p
          key={framingMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-[12px] text-[var(--text-muted)] mt-1.5"
        >
          {description}
        </motion.p>
      </AnimatePresence>
      {factor.userChallenged && (
        <span className="text-[10px] text-[var(--accent)] mt-1 inline-block">
          Score adjusted by your input
        </span>
      )}
    </motion.div>
  )
}
