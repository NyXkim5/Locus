# LOCUS Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete client-side React app that presents neighborhood data with cognitive debiasing tools (framing toggle, challengeable AI scores, source transparency).

**Architecture:** Single-page React app with client-side routing (react-router-dom). All data is hardcoded JSON. Zustand manages global state (framing mode, selected neighborhoods, expanded categories, challenge state). Framer Motion handles all animations. No backend, no API keys.

**Tech Stack:** React 18, Vite, Tailwind CSS v3, Zustand, Framer Motion, react-router-dom

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`

**Step 1: Initialize Vite project**

```bash
cd /Users/jay/locus
npm create vite@latest . -- --template react
```

If it asks to overwrite, allow it (only docs/ exists).

**Step 2: Install dependencies**

```bash
npm install zustand framer-motion react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

**Step 3: Configure Tailwind**

Replace `src/index.css` with:

```css
@import "tailwindcss";
```

Update `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**Step 4: Set up minimal App**

`src/App.jsx`:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0C0C0E] text-[#F4F4F5]">
        <Routes>
          <Route path="/" element={<div>Input Page</div>} />
          <Route path="/neighborhood/:id" element={<div>Neighborhood</div>} />
          <Route path="/compare" element={<div>Compare</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
```

**Step 5: Verify it runs**

```bash
npm run dev
```

Expected: App runs on localhost, shows "Input Page" on dark background.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React + Tailwind + routing"
```

---

## Task 2: Design System + Global Styles

**Files:**
- Create: `src/styles/globals.css`
- Modify: `src/index.css`
- Modify: `tailwind.config.js`

**Step 1: Create globals.css with CSS custom properties**

`src/styles/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  /* Backgrounds */
  --bg-base: #0C0C0E;
  --bg-surface: #161618;
  --bg-elevated: #1C1C1F;
  --border: #2A2A2E;
  --border-active: #3A3A40;

  /* Text */
  --text-primary: #F4F4F5;
  --text-secondary: #A1A1AA;
  --text-muted: #71717A;

  /* Accent */
  --accent: #6366F1;
  --accent-hover: #818CF8;
  --accent-muted: rgba(99, 102, 241, 0.12);

  /* Scores */
  --score-high: #34D399;
  --score-mid: #FBBF24;
  --score-low: #F87171;

  /* Framing tints */
  --frame-positive: rgba(52, 211, 153, 0.19);
  --frame-negative: rgba(248, 113, 113, 0.19);
  --frame-neutral: transparent;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--bg-base);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}
```

**Step 2: Update index.css to import globals**

`src/index.css`:
```css
@import "tailwindcss";
@import "./styles/globals.css";
```

**Step 3: Configure Tailwind with design tokens**

`tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0C0C0E',
        surface: '#161618',
        elevated: '#1C1C1F',
        border: '#2A2A2E',
        'border-active': '#3A3A40',
        'text-primary': '#F4F4F5',
        'text-secondary': '#A1A1AA',
        'text-muted': '#71717A',
        accent: '#6366F1',
        'accent-hover': '#818CF8',
        'score-high': '#34D399',
        'score-mid': '#FBBF24',
        'score-low': '#F87171',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
    },
  },
  plugins: [],
}
```

**Step 4: Verify styles load**

```bash
npm run dev
```

Expected: Dark background, Inter font visible.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: design system with CSS custom properties and Tailwind config"
```

---

## Task 3: Mock Data

**Files:**
- Create: `src/data/neighborhoods.js`

**Step 1: Create the complete mock data file**

This is the largest single file. It contains all 4 neighborhoods with full factor data, framing variants, sources, and confidence levels. Every factor needs:
- `name`: string
- `score`: 0-100
- `confidence`: 0-100
- `sources`: array of `{ name, weight, value, type: "measured"|"estimated" }`
- `frames`: `{ neutral, positive, negative }` — three string descriptions of the same data

