import { useNavigate } from 'react-router-dom'

export default function TopBar({ title, showBack = false }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2E]">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate('/')}
            className="text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors text-sm flex items-center gap-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <h1 className="text-[15px] font-semibold">{title}</h1>
      </div>
    </div>
  )
}
