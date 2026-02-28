import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import InputPage from './pages/InputPage'
import NeighborhoodPage from './pages/NeighborhoodPage'
import ComparePage from './pages/ComparePage'
import ChallengePanel from './components/challenge/ChallengePanel'

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

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <Routes>
          <Route path="/" element={<InputPage />} />
          <Route path="/neighborhood/:id" element={<NeighborhoodPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChallengePanel />
      </div>
    </BrowserRouter>
  )
}

export default App
