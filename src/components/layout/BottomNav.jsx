import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, MessageCircle, Grid2X2, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

const NAV = [
  { path: '/',           icon: Home,          label: 'Accueil',   exact: true  },
  { path: '/marketplace',icon: Search,        label: 'Recherche', exact: false },
  { path: '/messages',   icon: MessageCircle, label: 'Messages',  exact: false },
  { path: '/categories', icon: Grid2X2,       label: 'Catégories',exact: false },
  { path: '/profil',     icon: User,          label: 'Profil',    exact: true  },
]

export default function BottomNav() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [unreadMsg, setUnreadMsg] = useState(0)

  useEffect(() => {
    if (!user) { setUnreadMsg(0); return }
    fetchUnread()
  }, [user, location.pathname])

  async function fetchUnread() {
    try {
      // Compter les messages non lus dans les conversations de l'utilisateur
      const { data: convs } = await supabase
        .from('conversations')
        .select('id')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)

      if (!convs?.length) { setUnreadMsg(0); return }

      const convIds = convs.map(c => c.id)
      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .in('conversation_id', convIds)
        .neq('sender_id', user.id)
        .eq('read', false)

      setUnreadMsg(count || 0)
    } catch {
      // silent
    }
  }

  function handleProfile(e) {
    e.preventDefault()
    if (!user) { navigate('/connexion'); return }
    navigate('/profil')
  }

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 flex"
      style={{
        background: '#120020',
        borderTop: '1px solid rgba(139,0,255,0.2)',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.6)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {NAV.map(item => {
        if (item.path === '/profil') {
          return (
            <button
              key={item.path}
              onClick={handleProfile}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative
                         text-gaming-text-muted hover:text-gaming-purple-light transition-colors"
            >
              <item.icon size={22} strokeWidth={2} />
              <span className="text-[9.5px] font-heading font-semibold tracking-wide">{item.label}</span>
            </button>
          )
        }

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative transition-colors
               ${isActive ? 'text-gaming-purple' : 'text-gaming-text-muted hover:text-gaming-purple-light'}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-gaming-purple rounded-b-full" />
                )}
                <div className="relative">
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1.5 w-[18px] h-[18px] bg-red-500 text-white
                                     rounded-full text-[9px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[9.5px] font-heading tracking-wide ${isActive ? 'font-bold' : 'font-semibold'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