`src/data/neighborhoods.js`:
```js
export const neighborhoods = [
  {
    id: "irvine",
    name: "Irvine, CA",
    coordinates: { lat: 33.6846, lng: -117.8265 },
    overallScore: 78,
    categories: {
      livability: {
        label: "Livability",
        score: 82,
        factors: [
          {
            name: "Walk Score",
            score: 78,
            confidence: 73,
            sources: [
              { name: "Walk Score API", weight: 0.4, value: 81, type: "measured" },
              { name: "Google Places density", weight: 0.3, value: 74, type: "measured" },
              { name: "AI review analysis", weight: 0.3, value: 76, type: "estimated" }
            ],
            frames: {
              neutral: "Walk Score: 78",
              positive: "More walkable than 78% of neighborhoods",
              negative: "Falls behind 22% of comparable neighborhoods in walkability"
            }
          },
          {
            name: "Transit Access",
            score: 54,
            confidence: 82,
            sources: [
              { name: "Transit Score API", weight: 0.5, value: 52, type: "measured" },
              { name: "Route frequency data", weight: 0.3, value: 58, type: "measured" },
              { name: "AI commute analysis", weight: 0.2, value: 53, type: "estimated" }
            ],
            frames: {
              neutral: "Transit Score: 54",
              positive: "Better transit access than 54% of suburban areas",
              negative: "Below average transit compared to 46% of metro neighborhoods"
            }
          },
          {
            name: "Grocery Access",
            score: 85,
            confidence: 88,
            sources: [
              { name: "Google Places grocery count", weight: 0.5, value: 87, type: "measured" },
              { name: "Distance to nearest store", weight: 0.3, value: 82, type: "measured" },
              { name: "AI variety analysis", weight: 0.2, value: 84, type: "estimated" }
            ],
            frames: {
              neutral: "Grocery Access: 85",
              positive: "More grocery options than 85% of neighborhoods",
              negative: "15% of neighborhoods have better grocery access"
            }
          },
          {
            name: "Park Proximity",
            score: 91,
            confidence: 92,
            sources: [
              { name: "Parks database", weight: 0.5, value: 93, type: "measured" },
              { name: "Acreage per capita", weight: 0.3, value: 89, type: "measured" },
              { name: "AI quality assessment", weight: 0.2, value: 88, type: "estimated" }
            ],
            frames: {
              neutral: "Park Proximity: 91",
              positive: "Closer to parks than 91% of neighborhoods",
              negative: "9% of neighborhoods offer better park access"
            }
          }
        ]
      },
      safety: {
        label: "Safety & Stability",
        score: 74,
        factors: [
          {
            name: "Crime Rate",
            score: 81,
            confidence: 85,
            sources: [
              { name: "FBI UCR database", weight: 0.5, value: 83, type: "measured" },
              { name: "Local PD reports", weight: 0.3, value: 79, type: "measured" },
              { name: "AI trend analysis", weight: 0.2, value: 78, type: "estimated" }
            ],
            frames: {
              neutral: "Crime Rate Score: 81",
              positive: "Safer than 81% of comparable neighborhoods",
              negative: "19% of neighborhoods report lower crime rates"
            }
          },
          {
            name: "Emergency Response",
            score: 72,
            confidence: 78,
            sources: [
              { name: "Response time data", weight: 0.5, value: 74, type: "measured" },
              { name: "Station proximity", weight: 0.3, value: 71, type: "measured" },
              { name: "AI capacity analysis", weight: 0.2, value: 68, type: "estimated" }
            ],
            frames: {
              neutral: "Emergency Response: 72",
              positive: "Faster emergency response than 72% of areas",
              negative: "28% of areas have faster emergency response times"
            }
          },
          {
            name: "Natural Disaster Risk",
            score: 62,
            confidence: 70,
            sources: [
              { name: "FEMA flood maps", weight: 0.4, value: 68, type: "measured" },
              { name: "Seismic data", weight: 0.3, value: 55, type: "measured" },
              { name: "AI climate projection", weight: 0.3, value: 60, type: "estimated" }
            ],
            frames: {
              neutral: "Disaster Risk Score: 62",
              positive: "Lower disaster risk than 62% of CA neighborhoods",
              negative: "38% of CA neighborhoods face lower disaster risk"
            }
          },
          {
            name: "Insurance Cost",
            score: 68,
            confidence: 75,
            sources: [
              { name: "Insurance rate index", weight: 0.5, value: 70, type: "measured" },
              { name: "Claims history", weight: 0.3, value: 65, type: "measured" },
              { name: "AI risk estimate", weight: 0.2, value: 66, type: "estimated" }
            ],
            frames: {
              neutral: "Insurance Cost Score: 68",
              positive: "Lower insurance costs than 68% of areas",
              negative: "32% of areas enjoy lower insurance premiums"
            }
          }
        ]
      },
      community: {
        label: "Community",
        score: 81,
        factors: [
          {
            name: "Family Friendliness",
            score: 92,
            confidence: 86,
            sources: [
              { name: "School ratings aggregate", weight: 0.4, value: 94, type: "measured" },
              { name: "Family household ratio", weight: 0.3, value: 90, type: "measured" },
              { name: "AI family review analysis", weight: 0.3, value: 91, type: "estimated" }
            ],
            frames: {
              neutral: "Family Friendliness: 92",
              positive: "More family-friendly than 92% of neighborhoods",
              negative: "8% of neighborhoods rank higher for families"
            }
          },
          {
            name: "Owner vs Renter",
            score: 74,
            confidence: 90,
            sources: [
              { name: "Census ownership data", weight: 0.6, value: 75, type: "measured" },
              { name: "Rental listing density", weight: 0.2, value: 72, type: "measured" },
              { name: "AI stability estimate", weight: 0.2, value: 73, type: "estimated" }
            ],
            frames: {
              neutral: "Owner-Renter Balance: 74",
              positive: "Higher ownership rate than 74% of neighborhoods",
              negative: "26% of neighborhoods have more stable ownership ratios"
            }
          },
          {
            name: "Local Business Density",
            score: 71,
            confidence: 80,
            sources: [
              { name: "Business license database", weight: 0.5, value: 73, type: "measured" },
              { name: "Yelp/Google listing count", weight: 0.3, value: 70, type: "measured" },
              { name: "AI vitality estimate", weight: 0.2, value: 67, type: "estimated" }
            ],
            frames: {
              neutral: "Local Business Density: 71",
              positive: "More local businesses than 71% of neighborhoods",
              negative: "29% of neighborhoods have a denser local business scene"
            }
          },
          {
            name: "Community Events",
            score: 77,
            confidence: 62,
            sources: [
              { name: "Event calendar scrape", weight: 0.4, value: 79, type: "measured" },
              { name: "AI activity analysis", weight: 0.6, value: 76, type: "estimated" }
            ],
            frames: {
              neutral: "Community Events: 77",
              positive: "More community events than 77% of neighborhoods",
              negative: "23% of neighborhoods host more community events"
            }
          }
        ]
      },
      growth: {
        label: "Growth",
        score: 69,
        factors: [
          {
            name: "Permit Activity",
            score: 65,
            confidence: 82,
            sources: [
              { name: "City permit database", weight: 0.5, value: 67, type: "measured" },
              { name: "Construction tracking", weight: 0.3, value: 63, type: "measured" },
              { name: "AI development estimate", weight: 0.2, value: 62, type: "estimated" }
            ],
            frames: {
              neutral: "Permit Activity: 65",
              positive: "More development activity than 65% of areas",
              negative: "35% of areas are developing faster"
            }
          },
          {
            name: "Business Growth",
            score: 61,
            confidence: 72,
            sources: [
              { name: "New business filings", weight: 0.4, value: 63, type: "measured" },
              { name: "Closure rate data", weight: 0.3, value: 58, type: "measured" },
              { name: "AI economic analysis", weight: 0.3, value: 61, type: "estimated" }
            ],
            frames: {
              neutral: "Business Growth: 61",
              positive: "Stronger business growth than 61% of neighborhoods",
              negative: "39% of neighborhoods show stronger business growth"
            }
          },
          {
            name: "School Enrollment Trend",
            score: 78,
            confidence: 84,
            sources: [
              { name: "District enrollment data", weight: 0.5, value: 80, type: "measured" },
              { name: "New school construction", weight: 0.3, value: 76, type: "measured" },
              { name: "AI demographic forecast", weight: 0.2, value: 74, type: "estimated" }
            ],
            frames: {
              neutral: "School Enrollment Trend: 78",
              positive: "Growing school enrollment vs 78% of districts",
              negative: "22% of districts show stronger enrollment growth"
            }
          },
          {
            name: "Property Value Trajectory",
            score: 72,
            confidence: 76,
            sources: [
              { name: "MLS historical data", weight: 0.4, value: 74, type: "measured" },
              { name: "Tax assessment trends", weight: 0.3, value: 71, type: "measured" },
              { name: "AI appreciation forecast", weight: 0.3, value: 69, type: "estimated" }
            ],
            frames: {
              neutral: "Value Trajectory: 72",
              positive: "Stronger value trajectory than 72% of neighborhoods",
              negative: "28% of neighborhoods show stronger appreciation"
            }
          }
        ]
      }
    }
  },
  {
    id: "santa-monica",
    name: "Santa Monica, CA",
    coordinates: { lat: 34.0195, lng: -118.4912 },
    overallScore: 84,
    categories: {
      livability: {
        label: "Livability",
        score: 91,
        factors: [
          {
            name: "Walk Score",
            score: 88,
            confidence: 90,
            sources: [
              { name: "Walk Score API", weight: 0.4, value: 90, type: "measured" },
              { name: "Google Places density", weight: 0.3, value: 87, type: "measured" },
              { name: "AI review analysis", weight: 0.3, value: 85, type: "estimated" }
            ],
            frames: {
              neutral: "Walk Score: 88",
              positive: "More walkable than 88% of neighborhoods",
              negative: "Falls behind 12% of comparable neighborhoods in walkability"
            }
          },
          {
            name: "Transit Access",
            score: 82,
            confidence: 85,
            sources: [
              { name: "Transit Score API", weight: 0.5, value: 84, type: "measured" },
              { name: "Route frequency data", weight: 0.3, value: 80, type: "measured" },
              { name: "AI commute analysis", weight: 0.2, value: 79, type: "estimated" }
            ],
            frames: {
              neutral: "Transit Score: 82",
              positive: "Better transit access than 82% of areas",
              negative: "18% of areas have superior transit options"
            }
          },
          {
            name: "Grocery Access",
            score: 93,
            confidence: 91,
            sources: [
              { name: "Google Places grocery count", weight: 0.5, value: 95, type: "measured" },
              { name: "Distance to nearest store", weight: 0.3, value: 91, type: "measured" },
              { name: "AI variety analysis", weight: 0.2, value: 90, type: "estimated" }
            ],
            frames: {
              neutral: "Grocery Access: 93",
              positive: "More grocery options than 93% of neighborhoods",
              negative: "7% of neighborhoods offer even better grocery access"
            }
          },
          {
            name: "Beach & Recreation",
            score: 96,
            confidence: 95,
            sources: [
              { name: "Recreation facility count", weight: 0.5, value: 97, type: "measured" },
              { name: "Beach proximity", weight: 0.3, value: 98, type: "measured" },
              { name: "AI lifestyle analysis", weight: 0.2, value: 91, type: "estimated" }
            ],
            frames: {
              neutral: "Beach & Recreation: 96",
              positive: "Better recreation access than 96% of neighborhoods",
              negative: "4% of neighborhoods offer better recreational options"
            }
          }
        ]
      },
      safety: {
        label: "Safety & Stability",
        score: 68,
        factors: [
          {
            name: "Crime Rate",
            score: 58,
            confidence: 82,
            sources: [
              { name: "FBI UCR database", weight: 0.5, value: 56, type: "measured" },
              { name: "Local PD reports", weight: 0.3, value: 61, type: "measured" },
              { name: "AI trend analysis", weight: 0.2, value: 58, type: "estimated" }
            ],
            frames: {
              neutral: "Crime Rate Score: 58",
              positive: "Safer than 58% of urban neighborhoods",
              negative: "42% of comparable neighborhoods report lower crime"
            }
          },
          {
            name: "Emergency Response",
            score: 79,
            confidence: 80,
            sources: [
              { name: "Response time data", weight: 0.5, value: 81, type: "measured" },
              { name: "Station proximity", weight: 0.3, value: 78, type: "measured" },
              { name: "AI capacity analysis", weight: 0.2, value: 75, type: "estimated" }
            ],
            frames: {
              neutral: "Emergency Response: 79",
              positive: "Faster emergency response than 79% of areas",
              negative: "21% of areas respond to emergencies faster"
            }
          },
          {
            name: "Natural Disaster Risk",
            score: 55,
            confidence: 72,
            sources: [
              { name: "FEMA flood maps", weight: 0.4, value: 50, type: "measured" },
              { name: "Seismic data", weight: 0.3, value: 52, type: "measured" },
              { name: "AI climate projection", weight: 0.3, value: 65, type: "estimated" }
            ],
            frames: {
              neutral: "Disaster Risk Score: 55",
              positive: "Lower disaster risk than 55% of coastal areas",
              negative: "45% of coastal areas face lower disaster risk"
            }
          },
          {
            name: "Insurance Cost",
            score: 48,
            confidence: 78,
            sources: [
              { name: "Insurance rate index", weight: 0.5, value: 45, type: "measured" },
              { name: "Claims history", weight: 0.3, value: 50, type: "measured" },
              { name: "AI risk estimate", weight: 0.2, value: 52, type: "estimated" }
            ],
            frames: {
              neutral: "Insurance Cost Score: 48",
              positive: "Lower insurance costs than 48% of coastal areas",
              negative: "52% of areas enjoy significantly lower insurance premiums"
            }
          }
        ]
      },
      community: {
        label: "Community",
        score: 79,
        factors: [
          {
            name: "Nightlife & Dining",
            score: 94,
            confidence: 88,
            sources: [
              { name: "Restaurant/bar density", weight: 0.5, value: 96, type: "measured" },
              { name: "Yelp rating aggregate", weight: 0.3, value: 92, type: "measured" },
              { name: "AI scene analysis", weight: 0.2, value: 91, type: "estimated" }
            ],
            frames: {
              neutral: "Nightlife & Dining: 94",
              positive: "Better dining scene than 94% of neighborhoods",
              negative: "6% of neighborhoods offer even more vibrant dining"
            }
          },
          {
            name: "Owner vs Renter",
            score: 42,
            confidence: 88,
            sources: [
              { name: "Census ownership data", weight: 0.6, value: 40, type: "measured" },
              { name: "Rental listing density", weight: 0.2, value: 44, type: "measured" },
              { name: "AI stability estimate", weight: 0.2, value: 45, type: "estimated" }
            ],
            frames: {
              neutral: "Owner-Renter Balance: 42",
              positive: "Higher renter diversity and housing flexibility",
              negative: "58% of neighborhoods have more stable ownership communities"
            }
          },
          {
            name: "Local Business Density",
            score: 89,
            confidence: 85,
            sources: [
              { name: "Business license database", weight: 0.5, value: 91, type: "measured" },
              { name: "Yelp/Google listing count", weight: 0.3, value: 88, type: "measured" },
              { name: "AI vitality estimate", weight: 0.2, value: 85, type: "estimated" }
            ],
            frames: {
              neutral: "Local Business Density: 89",
              positive: "More local businesses than 89% of neighborhoods",
              negative: "11% of neighborhoods have a denser business scene"
            }
          },
          {
            name: "Community Events",
            score: 86,
            confidence: 72,
            sources: [
              { name: "Event calendar scrape", weight: 0.4, value: 88, type: "measured" },
              { name: "AI activity analysis", weight: 0.6, value: 85, type: "estimated" }
            ],
            frames: {
              neutral: "Community Events: 86",
              positive: "More community events than 86% of neighborhoods",
              negative: "14% of neighborhoods host more community activities"
            }
          }
        ]
      },
      growth: {
        label: "Growth",
        score: 88,
        factors: [
          {
            name: "Permit Activity",
            score: 85,
            confidence: 80,
            sources: [
              { name: "City permit database", weight: 0.5, value: 87, type: "measured" },
              { name: "Construction tracking", weight: 0.3, value: 83, type: "measured" },
              { name: "AI development estimate", weight: 0.2, value: 82, type: "estimated" }
            ],
            frames: {
              neutral: "Permit Activity: 85",
              positive: "More development activity than 85% of areas",
              negative: "15% of areas are developing faster"
            }
          },
          {
            name: "Business Growth",
            score: 88,
            confidence: 77,
            sources: [
              { name: "New business filings", weight: 0.4, value: 90, type: "measured" },
              { name: "Closure rate data", weight: 0.3, value: 85, type: "measured" },
              { name: "AI economic analysis", weight: 0.3, value: 87, type: "estimated" }
            ],
            frames: {
              neutral: "Business Growth: 88",
              positive: "Stronger business growth than 88% of neighborhoods",
              negative: "12% of neighborhoods show stronger business momentum"
            }
          },
          {
            name: "School Enrollment Trend",
            score: 71,
            confidence: 74,
            sources: [
              { name: "District enrollment data", weight: 0.5, value: 73, type: "measured" },
              { name: "New school construction", weight: 0.3, value: 68, type: "measured" },
              { name: "AI demographic forecast", weight: 0.2, value: 70, type: "estimated" }
            ],
            frames: {
              neutral: "School Enrollment Trend: 71",
              positive: "Growing enrollment vs 71% of districts",
              negative: "29% of districts show stronger enrollment growth"
            }
          },
          {
            name: "Property Value Trajectory",
            score: 91,
            confidence: 82,
            sources: [
              { name: "MLS historical data", weight: 0.4, value: 93, type: "measured" },
              { name: "Tax assessment trends", weight: 0.3, value: 89, type: "measured" },
              { name: "AI appreciation forecast", weight: 0.3, value: 88, type: "estimated" }
            ],
            frames: {
              neutral: "Value Trajectory: 91",
              positive: "Stronger appreciation than 91% of neighborhoods",
              negative: "9% of neighborhoods appreciate faster"
            }
          }
        ]
      }
    }
  },
  {
    id: "pasadena",
    name: "Pasadena, CA",
    coordinates: { lat: 34.1478, lng: -118.1445 },
    overallScore: 76,
    categories: {
      livability: {
        label: "Livability",
        score: 79,
        factors: [
          {
            name: "Walk Score",
            score: 72,
            confidence: 80,
            sources: [
              { name: "Walk Score API", weight: 0.4, value: 74, type: "measured" },
              { name: "Google Places density", weight: 0.3, value: 70, type: "measured" },
              { name: "AI review analysis", weight: 0.3, value: 71, type: "estimated" }
            ],
            frames: {
              neutral: "Walk Score: 72",
              positive: "More walkable than 72% of neighborhoods",
              negative: "Falls behind 28% of neighborhoods in walkability"
            }
          },
          {
            name: "Transit Access",
            score: 74,
            confidence: 83,
            sources: [
              { name: "Transit Score API", weight: 0.5, value: 76, type: "measured" },
              { name: "Route frequency data", weight: 0.3, value: 72, type: "measured" },
              { name: "AI commute analysis", weight: 0.2, value: 71, type: "estimated" }
            ],
            frames: {
              neutral: "Transit Score: 74",
              positive: "Better transit than 74% of suburban neighborhoods",
              negative: "26% of neighborhoods offer better transit connections"
            }
          },
          {
            name: "Grocery Access",
            score: 80,
            confidence: 85,
            sources: [
              { name: "Google Places grocery count", weight: 0.5, value: 82, type: "measured" },
              { name: "Distance to nearest store", weight: 0.3, value: 78, type: "measured" },
              { name: "AI variety analysis", weight: 0.2, value: 79, type: "estimated" }
            ],
            frames: {
              neutral: "Grocery Access: 80",
              positive: "More grocery options than 80% of neighborhoods",
              negative: "20% of neighborhoods have better grocery access"
            }
          },
          {
            name: "Cultural Amenities",
            score: 88,
            confidence: 82,
            sources: [
              { name: "Museum/gallery count", weight: 0.4, value: 91, type: "measured" },
              { name: "Event venue density", weight: 0.3, value: 86, type: "measured" },
              { name: "AI cultural analysis", weight: 0.3, value: 85, type: "estimated" }
            ],
            frames: {
              neutral: "Cultural Amenities: 88",
              positive: "Richer cultural scene than 88% of neighborhoods",
              negative: "12% of neighborhoods offer more cultural amenities"
            }
          }
        ]
      },
      safety: {
        label: "Safety & Stability",
        score: 71,
        factors: [
          {
            name: "Crime Rate",
            score: 65,
            confidence: 83,
            sources: [
              { name: "FBI UCR database", weight: 0.5, value: 63, type: "measured" },
              { name: "Local PD reports", weight: 0.3, value: 67, type: "measured" },
              { name: "AI trend analysis", weight: 0.2, value: 66, type: "estimated" }
            ],
            frames: {
              neutral: "Crime Rate Score: 65",
              positive: "Safer than 65% of metro neighborhoods",
              negative: "35% of metro neighborhoods are safer"
            }
          },
          {
            name: "Emergency Response",
            score: 76,
            confidence: 79,
            sources: [
              { name: "Response time data", weight: 0.5, value: 78, type: "measured" },
              { name: "Station proximity", weight: 0.3, value: 75, type: "measured" },
              { name: "AI capacity analysis", weight: 0.2, value: 72, type: "estimated" }
            ],
            frames: {
              neutral: "Emergency Response: 76",
              positive: "Faster response than 76% of areas",
              negative: "24% of areas have faster emergency services"
            }
          },
          {
            name: "Natural Disaster Risk",
            score: 58,
            confidence: 71,
            sources: [
              { name: "FEMA flood maps", weight: 0.4, value: 62, type: "measured" },
              { name: "Seismic data", weight: 0.3, value: 50, type: "measured" },
              { name: "AI climate projection", weight: 0.3, value: 60, type: "estimated" }
            ],
            frames: {
              neutral: "Disaster Risk Score: 58",
              positive: "Lower disaster risk than 58% of LA County",
              negative: "42% of LA County neighborhoods face lower risk"
            }
          }
        ]
      },
      community: {
        label: "Community",
        score: 83,
        factors: [
          {
            name: "Family Friendliness",
            score: 80,
            confidence: 84,
            sources: [
              { name: "School ratings aggregate", weight: 0.4, value: 82, type: "measured" },
              { name: "Family household ratio", weight: 0.3, value: 78, type: "measured" },
              { name: "AI family review analysis", weight: 0.3, value: 79, type: "estimated" }
            ],
            frames: {
              neutral: "Family Friendliness: 80",
              positive: "More family-friendly than 80% of neighborhoods",
              negative: "20% of neighborhoods rank higher for families"
            }
          },
          {
            name: "Cultural Diversity",
            score: 91,
            confidence: 88,
            sources: [
              { name: "Census demographic data", weight: 0.5, value: 93, type: "measured" },
              { name: "Language diversity index", weight: 0.3, value: 89, type: "measured" },
              { name: "AI community analysis", weight: 0.2, value: 88, type: "estimated" }
            ],
            frames: {
              neutral: "Cultural Diversity: 91",
              positive: "More culturally diverse than 91% of neighborhoods",
              negative: "9% of neighborhoods are more diverse"
            }
          },
          {
            name: "Local Business Density",
            score: 82,
            confidence: 81,
            sources: [
              { name: "Business license database", weight: 0.5, value: 84, type: "measured" },
              { name: "Yelp/Google listing count", weight: 0.3, value: 80, type: "measured" },
              { name: "AI vitality estimate", weight: 0.2, value: 79, type: "estimated" }
            ],
            frames: {
              neutral: "Local Business Density: 82",
              positive: "More local businesses than 82% of neighborhoods",
              negative: "18% of neighborhoods have a richer business scene"
            }
          },
          {
            name: "Community Events",
            score: 85,
            confidence: 70,
            sources: [
              { name: "Event calendar scrape", weight: 0.4, value: 87, type: "measured" },
              { name: "AI activity analysis", weight: 0.6, value: 84, type: "estimated" }
            ],
            frames: {
              neutral: "Community Events: 85",
              positive: "More community events than 85% of neighborhoods",
              negative: "15% of neighborhoods host more events"
            }
          }
        ]
      },
      growth: {
        label: "Growth",
        score: 73,
        factors: [
          {
            name: "Permit Activity",
            score: 72,
            confidence: 79,
            sources: [
              { name: "City permit database", weight: 0.5, value: 74, type: "measured" },
              { name: "Construction tracking", weight: 0.3, value: 70, type: "measured" },
              { name: "AI development estimate", weight: 0.2, value: 69, type: "estimated" }
            ],
            frames: {
              neutral: "Permit Activity: 72",
              positive: "More development activity than 72% of areas",
              negative: "28% of areas are developing faster"
            }
          },
          {
            name: "Business Growth",
            score: 74,
            confidence: 75,
            sources: [
              { name: "New business filings", weight: 0.4, value: 76, type: "measured" },
              { name: "Closure rate data", weight: 0.3, value: 71, type: "measured" },
              { name: "AI economic analysis", weight: 0.3, value: 73, type: "estimated" }
            ],
            frames: {
              neutral: "Business Growth: 74",
              positive: "Stronger business growth than 74% of neighborhoods",
              negative: "26% of neighborhoods show stronger growth"
            }
          },
          {
            name: "Property Value Trajectory",
            score: 77,
            confidence: 78,
            sources: [
              { name: "MLS historical data", weight: 0.4, value: 79, type: "measured" },
              { name: "Tax assessment trends", weight: 0.3, value: 75, type: "measured" },
              { name: "AI appreciation forecast", weight: 0.3, value: 74, type: "estimated" }
            ],
            frames: {
              neutral: "Value Trajectory: 77",
              positive: "Stronger appreciation than 77% of neighborhoods",
              negative: "23% of neighborhoods appreciate faster"
            }
          }
        ]
      }
    }
  },
  {
    id: "west-hollywood",
    name: "West Hollywood, CA",
    coordinates: { lat: 34.0900, lng: -118.3617 },
    overallScore: 80,
    categories: {
      livability: {
        label: "Livability",
        score: 87,
        factors: [
          {
            name: "Walk Score",
            score: 92,
            confidence: 91,
            sources: [
              { name: "Walk Score API", weight: 0.4, value: 94, type: "measured" },
              { name: "Google Places density", weight: 0.3, value: 91, type: "measured" },
              { name: "AI review analysis", weight: 0.3, value: 89, type: "estimated" }
            ],
            frames: {
              neutral: "Walk Score: 92",
              positive: "More walkable than 92% of neighborhoods",
              negative: "8% of neighborhoods are even more walkable"
            }
          },
          {
            name: "Transit Access",
            score: 76,
            confidence: 82,
            sources: [
              { name: "Transit Score API", weight: 0.5, value: 78, type: "measured" },
              { name: "Route frequency data", weight: 0.3, value: 74, type: "measured" },
              { name: "AI commute analysis", weight: 0.2, value: 73, type: "estimated" }
            ],
            frames: {
              neutral: "Transit Score: 76",
              positive: "Better transit than 76% of LA neighborhoods",
              negative: "24% of LA neighborhoods have better transit"
            }
          },
          {
            name: "Grocery Access",
            score: 88,
            confidence: 87,
            sources: [
              { name: "Google Places grocery count", weight: 0.5, value: 90, type: "measured" },
              { name: "Distance to nearest store", weight: 0.3, value: 86, type: "measured" },
              { name: "AI variety analysis", weight: 0.2, value: 85, type: "estimated" }
            ],
            frames: {
              neutral: "Grocery Access: 88",
              positive: "More grocery options than 88% of neighborhoods",
              negative: "12% of neighborhoods offer better grocery access"
            }
          },
          {
            name: "Nightlife Access",
            score: 95,
            confidence: 93,
            sources: [
              { name: "Venue density data", weight: 0.5, value: 97, type: "measured" },
              { name: "Late-night business count", weight: 0.3, value: 94, type: "measured" },
              { name: "AI scene analysis", weight: 0.2, value: 91, type: "estimated" }
            ],
            frames: {
              neutral: "Nightlife Access: 95",
              positive: "Better nightlife than 95% of neighborhoods",
              negative: "5% of neighborhoods offer more nightlife options"
            }
          }
        ]
      },
      safety: {
        label: "Safety & Stability",
        score: 63,
        factors: [
          {
            name: "Crime Rate",
            score: 52,
            confidence: 80,
            sources: [
              { name: "FBI UCR database", weight: 0.5, value: 50, type: "measured" },
              { name: "Local PD reports", weight: 0.3, value: 54, type: "measured" },
              { name: "AI trend analysis", weight: 0.2, value: 53, type: "estimated" }
            ],
            frames: {
              neutral: "Crime Rate Score: 52",
              positive: "Safer than 52% of urban entertainment districts",
              negative: "48% of comparable areas report lower crime"
            }
          },
          {
            name: "Emergency Response",
            score: 74,
            confidence: 78,
            sources: [
              { name: "Response time data", weight: 0.5, value: 76, type: "measured" },
              { name: "Station proximity", weight: 0.3, value: 73, type: "measured" },
              { name: "AI capacity analysis", weight: 0.2, value: 70, type: "estimated" }
            ],
            frames: {
              neutral: "Emergency Response: 74",
              positive: "Faster response than 74% of urban areas",
              negative: "26% of urban areas have faster response times"
            }
          },
          {
            name: "Insurance Cost",
            score: 55,
            confidence: 76,
            sources: [
              { name: "Insurance rate index", weight: 0.5, value: 53, type: "measured" },
              { name: "Claims history", weight: 0.3, value: 57, type: "measured" },
              { name: "AI risk estimate", weight: 0.2, value: 56, type: "estimated" }
            ],
            frames: {
              neutral: "Insurance Cost Score: 55",
              positive: "Lower insurance than 55% of urban areas",
              negative: "45% of areas enjoy lower insurance costs"
            }
          }
        ]
      },
      community: {
        label: "Community",
        score: 85,
        factors: [
          {
            name: "Nightlife & Dining",
            score: 96,
            confidence: 92,
            sources: [
              { name: "Restaurant/bar density", weight: 0.5, value: 98, type: "measured" },
              { name: "Yelp rating aggregate", weight: 0.3, value: 94, type: "measured" },
              { name: "AI scene analysis", weight: 0.2, value: 93, type: "estimated" }
            ],
            frames: {
              neutral: "Nightlife & Dining: 96",
              positive: "Better dining/nightlife than 96% of neighborhoods",
              negative: "4% of neighborhoods offer even more dining variety"
            }
          },
          {
            name: "LGBTQ+ Friendliness",
            score: 98,
            confidence: 95,
            sources: [
              { name: "Pride index data", weight: 0.4, value: 99, type: "measured" },
              { name: "LGBTQ+ business density", weight: 0.3, value: 97, type: "measured" },
              { name: "AI community analysis", weight: 0.3, value: 96, type: "estimated" }
            ],
            frames: {
              neutral: "LGBTQ+ Friendliness: 98",
              positive: "More LGBTQ+ friendly than 98% of neighborhoods",
              negative: "2% of neighborhoods are rated more inclusive"
            }
          },
          {
            name: "Local Business Density",
            score: 91,
            confidence: 86,
            sources: [
              { name: "Business license database", weight: 0.5, value: 93, type: "measured" },
              { name: "Yelp/Google listing count", weight: 0.3, value: 90, type: "measured" },
              { name: "AI vitality estimate", weight: 0.2, value: 87, type: "estimated" }
            ],
            frames: {
              neutral: "Local Business Density: 91",
              positive: "More local businesses than 91% of neighborhoods",
              negative: "9% of neighborhoods have a denser business scene"
            }
          },
          {
            name: "Community Events",
            score: 90,
            confidence: 78,
            sources: [
              { name: "Event calendar scrape", weight: 0.4, value: 92, type: "measured" },
              { name: "AI activity analysis", weight: 0.6, value: 89, type: "estimated" }
            ],
            frames: {
              neutral: "Community Events: 90",
              positive: "More community events than 90% of neighborhoods",
              negative: "10% of neighborhoods host more community events"
            }
          }
        ]
      },
      growth: {
        label: "Growth",
        score: 82,
        factors: [
          {
            name: "Permit Activity",
            score: 78,
            confidence: 77,
            sources: [
              { name: "City permit database", weight: 0.5, value: 80, type: "measured" },
              { name: "Construction tracking", weight: 0.3, value: 76, type: "measured" },
              { name: "AI development estimate", weight: 0.2, value: 75, type: "estimated" }
            ],
            frames: {
              neutral: "Permit Activity: 78",
              positive: "More development than 78% of areas",
              negative: "22% of areas are developing faster"
            }
          },
          {
            name: "Business Growth",
            score: 84,
            confidence: 76,
            sources: [
              { name: "New business filings", weight: 0.4, value: 86, type: "measured" },
              { name: "Closure rate data", weight: 0.3, value: 82, type: "measured" },
              { name: "AI economic analysis", weight: 0.3, value: 83, type: "estimated" }
            ],
            frames: {
              neutral: "Business Growth: 84",
              positive: "Stronger business growth than 84% of neighborhoods",
              negative: "16% of neighborhoods show stronger growth"
            }
          },
          {
            name: "Property Value Trajectory",
            score: 86,
            confidence: 80,
            sources: [
              { name: "MLS historical data", weight: 0.4, value: 88, type: "measured" },
              { name: "Tax assessment trends", weight: 0.3, value: 84, type: "measured" },
              { name: "AI appreciation forecast", weight: 0.3, value: 83, type: "estimated" }
            ],
            frames: {
              neutral: "Value Trajectory: 86",
              positive: "Stronger appreciation than 86% of neighborhoods",
              negative: "14% of neighborhoods are appreciating faster"
            }
          }
        ]
      }
    }
  }
];

// Helper to get a neighborhood by ID
export function getNeighborhoodById(id) {
  return neighborhoods.find(n => n.id === id);
}

// Helper to search neighborhoods by name
export function searchNeighborhoods(query) {
  const lower = query.toLowerCase();
  return neighborhoods.filter(n => n.name.toLowerCase().includes(lower));
}
```

