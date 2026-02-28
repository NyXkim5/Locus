const FACTORS = [
  'Carbon Footprint',
  'Green Transit Score',
  'Bike Infrastructure',
  'Renewable Energy',
  'Green Space Coverage',
]

const CENTER = 140
const RADIUS = 110
const ANGLES_DEG = [-90, -18, 54, 126, 198]
const ANGLES_RAD = ANGLES_DEG.map((d) => (d * Math.PI) / 180)

function getVertex(angleRad, fraction) {
  return {
    x: CENTER + fraction * RADIUS * Math.cos(angleRad),
    y: CENTER + fraction * RADIUS * Math.sin(angleRad),
  }
}

function buildPolygonPoints(scores) {
  return scores
    .map((score, i) => {
      const pt = getVertex(ANGLES_RAD[i], score / 100)
      return `${pt.x},${pt.y}`
    })
    .join(' ')
}

function getLabelAnchor(angleDeg) {
  if (angleDeg === -90) return { textAnchor: 'middle', dy: '-0.7em', dx: 0 }
  if (angleDeg === -18) return { textAnchor: 'start', dy: '0.35em', dx: 6 }
  if (angleDeg === 54) return { textAnchor: 'start', dy: '0.9em', dx: 4 }
  if (angleDeg === 126) return { textAnchor: 'end', dy: '0.9em', dx: -4 }
  if (angleDeg === 198) return { textAnchor: 'end', dy: '0.35em', dx: -6 }
  return { textAnchor: 'middle', dy: 0, dx: 0 }
}

export default function RadarChart({ neighborhoods }) {
  if (!neighborhoods || neighborhoods.length !== 2) return null

  const extractScores = (neighborhood) => {
    const sus = neighborhood.categories?.find((c) => c.label === 'Sustainability')
    if (!sus?.factors) return null
    return FACTORS.map((name) => {
      const factor = sus.factors.find((f) => f.name === name)
      return factor?.score ?? 0
    })
  }

  const scoresA = extractScores(neighborhoods[0])
  const scoresB = extractScores(neighborhoods[1])

  if (!scoresA || !scoresB) return null

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0]

  return (
    <div className="flex flex-col items-center">
      <svg
        width="280"
        height="280"
        viewBox="0 0 280 280"
        role="img"
        aria-label={`Sustainability radar chart comparing ${neighborhoods[0].name} and ${neighborhoods[1].name}`}
      >
        {/* Grid rings */}
        {gridLevels.map((level) => {
          const pts = ANGLES_RAD.map((a) => {
            const pt = getVertex(a, level)
            return `${pt.x},${pt.y}`
          }).join(' ')
          return (
            <polygon
              key={level}
              points={pts}
              fill="none"
              stroke="var(--border)"
              strokeWidth="0.7"
              opacity={0.5}
            />
          )
        })}

        {/* Axis lines from center to each vertex */}
        {ANGLES_RAD.map((a, i) => {
          const pt = getVertex(a, 1)
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={pt.x}
              y2={pt.y}
              stroke="var(--border)"
              strokeWidth="0.7"
            />
          )
        })}

        {/* Data polygon A (first neighborhood) */}
        <polygon
          points={buildPolygonPoints(scoresA)}
          fill="color-mix(in srgb, var(--accent) 20%, transparent)"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />

        {/* Data polygon B (second neighborhood) */}
        <polygon
          points={buildPolygonPoints(scoresB)}
          fill="color-mix(in srgb, var(--color-sustainability) 20%, transparent)"
          stroke="var(--color-sustainability)"
          strokeWidth="1.5"
        />

        {/* Data points A */}
        {scoresA.map((score, i) => {
          const pt = getVertex(ANGLES_RAD[i], score / 100)
          return (
            <circle
              key={`a-${i}`}
              cx={pt.x}
              cy={pt.y}
              r="3"
              fill="var(--accent)"
            />
          )
        })}

        {/* Data points B */}
        {scoresB.map((score, i) => {
          const pt = getVertex(ANGLES_RAD[i], score / 100)
          return (
            <circle
              key={`b-${i}`}
              cx={pt.x}
              cy={pt.y}
              r="3"
              fill="var(--color-sustainability)"
            />
          )
        })}

        {/* Axis labels */}
        {FACTORS.map((name, i) => {
          const pt = getVertex(ANGLES_RAD[i], 1)
          const anchor = getLabelAnchor(ANGLES_DEG[i])
          return (
            <text
              key={name}
              x={pt.x + anchor.dx}
              y={pt.y}
              dy={anchor.dy}
              textAnchor={anchor.textAnchor}
              fill="var(--text-muted)"
              fontSize="11"
            >
              {name}
            </text>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-2">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: 'var(--accent)' }}
          />
          <span className="text-[11px] text-[var(--text-muted)]">
            {neighborhoods[0].name}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: 'var(--color-sustainability)' }}
          />
          <span className="text-[11px] text-[var(--text-muted)]">
            {neighborhoods[1].name}
          </span>
        </div>
      </div>
    </div>
  )
}
