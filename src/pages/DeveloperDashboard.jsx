import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TopBar from '../components/shared/TopBar'

// ═══════════════════════════════════════════════════════════════════
// REAL LOCATION DATA — Southern California & Bay Area Markets
// ═══════════════════════════════════════════════════════════════════

const MARKETS = {
  irvine: {
    name: 'Irvine, CA',
    region: 'Orange County',
    population: '307,670',
    medianIncome: '$116,927',
    medianHome: '$1,285,000',
    yoyAppreciation: 8.2,
    rentToPrice: 4.1,
    vacancyRate: 3.8,
    daysOnMarket: 24,
    coordinates: { lat: 33.6846, lng: -117.8265 },
  },
  austin: {
    name: 'Austin, TX',
    region: 'Travis County',
    population: '979,882',
    medianIncome: '$85,368',
    medianHome: '$545,000',
    yoyAppreciation: 3.1,
    rentToPrice: 5.8,
    vacancyRate: 7.2,
    daysOnMarket: 58,
    coordinates: { lat: 30.2672, lng: -97.7431 },
  },
  sanFrancisco: {
    name: 'San Francisco, CA',
    region: 'Bay Area',
    population: '808,437',
    medianIncome: '$136,689',
    medianHome: '$1,420,000',
    yoyAppreciation: 5.4,
    rentToPrice: 3.2,
    vacancyRate: 6.1,
    daysOnMarket: 32,
    coordinates: { lat: 37.7749, lng: -122.4194 },
  },
  miami: {
    name: 'Miami, FL',
    region: 'Miami-Dade',
    population: '442,241',
    medianIncome: '$54,858',
    medianHome: '$620,000',
    yoyAppreciation: 6.8,
    rentToPrice: 6.2,
    vacancyRate: 4.5,
    daysOnMarket: 41,
    coordinates: { lat: 25.7617, lng: -80.1918 },
  },
  nashville: {
    name: 'Nashville, TN',
    region: 'Davidson County',
    population: '689,447',
    medianIncome: '$69,103',
    medianHome: '$435,000',
    yoyAppreciation: 4.7,
    rentToPrice: 6.9,
    vacancyRate: 5.3,
    daysOnMarket: 35,
    coordinates: { lat: 36.1627, lng: -86.7816 },
  },
}

// ═══════════════════════════════════════════════════════════════════
// NEIGHBORHOOD-LEVEL INVESTMENT OPPORTUNITIES
// ═══════════════════════════════════════════════════════════════════

const INVESTMENT_OPPORTUNITIES = [
  {
    id: 1,
    neighborhood: 'Woodbury',
    city: 'Irvine, CA',
    type: 'Long-Term Rental',
    badge: 'Top Pick',
    badgeColor: 'var(--score-high)',
    medianPrice: '$1,150,000',
    monthlyRent: '$4,200',
    capRate: 4.4,
    cashOnCash: 6.1,
    appreciation5yr: 42,
    walkScore: 72,
    schoolRating: 9,
    demandScore: 94,
    aiSuggestion: 'High-performing school district drives consistent family rental demand. Low vacancy risk with 18-month average tenant retention. Recommend 3-4BR SFR acquisitions.',
    riskLevel: 'Low',
    riskColor: 'var(--score-high)',
  },
  {
    id: 2,
    neighborhood: 'Wynwood',
    city: 'Miami, FL',
    type: 'Airbnb / Short-Term',
    badge: 'Hot Market',
    badgeColor: 'var(--score-mid)',
    medianPrice: '$580,000',
    monthlyRent: '$3,800',
    capRate: 7.9,
    cashOnCash: 11.2,
    appreciation5yr: 35,
    walkScore: 88,
    schoolRating: 5,
    demandScore: 91,
    aiSuggestion: 'Art district with year-round tourism. Average Airbnb nightly rate $245 with 78% occupancy. STR regulations are favorable. Strong weekend demand from domestic travelers.',
    riskLevel: 'Medium',
    riskColor: 'var(--score-mid)',
  },
  {
    id: 3,
    neighborhood: 'East Nashville',
    city: 'Nashville, TN',
    type: 'Fix & Flip',
    badge: 'Emerging',
    badgeColor: 'var(--accent)',
    medianPrice: '$385,000',
    monthlyRent: '$2,600',
    capRate: 8.1,
    cashOnCash: 14.3,
    appreciation5yr: 52,
    walkScore: 65,
    schoolRating: 6,
    demandScore: 87,
    aiSuggestion: 'Rapid gentrification with 23% YoY price growth in sub-$400K segment. Strong flip margins on pre-1970 homes. Average renovation ROI of 38%. Act within 12-18 months window.',
    riskLevel: 'Medium-High',
    riskColor: 'var(--score-mid)',
  },
  {
    id: 4,
    neighborhood: 'Great Park',
    city: 'Irvine, CA',
    type: 'New Development',
    badge: 'Pre-Construction',
    badgeColor: 'var(--accent)',
    medianPrice: '$1,450,000',
    monthlyRent: '$5,100',
    capRate: 4.2,
    cashOnCash: 5.8,
    appreciation5yr: 48,
    walkScore: 45,
    schoolRating: 10,
    demandScore: 96,
    aiSuggestion: 'Master-planned community with $2B+ in planned infrastructure. Pre-construction pricing 15-20% below market at completion. Strong demand from tech relocations from Bay Area.',
    riskLevel: 'Low',
    riskColor: 'var(--score-high)',
  },
  {
    id: 5,
    neighborhood: 'Mission District',
    city: 'San Francisco, CA',
    type: 'Mixed-Use',
    badge: 'Value-Add',
    badgeColor: 'var(--score-mid)',
    medianPrice: '$1,680,000',
    monthlyRent: '$5,800',
    capRate: 4.1,
    cashOnCash: 5.2,
    appreciation5yr: 28,
    walkScore: 96,
    schoolRating: 7,
    demandScore: 89,
    aiSuggestion: 'Ground-floor commercial + residential upper units yield blended 5.2% cap rate. Rent control applies to pre-1979 units. Target post-1979 or commercial conversions for best returns.',
    riskLevel: 'Medium',
    riskColor: 'var(--score-mid)',
  },
  {
    id: 6,
    neighborhood: 'East Austin',
    city: 'Austin, TX',
    type: 'Land Acquisition',
    badge: 'Opportunity Zone',
    badgeColor: 'var(--score-high)',
    medianPrice: '$320,000',
    monthlyRent: '$2,100',
    capRate: 7.9,
    cashOnCash: 12.8,
    appreciation5yr: 61,
    walkScore: 71,
    schoolRating: 6,
    demandScore: 93,
    aiSuggestion: 'Federal Opportunity Zone with tax advantages. Zoning changes pending for increased density. Land values projected to double in 3-5 years with new transit corridor. Buy raw land now.',
    riskLevel: 'High',
    riskColor: 'var(--score-low)',
  },
]

