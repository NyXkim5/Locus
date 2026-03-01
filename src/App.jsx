import { Component } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import InputPage from './pages/InputPage'
import NeighborhoodPage from './pages/NeighborhoodPage'
import ComparePage from './pages/ComparePage'
import ChallengePanel from './components/challenge/ChallengePanel'
import ProfilePanel from './components/profile/ProfilePanel'
import InsightsPage from './pages/InsightsPage'
import useStore from './store/useStore'

// ── Error Boundary ──
class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[LOCUS ErrorBoundary]', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--bg-base)] text-[var(--text-primary)]">
          <div className="w-12 h-12 rounded-full bg-[var(--score-low)]/10 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--score-low)" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h1 className="text-[20px] font-semibold">Something went wrong</h1>
          <p className="text-[14px] text-[var(--text-muted)] max-w-sm text-center">
            An unexpected error occurred. Please try going back to the home page.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.href = '/' }}
            className="px-4 py-2 bg-[var(--accent)] text-white text-[13px] font-medium rounded-[6px] hover:bg-[var(--accent-hover)] transition-colors"
          >
            Back to home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Scroll to top on route change ──
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// ── Animated Routes ──
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-screen"
      >
        <Routes location={location}>
          <Route path="/" element={<InputPage />} />
          <Route path="/neighborhood/:id" element={<NeighborhoodPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">Page not found</h1>
      <p className="text-[14px] text-[var(--text-muted)]">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-[var(--accent)] text-white text-[13px] font-medium rounded-[6px] hover:bg-[var(--accent-hover)] transition-colors"
      >
        Back to home
      </Link>
    </div>
  )
}

function Toast() {
  const toast = useStore((s) => s.toast)
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 z-[60] px-4 py-2.5 rounded-[8px] bg-[var(--text-primary)] text-[var(--bg-base)] text-[13px] font-medium shadow-lg pointer-events-none"
          role="status"
          aria-live="polite"
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
          <AnimatedRoutes />
          <ChallengePanel />
          <ProfilePanel />
          <Toast />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
