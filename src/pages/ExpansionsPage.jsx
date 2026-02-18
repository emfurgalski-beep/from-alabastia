import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/expansions.css'

export default function ExpansionsPage() {
  const [sets, setSets] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        const r = await fetch('/api/sets')
        const j = await r.json()
        if (!r.ok) throw new Error(j?.error || `HTTP ${r.status}`)
        if (alive) setSets(j.data || [])
      } catch (e) {
        if (alive) setError(String(e.message || e))
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => { alive = false }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sets
    return sets.filter(s =>
      String(s.name || '').toLowerCase().includes(q) ||
      String(s.series || '').toLowerCase().includes(q)
    )
  }, [sets, query])

  return (
    <main className="page">
      <div className="pageHeader">
        <h1 className="h1">Expansions</h1>
        <div className="muted">{filtered.length} / {sets.length} sets</div>
      </div>

      <input
        className="input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or series…"
      />

      {loading && <div className="center muted">Loading…</div>}
      {error && <div className="center error">Error: {error}</div>}

      {!loading && !error && (
        <div className="setsGrid">
          {filtered.map(set => (
            <Link key={set.id} className="setCard" to={`/pokemon/expansions/${set.id}`}>
              <div className="setLogoWrap">
                {set?.images?.logo
                  ? <img className="setLogo" src={set.images.logo} alt={set.name} />
                  : <div className="setLogoFallback">{set.id}</div>
                }
   pareCardNumber)

        if (alive) {
          setSetInfo(found)
          setCards(sorted)
        }
      } catch (e) {
        if (alive) setError(String(e.message || e))
      } finally {
        if (alive) setLoading(false)
      }
    }

    loadAll()
    return () => { alive = false }
  }, [setId])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return cards
    return cards.filter(c =>
      String(c.name || '').toLowerCase().includes(q) ||
      String(c.number || '').toLowerCase().includes(q) ||
      String(c.rarity || '').toLowerCase().includes(q)
    )
  }, [cards, query])

  const title = setInfo?.name || setId
  const series = setInfo?.series
  const date = setInfo?.releaseDate
  const total = setInfo?.total ?? cards.length
  const ptcgo = setInfo?.ptcgoCode

  return (
    <main className="page">
      <div className="backRow">
        <Link to="/pokemon/expansions" className="backLink">← Back to expansions</Link>
      </div>

      <Breadcrumbs items={[
        { label: 'Expansions', to: '/pokemon/expansions' },
        { label: title }
      ]} />

      <section className="setHero">
        <div className="setHero__logoWrap">
          {setInfo?.images?.logo
            ? <img className="setHero__logo" src={setInfo.images.logo} alt={title} />
            : <div className="setHero__logoFallback">{setId}</div>
          }
        </div>

        <div className="setHero__main">
          <div className="setHero__titleRow">
            <h1 className="setHero__title">{title}</h1>
            {ptcgo && <span className="setHero__badge">{ptcgo}</span>}
          </div>

          <div className="setHero__meta">
            {series && <span className="pill">{series}</span>}
            <span className="pill">{total} cards</span>
            {date && <span className="pill">Released {date}</span>}
          </div>
        </div>

        <div className="setHero__ghost" aria-hidden="true" />
      </section>

      <div className="setTools">
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cards (name, number, rarity)…"
        />
        <div className="muted setTools__count">
          {loading ? 'Loading…' : `${filtered.length} / ${cards.length} cards`}
        </div>
      </div>

      {loading && <div className="center muted">Loading…</div>}
      {error && <div className="center error">Error: {error}</div>}

      {!loading && !error && (
        filtered.length === 0
          ? <div className="center muted">No cards found for this set.</div>
          : <div className="cardGrid">
              {filtered.map(card => {
                const s = slugify(card.name)
                return (
                  <Link
                    key={card.id}
                    className="miniCard"
                    to={`/pokemon/cards/${s}/${card.id}?variant=normal`}
                  >
                    <div className="miniImgWrap">
                      <img className="miniImg" src={card.images?.small} alt={card.name} loading="lazy" />
                    </div>
                    <div className="miniBody">
                      <div className="miniName">{card.name}</div>
                      <div className="miniMeta">
                        <span className="pill">#{card.number}</span>
                        {card.rarity && <span className="pill">{card.rarity}</span>}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
      )}
    </main>
  )
}