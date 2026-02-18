import { Link } from 'react-router-dom'
import '../styles/breadcrumbs.css'

export default function Breadcrumbs({ items = [] }) {
  return (
    <div className="crumbs">
      {items.map((it, idx) => (
        <span key={idx} className="crumbs__item">
          {it.to ? <Link className="crumbs__link" to={it.to}>{it.label}</Link> : <span className="crumbs__text">{it.label}</span>}
          {idx < items.length - 1 && <span className="crumbs__sep">›</span>}
        </span>
      ))}
    </div>
  )
}