**Step 2: Commit**

```bash
git add src/data/
git commit -m "feat: add mock neighborhood data for 4 demo locations"
```

---

## Task 4: Zustand Store

**Files:**
- Create: `src/store/useStore.js`

**Step 1: Create the store**

`src/store/useStore.js`:
```js
import { create } from 'zustand'

const useStore = create((set, get) => ({
  // Framing mode: 'neutral' | 'positive' | 'negative'
  framingMode: 'neutral',
  setFramingMode: (mode) => set({ framingMode: mode }),

  // Expanded category key (null = all collapsed)
  expandedCategory: null,
  toggleCategory: (key) => set((state) => ({
    expandedCategory: state.expandedCategory === key ? null : key,
  })),
  collapseAll: () => set({ expandedCategory: null }),

  // Challenge state
  challengeFactor: null, // { neighborhoodId, categoryKey, factorIndex }
  openChallenge: (neighborhoodId, categoryKey, factorIndex) => set({
    challengeFactor: { neighborhoodId, categoryKey, factorIndex },
  }),
  closeChallenge: () => set({ challengeFactor: null }),

  // Challenged scores: Map of "neighborhoodId.categoryKey.factorIndex" -> updated factor
  challengedFactors: {},
  setChallengedFactor: (key, factor) => set((state) => ({
    challengedFactors: { ...state.challengedFactors, [key]: factor },
  })),

  // Comparison: array of neighborhood IDs (max 2)
  comparisonIds: [],
  addToComparison: (id) => set((state) => {
    if (state.comparisonIds.includes(id) || state.comparisonIds.length >= 2) return state;
    return { comparisonIds: [...state.comparisonIds, id] };
  }),
  removeFromComparison: (id) => set((state) => ({
    comparisonIds: state.comparisonIds.filter(i => i !== id),
  })),
  clearComparison: () => set({ comparisonIds: [] }),
}));

export default useStore;
```

