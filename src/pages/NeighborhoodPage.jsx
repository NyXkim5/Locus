import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getNeighborhoodById } from '../data/neighborhoods'
import useStore from '../store/useStore'
import TopBar from '../components/shared/TopBar'
import ScoreCircle from '../components/shared/ScoreCircle'
import CategoryCard from '../components/scores/CategoryCard'
import FramingToggle from '../components/framing/FramingToggle'
import MapPlaceholder from '../components/map/MapPlaceholder'

export default function NeighborhoodPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const neighborhood = getNeighborhoodById(id)
  const openChallenge = useStore((s) => s.openChallenge)
  const addToComparison = useStore((s) => s.addToComparison)
  const comparisonIds = useStore((s) => s.comparisonIds)

  if (!neighborhood) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#71717A]">Neighborhood not found</p>
      </div>
    )
  }

  const handleChallenge = (categoryIndex, factorIndex) => {
    openChallenge(id, categoryIndex, factorIndex)
  }

  const handleCompare = () => {
    addToComparison(id)
    navigate('/compare')
  }

  const categories = neighborhood.categories

  return (
    <div className="min-h-screen">
      <TopBar title={neighborhood.name} showBack />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Framing toggle */}
        <div className="flex justify-end mb-6">
          <FramingToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* Left: Map */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MapPlaceholder
              name={neighborhood.name}
              coordinates={neighborhood.coordinates}
            />
          </motion.div>

          {/* Right: Score + Categories */}
          <div>
            {/* Overall Score */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex flex-col items-center mb-6"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#71717A] mb-3">
                Overall Score
              </span>
              <ScoreCircle score={neighborhood.overallScore} size="lg" />
            </motion.div>

            {/* Category Cards */}
            <div className="space-y-3">
              {categories.map((category, i) => (
                <motion.div
                  key={category.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                >
                  <CategoryCard
                    categoryKey={i}
                    category={category}
                    neighborhoodId={id}
                    onChallengeFactor={handleChallenge}
                  />
                </motion.div>
              ))}
            </div>

            {/* Compare Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleCompare}
              disabled={comparisonIds.length >= 2 && !comparisonIds.includes(id)}
              className="w-full mt-4 py-3 border border-dashed border-[#2A2A2E] rounded-[10px] text-[13px] text-[#71717A] hover:border-[#6366F1] hover:text-[#6366F1] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + Compare with another neighborhood
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
