import { motion } from 'framer-motion'
import { getScoreColor } from '../../utils/scoreColor'

export default function ScoreBar({ score, delay = 0 }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-[var(--border)] overflow-hidden" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label={`Score: ${score} out of 100`}>
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: getScoreColor(score) }}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}