// ═══════════════════════════════════════════════════════════════════
// MARKET TRENDS — Monthly data for charts
// ═══════════════════════════════════════════════════════════════════

const MONTHLY_TRENDS = [
  { month: 'Apr', medianPrice: 1180, rentIndex: 100, inventory: 342, absorption: 78 },
  { month: 'May', medianPrice: 1195, rentIndex: 101, inventory: 358, absorption: 82 },
  { month: 'Jun', medianPrice: 1210, rentIndex: 103, inventory: 312, absorption: 88 },
  { month: 'Jul', medianPrice: 1230, rentIndex: 104, inventory: 298, absorption: 91 },
  { month: 'Aug', medianPrice: 1255, rentIndex: 105, inventory: 278, absorption: 85 },
  { month: 'Sep', medianPrice: 1240, rentIndex: 106, inventory: 305, absorption: 79 },
  { month: 'Oct', medianPrice: 1225, rentIndex: 106, inventory: 330, absorption: 74 },
  { month: 'Nov', medianPrice: 1215, rentIndex: 107, inventory: 345, absorption: 71 },
  { month: 'Dec', medianPrice: 1220, rentIndex: 108, inventory: 320, absorption: 68 },
  { month: 'Jan', medianPrice: 1245, rentIndex: 109, inventory: 290, absorption: 76 },
  { month: 'Feb', medianPrice: 1268, rentIndex: 110, inventory: 275, absorption: 83 },
  { month: 'Mar', medianPrice: 1285, rentIndex: 112, inventory: 260, absorption: 89 },
]

// ═══════════════════════════════════════════════════════════════════
// AIRBNB METRICS
// ═══════════════════════════════════════════════════════════════════

const AIRBNB_METRICS = [
  { neighborhood: 'Wynwood, Miami', avgNightly: 245, occupancy: 78, monthlyRev: 5738, revPAR: 191, seasonality: 'Low', rating: 4.8 },
  { neighborhood: 'South Beach, Miami', avgNightly: 312, occupancy: 82, monthlyRev: 7679, revPAR: 256, seasonality: 'Medium', rating: 4.6 },
  { neighborhood: 'East Nashville, TN', avgNightly: 189, occupancy: 71, monthlyRev: 4027, revPAR: 134, seasonality: 'Medium', rating: 4.7 },
  { neighborhood: 'SoMa, San Francisco', avgNightly: 275, occupancy: 68, monthlyRev: 5610, revPAR: 187, seasonality: 'Low', rating: 4.5 },
  { neighborhood: 'Woodbury, Irvine', avgNightly: 198, occupancy: 62, monthlyRev: 3683, revPAR: 123, seasonality: 'High', rating: 4.9 },
  { neighborhood: '6th Street, Austin', avgNightly: 165, occupancy: 75, monthlyRev: 3713, revPAR: 124, seasonality: 'Medium', rating: 4.4 },
]

// ═══════════════════════════════════════════════════════════════════
// RENTAL MARKET ANALYSIS
// ═══════════════════════════════════════════════════════════════════

const RENTAL_ANALYSIS = [
  { type: 'Studio', avgRent: 2150, yoyChange: 5.2, vacancy: 4.1, demand: 'High' },
  { type: '1-Bedroom', avgRent: 2680, yoyChange: 4.8, vacancy: 3.5, demand: 'Very High' },
  { type: '2-Bedroom', avgRent: 3450, yoyChange: 6.1, vacancy: 2.8, demand: 'Very High' },
  { type: '3-Bedroom', avgRent: 4200, yoyChange: 7.3, vacancy: 2.2, demand: 'Extreme' },
  { type: '4+ Bedroom', avgRent: 5800, yoyChange: 8.9, vacancy: 1.9, demand: 'Extreme' },
]

