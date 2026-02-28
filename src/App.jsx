import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InputPage from './pages/InputPage'
import NeighborhoodPage from './pages/NeighborhoodPage'
import ComparePage from './pages/ComparePage'
import ChallengePanel from './components/challenge/ChallengePanel'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0C0C0E] text-[#F4F4F5]" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <Routes>
          <Route path="/" element={<InputPage />} />
          <Route path="/neighborhood/:id" element={<NeighborhoodPage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Routes>
        <ChallengePanel />
      </div>
    </BrowserRouter>
  )
}

export default App
