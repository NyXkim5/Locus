import { useState, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { neighborhoods } from '../data/neighborhoods'

export default function InputPage() {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const navigate = useNavigate()
  const listboxRef = useRef(null)
  const inputRef = useRef(null)

  const results = useMemo(() => {
    if (!query.trim()) return []
    return neighborhoods.filter(n =>
      n.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  const isOpen = results.length > 0

  const handleSelect = useCallback((id) => {
    navigate(`/neighborhood/${id}`)
  }, [navigate])

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => (prev <= 0 ? results.length - 1 : prev - 1))
        break
      case 'Enter':
        if (activeIndex >= 0 && activeIndex < results.length) {
          e.preventDefault()
          handleSelect(results[activeIndex].id)
        }
        break
      case 'Escape':
        e.preventDefault()
        setQuery('')
        setActiveIndex(-1)
        break
    }
  }, [isOpen, activeIndex, results, handleSelect])

  const handleInputChange = (e) => {
    setQuery(e.target.value)
    setActiveIndex(-1)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg text-center"
      >
        {/* Logo */}
        <h1 className="text-[20px] font-semibold tracking-[-0.02em] mb-1">
          <span className="text-[#6366F1]">LOCUS</span>
        </h1>
        <p className="text-[#71717A] text-[12px] uppercase tracking-[0.08em] mb-10">
          Neighborhood Intelligence, Debiased
        </p>

        {/* Prompt */}
        <h2 className="text-[28px] font-semibold tracking-[-0.02em] mb-6">
          Where are you looking?
        </h2>

        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center bg-[#161618] border border-[#2A2A2E] rounded-[10px] px-4 py-3 focus-within:border-[#6366F1] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" className="mr-3 flex-shrink-0" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search address or neighborhood"
              className="bg-transparent w-full text-[14px] text-[#F4F4F5] placeholder-[#71717A] outline-none"
              autoFocus
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-controls="search-listbox"
              aria-activedescendant={activeIndex >= 0 ? `option-${results[activeIndex]?.id}` : undefined}
              aria-label="Search neighborhoods"
              autoComplete="off"
            />
          </div>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={listboxRef}
                id="search-listbox"
                role="listbox"
                aria-label="Search results"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#161618] border border-[#2A2A2E] rounded-[10px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)] z-10"
              >
                {results.map((n, i) => (
                  <button
                    key={n.id}
                    id={`option-${n.id}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    onClick={() => handleSelect(n.id)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-full text-left px-4 py-3 text-[14px] transition-colors flex items-center justify-between ${
                      i === activeIndex ? 'bg-[#1C1C1F]' : 'hover:bg-[#1C1C1F]'
                    }`}
                  >
                    <span>{n.name}</span>
                    <span className="text-[12px] text-[#71717A]">Score: {n.overallScore}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestion Pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="text-[12px] text-[#71717A] mr-1 self-center">Try:</span>
          {neighborhoods.map((n) => (
            <button
              key={n.id}
              onClick={() => handleSelect(n.id)}
              className="px-3 py-1.5 text-[12px] text-[#A1A1AA] bg-[#161618] border border-[#2A2A2E] rounded-[6px] hover:border-[#6366F1] hover:text-[#F4F4F5] transition-all"
            >
              {n.name}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
