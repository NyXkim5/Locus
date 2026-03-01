import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import ListingsCarousel from '../listings/ListingsCarousel'
import { PRIORITIES } from '../../utils/priorities'

function Dropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = options.find((o) => o.value === value) || options[0]

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, close])

  return (
    <div ref={ref} className="relative inline-flex flex-col">
      <span className="text-[12px] font-medium text-[var(--text-muted)] mb-1">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[13px] transition-colors whitespace-nowrap ${
          value
            ? 'border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)] font-medium'
            : 'border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-active)]'
        }`}
      >
        {selected.label}
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full z-50 mt-1.5 min-w-[140px] rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden py-1"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => { onChange(opt.value); close() }}
                className={`px-3 py-1.5 text-[13px] cursor-pointer transition-colors
                  ${opt.value === value
                    ? 'bg-[var(--accent-muted)] text-[var(--accent)] font-medium'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                  }`}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

const SUGGESTED_PROMPTS = [
  {
    label: 'First-time buyer',
    prompt: "I'm a first-time homebuyer in my late 20s. I want a neighborhood with strong property value appreciation over 5 years, good walkability, and a decent social scene.",
  },
  {
    label: 'Family with kids',
    prompt: "We're a family with two young kids. We need the best school zones with top-rated schools, family friendliness, safety, and parks. Show us homes near highly ranked schools with strong college prep programs.",
  },
  {
    label: 'Young professional',
    prompt: "I'm a single professional who wants great nightlife, cultural amenities, walkability, and strong job market. Rent affordability matters.",
  },
  {
    label: 'Investor',
    prompt: "I'm looking to invest in rental property. Which neighborhood has the best property value trend, development pipeline, and job market growth?",
  },
  {
    label: 'Eco-conscious buyer',
    prompt: "I care deeply about sustainability. Show me homes in areas with low carbon footprint, great bike infrastructure, green transit, and renewable energy adoption. I want to minimize my environmental impact.",
  },
  {
    label: 'Low-carbon lifestyle',
    prompt: "I want to live car-free or car-light. Which neighborhoods have the best green transit scores, bike infrastructure, and walkability? Show me homes where I can reduce my carbon footprint the most.",
  },
]

function summarizeForAI(allNeighborhoods) {
  return allNeighborhoods.map((n) => ({
    name: n.name,
    id: n.id,
    overallScore: n.overallScore,
    categories: n.categories.map((c) => ({
      label: c.label,
      score: c.score,
      factors: c.factors.map((f) => ({ name: f.name, score: f.score })),
    })),
  }))
}

function summarizeListings(listings) {
  if (!listings?.length) return 'No active listings available.'
  return listings.map((l) => {
    const parts = [l.address]
    if (l.price) parts.push(`$${l.price.toLocaleString()}`)
    if (l.beds != null) parts.push(`${l.beds}bd`)
    if (l.baths != null) parts.push(`${l.baths}ba`)
    if (l.sqft != null) parts.push(`${l.sqft.toLocaleString()}sqft`)
    if (l.type) parts.push(l.type)
    return parts.join(' | ')
  }).join('\n')
}

function parseAIResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { analysis: '', recommendations: [] }
  }
  try {
    const cleaned = rawText.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(cleaned)
    return {
      analysis: parsed.analysis || '',
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    }
  } catch {
    return { analysis: rawText, recommendations: [] }
  }
}

function extractPartialAnalysis(partialJson) {
  const marker = '"analysis"'
  const idx = partialJson.indexOf(marker)
  if (idx === -1) return null
  const colonIdx = partialJson.indexOf(':', idx + marker.length)
  if (colonIdx === -1) return null
  const quoteIdx = partialJson.indexOf('"', colonIdx + 1)
  if (quoteIdx === -1) return null
  let text = ''
  let i = quoteIdx + 1
  let escaped = false
  while (i < partialJson.length) {
    const ch = partialJson[i]
    if (escaped) {
      if (ch === 'n') text += '\n'
      else if (ch === '"') text += '"'
      else if (ch === '\\') text += '\\'
      else text += ch
      escaped = false
    } else if (ch === '\\') {
      escaped = true
    } else if (ch === '"') {
      break
    } else {
      text += ch
    }
    i++
  }
  return text || null
}

function enrichListings(listings, recommendations) {
  if (!recommendations?.length || !listings?.length) return []

  return recommendations
    .map((rec) => {
      const recAddr = rec.address?.toLowerCase().trim()
      if (!recAddr) return null

      const match = listings.find((l) => {
        const street = l.address?.split(',')[0]?.trim().toLowerCase()
        return street && recAddr.includes(street)
      })

      if (!match) return null

      return {
        ...match,
        aiExplanation: rec.explanation,
        relevantMetrics: rec.relevantMetrics || [],
      }
    })
    .filter(Boolean)
}

const PRICE_RANGES = [
  { value: '', label: 'Any' },
  { value: '0-500000', label: 'Under $500K' },
  { value: '500000-750000', label: '$500K – $750K' },
  { value: '750000-1000000', label: '$750K – $1M' },
  { value: '1000000-1500000', label: '$1M – $1.5M' },
  { value: '1500000-2000000', label: '$1.5M – $2M' },
  { value: '2000000-', label: '$2M+' },
]

const SQFT_RANGES = [
  { value: '', label: 'Any' },
  { value: '500', label: '500+ sqft' },
  { value: '1000', label: '1,000+ sqft' },
  { value: '1500', label: '1,500+ sqft' },
  { value: '2000', label: '2,000+ sqft' },
  { value: '2500', label: '2,500+ sqft' },
  { value: '3000', label: '3,000+ sqft' },
]

function buildFilterContext(filters) {
  const parts = []
  if (filters.priceRange) {
    const match = PRICE_RANGES.find((r) => r.value === filters.priceRange)
    if (match) parts.push(`Price range: ${match.label}`)
  }
  if (filters.minBeds) parts.push(`Minimum bedrooms: ${filters.minBeds}`)
  if (filters.minSqft) {
    const match = SQFT_RANGES.find((r) => r.value === filters.minSqft)
    if (match) parts.push(`Minimum sqft: ${match.label}`)
  }
  return parts.length ? `\n\nUser's search filters:\n${parts.join('\n')}` : ''
}

