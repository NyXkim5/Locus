export default function ConfidenceShield({ confidence }) {
  return (
    <div
      className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]"
      aria-label={`AI confidence: ${confidence}%`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <span>{confidence}%</span>
    </div>
  )
}
