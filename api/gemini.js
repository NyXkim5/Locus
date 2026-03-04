/* global process */

function parseRequestBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return req.body
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' })
  }

  const body = parseRequestBody(req)
  const systemPrompt = body?.systemPrompt
  const contents = body?.contents
  const responseMimeType = body?.responseMimeType || 'application/json'

  if (!systemPrompt || !Array.isArray(contents) || contents.length === 0) {
    return res.status(400).json({ error: 'Invalid request payload' })
  }

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: String(systemPrompt) }] },
          contents,
          generationConfig: { responseMimeType },
        }),
      }
    )

    const data = await upstream.json().catch(() => null)
    if (!upstream.ok) {
      const message = data?.error?.message || `Gemini request failed (${upstream.status})`
      return res.status(upstream.status).json({ error: message })
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return res.status(200).json({ text })
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Unexpected server error' })
  }
}
