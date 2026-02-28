import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { neighborhoods, getAllNeighborhoods } from '../data/neighborhoods'
import { generateNeighborhood } from '../services/generateNeighborhood'
import useStore from '../store/useStore'

export default function InputPage() {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [generating, setGenerating] = useState(false)
  const [progressText, setProgressText] = useState('')
  const [genError, setGenError] = useState(null)
  const navigate = useNavigate()
  const listboxRef = useRef(null)
  const inputRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.8
  }, [])

  const allNeighborhoods = useMemo(() => getAllNeighborhoods(), [query]) // re-read on query change

  const results = useMemo(() => {
    if (!query.trim()) return []
    return allNeighborhoods.filter(n =>
      n.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [query, allNeighborhoods])

  const trimmedQuery = query.trim()
  const hasExactMatch = trimmedQuery.length > 0 && allNeighborhoods.some(
    n => n.name.toLowerCase() === trimmedQuery.toLowerCase()
  )
  const showGenerateOption = trimmedQuery.length > 2 && !hasExactMatch

  const isOpen = results.length > 0 || showGenerateOption

  const handleSelect = useCallback((id) => {
    navigate(`/neighborhood/${id}`)
  }, [navigate])

  const handleGenerate = async () => {
    setGenerating(true)
    setGenError(null)
    setProgressText('Connecting to AI...')
    try {
      const result = await generateNeighborhood(trimmedQuery, setProgressText)
      navigate(`/neighborhood/${result.id}`)
    } catch (err) {
      setGenError(err.message)
      setGenerating(false)
    }
  }

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return

    const totalItems = results.length + (showGenerateOption ? 1 : 0)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => (prev + 1) % totalItems)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => (prev <= 0 ? totalItems - 1 : prev - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < results.length) {
          handleSelect(results[activeIndex].id)
        } else if (activeIndex === results.length && showGenerateOption) {
          handleGenerate()
        }
        break
      case 'Escape':
        e.preventDefault()
        setQuery('')
        setActiveIndex(-1)
        break
    }
  }, [isOpen, activeIndex, results, handleSelect, showGenerateOption, trimmedQuery])

  const handleInputChange = (e) => {
    setQuery(e.target.value)
    setActiveIndex(-1)
    setGenError(null)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Loading overlay */}
      <AnimatePresence>
        {generating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-base)]/95 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-5">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--accent)] animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-[16px] font-medium text-[var(--text-primary)] mb-1">
                  {progressText}
                </p>
                <p className="text-[13px] text-[var(--text-muted)]">
                  This usually takes 10-15 seconds
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg text-center"
      >
        {/* Animated logo */}
        <div className="flex justify-center mb-4">
          <video
            ref={videoRef}
            src="/davsan-logo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-60 h-60 object-contain"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>

        {/* Logo */}
        <h1 className="text-[20px] font-semibold tracking-[-0.02em] mb-1">
          <span className="text-[var(--accent)]">LOCUS</span>
        </h1>
        <p className="text-[var(--text-muted)] text-[12px] uppercase tracking-[0.08em] mb-10">
          Neighborhood Intelligence, Debiased
        </p>

        {/* Prompt */}
        <h2 className="text-[28px] font-semibold tracking-[-0.02em] mb-6">
          Where are you looking?
        </h2>

        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] px-4 py-3 focus-within:border-[var(--accent)] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-3 flex-shrink-0 text-[var(--text-muted)]" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search any city or neighborhood"
              className="bg-transparent w-full text-[14px] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
              autoFocus
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-controls="search-listbox"
              aria-activedescendant={activeIndex >= 0 ? `option-${results[activeIndex]?.id || 'generate'}` : undefined}
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
                className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.1)] z-10"
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
                      i === activeIndex ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {n.name}
                      {n.isGenerated && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] font-medium">AI</span>
                      )}
                    </span>
                    <span className="text-[12px] text-[var(--text-muted)]">Score: {n.overallScore}</span>
                  </button>
                ))}
                {showGenerateOption && (
                  <button
                    id="option-generate"
                    role="option"
                    aria-selected={activeIndex === results.length}
                    onClick={handleGenerate}
                    onMouseEnter={() => setActiveIndex(results.length)}
                    className={`w-full text-left px-4 py-3 text-[14px] transition-colors flex items-center gap-2 border-t border-[var(--border)] ${
                      activeIndex === results.length ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]'
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="flex-shrink-0">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                    <span className="text-[var(--accent)] font-medium">
                      Generate AI analysis for <strong>{trimmedQuery}</strong>
                    </span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generation error */}
          {genError && (
            <div className="mt-2 px-3 py-2 rounded-[8px] bg-[var(--score-low)]/10 border border-[var(--score-low)]/20">
              <p className="text-[12px] text-[var(--score-low)]">{genError}</p>
            </div>
          )}
        </div>

        {/* Suggestion Pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="text-[12px] text-[var(--text-muted)] mr-1 self-center">Try:</span>
          {neighborhoods.map((n) => (
            <button
              key={n.id}
              onClick={() => handleSelect(n.id)}
              className="px-3 py-1.5 text-[12px] text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border)] rounded-[6px] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-all"
            >
              {n.name}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
