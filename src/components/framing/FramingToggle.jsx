import { motion } from 'framer-motion'
import useStore from '../../store/useStore'

const modes = [
  { key: 'neutral', label: 'Neutral' },
  { key: 'positive', label: 'Positive' },
  { key: 'negative', label: 'Negative' },
]

export default function FramingToggle() {
  const framingMode = useStore((s) => s.framingMode)
  const setFramingMode = useStore((s) => s.setFramingMode)

  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Data framing mode">
      <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)]">
        Framing
      </span>
      <div className="flex bg-[var(--bg-surface)] rounded-md border border-[var(--border)] p-0.5">
        {modes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => setFramingMode(mode.key)}
            className="relative px-3 py-1.5 text-[12px] font-medium rounded-[5px] transition-colors"
            style={{
              color: framingMode === mode.key ? 'var(--text-primary)' : 'var(--text-muted)',
            }}
            role="radio"
            aria-checked={framingMode === mode.key}
            aria-label={`${mode.label} framing`}
          >
            {framingMode === mode.key && (
              <motion.div
                layoutId="framing-indicator"
                className="absolute inset-0 rounded-[5px]"
                style={{
                  backgroundColor: mode.key === 'positive' ? 'var(--frame-positive)'
                    : mode.key === 'negative' ? 'var(--frame-negative)'
                    : 'var(--accent-muted)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
