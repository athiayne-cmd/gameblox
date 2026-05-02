import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import ProductDetail from './pages/ProductDetail'
import Sell from './pages/Sell'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"              element={<Home />} />
        <Route path="/marketplace"   element={<Marketplace />} />
        <Route path="/produit/:slug" element={<ProductDetail />} />
        <Route path="/vendre"        element={<Sell />} />
        <Route path="/panier"        element={<Cart />} />
        <Route path="/paiement"      element={<Checkout />} />
        <Route path="/messages"      element={<Messages />} />
        <Route path="/profil/:id"    element={<Profile />} />
        <Route path="*"              element={<NotFound />} />
      </Route>
      <Route path="/connexion"   element={<Login />} />
      <Route path="/inscription" element={<Register />} />
    </Routes>
  )
}
