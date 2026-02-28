import { useState, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { neighborhoods } from '../data/neighborhoods'
import useStore from '../store/useStore'

export default function InputPage() {
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Dark mode toggle */}
      <button
        onClick={toggleTheme}
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        className="absolute top-5 right-5 w-8 h-8 rounded-[6px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
      >
        {theme === 'light' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        )}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg text-center"
      >
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
              placeholder="Search address or neighborhood"
              className="bg-transparent w-full text-[14px] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
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
                    <span>{n.name}</span>
                    <span className="text-[12px] text-[var(--text-muted)]">Score: {n.overallScore}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
