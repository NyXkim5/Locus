import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import InputPage from './pages/InputPage'
import NeighborhoodPage from './pages/NeighborhoodPage'
import ComparePage from './pages/ComparePage'
import ChallengePanel from './components/challenge/ChallengePanel'

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-[20px] font-semibold text-[#F4F4F5]">Page not found</h1>
      <p className="text-[14px] text-[#71717A]">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-[#6366F1] text-white text-[13px] font-medium rounded-[6px] hover:bg-[#818CF8] transition-colors"
      >
        Back to home
      </Link>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0C0C0E] text-[#F4F4F5]" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
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
