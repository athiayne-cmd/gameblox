import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Layout from './components/layout/Layout'

const Home           = lazy(() => import('./pages/Home'))
const Marketplace    = lazy(() => import('./pages/Marketplace'))
const Categories     = lazy(() => import('./pages/Categories'))
const ProductDetail  = lazy(() => import('./pages/ProductDetail'))
const Sell           = lazy(() => import('./pages/Sell'))
const Login          = lazy(() => import('./pages/Login'))
const Register       = lazy(() => import('./pages/Register'))
const Cart           = lazy(() => import('./pages/Cart'))
const Checkout       = lazy(() => import('./pages/Checkout'))
const MyProfile      = lazy(() => import('./pages/MyProfile'))
const Profile        = lazy(() => import('./pages/Profile'))
const Partners       = lazy(() => import('./pages/Partners'))
const Messages       = lazy(() => import('./pages/Messages'))
const NotFound       = lazy(() => import('./pages/NotFound'))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'))
const Subscription   = lazy(() => import('./pages/Subscription'))
const PremiumSuccess = lazy(() => import('./pages/PremiumSuccess'))
const PremiumCancel  = lazy(() => import('./pages/PremiumCancel'))
const Favorites      = lazy(() => import('./pages/Favorites'))
const Notifications  = lazy(() => import('./pages/Notifications'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="text-gaming-purple animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
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
          <Route path="/favoris"         element={<Favorites />} />
          <Route path="/notifications"   element={<Notifications />} />
          <Route path="*"                element={<NotFound />} />
        </Route>
        <Route path="/connexion"   element={<Login />} />
        <Route path="/inscription" element={<Register />} />
      </Routes>
    </Suspense>
  )
}
