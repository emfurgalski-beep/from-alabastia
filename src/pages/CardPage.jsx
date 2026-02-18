import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import '../styles/card.css'

function clean(v){ return String(v || '').trim() }

export default function CardPage() {
  const { slug, cardId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const variant = searchParams.get('variant') || 'normal'

  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        const r = await fetch(`/api/card?id=${encodeURIComponent(cardId)}`)
        const j = await r.json()
        if (!r.ok) throw new Error(j?.error || `HTTP ${r.status}`)
        if (alive) setCard(j.data)
      } catch (e) {
        if (alive) setError(String(e.message || e))
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => { alive = false }
  }, [cardId])

  const setId = card?.set?.id
  const setName = card?.set?.name

  const facts = useMemo(() => {
    if (!card) return []
    const out = []
    out.push(['Card ID', card.id])
    if (setName) out.push(['Set', setName])
    if (card.number) out.push(['Number', `#${card.number}`])
    if (card.rarity) out.push(['Rarity', card.rarity])
    if (card.supertype) out.push(['Supertype', card.supertype])
    if (card.subtypes?.length) out.push(['Subtypes', card.subtypes.join(', ')])
    if (card.types?.length) out.push(['Types', card.types.join(', ')])
    if (card.hp) out.push(['HP', String(card.hp)])
    if (card.artist) out.push(['Artist', card.artist])
    return out
  }, [card, setName])

  function setVariant(next) {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev)
      p.set('variant', next)
      return p
    })
  }

  const headerMeta = useMemo(() => {
    if (!card) return ''
    const parts = []
    if (setName) parts.push(setName)
    if (card.number) parts.push(`#${card.number}`)
    if (card.rarity) parts.push(card.rarity)
    return parts.join(' • ')
  }, [card, setName])

  return (
    <main className="page">
      <div className="backRow">
        {setId
          ? <Link to={`/pokemon/expansions/${setId}`} className="backLink">← Back to set</Link>
          : <Link to="/pokemon/expansions" className="backLink">← Back to expansions</Link>
        }
      </div>

      <Breadcrumbs items={[
        { label: 'Expansions', to: '/pokemon/expansions' },
        ...(setId ? [{ label: setName || setId, to: `/pokemon/expansions/${setId}` }] : []),
        { label: slug || 'Card' }
      ]} />

      <div className="cardHeader">
        <div>
          <h1 className="h1">{card ? clean(card.name) : 'Card'}</h1>
          <div className="muted">{loading ? 'Loading…' : headerMeta}</div>
        </div>

        <div className="cardHeaderRight">
          <div className="variantTabs">
            <button className={`tab ${variant === 'normal' ? 'tabActive' : ''}`} onClick={() => setVariant('normal')}>Normal</button>
            <button className={`tab ${variant === 'holo' ? 'tabActive' : ''}`} onClick={() => setVariant('holo')}>Holo</button>
            <button className={`tab ${variant === 'reverse' ? 'tabActive' : ''}`} onClick={() => setVariant('reverse')}>Reverse</button>
          </div>
          <span className="pill">variant: {variant}</span>
        </div>
      </div>

      {loading && <div className="center muted">Loading card…</div>}
      {error && <div className="center error">Error: {error}</div>}

      {!loading && !error && card && (
        <div className="cardLayout">
          <section className="cardPanel">
            <div className="cardImgWrap">
              <div className="cardImgFrame">
                <img className="cardImg" src={card.images?.large || card.images?.small} alt={card.name} />
              </div>
            </div>
          </section>

          <section className="cardPanel">
            <div className="cardInfo">
              <div className="cardInfoRow">
                <span className="pill">{card.supertype || 'Card'}</span>
                {card.types?.map(t => <span className="pill" key={t}>{t}</span>)}
                {card.rarity && <span className="pill">{card.rarity}</span>}
              </div>

              <div className="factGrid">
                {facts.map(([k, v]) => (
                  <div className="fact" key={k}>
                    <div className="factLabel">{k}</div>
                    <div className="factValue">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}