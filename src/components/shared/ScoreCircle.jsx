import { animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getScoreColor } from '../../utils/scoreColor'

export default function ScoreCircle({ score, size = 'lg' }) {
  const [displayScore, setDisplayScore] = useState(0)
  const color = getScoreColor(score)

  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    })
    return controls.stop
  }, [score])

  const sizeClasses = size === 'lg'
    ? 'w-28 h-28 text-[28px]'
    : 'w-16 h-16 text-[20px]'

  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center font-bold border-2`}
      style={{ borderColor: color, color }}
      aria-label={`Score: ${score} out of 100`}
    >
      {displayScore}
    </div>
  )
}
