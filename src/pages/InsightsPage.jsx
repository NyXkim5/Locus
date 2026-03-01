import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import TopBar from '../components/shared/TopBar'

// Mock aggregated data for B2B demo
const NEIGHBORHOOD_DEMAND = [
  { name: 'Mission District', views: 1842, pctChange: 12 },
  { name: 'Pacific Heights', views: 1456, pctChange: 8 },
  { name: 'SoMa', views: 1234, pctChange: -3 },
  { name: 'Castro', views: 1098, pctChange: 15 },
  { name: 'Noe Valley', views: 987, pctChange: 5 },
  { name: 'Richmond', views: 876, pctChange: 22 },
]

const BUDGET_DISTRIBUTION = [
  { tier: 'Starter', pct: 18, label: '< $500K' },
  { tier: 'Mid-Range', pct: 35, label: '$500K - $1M' },
  { tier: 'Premium', pct: 32, label: '$1M - $2M' },
  { tier: 'Luxury', pct: 15, label: '$2M+' },
]

const TOP_PRIORITIES = [
  { label: 'Safe Area', pct: 72 },
  { label: 'Good Schools', pct: 58 },
  { label: 'Walkable', pct: 54 },
  { label: 'Good Investment', pct: 41 },
  { label: 'Eco-Friendly', pct: 33 },
  { label: 'Nightlife & Culture', pct: 28 },
]

const LIFESTYLE_SEGMENTS = [
  { type: 'Family-Oriented', pct: 35, color: 'var(--score-high)' },
  { type: 'Young Professional', pct: 28, color: 'var(--accent)' },
  { type: 'Investor', pct: 18, color: 'var(--score-mid)' },
  { type: 'Eco-Conscious', pct: 12, color: 'var(--color-sustainability, #22c55e)' },
  { type: 'Explorer', pct: 7, color: 'var(--text-muted)' },
]

const TRENDING_INTERESTS = [
  { interest: 'hiking', count: 342 },
  { interest: 'coffee shops', count: 298 },
  { interest: 'yoga', count: 256 },
  { interest: 'dogs', count: 234 },
  { interest: 'farmers markets', count: 212 },
  { interest: 'cycling', count: 198 },
  { interest: 'art galleries', count: 176 },
  { interest: 'food', count: 165 },
  { interest: 'tech meetups', count: 154 },
  { interest: 'live music', count: 143 },
]

const maxDemand = Math.max(...NEIGHBORHOOD_DEMAND.map(n => n.views))

function StatCard({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] p-5"
    >
      <h3 className="text-[13px] font-semibold text-[var(--text-primary)] mb-4">{title}</h3>
      {children}
    </motion.div>
  )
}

