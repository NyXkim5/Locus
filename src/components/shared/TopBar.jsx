import { useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'

export default function TopBar({ title, showBack = false }) {
  const navigate = useNavigate()
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const toggleProfile = useStore((s) => s.toggleProfile)

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

      <div className="flex items-center gap-2">
        <button
          onClick={toggleProfile}
          aria-label="View profile"
          className="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-active)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
        <button
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-active)] transition-colors"
        >
        {theme === 'light' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        )}
        </button>
      </div>
    </nav>
  )
}
