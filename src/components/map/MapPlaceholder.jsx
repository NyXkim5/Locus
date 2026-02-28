import { motion } from 'framer-motion'

export default function MapPlaceholder({ name, coordinates }) {
  return (
    <div className="relative w-full h-full bg-[#0C0C0E] rounded-[10px] overflow-hidden border border-[#2A2A2E] min-h-[300px]">
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full h-px bg-[#A1A1AA]" style={{ top: `${(i + 1) * 12.5}%` }} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full w-px bg-[#A1A1AA]" style={{ left: `${(i + 1) * 12.5}%` }} />
        ))}
      </div>

      {/* Animated boundary polygon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="opacity-30"
        >
          <motion.polygon
            points="100,20 170,50 185,120 150,175 60,180 25,130 30,55"
            fill="rgba(99, 102, 241, 0.1)"
            stroke="#6366F1"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.svg>
      </div>

      {/* Center pin */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
          className="w-3 h-3 rounded-full bg-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.5)]"
        />
      </div>

      {/* Label */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="text-[11px] text-[#71717A] font-medium">{name}</span>
        <span className="text-[10px] text-[#71717A]">
          {coordinates.lat.toFixed(2)}°N, {Math.abs(coordinates.lng).toFixed(2)}°W
        </span>
      </div>
    </div>
  )
}
