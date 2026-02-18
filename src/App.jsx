import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ExpansionsPage from './pages/ExpansionsPage.jsx'
import SetPage from './pages/SetPage.jsx'
import CardPage from './pages/CardPage.jsx'
import BlogPage from './pages/BlogPage.jsx'
import ShopPage from './pages/ShopPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/pokemon/expansions" replace />} />
        <Route path="/pokemon/expansions" element={<ExpansionsPage />} />
        <Route path="/pokemon/expansions/:setId" element={<SetPage />} />
        <Route path="/pokemon/cards/:slug/:cardId" element={<CardPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/shop" element={<ShopPage />} />
      </Routes>
    </BrowserRouter>
  )
}