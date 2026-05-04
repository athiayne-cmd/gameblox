import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "À l'instant"
  if (mins < 60) return `Il y a ${mins}min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Il y a ${hrs}h`
  return `Il y a ${Math.floor(hrs / 24)}j`
}

export default function Notifications() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/connexion'); return }
    fetchNotifications()
  }, [user])

  async function fetchNotifications() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      setNotifications(data || [])
      if (data?.some(n => !n.read)) {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', user.id)
          .eq('read', false)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <div style={{ minHeight: '100%', background: '#0a0010', paddingBottom: 90 }}>

      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: '#120020', padding: '12px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid rgba(139,0,255,0.2)',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b00ff', padding: 0 }}
        >
          <ArrowLeft size={22} />
        </button>
        <span style={{ fontWeight: 700, fontSize: 16, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
          Notifications
        </span>
        {unread > 0 && (
          <span style={{
            marginLeft: 'auto', background: '#8b00ff',
            borderRadius: 20, padding: '2px 10px',
            fontSize: 12, fontWeight: 700, color: '#fff',
            fontFamily: 'Space Grotesk, sans-serif',
          }}>
            {unread} nouvelle{unread > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div style={{ padding: '14px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              border: '2px solid #8b00ff', borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite', margin: '0 auto',
            }} />
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(139,0,255,0.1)', border: '1px solid rgba(139,0,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto',
            }}>
              <Bell size={30} style={{ color: '#8b00ff' }} />
            </div>
            <p style={{ color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 800, marginTop: 16, marginBottom: 4 }}>
              Aucune notification
            </p>
            <p style={{ color: '#6b6b8a', fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
              Tu seras notifié quand quelqu'un like tes annonces
            </p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              style={{
                background: notif.read ? '#1a0038' : 'rgba(139,0,255,0.1)',
                border: notif.read ? '1px solid rgba(139,0,255,0.2)' : '1px solid rgba(139,0,255,0.5)',
                borderRadius: 12, padding: '13px 14px', marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 12,
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: 'rgba(255,51,85,0.15)', border: '1px solid rgba(255,51,85,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Heart size={17} style={{ color: '#ff3355', fill: '#ff3355' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#fff', fontFamily: 'Rajdhani, sans-serif' }}>
                  {notif.title}
                </p>
                {notif.body && (
                  <p style={{
                    margin: '2px 0 0', fontSize: 12, color: '#a0a0b0',
                    fontFamily: 'Inter, sans-serif',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {notif.body}
                  </p>
                )}
                <p style={{ margin: '3px 0 0', fontSize: 11, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
                  {timeAgo(notif.created_at)}
                </p>
              </div>
              {!notif.read && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b00ff', flexShrink: 0 }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
