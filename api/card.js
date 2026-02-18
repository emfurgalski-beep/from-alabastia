const BASE = 'https://cdn.jsdelivr.net/gh/PokemonTCG/pokemon-tcg-data@master'

function parseSetIdFromCardId(cardId) {
  const s = String(cardId || '')
  const idx = s.indexOf('-')
  if (idx <= 0) return null
  return s.slice(0, idx)
}

module.exports = async function handler(req, res) {
  try {
    const id = String(req.query.id || '').trim()
    if (!id) return res.status(400).json({ error: 'Missing id' })

    const setId = parseSetIdFromCardId(id)
    if (!setId) return res.status(400).json({ error: 'Invalid card id' })

    const url = `${BASE}/cards/en/${encodeURIComponent(setId)}.json`
    const r = await fetch(url, { headers: { Accept: 'application/json' } })

    if (!r.ok) return res.status(502).json({ error: `Upstream HTTP ${r.status}` })

    const cards = await r.json()
    const card = (cards || []).find(c => c?.id === id)
    if (!card) return res.status(404).json({ error: 'Card not found' })

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).json({ data: card })
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) })
  }
}