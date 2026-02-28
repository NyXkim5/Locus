# LOCUS — Neighborhood Intelligence, Debiased

## Design Document

### What We're Building
A client-side React app that presents neighborhood data with cognitive debiasing tools. No backend, no API keys, mock data for 4 demo neighborhoods.

### Stack
- React 18 + Vite
- Tailwind CSS + CSS custom properties
- Framer Motion (animations)
- Zustand (state management)
- No backend, no external APIs

### Screens
1. **Input Page** — centered search filtering 4 neighborhoods, suggestion pills
2. **Neighborhood Overview** — map placeholder + overall score + 4 category cards
3. **Expanded Category** — factor rows with score bars, confidence, framed descriptions
4. **Challenge Panel** — slide-in with source breakdown, user input, recalculate
5. **Comparison View** — side-by-side, shared framing toggle

### Core Interactions
- Framing toggle (neutral/positive/negative) with crossfade
- Category expand/collapse with spring physics
- Score count-up animation
- Challenge recalculation (adjust AI-estimated weights)
- Full hover/active/focus states

### Design System
- Dark theme, warm undertone (#0C0C0E background)
- Inter font, 4-level type scale
- Traffic-light score colors (emerald/amber/red)
- Indigo accent (#6366F1)
- 4px spacing unit

### Data
- 4 hardcoded neighborhoods: Irvine, Santa Monica, Pasadena, West Hollywood
- Each with 4 categories, 3-5 factors per category
- Each factor: score, confidence, 2-3 sources, 3 framing variants

### Not Building
- Mapbox GL (static map placeholder instead)
- 3rd comparison slot
- Anti-anchoring randomization
- Comparison friction modal
- User accounts/auth
- Backend/API integrations