export default function AIAdvisor({ currentNeighborhood, listings = [], onResponse, priorities = [] }) {
  const [input, setInput] = useState('')
  const [refineInput, setRefineInput] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [streamingText, setStreamingText] = useState('')
  const [filters, setFilters] = useState({ priceRange: '', minBeds: '', minSqft: '' })
  const inputRef = useRef(null)
  const refineRef = useRef(null)

  const chatHistory = useStore((s) => s.chatHistory)
  const addChatMessage = useStore((s) => s.addChatMessage)
  const clearChatHistory = useStore((s) => s.clearChatHistory)

  const updateFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = async (promptOverride, displayLabel) => {
    const text = promptOverride || input
    if (!text.trim()) return

    if (promptOverride) setInput(displayLabel || promptOverride)
    setLoading(true)
    setError(null)
    setResponse(null)
    setStreamingText('')

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      setError('Add VITE_GEMINI_API_KEY to your .env file to enable AI insights.')
      setLoading(false)
      return
    }

    const data = summarizeForAI([currentNeighborhood])
    const listingsSummary = summarizeListings(listings)
    const filterContext = buildFilterContext(filters)

    const systemPrompt = `You are LOCUS AI, an expert neighborhood advisor built into the LOCUS app. You analyze real neighborhood score data AND active property listings to give personalized recommendations.

Available neighborhood data:
${JSON.stringify(data, null, 2)}

The user is currently viewing: ${currentNeighborhood.name} (Overall Score: ${currentNeighborhood.overallScore})

Active listings in ${currentNeighborhood.name}:
${listingsSummary}${filterContext}

You MUST respond with valid JSON in this exact schema:
{
  "analysis": "2-3 paragraphs of overall neighborhood analysis.",
  "recommendations": [
    {
      "address": "The street address exactly as it appears in the listings above (before the first comma)",
      "explanation": "2-4 sentences selling the user on this specific property. Be persuasive and concrete — mention nearby landmarks, schools by name, commute times, lifestyle fit. For families/kids: name the nearest top-rated school, mention its GreatSchools rating as X/10, college acceptance rate, AP program availability, distance from the home. Make the buyer feel like this is THE one.",
      "relevantMetrics": [
        { "label": "Short metric name", "score": 71, "reason": "Brief reason this metric matters" }
      ]
    }
  ]
}

Guidelines:
- analysis: 2-3 short paragraphs. Reference specific scores and factor names. Address the user directly. Compare neighborhoods when useful. Write naturally — no markdown, no asterisks, no bullet lists.
- recommendations: Recommend ALL listings from the active listings that are reasonable matches (up to 6). If the user specifies a number (e.g. "show me 5 homes"), respect that exact count. If the user set search filters (price, beds, sqft), only recommend listings that match those filters. Each address must match one from the active listings.
- relevantMetrics: ALWAYS include 2-4 metrics per recommendation. Use scores from the neighborhood data (these are on a 0-100 scale). If the user mentions specific interests (walkability, safety, schools, etc.), prioritize those. For generic prompts, pick broadly useful metrics (Property Value Trend, Safety, Walkability, School Quality).
- FAMILIES & KIDS: When the user mentions kids, children, family, or schools, you MUST include a "School Rating" metric for every recommendation. For school ratings specifically, use a X/10 scale (e.g. 9/10) to match the GreatSchools format — do NOT use the 0-100 scale for school ratings. In the explanation, name REAL specific nearby schools that actually exist in the area (e.g. "University High School", "Turtle Rock Elementary", "Northwood High School"). Mention their real GreatSchools rating as X/10, real college acceptance rates, AP course counts, or notable achievements. Do NOT make up school names or statistics — only reference schools you are confident actually exist in that city/neighborhood.
- SUSTAINABILITY: When the user mentions sustainability, eco-friendly, carbon footprint, green living, bike infrastructure, or renewable energy, you MUST reference the Sustainability category scores and individual factors (Carbon Footprint, Green Transit Score, Bike Infrastructure, Renewable Energy, Green Space Coverage). Include sustainability-related metrics in your recommendations. Highlight how specific properties support a low-carbon lifestyle — proximity to bike lanes, transit stops, EV charging, solar panels, walkable errands. Compare sustainability scores across neighborhoods when useful.
- REAL DATA ONLY: Never fabricate school names, ratings, statistics, or facts. Only reference real schools, real landmarks, and real amenities that exist in the area. If you are not confident a specific fact is accurate, describe it in general terms instead of making up numbers.
- Score interpretation: 70+ is strong, 40-69 is moderate, below 40 is a red flag.
- TONE: Be persuasive and enthusiastic. You are selling the buyer on each home. Use concrete details — nearby parks by name, walking distance to amenities, specific school names and stats, commute times to job centers. Make every explanation feel tailored and compelling.${
  priorities.length > 0
    ? `\n\nUser priorities: ${priorities.map(pid => PRIORITIES.find(p => p.id === pid)?.label).filter(Boolean).join(', ')}. Bias your analysis and recommendations toward these priorities.`
    : ''
}`

    // Build multi-turn contents: include prior history + new user message
    const priorHistory = useStore.getState().chatHistory
    const contents = [
      ...priorHistory.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      { role: 'user', parts: [{ text }] },
    ]

    try {
      const fetchWithRetry = async (retries = 2) => {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents,
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        )

        if (res.status === 429 && retries > 0) {
          await new Promise((r) => setTimeout(r, 1500 * (3 - retries)))
          return fetchWithRetry(retries - 1)
        }

        if (!res.ok) {
          const body = await res.json().catch(() => null)
          throw new Error(body?.error?.message || `API request failed (${res.status})`)
        }

        return res
      }

      const res = await fetchWithRetry()

      // Stream response and extract analysis progressively
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let sseBuffer = ''
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        sseBuffer += decoder.decode(value, { stream: true })
        const lines = sseBuffer.split('\n')
        sseBuffer = lines.pop()
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6).trim()
          if (!payload || payload === '[DONE]') continue
          try {
            const event = JSON.parse(payload)
            const chunk = event.candidates?.[0]?.content?.parts?.[0]?.text
            if (chunk) {
              fullText += chunk
              const partial = extractPartialAnalysis(fullText)
              if (partial) setStreamingText(partial)
            }
          } catch { /* skip malformed SSE chunks */ }
        }
      }

      if (!fullText) throw new Error('No response received')
      setStreamingText('')
      const parsed = parseAIResponse(fullText)
      let enriched = enrichListings(listings, parsed.recommendations)

      // Fall back to raw listings when AI enrichment finds no matches
      if (enriched.length === 0 && listings.length > 0) {
        enriched = listings
      }

      // Only store messages in history after successful response
      addChatMessage('user', displayLabel || text)
      addChatMessage('model', parsed.analysis)

      setResponse({ analysis: parsed.analysis, recommendations: parsed.recommendations })
      setRefineInput('')
      onResponse?.({ analysis: parsed.analysis, recommendations: parsed.recommendations, enrichedListings: enriched })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setStreamingText('')
    }
  }

  const handleRefine = () => {
    if (!refineInput.trim()) return
    handleSubmit(refineInput)
    setRefineInput('')
  }

  const handleClearConversation = () => {
    clearChatHistory()
    setResponse(null)
    setRefineInput('')
    setInput('')
    setError(null)
  }

  const _enriched = response ? enrichListings(listings, response.recommendations) : []
  const enrichedListings = _enriched.length === 0 && response && listings.length > 0 ? listings : _enriched

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="mt-8"
    >
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />
            <span className="text-[17px] font-semibold text-[var(--text-primary)]">
              LOCUS AI
            </span>
          </div>
          {chatHistory.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] text-[12px] font-medium">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {Math.ceil(chatHistory.length / 2)} turn{Math.ceil(chatHistory.length / 2) !== 1 ? 's' : ''} in memory
            </span>
          )}
        </div>
        <p className="text-[15px] text-[var(--text-muted)] mb-5">
          Set your preferences below, then describe your situation or pick a prompt
        </p>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3 mb-5">
          <Dropdown
            label="Price"
            value={filters.priceRange}
            options={PRICE_RANGES}
            onChange={(v) => updateFilter('priceRange', v)}
          />
          <Dropdown
            label="Beds"
            value={filters.minBeds}
            options={[
              { value: '', label: 'Any' },
              { value: '1', label: '1+' },
              { value: '2', label: '2+' },
              { value: '3', label: '3+' },
              { value: '4', label: '4+' },
              { value: '5', label: '5+' },
            ]}
            onChange={(v) => updateFilter('minBeds', v)}
          />
          <Dropdown
            label="Sqft"
            value={filters.minSqft}
            options={SQFT_RANGES}
            onChange={(v) => updateFilter('minSqft', v)}
          />
        </div>

        {/* Suggested prompts */}
        <div className="flex flex-wrap gap-2 mb-4">
          {SUGGESTED_PROMPTS.map((s) => (
            <button
              key={s.label}
              onClick={() => handleSubmit(s.prompt, s.label)}
              disabled={loading}
              className="px-4 py-2.5 rounded-[8px] text-[14px] font-medium bg-[var(--accent-muted)] text-[var(--accent)] hover:bg-[var(--accent)]/15 transition-colors disabled:opacity-40"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSubmit()}
            placeholder="I'm looking for a home with great schools nearby..."
            disabled={loading}
            aria-label="Describe what you're looking for in a home"
            className="flex-1 px-4 py-3.5 rounded-[10px] bg-[var(--bg-base)] border border-[var(--border)] text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors disabled:opacity-60"
          />
          <button
            onClick={() => handleSubmit()}
            disabled={loading || !input.trim()}
            aria-label={loading ? 'Loading' : 'Submit prompt'}
            className="px-6 py-3.5 rounded-[10px] bg-[var(--accent)] text-white text-[16px] font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? '...' : '\u2192'}
          </button>
        </div>

        {/* Response area */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-5"
            >
              {streamingText ? (
                <div className="px-5 py-4 rounded-[10px] bg-[var(--bg-base)] border border-[var(--border)] shadow-sm">
                  <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                    {streamingText}
                    <span className="inline-block w-[2px] h-[16px] bg-[var(--accent)] ml-0.5 align-middle animate-pulse" />
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:0ms]" />
                    <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:150ms]" />
                    <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span className="text-[15px] text-[var(--text-muted)]">
                    Analyzing neighborhoods...
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 px-4 py-3 rounded-[8px] bg-[var(--score-low)]/10 border border-[var(--score-low)]/20"
            >
              <p className="text-[15px] text-[var(--score-low)]">{error}</p>
            </motion.div>
          )}

          {response && (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Conversation thread — show prior exchanges */}
              {chatHistory.length > 2 && (
                <div className="mt-5 mb-4 space-y-3">
                  <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)]">
                    Conversation History
                  </span>
                  {chatHistory.slice(0, -2).map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-3.5 py-2.5 rounded-[10px] text-[13px] leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-[var(--accent-muted)] text-[var(--accent)] rounded-br-[4px]'
                            : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-bl-[4px]'
                        }`}
                      >
                        {msg.role !== 'user' && (
                          <span className="text-[12px] font-medium text-[var(--text-muted)] block mb-1">LOCUS AI</span>
                        )}
                        <p className="line-clamp-2">{msg.role === 'user' && msg.text.length > 120 ? msg.text.slice(0, 120) + '...' : msg.text}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-[var(--border)] pt-1">
                    <span className="text-[12px] text-[var(--text-muted)]">Latest response</span>
                  </div>
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-5">
                {/* Left: Analysis */}
                <div className="px-5 py-4 rounded-[10px] bg-[var(--bg-base)] border border-[var(--border)] shadow-sm">
                  <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                    {response.analysis}
                  </p>
                </div>

                {/* Right: Carousel */}
                <div className="min-w-0">
                  <ListingsCarousel listings={enrichedListings} />
                </div>
              </div>

              {/* Refine input */}
              <div className="mt-4 flex items-center gap-2">
                <input
                  ref={refineRef}
                  type="text"
                  value={refineInput}
                  onChange={(e) => setRefineInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handleRefine()}
                  placeholder="Refine your search — ask a follow-up..."
                  disabled={loading}
                  aria-label="Refine your search with a follow-up question"
                  className="flex-1 px-3 py-2.5 rounded-[8px] bg-[var(--bg-base)] border border-[var(--border)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors disabled:opacity-60"
                />
                <button
                  onClick={handleRefine}
                  disabled={loading || !refineInput.trim()}
                  className="px-4 py-2.5 rounded-[8px] bg-[var(--accent)] text-white text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Refine
                </button>
                <button
                  onClick={handleClearConversation}
                  className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap"
                >
                  Clear conversation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
