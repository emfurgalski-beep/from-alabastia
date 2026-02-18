const BASE = 'https://cdn.jsdelivr.net/gh/PokemonTCG/pokemon-tcg-data@master'

module.exports = async function handler(req, res) {
  try {
    const url = `${BASE}/sets/en.json`
    const r = await fetch(url, { headers: { Accept: 'application/json' } })

    if (!r.ok) return res.status(502).json({ error: `Upstream HTTP ${r.status}` })

    const data = await r.json()
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).json({ data })
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) })
  }
}