export default function InsightsPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="Market Insights" showBack />

      <div className="max-w-6xl mx-auto px-6 pt-8 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-[24px] font-bold text-[var(--text-primary)] mb-1">
            Market Insights — Bay Area
          </h1>
          <p className="text-[14px] text-[var(--text-muted)]">
            For Developers & Realtors — Understand real demand patterns from Locus users
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[12px] text-[var(--text-muted)]">
            <span className="w-2 h-2 rounded-full bg-[var(--score-high)] animate-pulse" />
            Demo data — 2,847 anonymized user profiles
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Demand Heatmap */}
          <StatCard title="Neighborhood Demand" delay={0.1}>
            <div className="space-y-3">
              {NEIGHBORHOOD_DEMAND.map((n) => (
                <div key={n.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-[var(--text-secondary)]">{n.name}</span>
                    <span className="text-[12px] text-[var(--text-muted)]">
                      {n.views.toLocaleString()} views
                      <span className={`ml-1.5 ${n.pctChange >= 0 ? 'text-[var(--score-high)]' : 'text-[var(--score-low)]'}`}>
                        {n.pctChange >= 0 ? '+' : ''}{n.pctChange}%
                      </span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(n.views / maxDemand) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full bg-[var(--accent)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </StatCard>

          {/* Budget Distribution */}
          <StatCard title="Budget Distribution" delay={0.2}>
            <div className="space-y-3">
              {BUDGET_DISTRIBUTION.map((b) => (
                <div key={b.tier}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-[var(--text-secondary)]">
                      {b.tier} <span className="text-[var(--text-muted)]">({b.label})</span>
                    </span>
                    <span className="text-[12px] font-medium text-[var(--text-primary)]">{b.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${b.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: b.tier === 'Luxury' ? 'var(--score-mid)' :
                          b.tier === 'Premium' ? 'var(--accent)' :
                          b.tier === 'Mid-Range' ? 'var(--score-high)' : 'var(--text-muted)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </StatCard>

          {/* Top Priorities */}
          <StatCard title="Top Priorities" delay={0.3}>
            <div className="space-y-3">
              {TOP_PRIORITIES.map((p, i) => (
                <div key={p.label} className="flex items-center gap-3">
                  <span className="w-5 text-[12px] text-[var(--text-muted)] text-right">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-[var(--text-secondary)]">{p.label}</span>
                      <span className="text-[12px] font-medium text-[var(--text-primary)]">{p.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.pct}%` }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="h-full rounded-full bg-[var(--accent)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </StatCard>

          {/* Lifestyle Segments */}
          <StatCard title="Lifestyle Segments" delay={0.4}>
            <div className="space-y-3">
              {LIFESTYLE_SEGMENTS.map((seg) => (
                <div key={seg.type} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-[var(--text-secondary)]">{seg.type}</span>
                      <span className="text-[12px] font-medium text-[var(--text-primary)]">{seg.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${seg.pct}%` }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: seg.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </StatCard>

          {/* Trending Interests — full width */}
          <div className="md:col-span-2">
            <StatCard title="Trending Interests" delay={0.5}>
              <div className="flex flex-wrap gap-2">
                {TRENDING_INTERESTS.map((item, i) => {
                  const maxCount = TRENDING_INTERESTS[0].count
                  const scale = 0.7 + (item.count / maxCount) * 0.3
                  const opacity = 0.5 + (item.count / maxCount) * 0.5
                  return (
                    <motion.span
                      key={item.interest}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] font-medium"
                      style={{
                        fontSize: `${Math.round(11 * scale)}px`,
                        opacity,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {item.interest}
                      <span className="ml-1.5 text-[var(--text-muted)]" style={{ fontSize: '10px' }}>
                        {item.count}
                      </span>
                    </motion.span>
                  )
                })}
              </div>
            </StatCard>
          </div>
        </div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center"
        >
          <h2 className="text-[18px] font-bold text-[var(--text-primary)] mb-2">
            Understand What Residents Actually Want
          </h2>
          <p className="text-[14px] text-[var(--text-muted)] max-w-lg mx-auto mb-6">
            Locus passively collects household preferences from real search behavior — no surveys needed.
            Use these insights to inform development decisions, marketing strategies, and tenant matching.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[13px]">
            <div className="px-4 py-3 rounded-[8px] bg-[var(--bg-elevated)] border border-[var(--border)]">
              <div className="text-[20px] font-bold text-[var(--accent)]">2,847</div>
              <div className="text-[var(--text-muted)]">Active Profiles</div>
            </div>
            <div className="px-4 py-3 rounded-[8px] bg-[var(--bg-elevated)] border border-[var(--border)]">
              <div className="text-[20px] font-bold text-[var(--accent)]">12.4K</div>
              <div className="text-[var(--text-muted)]">Neighborhood Views</div>
            </div>
            <div className="px-4 py-3 rounded-[8px] bg-[var(--bg-elevated)] border border-[var(--border)]">
              <div className="text-[20px] font-bold text-[var(--accent)]">89%</div>
              <div className="text-[var(--text-muted)]">Profile Completion</div>
            </div>
          </div>
        </motion.div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-[13px] text-[var(--accent)] hover:underline"
          >
            Back to Locus
          </Link>
        </div>
      </div>
    </div>
  )
}