**Step 2: Commit**

```bash
git add src/store/
git commit -m "feat: add Zustand store for framing, category, challenge, and comparison state"
```

---

## Task 5: Recalculation Engine

**Files:**
- Create: `src/engine/recalculate.js`

**Step 1: Create recalculation logic**

`src/engine/recalculate.js`:
```js
/**
 * Recalculates a factor's score after a user challenge.
 * - Reduces weight of AI-estimated sources
 * - Increases weight of measured sources
 * - Normalizes weights to sum to 1
 * - Returns updated factor with new score
 */
export function recalculateFactor(factor, challengeDirection) {
  // challengeDirection: 'higher' | 'lower'
  // 'higher' = user thinks score should be higher
  // 'lower' = user thinks score should be lower

  const delta = challengeDirection === 'higher' ? 8 : -8;

  const adjusted = factor.sources.map(source => {
    if (source.type === 'estimated') {
      return {
        ...source,
        value: clamp(source.value + delta, 0, 100),
        weight: source.weight * 0.6, // Reduce AI weight significantly
        challenged: true,
      };
    }
    return {
      ...source,
      weight: source.weight * 1.2, // Boost measured data weight
    };
  });

  // Normalize weights
  const totalWeight = adjusted.reduce((sum, s) => sum + s.weight, 0);
  const normalized = adjusted.map(s => ({
    ...s,
    weight: s.weight / totalWeight,
  }));

  // Recalculate score
  const newScore = Math.round(
    normalized.reduce((sum, s) => sum + s.value * s.weight, 0)
  );

  // Adjust confidence down slightly (user had to challenge it)
  const newConfidence = Math.max(factor.confidence - 5, 20);

  return {
    ...factor,
    score: newScore,
    confidence: newConfidence,
    sources: normalized,
    userChallenged: true,
  };
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
```

