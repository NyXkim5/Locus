import { motion } from 'framer-motion'

export default function BiographyComparison({ neighborhoods }) {
  if (neighborhoods.length !== 2) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      {/* Title */}
      <h3 className="text-[13px] font-semibold mb-4 text-[var(--text-primary)]">
        City Profiles
      </h3>

      {/* Two-column biography layout */}
      <div className="grid grid-cols-2 gap-6">
        {neighborhoods.map((neighborhood) => (
          <motion.div
            key={neighborhood.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] p-5"
          >
            {/* City name */}
            <h4 className="text-[14px] font-semibold mb-3 text-[var(--text-primary)]">
              {neighborhood.name}
            </h4>

            {/* Biography text */}
            <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
              {neighborhood.biography}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
