import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import useStore from '../../store/useStore'

function fmt(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export default function MortgageCalculator({ medianPrice = 500000 }) {
  const [homePrice, setHomePrice] = useState(medianPrice)
  const [userTouched, setUserTouched] = useState(false)
  const [downPct, setDownPct] = useState(20)
  const setBudgetRange = useStore((s) => s.setBudgetRange)

  // Sync with median price when listings load (unless user already adjusted)
  useEffect(() => {
    if (!userTouched) setHomePrice(medianPrice)
  }, [medianPrice, userTouched])
  const [rate, setRate] = useState(6.5)
  const [term, setTerm] = useState(30)

  // Debounced budget range tracking
  useEffect(() => {
    const timer = setTimeout(() => {
      setBudgetRange({ homePrice, downPct, rate, term })
    }, 500)
    return () => clearTimeout(timer)
  }, [homePrice, downPct, rate, term, setBudgetRange])

  const monthly = useMemo(() => {
    const principal = homePrice * (1 - downPct / 100)
    if (principal <= 0) return 0
    const r = rate / 100 / 12
    const n = term * 12
    if (r === 0) return principal / n
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  }, [homePrice, downPct, rate, term])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-[15px] font-semibold text-[var(--text-primary)] mb-3">Mortgage Calculator</h2>
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Home Price */}
          <div>
            <label className="text-[12px] font-medium text-[var(--text-muted)] mb-1 block">
              Home Price
            </label>
            <input
              type="range"
              min={50000}
              max={5000000}
              step={10000}
              value={homePrice}
              onChange={(e) => { setUserTouched(true); setHomePrice(Number(e.target.value)) }}
              className="w-full accent-[var(--accent)]"
            />
            <span className="text-[13px] font-medium text-[var(--text-primary)]">{fmt(homePrice)}</span>
          </div>

          {/* Down Payment */}
          <div>
            <label className="text-[12px] font-medium text-[var(--text-muted)] mb-1 block">
              Down Payment
            </label>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={downPct}
              onChange={(e) => setDownPct(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
            <span className="text-[13px] font-medium text-[var(--text-primary)]">
              {downPct}% ({fmt(homePrice * downPct / 100)})
            </span>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="text-[12px] font-medium text-[var(--text-muted)] mb-1 block">
              Interest Rate
            </label>
            <input
              type="range"
              min={1}
              max={12}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
            <span className="text-[13px] font-medium text-[var(--text-primary)]">{rate.toFixed(1)}%</span>
          </div>

          {/* Loan Term */}
          <div>
            <label className="text-[12px] font-medium text-[var(--text-muted)] mb-1 block">
              Loan Term
            </label>
            <div className="flex gap-2 mt-1">
              {[30, 15].map((t) => (
                <button
                  key={t}
                  onClick={() => setTerm(t)}
                  className={`flex-1 py-2 rounded-[8px] text-[13px] font-medium border transition-colors ${
                    term === t
                      ? 'border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]'
                      : 'border-[var(--border)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:border-[var(--border-active)]'
                  }`}
                >
                  {t} yr
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="border-t border-[var(--border)] pt-4 flex items-baseline justify-between">
          <span className="text-[13px] text-[var(--text-muted)]">Estimated Monthly Payment (P&I)</span>
          <span className="text-[24px] font-bold text-[var(--accent)]">{fmt(Math.round(monthly))}</span>
        </div>
      </div>
    </motion.div>
  )
}
