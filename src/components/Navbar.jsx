import { NavLink } from 'react-router-dom'
import '../styles/navbar.css'

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__brand">
          <span className="nav__bolt">⚡</span>
          <span className="nav__name">From Alabastia</span>
        </div>

        <nav className="nav__links">
          <NavLink className={({isActive}) => `nav__link ${isActive ? 'nav__link--active' : ''}`} to="/pokemon/expansions">
            Expansions
          </NavLink>
          <NavLink className={({isActive}) => `nav__link ${isActive ? 'nav__link--active' : ''}`} to="/blog">
            Blog (soon)
          </NavLink>
          <NavLink className={({isActive}) => `nav__link ${isActive ? 'nav__link--active' : ''}`} to="/shop">
            Shop (later)
          </NavLink>
        </nav>
      </div>
    </header>
  )
}