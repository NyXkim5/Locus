import { motion } from 'framer-motion'

function getScoreColor(score) {
  if (score >= 70) return '#34D399'
  if (score >= 40) return '#FBBF24'
  return '#F87171'
}

export default function ScoreBar({ score, delay = 0 }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-[#2A2A2E] overflow-hidden">
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
