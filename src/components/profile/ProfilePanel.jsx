import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import { computeProfile } from '../../utils/profileComputer'
import ShareableProfileCard from './ShareableProfileCard'

const LIFESTYLE_COLORS = {
  'Family-Oriented': 'var(--score-high)',
  'Young Professional': 'var(--accent)',
  'Eco-Conscious': 'var(--color-sustainability, var(--score-high))',
  'Investor': 'var(--score-mid)',
  'Explorer': 'var(--accent)',
}

function ProfilePanelInner() {
  const toggleProfile = useStore((s) => s.toggleProfile)
  const priorities = useStore((s) => s.priorities)
  const interests = useStore((s) => s.interests)
  const viewedNeighborhoods = useStore((s) => s.viewedNeighborhoods)
  const budgetRange = useStore((s) => s.budgetRange)
  const favorites = useStore((s) => s.favorites)
  const chatHistory = useStore((s) => s.chatHistory)

  const [showShare, setShowShare] = useState(false)
  const panelRef = useRef(null)

  const profile = computeProfile({
    priorities, interests, viewedNeighborhoods, budgetRange, favorites, chatHistory,
  })

  const handleFocusTrap = useCallback((e) => {
    if (e.key !== 'Tab' || !panelRef.current) return
    const focusable = panelRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') toggleProfile()
      handleFocusTrap(e)
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [toggleProfile, handleFocusTrap])

  const lifestyleColor = LIFESTYLE_COLORS[profile.lifestyleType] || 'var(--accent)'

  return (
    <motion.div
      key="profile-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end"
      onClick={toggleProfile}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-panel-title"
    >
      <div className="absolute inset-0 bg-black/40" />

      <motion.div
        ref={panelRef}
        tabIndex={-1}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-md bg-[var(--bg-surface)] border-l border-[var(--border)] overflow-y-auto outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[var(--bg-surface)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
          <h3 id="profile-panel-title" className="text-[15px] font-semibold">Your Profile</h3>
          <button
            onClick={toggleProfile}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
            aria-label="Close profile panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Strength */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)]">
                Profile Strength
              </span>
              <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                {profile.profileStrength}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profile.profileStrength}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: profile.profileStrength >= 80 ? 'var(--score-high)' : profile.profileStrength >= 40 ? 'var(--accent)' : 'var(--score-mid)' }}
              />
            </div>
            {profile.profileStrength < 60 && (
              <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
                Explore more neighborhoods, set priorities, and use the AI advisor to strengthen your profile.
              </p>
            )}
          </div>

          {/* Lifestyle Type */}
          <div className="flex justify-center">
            <div
              className="px-5 py-2.5 rounded-full text-[14px] font-semibold border"
              style={{
                color: lifestyleColor,
                borderColor: lifestyleColor,
                background: `color-mix(in srgb, ${lifestyleColor} 10%, transparent)`,
              }}
            >
              {profile.lifestyleType}
            </div>
          </div>

          {/* Budget Tier */}
          {profile.budgetTier && (
            <div className="flex justify-center">
              <span className="px-3 py-1.5 rounded-[6px] text-[12px] font-medium bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]">
                Budget: {profile.budgetTier}
              </span>
            </div>
          )}

          {/* Search Intent */}
          <div className="flex justify-center">
            <span className="text-[12px] text-[var(--text-muted)]">
              Intent: <span className="font-medium text-[var(--text-secondary)] capitalize">{profile.searchIntent}</span>
            </span>
          </div>

          {/* Priorities */}
          {profile.prioritySummary.length > 0 && (
            <div>
              <h4 className="text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)] mb-2">
                Your Priorities
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.prioritySummary.map((label) => (
                  <span
                    key={label}
                    className="px-3 py-1.5 text-[12px] rounded-[6px] border border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)] font-medium"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {profile.topInterests.length > 0 && (
            <div>
              <h4 className="text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)] mb-2">
                Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.topInterests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1.5 text-[12px] rounded-[6px] border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Most Viewed Neighborhoods */}
          {profile.topNeighborhoods.length > 0 && (
            <div>
              <h4 className="text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)] mb-2">
                Most Viewed
              </h4>
              <div className="space-y-2">
                {profile.topNeighborhoods.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between py-2 px-3 bg-[var(--bg-elevated)] rounded-[6px]"
                  >
                    <span className="text-[13px] text-[var(--text-primary)]">{n.name}</span>
                    <span className="text-[12px] text-[var(--text-muted)]">
                      {n.count} {n.count === 1 ? 'view' : 'views'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Traits */}
          {profile.traits.length > 0 && (
            <div>
              <h4 className="text-[12px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)] mb-2">
                Traits
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.traits.map((trait) => (
                  <span
                    key={trait.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                  >
                    <span aria-hidden="true">{trait.icon}</span>
                    {trait.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Button */}
          <button
            onClick={() => setShowShare(true)}
            className="w-full py-3 rounded-[8px] text-[13px] font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            Share Profile
          </button>

          {/* Shareable Card Modal */}
          <AnimatePresence>
            {showShare && (
              <ShareableProfileCard
                profile={profile}
                onClose={() => setShowShare(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ProfilePanel() {
  const profileOpen = useStore((s) => s.profileOpen)

  return (
    <AnimatePresence>
      {profileOpen && <ProfilePanelInner />}
    </AnimatePresence>
  )
}
