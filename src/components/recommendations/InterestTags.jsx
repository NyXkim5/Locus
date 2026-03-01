import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'

const PRIORITY_SUGGESTIONS = {
  nightlife: ['Nightlife', 'Cocktails', 'Live Music'],
  walkable: ['Coffee', 'Bookstores', 'Shopping'],
  green: ['Hiking', 'Yoga', 'Nature'],
  schools: ['Studying', 'Museums', 'Libraries'],
  safety: ['Pickleball', 'Parks', 'Family'],
  investment: ['Studying', 'Coworking', 'Gym'],
}

const DEFAULT_SUGGESTIONS = ['Hiking', 'Studying', 'Sushi', 'Matcha', 'Pickleball', 'Yoga']

export default function InterestTags() {
  const [input, setInput] = useState('')
  const interests = useStore((s) => s.interests)
  const addInterest = useStore((s) => s.addInterest)
  const removeInterest = useStore((s) => s.removeInterest)
  const priorities = useStore((s) => s.priorities)

  const prioritySuggestions = priorities
    .flatMap((p) => PRIORITY_SUGGESTIONS[p] || [])
  const suggestions = (prioritySuggestions.length > 0 ? prioritySuggestions : DEFAULT_SUGGESTIONS)
    .filter((s) => !interests.includes(s.toLowerCase()))

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (input.trim()) {
        addInterest(input)
        setInput('')
      }
    }
  }

  const handleSuggestionClick = (suggestion) => {
    addInterest(suggestion)
  }

  return (
    <div>
      {/* Input */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add interest (e.g. matcha, hiking...)"
          className="flex-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[8px] px-3 py-2 text-[12px] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors"
          aria-label="Add an interest"
        />
      </div>

      {/* Current interests */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        <AnimatePresence>
          {interests.map((interest) => (
            <motion.button
              key={interest}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => removeInterest(interest)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] text-[11px] font-medium hover:bg-[var(--accent)] hover:text-white transition-colors"
              aria-label={`Remove ${interest}`}
            >
              {interest}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Smart suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.slice(0, 6).map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestionClick(s)}
              className="px-2 py-0.5 rounded-full border border-dashed border-[var(--border)] text-[11px] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
