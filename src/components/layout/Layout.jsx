import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'

const HIDE_NAV_PATTERNS = [
  '/vendre', '/panier', '/paiement', '/abonnement',
  '/premium/success', '/premium/cancel', '/paiement-succes',
]

export default function Layout() {
  const { pathname } = useLocation()
  const hideNav = HIDE_NAV_PATTERNS.some(p => pathname === p || pathname.startsWith(p + '/'))

  return (
    <div
      className="flex flex-col bg-gaming-bg overflow-hidden relative mx-auto"
      style={{ maxWidth: 440, height: '100dvh', minHeight: '100vh' }}
    >
      <main
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ paddingBottom: hideNav ? 0 : 64 }}
      >
        <Outlet />
      </main>

      {!hideNav && <BottomNav />}
    </div>
  )
}