**Step 2: Commit**

```bash
git add src/engine/
git commit -m "feat: add challenge recalculation engine"
```

---

## Task 6: Shared UI Components

**Files:**
- Create: `src/components/shared/ScoreBar.jsx`
- Create: `src/components/shared/ConfidenceShield.jsx`
- Create: `src/components/shared/ScoreCircle.jsx`
- Create: `src/components/shared/TopBar.jsx`

**Step 1: ScoreBar — animated horizontal bar colored by score**

`src/components/shared/ScoreBar.jsx`:
```jsx
import { motion } from 'framer-motion'

function getScoreColor(score) {
  if (score >= 70) return '#34D399'
  if (score >= 40) return '#FBBF24'
  return '#F87171'
}

export default function ScoreBar({ score, delay = 0 }) {
  const color = getScoreColor(score)

  return (
    <div className="h-1.5 w-full rounded-full bg-[#2A2A2E] overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}
```

**Step 2: ConfidenceShield — small icon with confidence percentage**

`src/components/shared/ConfidenceShield.jsx`:
```jsx
export default function ConfidenceShield({ confidence }) {
  return (
    <div className="flex items-center gap-1 text-[11px] text-[#71717A]" title={`AI Confidence: ${confidence}%`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <span>{confidence}%</span>
    </div>
  )
}
```