// ═══════════════════════════════════════════════════════════════════
// AI INSIGHTS
// ═══════════════════════════════════════════════════════════════════

const AI_INSIGHTS = [
  {
    title: 'Buy Signal: Irvine Great Park Area',
    category: 'Acquisition',
    urgency: 'High',
    icon: '🏗️',
    insight: 'Pre-construction pricing in Great Park\'s newest phase is 15-20% below projected completion values. With $2B in planned infrastructure and 3 new tech campus relocations announced, this window closes within 6 months. Target 3-4BR homes in the $1.2-1.5M range for maximum appreciation.',
    metrics: [
      { label: 'Projected 3yr ROI', value: '38-45%' },
      { label: 'Monthly Cash Flow', value: '$1,200+' },
      { label: 'Risk Rating', value: 'Low' },
    ],
  },
  {
    title: 'Airbnb Opportunity: East Nashville',
    category: 'Short-Term Rental',
    urgency: 'Medium',
    icon: '🏠',
    insight: 'Nashville\'s tourism industry hit $8.1B in 2025. East Nashville\'s walkable restaurant scene drives 71% occupancy with $189 avg nightly rate. Properties near Five Points intersection command 22% premium. Convert older SFRs to boutique STRs for optimal returns.',
    metrics: [
      { label: 'Annual STR Revenue', value: '$48K-58K' },
      { label: 'Break-even Period', value: '4.2 years' },
      { label: 'Regulation Risk', value: 'Medium' },
    ],
  },
  {
    title: 'Land Banking: East Austin Opportunity Zone',
    category: 'Land Development',
    urgency: 'High',
    icon: '📍',
    insight: 'Federal Opportunity Zone designation provides tax-deferred capital gains. Pending zoning changes will allow 4x density increase along new transit corridor. Current land prices at $45-65/sqft projected to reach $120-150/sqft within 5 years. Acquire parcels along E. Cesar Chavez.',
    metrics: [
      { label: 'Projected Land Value 5yr', value: '2.4x-3.1x' },
      { label: 'Tax Advantage', value: '15-25% savings' },
      { label: 'Development Timeline', value: '3-5 years' },
    ],
  },
  {
    title: 'Rental Conversion: Mission District SF',
    category: 'Value-Add',
    urgency: 'Low',
    icon: '🔄',
    insight: 'Post-1979 mixed-use buildings not subject to rent control. Ground-floor retail vacancy at 12% creates ADU conversion opportunities. Blended residential + commercial yields outperform pure residential by 1.3% cap rate. Focus on Valencia St corridor.',
    metrics: [
      { label: 'Blended Cap Rate', value: '5.2%' },
      { label: 'ADU Conversion Cost', value: '$85-120K' },
      { label: 'Permit Timeline', value: '4-8 months' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════
// GROWTH INDICATORS
// ═══════════════════════════════════════════════════════════════════

const GROWTH_INDICATORS = [
  { label: 'Population Growth (YoY)', value: '+2.8%', trend: 'up', detail: 'vs +1.2% national avg' },
  { label: 'Job Growth', value: '+4.1%', trend: 'up', detail: 'Tech & healthcare leading' },
  { label: 'Permit Activity', value: '+18%', trend: 'up', detail: '2,847 new units approved' },
  { label: 'Median Income Growth', value: '+5.3%', trend: 'up', detail: 'Outpacing inflation' },
  { label: 'Days on Market', value: '24', trend: 'down', detail: 'Down from 38 last year' },
  { label: 'Inventory Level', value: '-12%', trend: 'down', detail: '1.8 months supply' },
]

// ═══════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function MiniBarChart({ data, dataKey, color, height = 60 }) {
  const max = Math.max(...data.map((d) => d[dataKey]))

  return (
    <div className="relative" style={{ height }}>
      <div className="flex items-end justify-between h-full gap-[2px]">
        {data.map((d, i) => {
          const h = (d[dataKey] / max) * 100
          return (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.6, delay: i * 0.04 }}
              className="rounded-t-[2px] flex-1 min-w-0"
              style={{ backgroundColor: color, opacity: 0.6 + (i / data.length) * 0.4 }}
              title={`${d.month}: ${d[dataKey].toLocaleString()}`}
            />
          )
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-[var(--text-muted)]">{data[0].month}</span>
        <span className="text-[9px] text-[var(--text-muted)]">{data[data.length - 1].month}</span>
      </div>
    </div>
  )
}

let chartIdCounter = 0
function MiniLineChart({ data, dataKey, color, height = 60 }) {
  const [gradientId] = useState(() => `gradient-${dataKey}-${++chartIdCounter}`)
  const max = Math.max(...data.map((d) => d[dataKey]))
  const min = Math.min(...data.map((d) => d[dataKey]))
  const range = max - min || 1
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((d[dataKey] - min) / range) * 100
    return `${x},${y}`
  }).join(' ')

  const fillPoints = `0,100 ${points} 100,100`

  return (
    <div className="relative" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <motion.polygon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          points={fillPoints}
          fill={`url(#${gradientId})`}
        />
        <motion.polyline
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-[var(--text-muted)]">{data[0].month}</span>
        <span className="text-[9px] text-[var(--text-muted)]">{data[data.length - 1].month}</span>
      </div>
    </div>
  )
}

function StatCard({ title, children, delay = 0, className = '', fullWidth = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] p-5 ${fullWidth ? 'md:col-span-2 lg:col-span-3' : ''} ${className}`}
    >
      {title && <h3 className="text-[13px] font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">{title}</h3>}
      {children}
    </motion.div>
  )
}

function KPICard({ label, value, change, changeLabel, icon, delay = 0, invertColor = false }) {
  const rawPositive = typeof change === 'number' ? change > 0 : change?.startsWith('+')
  const isPositive = invertColor ? !rawPositive : rawPositive
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] p-4 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">{label}</span>
        {icon && <span className="text-[16px]">{icon}</span>}
      </div>
      <div className="text-[24px] font-bold text-[var(--text-primary)] tracking-tight">{value}</div>
      {(change !== undefined || changeLabel) && (
        <div className="flex items-center gap-1.5">
          {change !== undefined && (
            <span className={`text-[12px] font-semibold ${isPositive ? 'text-[var(--score-high)]' : 'text-[var(--score-low)]'}`}>
              {typeof change === 'number' ? `${change > 0 ? '+' : ''}${change}%` : change}
            </span>
          )}
          {changeLabel && <span className="text-[11px] text-[var(--text-muted)]">{changeLabel}</span>}
        </div>
      )}
    </motion.div>
  )
}

function InvestmentCard({ opp, delay }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden hover:border-[var(--border-active)] transition-colors"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-[14px] font-semibold text-[var(--text-primary)]">{opp.neighborhood}</h4>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: opp.badgeColor, color: 'white', opacity: 0.9 }}
              >
                {opp.badge}
              </span>
            </div>
            <p className="text-[12px] text-[var(--text-muted)]">{opp.city} &middot; {opp.type}</p>
          </div>
          <div className="text-right">
            <div className="text-[16px] font-bold text-[var(--text-primary)]">{opp.medianPrice}</div>
            <div className="text-[11px] text-[var(--text-muted)]">Median Price</div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div className="text-center p-2 rounded-[8px] bg-[var(--bg-elevated)]">
            <div className="text-[14px] font-bold text-[var(--accent)]">{opp.capRate}%</div>
            <div className="text-[10px] text-[var(--text-muted)]">Cap Rate</div>
          </div>
          <div className="text-center p-2 rounded-[8px] bg-[var(--bg-elevated)]">
            <div className="text-[14px] font-bold text-[var(--score-high)]">{opp.cashOnCash}%</div>
            <div className="text-[10px] text-[var(--text-muted)]">Cash-on-Cash</div>
          </div>
          <div className="text-center p-2 rounded-[8px] bg-[var(--bg-elevated)]">
            <div className="text-[14px] font-bold text-[var(--text-primary)]">{opp.appreciation5yr}%</div>
            <div className="text-[10px] text-[var(--text-muted)]">5yr Apprec.</div>
          </div>
          <div className="text-center p-2 rounded-[8px] bg-[var(--bg-elevated)]">
            <div className="text-[14px] font-bold" style={{ color: opp.riskColor }}>{opp.riskLevel}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Risk</div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
            <span>Walk: {opp.walkScore}</span>
            <span>Schools: {opp.schoolRating}/10</span>
            <span>Demand: {opp.demandScore}/100</span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[12px] text-[var(--accent)] font-medium hover:underline"
          >
            {expanded ? 'Less' : 'AI Analysis'}
          </button>
        </div>
      </div>

      {/* Expanded AI Insight */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0">
              <div className="p-4 rounded-[10px] bg-[var(--accent-muted)] border border-[var(--accent)]/20">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a5 5 0 0 1 5 5c0 2.76-2.24 5-5 5s-5-2.24-5-5a5 5 0 0 1 5-5z" />
                    <path d="M2 22c0-5.52 4.48-10 10-10s10 4.48 10 10" />
                  </svg>
                  <span className="text-[12px] font-semibold text-[var(--accent)]">AI Investment Analysis</span>
                </div>
                <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{opp.aiSuggestion}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'M4 6h16M4 12h16M4 18h16' },
  { id: 'investments', label: 'Investments', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  { id: 'rental', label: 'Rental Analysis', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'airbnb', label: 'Airbnb Metrics', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
  { id: 'aiInsights', label: 'AI Suggestions', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
]

export default function DeveloperDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedMarket, setSelectedMarket] = useState('irvine')
  const market = MARKETS[selectedMarket]

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <TopBar title="Developer & Realtor Dashboard" showBack />

      <div className="max-w-7xl mx-auto px-6 pt-6 pb-32">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-[26px] font-bold text-[var(--text-primary)] tracking-tight mb-1">
                Real Estate Intelligence
              </h1>
              <p className="text-[14px] text-[var(--text-muted)]">
                Data-driven insights for developers, realtors, and investors
              </p>
            </div>
            {/* Market Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Market:</span>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="text-[13px] font-medium text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border)] rounded-[8px] px-3 py-2 outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
              >
                {Object.entries(MARKETS).map(([key, m]) => (
                  <option key={key} value={key}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Live Indicator */}
          <div className="mt-3 flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[11px] text-[var(--text-muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--score-high)] animate-pulse" />
              Live market data &middot; Updated March 2026
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[11px] text-[var(--text-muted)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              {market.region}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-[13px] font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <OverviewTab market={market} selectedMarket={selectedMarket} />
            </motion.div>
          )}
          {activeTab === 'investments' && (
            <motion.div key="investments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <InvestmentsTab />
            </motion.div>
          )}
          {activeTab === 'rental' && (
            <motion.div key="rental" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <RentalTab />
            </motion.div>
          )}
          {activeTab === 'airbnb' && (
            <motion.div key="airbnb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <AirbnbTab />
            </motion.div>
          )}
          {activeTab === 'aiInsights' && (
            <motion.div key="aiInsights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <AIInsightsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB: OVERVIEW
// ═══════════════════════════════════════════════════════════════════

function OverviewTab({ market, selectedMarket }) {
  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard label="Median Home" value={market.medianHome} change={market.yoyAppreciation} changeLabel="YoY" icon="🏠" delay={0.05} />
        <KPICard label="Rent/Price Ratio" value={`${market.rentToPrice}%`} changeLabel="Annual yield" icon="📊" delay={0.1} />
        <KPICard label="Vacancy Rate" value={`${market.vacancyRate}%`} change={market.vacancyRate < 5 ? '-0.8' : '+1.2'} changeLabel="vs last year" icon="🏢" delay={0.15} invertColor />
        <KPICard label="Days on Market" value={market.daysOnMarket} change={-14} changeLabel="vs last year" icon="📅" delay={0.2} invertColor />
        <KPICard label="Population" value={market.population} change="+2.8" changeLabel="YoY growth" icon="👥" delay={0.25} />
        <KPICard label="Med. Income" value={market.medianIncome} change="+5.3" changeLabel="YoY growth" icon="💰" delay={0.3} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Price Trend (12mo)" delay={0.15}>
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-[20px] font-bold text-[var(--text-primary)]">{market.medianHome}</span>
            <span className="text-[12px] text-[var(--score-high)] font-semibold">+{market.yoyAppreciation}%</span>
          </div>
          <MiniLineChart data={MONTHLY_TRENDS} dataKey="medianPrice" color="var(--accent)" height={80} />
        </StatCard>

        <StatCard title="Rent Index" delay={0.2}>
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-[20px] font-bold text-[var(--text-primary)]">112</span>
            <span className="text-[12px] text-[var(--score-high)] font-semibold">+12% from baseline</span>
          </div>
          <MiniLineChart data={MONTHLY_TRENDS} dataKey="rentIndex" color="var(--score-high)" height={80} />
        </StatCard>

        <StatCard title="Inventory Level" delay={0.25}>
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-[20px] font-bold text-[var(--text-primary)]">260</span>
            <span className="text-[12px] text-[var(--text-muted)]">active listings &middot; {market.daysOnMarket}d avg DOM</span>
          </div>
          <MiniBarChart data={MONTHLY_TRENDS} dataKey="inventory" color="var(--accent)" height={80} />
        </StatCard>
      </div>

      {/* Growth Indicators */}
      <StatCard title="Growth Indicators" delay={0.3}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {GROWTH_INDICATORS.map((g) => (
            <div key={g.label} className="text-center p-3 rounded-[10px] bg-[var(--bg-elevated)]">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className={`text-[16px] font-bold ${g.trend === 'up' ? 'text-[var(--score-high)]' : 'text-[var(--accent)]'}`}>{g.value}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={g.trend === 'up' ? 'var(--score-high)' : 'var(--accent)'} strokeWidth="3">
                  <path d={g.trend === 'up' ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
                </svg>
              </div>
              <div className="text-[10px] font-medium text-[var(--text-secondary)] mb-0.5">{g.label}</div>
              <div className="text-[9px] text-[var(--text-muted)]">{g.detail}</div>
            </div>
          ))}
        </div>
      </StatCard>

      {/* Market Comparison */}
      <StatCard title="Market Comparison" delay={0.35}>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-[var(--text-muted)] border-b border-[var(--border)]">
                <th className="text-left py-2 pr-4 font-medium">Market</th>
                <th className="text-right py-2 px-3 font-medium">Median Price</th>
                <th className="text-right py-2 px-3 font-medium">YoY</th>
                <th className="text-right py-2 px-3 font-medium">Rent/Price</th>
                <th className="text-right py-2 px-3 font-medium">Vacancy</th>
                <th className="text-right py-2 px-3 font-medium">DOM</th>
                <th className="text-right py-2 pl-3 font-medium">Med. Income</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(MARKETS).map(([key, m]) => (
                <tr
                  key={key}
                  className={`border-b border-[var(--border)]/50 transition-colors ${key === selectedMarket ? 'bg-[var(--accent-muted)]' : 'hover:bg-[var(--bg-elevated)]'}`}
                >
                  <td className="py-2.5 pr-4">
                    <span className={`font-medium ${key === selectedMarket ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>{m.name}</span>
                  </td>
                  <td className="text-right py-2.5 px-3 text-[var(--text-primary)] font-medium">{m.medianHome}</td>
                  <td className="text-right py-2.5 px-3">
                    <span className={m.yoyAppreciation > 5 ? 'text-[var(--score-high)] font-semibold' : 'text-[var(--text-secondary)]'}>
                      +{m.yoyAppreciation}%
                    </span>
                  </td>
                  <td className="text-right py-2.5 px-3 text-[var(--text-secondary)]">{m.rentToPrice}%</td>
                  <td className="text-right py-2.5 px-3">
                    <span className={m.vacancyRate < 5 ? 'text-[var(--score-high)]' : 'text-[var(--score-mid)]'}>
                      {m.vacancyRate}%
                    </span>
                  </td>
                  <td className="text-right py-2.5 px-3 text-[var(--text-secondary)]">{m.daysOnMarket}d</td>
                  <td className="text-right py-2.5 pl-3 text-[var(--text-secondary)]">{m.medianIncome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StatCard>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB: INVESTMENTS
// ═══════════════════════════════════════════════════════════════════

function InvestmentsTab() {
  const [filter, setFilter] = useState('all')
  const types = ['all', 'Long-Term Rental', 'Airbnb / Short-Term', 'Fix & Flip', 'New Development', 'Mixed-Use', 'Land Acquisition']

  const filtered = filter === 'all' ? INVESTMENT_OPPORTUNITIES : INVESTMENT_OPPORTUNITIES.filter((o) => o.type === filter)

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all ${
              filter === t
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t === 'all' ? 'All Types' : t}
          </button>
        ))}
      </div>

      {/* Investment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((opp, i) => (
          <InvestmentCard key={opp.id} opp={opp} delay={0.1 + i * 0.08} />
        ))}
      </div>

      {/* Summary Stats */}
      <StatCard title="Portfolio Summary" delay={0.4}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-[10px] bg-[var(--bg-elevated)]">
            <div className="text-[20px] font-bold text-[var(--accent)]">6.3%</div>
            <div className="text-[11px] text-[var(--text-muted)]">Avg Cap Rate</div>
          </div>
          <div className="text-center p-3 rounded-[10px] bg-[var(--bg-elevated)]">
            <div className="text-[20px] font-bold text-[var(--score-high)]">9.2%</div>
            <div className="text-[11px] text-[var(--text-muted)]">Avg Cash-on-Cash</div>
          </div>
          <div className="text-center p-3 rounded-[10px] bg-[var(--bg-elevated)]">
            <div className="text-[20px] font-bold text-[var(--text-primary)]">44%</div>
            <div className="text-[11px] text-[var(--text-muted)]">Avg 5yr Appreciation</div>
          </div>
          <div className="text-center p-3 rounded-[10px] bg-[var(--bg-elevated)]">
            <div className="text-[20px] font-bold text-[var(--score-mid)]">Med</div>
            <div className="text-[11px] text-[var(--text-muted)]">Avg Risk Level</div>
          </div>
        </div>
      </StatCard>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB: RENTAL ANALYSIS
// ═══════════════════════════════════════════════════════════════════

function RentalTab() {
  return (
    <div className="space-y-6">
      {/* Rental KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard label="Avg Rent" value="$3,256" change={6.1} changeLabel="YoY" icon="🏘️" delay={0.05} />
        <KPICard label="Avg Vacancy" value="2.9%" change="-0.6" changeLabel="vs last year" icon="📉" delay={0.1} invertColor />
        <KPICard label="Lease Velocity" value="18 days" change="-5" changeLabel="faster YoY" icon="⚡" delay={0.15} invertColor />
        <KPICard label="Renewal Rate" value="78%" change={3.2} changeLabel="YoY" icon="🔄" delay={0.2} />
      </div>

      {/* Rental Breakdown */}
      <StatCard title="Rental Market by Unit Type" delay={0.15}>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-[var(--text-muted)] border-b border-[var(--border)]">
                <th className="text-left py-2 pr-4 font-medium">Unit Type</th>
                <th className="text-right py-2 px-3 font-medium">Avg Rent</th>
                <th className="text-right py-2 px-3 font-medium">YoY Change</th>
                <th className="text-right py-2 px-3 font-medium">Vacancy</th>
                <th className="text-right py-2 pl-3 font-medium">Demand</th>
              </tr>
            </thead>
            <tbody>
              {RENTAL_ANALYSIS.map((r) => (
                <tr key={r.type} className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-elevated)] transition-colors">
                  <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">{r.type}</td>
                  <td className="text-right py-3 px-3 font-semibold text-[var(--text-primary)]">${r.avgRent.toLocaleString()}</td>
                  <td className="text-right py-3 px-3">
                    <span className="text-[var(--score-high)] font-semibold">+{r.yoyChange}%</span>
                  </td>
                  <td className="text-right py-3 px-3 text-[var(--text-secondary)]">{r.vacancy}%</td>
                  <td className="text-right py-3 pl-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      r.demand === 'Extreme' ? 'bg-[var(--score-low)]/10 text-[var(--score-low)]' :
                      r.demand === 'Very High' ? 'bg-[var(--score-high)]/10 text-[var(--score-high)]' :
                      'bg-[var(--accent-muted)] text-[var(--accent)]'
                    }`}>
                      {r.demand}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StatCard>

      {/* Rent vs Buy Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Should You Rent or Sell?" delay={0.25}>
          <div className="space-y-4">
            <div className="p-4 rounded-[10px] bg-[var(--bg-elevated)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold text-[var(--text-primary)]">Hold as Rental</span>
                <span className="text-[14px] font-bold text-[var(--score-high)]">Recommended</span>
              </div>
              <p className="text-[12px] text-[var(--text-muted)] mb-3">
                With vacancy rates under 3% and rent growth at 6.1% YoY, holding properties as rentals provides strong passive income with appreciating asset value.
              </p>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="text-[var(--text-secondary)]">10yr projected return: <b className="text-[var(--score-high)]">187%</b></span>
                <span className="text-[var(--text-secondary)]">Monthly cash flow: <b className="text-[var(--score-high)]">$1,850+</b></span>
              </div>
            </div>
            <div className="p-4 rounded-[10px] bg-[var(--bg-elevated)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold text-[var(--text-primary)]">Sell Now</span>
                <span className="text-[14px] font-bold text-[var(--text-muted)]">Consider</span>
              </div>
              <p className="text-[12px] text-[var(--text-muted)] mb-3">
                Near peak pricing with 8.2% YoY appreciation. If you need liquidity or want to reallocate to higher-yield markets, selling captures current gains.
              </p>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="text-[var(--text-secondary)]">Net proceeds: <b>$1.15M+</b></span>
                <span className="text-[var(--text-secondary)]">Tax impact: <b className="text-[var(--score-mid)]">$89K cap gains</b></span>
              </div>
            </div>
          </div>
        </StatCard>

        <StatCard title="Rent Growth Forecast" delay={0.3}>
          <div className="space-y-3">
            {[
              { year: '2026', low: 4.2, mid: 6.1, high: 8.5 },
              { year: '2027', low: 3.8, mid: 5.5, high: 7.8 },
              { year: '2028', low: 3.5, mid: 5.0, high: 7.2 },
              { year: '2029', low: 3.2, mid: 4.8, high: 6.9 },
              { year: '2030', low: 3.0, mid: 4.5, high: 6.5 },
            ].map((f) => (
              <div key={f.year} className="flex items-center gap-3">
                <span className="w-10 text-[12px] font-medium text-[var(--text-muted)]">{f.year}</span>
                <div className="flex-1 relative h-5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.high * 10}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="absolute top-0 left-0 h-full rounded-full bg-[var(--score-high)]/20"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.mid * 10}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="absolute top-0 left-0 h-full rounded-full bg-[var(--accent)]/40"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.low * 10}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="absolute top-0 left-0 h-full rounded-full bg-[var(--accent)]"
                  />
                </div>
                <div className="flex items-center gap-2 text-[10px] min-w-[120px]">
                  <span className="text-[var(--accent)] font-semibold">{f.low}%</span>
                  <span className="text-[var(--text-muted)]">—</span>
                  <span className="text-[var(--score-high)] font-semibold">{f.high}%</span>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 mt-2 text-[10px] text-[var(--text-muted)]">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[var(--accent)]" /> Conservative</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[var(--accent)]/40" /> Base Case</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[var(--score-high)]/20" /> Optimistic</div>
            </div>
          </div>
        </StatCard>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB: AIRBNB METRICS
// ═══════════════════════════════════════════════════════════════════

function AirbnbTab() {
  return (
    <div className="space-y-6">
      {/* Airbnb KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPICard label="Avg Nightly Rate" value="$231" change={12.4} changeLabel="YoY" icon="🌙" delay={0.05} />
        <KPICard label="Avg Occupancy" value="73%" change={4.1} changeLabel="YoY" icon="📈" delay={0.1} />
        <KPICard label="Avg Monthly Rev" value="$5,075" change={18.2} changeLabel="YoY" icon="💵" delay={0.15} />
        <KPICard label="Avg Rating" value="4.65" changeLabel="out of 5.0" icon="⭐" delay={0.2} />
      </div>

      {/* Airbnb Performance Table */}
      <StatCard title="Short-Term Rental Performance by Neighborhood" delay={0.15}>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-[var(--text-muted)] border-b border-[var(--border)]">
                <th className="text-left py-2 pr-4 font-medium">Neighborhood</th>
                <th className="text-right py-2 px-3 font-medium">Avg Nightly</th>
                <th className="text-right py-2 px-3 font-medium">Occupancy</th>
                <th className="text-right py-2 px-3 font-medium">Monthly Rev</th>
                <th className="text-right py-2 px-3 font-medium">RevPAR</th>
                <th className="text-right py-2 px-3 font-medium">Seasonality</th>
                <th className="text-right py-2 pl-3 font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {AIRBNB_METRICS.map((a) => (
                <tr key={a.neighborhood} className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-elevated)] transition-colors">
                  <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">{a.neighborhood}</td>
                  <td className="text-right py-3 px-3 text-[var(--text-primary)] font-semibold">${a.avgNightly}</td>
                  <td className="text-right py-3 px-3">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${a.occupancy}%` }} />
                      </div>
                      <span className="text-[var(--text-secondary)]">{a.occupancy}%</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-3 font-semibold text-[var(--score-high)]">${a.monthlyRev.toLocaleString()}</td>
                  <td className="text-right py-3 px-3 text-[var(--text-secondary)]">${a.revPAR}</td>
                  <td className="text-right py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      a.seasonality === 'Low' ? 'bg-[var(--score-high)]/10 text-[var(--score-high)]' :
                      a.seasonality === 'Medium' ? 'bg-[var(--score-mid)]/10 text-[var(--score-mid)]' :
                      'bg-[var(--score-low)]/10 text-[var(--score-low)]'
                    }`}>
                      {a.seasonality}
                    </span>
                  </td>
                  <td className="text-right py-3 pl-3 text-[var(--text-secondary)]">{a.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StatCard>

      {/* Airbnb vs Long-Term */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Airbnb vs Long-Term Rental" delay={0.25}>
          <div className="space-y-4">
            {[
              { location: 'Wynwood, Miami', airbnb: 5738, longTerm: 3800, winner: 'Airbnb', diff: '+51%' },
              { location: 'South Beach, Miami', airbnb: 7679, longTerm: 4200, winner: 'Airbnb', diff: '+83%' },
              { location: 'East Nashville', airbnb: 4027, longTerm: 2600, winner: 'Airbnb', diff: '+55%' },
              { location: 'SoMa, SF', airbnb: 5610, longTerm: 5800, winner: 'Long-Term', diff: '-3%' },
              { location: 'Woodbury, Irvine', airbnb: 3683, longTerm: 4200, winner: 'Long-Term', diff: '-12%' },
            ].map((comp) => (
              <div key={comp.location} className="flex items-center gap-3">
                <span className="text-[11px] text-[var(--text-secondary)] w-32 flex-shrink-0">{comp.location}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-4 bg-[var(--bg-elevated)] rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-[var(--accent)] rounded-l-full"
                      style={{ width: `${(comp.airbnb / (comp.airbnb + comp.longTerm)) * 100}%` }}
                    />
                    <div
                      className="h-full bg-[var(--score-high)] rounded-r-full"
                      style={{ width: `${(comp.longTerm / (comp.airbnb + comp.longTerm)) * 100}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-semibold min-w-[40px] text-right ${comp.winner === 'Airbnb' ? 'text-[var(--accent)]' : 'text-[var(--score-high)]'}`}>
                    {comp.diff}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 mt-2 text-[10px] text-[var(--text-muted)]">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[var(--accent)]" /> Airbnb</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[var(--score-high)]" /> Long-Term</div>
            </div>
          </div>
        </StatCard>

        <StatCard title="Seasonality Impact" delay={0.3}>
          <div className="space-y-3">
            {[
              { month: 'Jan', rev: 65 }, { month: 'Feb', rev: 70 }, { month: 'Mar', rev: 85 },
              { month: 'Apr', rev: 82 }, { month: 'May', rev: 78 }, { month: 'Jun', rev: 92 },
              { month: 'Jul', rev: 100 }, { month: 'Aug', rev: 95 }, { month: 'Sep', rev: 80 },
              { month: 'Oct', rev: 88 }, { month: 'Nov', rev: 75 }, { month: 'Dec', rev: 90 },
            ].map((m) => (
              <div key={m.month} className="flex items-center gap-2">
                <span className="w-7 text-[10px] text-[var(--text-muted)]">{m.month}</span>
                <div className="flex-1 h-3 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.rev}%` }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: m.rev >= 90 ? 'var(--score-high)' : m.rev >= 75 ? 'var(--accent)' : 'var(--score-mid)'
                    }}
                  />
                </div>
                <span className="text-[10px] text-[var(--text-secondary)] w-8 text-right">{m.rev}%</span>
              </div>
            ))}
          </div>
        </StatCard>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TAB: AI INSIGHTS
