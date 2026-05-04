import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Categories from './pages/Categories'
import ProductDetail from './pages/ProductDetail'
import Sell from './pages/Sell'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import MyProfile from './pages/MyProfile'
import Profile from './pages/Profile'
import Partners from './pages/Partners'
import Messages from './pages/Messages'
import NotFound from './pages/NotFound'
import PaymentSuccess from './pages/PaymentSuccess'
import Subscription from './pages/Subscription'
import PremiumSuccess from './pages/PremiumSuccess'
import PremiumCancel from './pages/PremiumCancel'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"                element={<Home />} />
        <Route path="/marketplace"     element={<Marketplace />} />
        <Route path="/categories"      element={<Categories />} />
        <Route path="/produit/:slug"   element={<ProductDetail />} />
        <Route path="/vendre"          element={<Sell />} />
        <Route path="/abonnement"      element={<Subscription />} />
        <Route path="/premium/success" element={<PremiumSuccess />} />
        <Route path="/premium/cancel"  element={<PremiumCancel />} />
        <Route path="/panier"          element={<Cart />} />
        <Route path="/paiement"        element={<Checkout />} />
        <Route path="/paiement-succes" element={<PaymentSuccess />} />
        <Route path="/messages"        element={<Messages />} />
        <Route path="/profil"          element={<MyProfile />} />
        <Route path="/profil/:id"      element={<Profile />} />
        <Route path="/partenaires"     element={<Partners />} />
        <Route path="*"                element={<NotFound />} />
      </Route>
      <Route path="/connexion"   element={<Login />} />
      <Route path="/inscription" element={<Register />} />
    </Routes>
  )
}