**Step 3: ScoreCircle — big score number with count-up animation**

`src/components/shared/ScoreCircle.jsx`:
```jsx
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'

function getScoreColor(score) {
  if (score >= 70) return '#34D399'
  if (score >= 40) return '#FBBF24'
  return '#F87171'
}

export default function ScoreCircle({ score, size = 'lg' }) {
  const [displayScore, setDisplayScore] = useState(0)
  const color = getScoreColor(score)

  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    })
    return controls.stop
  }, [score])

  const sizeClasses = size === 'lg'
    ? 'w-28 h-28 text-[28px]'
    : 'w-16 h-16 text-[20px]'

  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center font-bold border-2`}
      style={{ borderColor: color, color }}
    >
      {displayScore}
    </div>
  )
}
```

**Step 4: TopBar — navigation bar**

`src/components/shared/TopBar.jsx`:
```jsx
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
```

**Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add shared UI components (ScoreBar, ConfidenceShield, ScoreCircle, TopBar)"
```

---

## Task 7: Framing Toggle Component

**Files:**
- Create: `src/components/framing/FramingToggle.jsx`

**Step 1: Build the 3-way toggle**

`src/components/framing/FramingToggle.jsx`:
```jsx
import { motion } from 'framer-motion'
import useStore from '../../store/useStore'

const modes = [
  { key: 'neutral', label: 'Neutral' },
  { key: 'positive', label: 'Positive' },
  { key: 'negative', label: 'Negative' },
]

export default function FramingToggle() {
  const { framingMode, setFramingMode } = useStore()

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#71717A]">
        Framing
      </span>
      <div className="flex bg-[#161618] rounded-md border border-[#2A2A2E] p-0.5">
        {modes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => setFramingMode(mode.key)}
            className="relative px-3 py-1.5 text-[12px] font-medium rounded-[5px] transition-colors"
            style={{
              color: framingMode === mode.key ? '#F4F4F5' : '#71717A',
            }}
          >
            {framingMode === mode.key && (
              <motion.div
                layoutId="framing-indicator"
                className="absolute inset-0 rounded-[5px]"
                style={{
                  backgroundColor: mode.key === 'positive' ? 'rgba(52, 211, 153, 0.15)'
                    : mode.key === 'negative' ? 'rgba(248, 113, 113, 0.15)'
                    : 'rgba(99, 102, 241, 0.12)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/framing/
git commit -m "feat: add framing toggle with animated indicator"
```

---

## Task 8: Input Page

**Files:**
- Create: `src/pages/InputPage.jsx`
- Modify: `src/App.jsx` — import InputPage

**Step 1: Build the search page**

