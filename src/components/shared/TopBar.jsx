import { useNavigate } from 'react-router-dom'

export default function TopBar({ title, showBack = false }) {
  const navigate = useNavigate()

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]" aria-label="Navigation">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm flex items-center gap-1"
            aria-label="Go back"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <h1 className="text-[15px] font-semibold">{title}</h1>
      </div>
    </nav>
  )
}
