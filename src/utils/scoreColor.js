// Returns CSS variable references for theme consistency.
// Falls back to hex for contexts that need raw values (e.g. canvas, SVG data URIs).
export function getScoreColor(score) {
  if (score >= 70) return 'var(--score-high, #16A34A)'
  if (score >= 40) return 'var(--score-mid, #D97706)'
  return 'var(--score-low, #DC2626)'
}

// Raw hex version for contexts where CSS vars don't work (SVG data URIs, canvas)
export function getScoreColorHex(score) {
  if (score >= 70) return '#16A34A'
  if (score >= 40) return '#D97706'
  return '#DC2626'
}