`src/pages/InputPage.jsx`:
```jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { neighborhoods } from '../data/neighborhoods'

export default function InputPage() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const results = useMemo(() => {
    if (!query.trim()) return []
    return neighborhoods.filter(n =>
      n.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  const handleSelect = (id) => {
    navigate(`/neighborhood/${id}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg text-center"
      >
        {/* Logo */}
        <h1 className="text-[20px] font-semibold tracking-[-0.02em] mb-1">
          <span className="text-[#6366F1]">LOCUS</span>
        </h1>
        <p className="text-[#71717A] text-[12px] uppercase tracking-[0.08em] mb-10">
          Neighborhood Intelligence, Debiased
        </p>

        {/* Prompt */}
        <h2 className="text-[28px] font-semibold tracking-[-0.02em] mb-6">
          Where are you looking?
        </h2>

        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center bg-[#161618] border border-[#2A2A2E] rounded-[10px] px-4 py-3 focus-within:border-[#6366F1] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" className="mr-3 flex-shrink-0">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search address or neighborhood"
              className="bg-transparent w-full text-[14px] text-[#F4F4F5] placeholder-[#71717A] outline-none"
              autoFocus
            />
          </div>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#161618] border border-[#2A2A2E] rounded-[10px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)] z-10"
              >
                {results.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleSelect(n.id)}
                    className="w-full text-left px-4 py-3 text-[14px] hover:bg-[#1C1C1F] transition-colors flex items-center justify-between"
                  >
                    <span>{n.name}</span>
                    <span className="text-[12px] text-[#71717A]">Score: {n.overallScore}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestion Pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="text-[12px] text-[#71717A] mr-1 self-center">Try:</span>
          {neighborhoods.map((n) => (
            <button
              key={n.id}
              onClick={() => handleSelect(n.id)}
              className="px-3 py-1.5 text-[12px] text-[#A1A1AA] bg-[#161618] border border-[#2A2A2E] rounded-[6px] hover:border-[#6366F1] hover:text-[#F4F4F5] transition-all"
            >
              {n.name.replace(', CA', '')}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
```

**Step 2: Update App.jsx to import InputPage**

In `src/App.jsx`, import InputPage and use it in the routes:
```jsx
import InputPage from './pages/InputPage'
// ... in Routes:
<Route path="/" element={<InputPage />} />
```

**Step 3: Verify**

```bash
npm run dev
```

Expected: Dark screen with centered "Where are you looking?", search input, suggestion pills.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add input page with search and suggestion pills"
```

---

## Task 9: Category Card + Factor Row Components

**Files:**
- Create: `src/components/scores/CategoryCard.jsx`
- Create: `src/components/scores/FactorRow.jsx`

**Step 1: FactorRow — individual metric with bar, confidence, framed description**

`src/components/scores/FactorRow.jsx`:
```jsx
import { motion, AnimatePresence } from 'framer-motion'
import ScoreBar from '../shared/ScoreBar'
import ConfidenceShield from '../shared/ConfidenceShield'
import useStore from '../../store/useStore'

function getScoreColor(score) {
  if (score >= 70) return '#34D399'
  if (score >= 40) return '#FBBF24'
  return '#F87171'
}

export default function FactorRow({ factor, index, onChallenge }) {
  const framingMode = useStore((s) => s.framingMode)
  const description = factor.frames[framingMode]

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group py-3 px-3 rounded-[6px] hover:bg-[#1C1C1F] transition-colors cursor-pointer"
      onClick={() => onChallenge?.()}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[14px] text-[#F4F4F5]">{factor.name}</span>
        <div className="flex items-center gap-3">
          <span
            className="text-[14px] font-semibold"
            style={{ color: getScoreColor(factor.score) }}
          >
            {factor.score}
          </span>
          <ConfidenceShield confidence={factor.confidence} />
        </div>
      </div>
      <ScoreBar score={factor.score} delay={index * 0.05} />
      <AnimatePresence mode="wait">
        <motion.p
          key={framingMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-[12px] text-[#71717A] mt-1.5"
        >
          {description}
        </motion.p>
      </AnimatePresence>
      {factor.userChallenged && (
        <span className="text-[10px] text-[#6366F1] mt-1 inline-block">
          Score adjusted by your input
        </span>
      )}
    </motion.div>
  )
}
```

**Step 2: CategoryCard — expandable card with header score and factor list**

`src/components/scores/CategoryCard.jsx`:
```jsx
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import FactorRow from './FactorRow'

function getScoreColor(score) {
  if (score >= 70) return '#34D399'
  if (score >= 40) return '#FBBF24'
  return '#F87171'
}

export default function CategoryCard({ categoryKey, category, neighborhoodId, onChallengeFactor }) {
  const { expandedCategory, toggleCategory } = useStore()
  const isExpanded = expandedCategory === categoryKey

  return (
    <motion.div
      layout
      className="bg-[#161618] border border-[#2A2A2E] rounded-[10px] overflow-hidden hover:border-[#3A3A40] transition-colors cursor-pointer"
      onClick={() => toggleCategory(categoryKey)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[14px] font-medium">{category.label}</span>
        <div className="flex items-center gap-2">
          <span
            className="text-[15px] font-semibold"
            style={{ color: getScoreColor(category.score) }}
          >
            {category.score}
          </span>
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#71717A"
            strokeWidth="2"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </div>
      </div>

      {/* Expanded factors */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 pb-3 border-t border-[#2A2A2E]">
              {category.factors.map((factor, i) => (
                <FactorRow
                  key={factor.name}
                  factor={factor}
                  index={i}
                  onChallenge={() => onChallengeFactor?.(categoryKey, i)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
```

**Step 3: Commit**

```bash
git add src/components/scores/
git commit -m "feat: add CategoryCard and FactorRow with expand/collapse and framing"
```

---

## Task 10: Challenge Panel

**Files:**
- Create: `src/components/challenge/ChallengePanel.jsx`

**Step 1: Build the slide-in challenge panel**

`src/components/challenge/ChallengePanel.jsx`:
```jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import { recalculateFactor } from '../../engine/recalculate'
import { getNeighborhoodById } from '../../data/neighborhoods'
import ScoreBar from '../shared/ScoreBar'

function getSourceIcon(type) {
  return type === 'measured' ? '✓' : '⚠'
}

function getSourceColor(type) {
  return type === 'measured' ? '#34D399' : '#FBBF24'
}

export default function ChallengePanel() {
  const { challengeFactor, closeChallenge, setChallengedFactor, challengedFactors } = useStore()
  const [challengeText, setChallengeText] = useState('')

  if (!challengeFactor) return null

  const { neighborhoodId, categoryKey, factorIndex } = challengeFactor
  const neighborhood = getNeighborhoodById(neighborhoodId)
  const category = neighborhood.categories[categoryKey]

  // Use challenged factor if available, else original
  const challengeKey = `${neighborhoodId}.${categoryKey}.${factorIndex}`
  const factor = challengedFactors[challengeKey] || category.factors[factorIndex]

  const handleRecalculate = (direction) => {
    const updated = recalculateFactor(factor, direction)
    setChallengedFactor(challengeKey, updated)
    setChallengeText('')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-end"
        onClick={closeChallenge}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-md bg-[#161618] border-l border-[#2A2A2E] p-6 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-semibold">Challenge: {factor.name}</h3>
              <p className="text-[12px] text-[#71717A] mt-0.5">
                Current score: {factor.score} · Confidence: {factor.confidence}%
              </p>
            </div>
            <button
              onClick={closeChallenge}
              className="text-[#71717A] hover:text-[#F4F4F5] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Source Breakdown */}
          <div className="mb-6">
            <h4 className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#71717A] mb-3">
              Data Sources
            </h4>
            <div className="space-y-2">
              {factor.sources.map((source, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 px-3 bg-[#1C1C1F] rounded-[6px]"
                >
                  <div className="flex items-center gap-2">
                    <span style={{ color: getSourceColor(source.type) }}>
                      {getSourceIcon(source.type)}
                    </span>
                    <div>
                      <span className="text-[13px] text-[#F4F4F5]">{source.name}</span>
                      <span className="text-[11px] text-[#71717A] ml-2">
                        weight: {(source.weight * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-[#A1A1AA]">{source.value}</span>
                    {source.challenged && (
                      <span className="text-[10px] text-[#6366F1]">adjusted</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div className="mb-6 p-3 bg-[#0C0C0E] rounded-[6px] border border-[#2A2A2E]">
            <p className="text-[12px] text-[#A1A1AA] leading-relaxed">
              {factor.sources.some(s => s.type === 'estimated')
                ? 'This score includes AI-estimated components with lower confidence. Challenging will reduce AI weight and increase measured data weight.'
                : 'All sources for this score are measured data. Challenge will still be applied to adjust scoring.'
              }
            </p>
          </div>

          {/* Challenge Input */}
          <div className="mb-4">
            <h4 className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#71717A] mb-2">
              What's your experience?
            </h4>
            <textarea
              value={challengeText}
              onChange={(e) => setChallengeText(e.target.value)}
              placeholder="I've lived/visited this area and believe..."
              className="w-full bg-[#0C0C0E] border border-[#2A2A2E] rounded-[6px] p-3 text-[13px] text-[#F4F4F5] placeholder-[#71717A] outline-none focus:border-[#6366F1] transition-colors resize-none h-24"
            />
          </div>

          {/* Challenge Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleRecalculate('higher')}
              className="flex-1 py-2.5 rounded-[6px] text-[13px] font-medium bg-[rgba(52,211,153,0.12)] text-[#34D399] hover:bg-[rgba(52,211,153,0.2)] transition-colors"
            >
              Should be higher
            </button>
            <button
              onClick={() => handleRecalculate('lower')}
              className="flex-1 py-2.5 rounded-[6px] text-[13px] font-medium bg-[rgba(248,113,113,0.12)] text-[#F87171] hover:bg-[rgba(248,113,113,0.2)] transition-colors"
            >
              Should be lower
            </button>
          </div>

          {/* How it works */}
          <div className="mt-6 pt-4 border-t border-[#2A2A2E]">
            <h4 className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#71717A] mb-2">
              How recalculation works
            </h4>
            <p className="text-[12px] text-[#71717A] leading-relaxed">
              Your input adjusts the AI-estimated component weights. Measured data sources remain unchanged. The score recalculates with higher weight on verified sources.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/challenge/
git commit -m "feat: add challenge panel with source breakdown and recalculation"
```

---

## Task 11: Neighborhood Overview Page

**Files:**
- Create: `src/pages/NeighborhoodPage.jsx`
- Create: `src/components/map/MapPlaceholder.jsx`
- Modify: `src/App.jsx` — import NeighborhoodPage and ChallengePanel

**Step 1: MapPlaceholder — styled static map stand-in**

`src/components/map/MapPlaceholder.jsx`:
```jsx
import { motion } from 'framer-motion'

export default function MapPlaceholder({ name, coordinates }) {
  return (
    <div className="relative w-full h-full bg-[#0C0C0E] rounded-[10px] overflow-hidden border border-[#2A2A2E] min-h-[300px]">
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full h-px bg-[#A1A1AA]" style={{ top: `${(i + 1) * 12.5}%` }} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full w-px bg-[#A1A1AA]" style={{ left: `${(i + 1) * 12.5}%` }} />
        ))}
      </div>

      {/* Animated boundary polygon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="opacity-30"
        >
          <motion.polygon
            points="100,20 170,50 185,120 150,175 60,180 25,130 30,55"
            fill="rgba(99, 102, 241, 0.1)"
            stroke="#6366F1"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.svg>
      </div>

      {/* Center pin */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
          className="w-3 h-3 rounded-full bg-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.5)]"
        />
      </div>

      {/* Label */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="text-[11px] text-[#71717A] font-medium">{name}</span>
        <span className="text-[10px] text-[#71717A]">
          {coordinates.lat.toFixed(2)}°N, {Math.abs(coordinates.lng).toFixed(2)}°W
        </span>
      </div>
    </div>
  )
}
```

**Step 2: NeighborhoodPage — the main overview screen**

`src/pages/NeighborhoodPage.jsx`:
```jsx
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getNeighborhoodById } from '../data/neighborhoods'
import useStore from '../store/useStore'
import TopBar from '../components/shared/TopBar'
import ScoreCircle from '../components/shared/ScoreCircle'
import CategoryCard from '../components/scores/CategoryCard'
import FramingToggle from '../components/framing/FramingToggle'
import MapPlaceholder from '../components/map/MapPlaceholder'

export default function NeighborhoodPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const neighborhood = getNeighborhoodById(id)
  const openChallenge = useStore((s) => s.openChallenge)
  const addToComparison = useStore((s) => s.addToComparison)
  const comparisonIds = useStore((s) => s.comparisonIds)

  if (!neighborhood) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#71717A]">Neighborhood not found</p>
      </div>
    )
  }

  const handleChallenge = (categoryKey, factorIndex) => {
    openChallenge(id, categoryKey, factorIndex)
  }

  const handleCompare = () => {
    addToComparison(id)
    navigate('/compare')
  }

  const categoryKeys = Object.keys(neighborhood.categories)

  return (
    <div className="min-h-screen">
      <TopBar title={neighborhood.name} showBack />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Framing toggle */}
        <div className="flex justify-end mb-6">
          <FramingToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* Left: Map */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MapPlaceholder
              name={neighborhood.name}
              coordinates={neighborhood.coordinates}
            />
          </motion.div>

          {/* Right: Score + Categories */}
          <div>
            {/* Overall Score */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex flex-col items-center mb-6"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#71717A] mb-3">
                Overall Score
              </span>
              <ScoreCircle score={neighborhood.overallScore} size="lg" />
            </motion.div>

            {/* Category Cards */}
            <div className="space-y-3">
              {categoryKeys.map((key, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                >
                  <CategoryCard
                    categoryKey={key}
                    category={neighborhood.categories[key]}
                    neighborhoodId={id}
                    onChallengeFactor={handleChallenge}
                  />
                </motion.div>
              ))}
            </div>

            {/* Compare Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleCompare}
              disabled={comparisonIds.length >= 2 && !comparisonIds.includes(id)}
              className="w-full mt-4 py-3 border border-dashed border-[#2A2A2E] rounded-[10px] text-[13px] text-[#71717A] hover:border-[#6366F1] hover:text-[#6366F1] transition-all disabled:opacity-40"
            >
              + Compare with another neighborhood
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Step 3: Update App.jsx with all page imports**

`src/App.jsx`:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InputPage from './pages/InputPage'
import NeighborhoodPage from './pages/NeighborhoodPage'
import ComparePage from './pages/ComparePage'
import ChallengePanel from './components/challenge/ChallengePanel'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0C0C0E] text-[#F4F4F5] font-sans">
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
```

Note: ComparePage doesn't exist yet — create a placeholder so the app compiles:

`src/pages/ComparePage.jsx`:
```jsx
export default function ComparePage() {
  return <div>Compare Page (coming next)</div>
}
```

**Step 4: Verify**

```bash
npm run dev
```

Expected: Can navigate from Input to Neighborhood overview. Map placeholder, score circle, category cards all visible. Framing toggle works. Clicking a category expands factors. Clicking a factor opens challenge panel.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add neighborhood overview page with map, scores, categories, and challenge flow"
```

---

## Task 12: Comparison Page

**Files:**
- Replace: `src/pages/ComparePage.jsx`

**Step 1: Build the comparison view**

`src/pages/ComparePage.jsx`:
```jsx
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'
import { getNeighborhoodById, neighborhoods } from '../data/neighborhoods'
import TopBar from '../components/shared/TopBar'
import FramingToggle from '../components/framing/FramingToggle'
import ScoreCircle from '../components/shared/ScoreCircle'
import ScoreBar from '../components/shared/ScoreBar'
import { useState } from 'react'

function getScoreColor(score) {
  if (score >= 70) return '#34D399'
  if (score >= 40) return '#FBBF24'
  return '#F87171'
}

function ComparisonColumn({ neighborhood }) {
  const framingMode = useStore((s) => s.framingMode)
  const categoryKeys = Object.keys(neighborhood.categories)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 min-w-0"
    >
      {/* Name + Score */}
      <div className="text-center mb-5">
        <h3 className="text-[15px] font-semibold mb-3">{neighborhood.name}</h3>
        <div className="flex justify-center">
          <ScoreCircle score={neighborhood.overallScore} size="sm" />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {categoryKeys.map((key) => {
          const cat = neighborhood.categories[key]
          return (
            <div key={key} className="bg-[#161618] rounded-[10px] border border-[#2A2A2E] px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-[#A1A1AA]">{cat.label}</span>
                <span
                  className="text-[14px] font-semibold"
                  style={{ color: getScoreColor(cat.score) }}
                >
                  {cat.score}
                </span>
              </div>
              <ScoreBar score={cat.score} />
              {/* Show top factor with framing */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={framingMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[11px] text-[#71717A] mt-2"
                >
                  {cat.factors[0]?.frames[framingMode]}
                </motion.p>
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default function ComparePage() {
  const navigate = useNavigate()
  const { comparisonIds, addToComparison, removeFromComparison } = useStore()
  const [showPicker, setShowPicker] = useState(false)

  const comparedNeighborhoods = comparisonIds
    .map(getNeighborhoodById)
    .filter(Boolean)

  const availableToAdd = neighborhoods.filter(
    (n) => !comparisonIds.includes(n.id)
  )

  return (
    <div className="min-h-screen">
      <TopBar title={`Comparing ${comparedNeighborhoods.length} neighborhood${comparedNeighborhoods.length !== 1 ? 's' : ''}`} showBack />

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Framing toggle */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-[12px] text-[#71717A]">
            Framing affects all descriptions simultaneously
          </p>
          <FramingToggle />
        </div>

        <div className="flex gap-6">
          {/* Compared neighborhoods */}
          {comparedNeighborhoods.map((n) => (
            <div key={n.id} className="flex-1 relative">
              <button
                onClick={() => removeFromComparison(n.id)}
                className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-[#1C1C1F] border border-[#2A2A2E] flex items-center justify-center text-[#71717A] hover:text-[#F87171] hover:border-[#F87171] transition-colors text-[12px]"
              >
                ×
              </button>
              <ComparisonColumn neighborhood={n} />
            </div>
          ))}

          {/* Add neighborhood slot */}
          {comparisonIds.length < 2 && (
            <div className="flex-1 min-w-0">
              {showPicker ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#161618] border border-[#2A2A2E] rounded-[10px] p-4"
                >
                  <h3 className="text-[13px] font-medium mb-3">Add neighborhood</h3>
                  <div className="space-y-1">
                    {availableToAdd.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          addToComparison(n.id)
                          setShowPicker(false)
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-[6px] text-[13px] hover:bg-[#1C1C1F] transition-colors flex items-center justify-between"
                      >
                        <span>{n.name}</span>
                        <span className="text-[12px] text-[#71717A]">{n.overallScore}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={() => setShowPicker(true)}
                  className="w-full h-full min-h-[400px] border-2 border-dashed border-[#2A2A2E] rounded-[10px] flex flex-col items-center justify-center gap-2 text-[#71717A] hover:border-[#6366F1] hover:text-[#6366F1] transition-all"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span className="text-[13px]">Add neighborhood</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Key difference insight */}
        {comparedNeighborhoods.length === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-4 bg-[#161618] border border-[#2A2A2E] rounded-[10px]"
          >
            <h4 className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#71717A] mb-2">
              Key Differences
            </h4>
            <p className="text-[13px] text-[#A1A1AA] leading-relaxed">
              {generateInsight(comparedNeighborhoods[0], comparedNeighborhoods[1])}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function generateInsight(a, b) {
  const catKeys = Object.keys(a.categories)
  const diffs = catKeys.map((key) => ({
    label: a.categories[key].label,
    diff: b.categories[key].score - a.categories[key].score,
    aScore: a.categories[key].score,
    bScore: b.categories[key].score,
  }))

  const biggest = diffs.reduce((max, d) => Math.abs(d.diff) > Math.abs(max.diff) ? d : max)
  const winner = biggest.diff > 0 ? b.name : a.name
  const loser = biggest.diff > 0 ? a.name : b.name

  return `${winner} scores significantly higher on ${biggest.label} (${Math.max(biggest.aScore, biggest.bScore)} vs ${Math.min(biggest.aScore, biggest.bScore)}). Overall, ${a.overallScore > b.overallScore ? a.name : b.name} has a higher composite score, but individual category differences may matter more for your priorities.`
}
```

**Step 2: Verify**

```bash
npm run dev
```

Expected: Navigate to /compare, can add neighborhoods, see side-by-side comparison with framing toggle affecting both simultaneously.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add comparison page with side-by-side view and key differences"
```

---

## Task 13: Polish + Hover States + Responsive

**Files:**
- Modify: Multiple component files for hover states and polish
- Modify: `src/styles/globals.css` — scrollbar styling, selection color, smooth scroll

**Step 1: Add global polish styles**

Add to `src/styles/globals.css`:
```css
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #2A2A2E;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #3A3A40;
}

/* Selection */
::selection {
  background: rgba(99, 102, 241, 0.3);
  color: #F4F4F5;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Focus ring */
*:focus-visible {
  outline: 2px solid #6366F1;
  outline-offset: 2px;
}
```

**Step 2: Verify all flows end-to-end**

- Home → search → select → neighborhood overview
- Expand/collapse categories
- Toggle framing (crossfade works on all descriptions)
- Open challenge panel, recalculate
- Navigate to compare, add two neighborhoods
- Framing toggle affects both comparison columns
- Back button works

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add polish styles, scrollbar, focus rings, and selection color"
```

---

## Task 14: Final Build + Deploy Verification

**Step 1: Build for production**

```bash
npm run build
```

Expected: No errors. Outputs to `dist/`.

**Step 2: Preview production build**

```bash
npm run preview
```

Expected: App works identically to dev mode. All transitions smooth. No console errors.

**Step 3: Commit final state**

```bash
git add -A
git commit -m "chore: verify production build"
```

---

## Parallel Task Dependencies

```
Task 1 (scaffold) ──► Task 2 (design system) ──► All subsequent tasks
                  ──► Task 3 (mock data)      ──► Task 4 (store) ──► Task 5 (engine)
                                                                  ──► Task 6 (shared UI)
                                                                  ──► Task 7 (framing toggle)

Task 6, 7 ──► Task 8 (input page)
Task 6, 7, 9 (category/factor) ──► Task 11 (neighborhood page)
Task 5, 6, 10 (challenge) ──► Task 11
Task 11 ──► Task 12 (compare page)
Task 12 ──► Task 13 (polish)
Task 13 ──► Task 14 (build)
```

Tasks 3, 4, 5 can run in parallel after Task 1.
Tasks 6, 7 can run in parallel after Task 2.
Tasks 8, 9, 10 can run in parallel after Tasks 6+7.
