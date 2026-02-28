import { motion } from 'framer-motion'
import useStore from '../../store/useStore'

const modes = [
  { key: 'neutral', label: 'Neutral' },
  { key: 'positive', label: 'Positive' },
  { key: 'negative', label: 'Negative' },
]

export default function FramingToggle() {
  const { framingMode, setFramingMode } = useStore()

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#71717A]">
        Framing
      </span>
      <div className="flex bg-[#161618] rounded-md border border-[#2A2A2E] p-0.5">
        {modes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => setFramingMode(mode.key)}
            className="relative px-3 py-1.5 text-[12px] font-medium rounded-[5px] transition-colors"
            style={{
              color: framingMode === mode.key ? '#F4F4F5' : '#71717A',
            }}
          >
            {framingMode === mode.key && (
              <motion.div
                layoutId="framing-indicator"
                className="absolute inset-0 rounded-[5px]"
                style={{
                  backgroundColor: mode.key === 'positive' ? 'rgba(52, 211, 153, 0.15)'
                    : mode.key === 'negative' ? 'rgba(248, 113, 113, 0.15)'
                    : 'rgba(99, 102, 241, 0.12)',
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
