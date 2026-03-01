import useStore from '../store/useStore'

function toKebabCase(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const SCHEMA_PROMPT = `You are a neighborhood data generator for the LOCUS app. Given a city or neighborhood name, generate a complete analysis object as JSON.

The JSON must follow this EXACT schema:
{
  "name": "City Name",
  "coordinates": { "lat": <number>, "lng": <number> },
  "biography": "2-3 sentence description of the city/neighborhood character, lifestyle, and appeal.",
  "categories": [
    {
      "label": "Sustainability",
      "score": <0-100>,
      "factors": [
        {
          "name": "Carbon Footprint",
          "score": <0-100>,
          "confidence": <60-95>,
          "sources": [
            { "name": "<real data source name>", "weight": 0.4, "value": <0-100>, "type": "measured" },
            { "name": "<real data source name>", "weight": 0.35, "value": <0-100>, "type": "measured" },
            { "name": "<AI estimate description>", "weight": 0.25, "value": <0-100>, "type": "estimated" }
          ],
          "frames": {
            "neutral": "Carbon Footprint: <score>",
            "positive": "Better than X% of <region> for <metric>",
            "negative": "Falls behind X% of comparable neighborhoods in <metric>"
          }
        }
      ]
    }
  ]
}

CRITICAL RULES:
1. Sustainability category MUST have exactly these 5 factors in this order: "Carbon Footprint", "Green Transit Score", "Bike Infrastructure", "Renewable Energy", "Green Space Coverage"
2. The other 4 categories (Livability, Safety, Community, Growth) must each have exactly 4 factors with context-appropriate names
3. Categories must be in this order: Sustainability, Livability, Safety, Community, Growth
4. Each factor must have exactly 3 sources with weights summing to ~1.0, and frames with neutral/positive/negative
5. Category score should be the rounded average of its factor scores
6. Use REAL coordinates for the location
7. Use real, plausible data source names (EPA, FBI UCR, Walk Score, Census ACS, etc.)
8. Scores should be realistic and differentiated — not all in the same range
9. The neutral frame format must be: "<Factor Name>: <score>"
10. Return ONLY the JSON object, no markdown fences, no explanation`

import { PRIORITIES } from '../utils/priorities'

export async function generateNeighborhood(cityName, onProgress, priorities = []) {
  const id = toKebabCase(cityName)

  // Dedup guard: if already generated, return existing
  const existing = useStore.getState().generatedNeighborhoods[id]
  if (existing) return existing

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Add VITE_GEMINI_API_KEY to your .env file to generate neighborhood analyses.')
  }

  onProgress?.('Connecting to AI...')

  const fetchWithRetry = async (retries = 2) => {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SCHEMA_PROMPT }] },
          contents: [
            { role: 'user', parts: [{ text: `Generate a complete neighborhood analysis for: ${cityName}${
              priorities.length > 0
                ? `\n\nThe user's top priorities are: ${priorities.map(pid => PRIORITIES.find(p => p.id === pid)?.label).filter(Boolean).join(', ')}. Provide more detailed and differentiated scores for relevant factors.`
                : ''
            }` }] },
          ],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    )

    if (res.status === 429 && retries > 0) {
      onProgress?.('Rate limited, retrying...')
      await new Promise((r) => setTimeout(r, 1500 * (3 - retries)))
      return fetchWithRetry(retries - 1)
    }

    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new Error(body?.error?.message || `API request failed (${res.status})`)
    }

    return res
  }

  onProgress?.(`Generating analysis for ${cityName}...`)
  const res = await fetchWithRetry()

  // Stream response
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let sseBuffer = ''
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    sseBuffer += decoder.decode(value, { stream: true })
    const lines = sseBuffer.split('\n')
    sseBuffer = lines.pop()
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const payload = line.slice(6).trim()
      if (!payload || payload === '[DONE]') continue
      try {
        const event = JSON.parse(payload)
        const chunk = event.candidates?.[0]?.content?.parts?.[0]?.text
        if (chunk) {
          fullText += chunk
          onProgress?.(`Generating analysis for ${cityName}...`)
        }
      } catch {}
    }
  }

  if (!fullText) throw new Error('No response received from AI')

  // Parse the JSON response
  onProgress?.('Processing results...')
  const cleaned = fullText.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '').trim()
  let parsed
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    throw new Error('Failed to parse AI response. Please try again.')
  }

  // Post-process: calculate overall score, add metadata
  const overallScore = Math.round(
    parsed.categories.reduce((sum, cat) => sum + cat.score, 0) / parsed.categories.length
  )

  const neighborhood = {
    id,
    name: parsed.name || cityName,
    coordinates: parsed.coordinates,
    biography: parsed.biography || `AI-generated analysis for ${parsed.name || cityName}.`,
    overallScore,
    categories: parsed.categories,
    isGenerated: true,
    generatedAt: Date.now(),
  }

  // Store it
  useStore.getState().addGeneratedNeighborhood(neighborhood)

  return neighborhood
}