// ═══════════════════════════════════════════════════════════════════

function AIInsightsTab() {
  return (
    <div className="space-y-6">
      {/* AI Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-[14px] bg-gradient-to-r from-[var(--accent)]/10 via-[var(--accent)]/5 to-transparent border border-[var(--accent)]/20"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[var(--text-primary)] mb-1">AI Investment Advisor</h2>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
              Our AI analyzes 50+ market indicators across demographic trends, permit activity, employment data, transit infrastructure,
              and historical returns to identify the highest-potential investment opportunities in real-time.
            </p>
          </div>
        </div>
      </motion.div>

      {/* AI Insight Cards */}
      <div className="space-y-4">
        {AI_INSIGHTS.map((insight, i) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.12, duration: 0.4 }}
            className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden hover:border-[var(--border-active)] transition-colors"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <span className="text-[24px]">{insight.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">{insight.title}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        insight.urgency === 'High' ? 'bg-[var(--score-low)]/10 text-[var(--score-low)]' :
                        insight.urgency === 'Medium' ? 'bg-[var(--score-mid)]/10 text-[var(--score-mid)]' :
                        'bg-[var(--accent-muted)] text-[var(--accent)]'
                      }`}>
                        {insight.urgency} Priority
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)]">{insight.category}</span>
                  </div>
                </div>
              </div>

              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-4 pl-9">
                {insight.insight}
              </p>

              <div className="flex items-center gap-3 pl-9">
                {insight.metrics.map((m) => (
                  <div key={m.label} className="px-3 py-2 rounded-[8px] bg-[var(--bg-elevated)]">
                    <div className="text-[13px] font-bold text-[var(--text-primary)]">{m.value}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="p-4 rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] text-center"
      >
        <p className="text-[11px] text-[var(--text-muted)]">
          AI suggestions are based on historical data and market models. They are not financial advice. Always consult with a licensed real estate professional before making investment decisions. Past performance does not guarantee future results.
        </p>
      </motion.div>
    </div>
  )
}
