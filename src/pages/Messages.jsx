import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Bell } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { PRODUCTS, SELLERS } from '../utils/mockData'

const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    product: PRODUCTS[0],
    other: SELLERS[1],
    unread: 2,
    time: '14:32',
    messages: [
      { id: 'm1', senderId: 's2', text: 'Bonjour, la PS5 est toujours disponible ?', createdAt: '2024-02-20T10:00:00' },
      { id: 'm2', senderId: 'me', text: 'Oui toujours dispo ! Tu veux la voir ?', createdAt: '2024-02-20T10:05:00' },
      { id: 'm3', senderId: 's2', text: 'Oui ce serait super ! Tu peux livrer à Dakar ?', createdAt: '2024-02-20T10:08:00' },
    ],
  },
  {
    id: 'c2',
    product: PRODUCTS[1],
    other: SELLERS[2],
    unread: 0,
    time: 'Hier',
    messages: [
      { id: 'm4', senderId: 's3', text: 'Je peux faire 25 000 FCFA, c\'est mon dernier prix.', createdAt: '2024-02-19T14:45:00' },
      { id: 'm5', senderId: 'me', text: 'Je réfléchis et je te reviens.', createdAt: '2024-02-19T15:00:00' },
    ],
  },
  {
    id: 'c3',
    product: PRODUCTS[4],
    other: SELLERS[3],
    unread: 1,
    time: 'Lun.',
    messages: [
      { id: 'm6', senderId: 's4', text: 'Livraison possible, comptez 2 000 FCFA.', createdAt: '2024-02-18T09:00:00' },
    ],
  },
]

function ConvAvatar({ name, size = 44 }) {
  const colors = ['#8b00ff', '#7b1fa2', '#1565c0', '#00695c', '#c62828', '#e65100']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.38, flexShrink: 0,
      fontFamily: 'Rajdhani, sans-serif',
    }}>
      {name[0]}
    </div>
  )
}

export default function Messages() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState(null)
  const [input, setInput] = useState('')
  const [convs, setConvs] = useState(MOCK_CONVERSATIONS)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active?.messages?.length])

  function sendMsg() {
    if (!input.trim() || !active) return
    const newMsg = { id: Date.now().toString(), senderId: 'me', text: input.trim(), createdAt: new Date().toISOString() }
    setConvs(prev => prev.map(c =>
      c.id === active.id ? { ...c, messages: [...c.messages, newMsg], unread: 0 } : c
    ))
    setActive(prev => ({ ...prev, messages: [...prev.messages, newMsg] }))
    setInput('')
  }

  if (!user) return (
    <div className="min-h-full flex items-center justify-center" style={{ background: '#0a0010' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48 }}>💬</div>
        <h2 style={{ color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 22, fontWeight: 800, marginTop: 12 }}>
          Connecte-toi
        </h2>
        <p style={{ color: '#6b6b8a', fontFamily: 'Inter, sans-serif', marginTop: 6 }}>
          Pour accéder à tes messages
        </p>
        <button
          onClick={() => navigate('/connexion')}
          style={{
            marginTop: 16, background: '#8b00ff', color: '#fff', border: 'none',
            borderRadius: 12, padding: '12px 24px', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
          }}
        >
          Se connecter
        </button>
      </div>
    </div>
  )

  /* ── Chat view ── */
  if (active) return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0a0010' }}>

      {/* Header */}
      <div style={{
        background: '#120020', padding: '12px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid rgba(139,0,255,0.2)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button onClick={() => setActive(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b00ff', padding: 0 }}>
          <ArrowLeft size={22} />
        </button>
        <ConvAvatar name={active.other.name} size={36} />
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
            {active.other.name}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: '#8b00ff', fontFamily: 'Inter, sans-serif' }}>
            📦 {active.product.title.slice(0, 30)}{active.product.title.length > 30 ? '…' : ''}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {active.messages.map(msg => {
          const isMe = msg.senderId === 'me'
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '75%', padding: '9px 13px', borderRadius: 16,
                background: isMe ? '#8b00ff' : '#1a0038',
                color: '#fff',
                fontSize: 13, fontFamily: 'Inter, sans-serif',
                boxShadow: isMe ? '0 2px 12px rgba(139,0,255,0.3)' : '0 2px 8px rgba(0,0,0,0.4)',
                borderBottomRightRadius: isMe ? 4 : 16,
                borderBottomLeftRadius: isMe ? 16 : 4,
                border: isMe ? 'none' : '1px solid rgba(139,0,255,0.2)',
              }}>
                {msg.text}
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{
        background: '#120020', padding: '10px 12px',
        borderTop: '1px solid rgba(139,0,255,0.2)',
        display: 'flex', gap: 8,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMsg()}
          placeholder="Votre message..."
          style={{
            flex: 1, background: 'rgba(139,0,255,0.08)', border: '1px solid rgba(139,0,255,0.25)',
            borderRadius: 22, padding: '10px 14px', fontSize: 13, outline: 'none',
            color: '#fff', fontFamily: 'Inter, sans-serif',
          }}
        />
        <button
          onClick={sendMsg}
          disabled={!input.trim()}
          style={{
            background: '#8b00ff', color: '#fff', border: 'none',
            borderRadius: '50%', width: 40, height: 40, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, opacity: input.trim() ? 1 : 0.4, transition: 'opacity 0.2s',
            boxShadow: '0 0 20px rgba(139,0,255,0.4)',
          }}
        >
          →
        </button>
      </div>
    </div>
  )

  /* ── Conversation list ── */
  return (
    <div className="min-h-full" style={{ background: '#0a0010' }}>

      {/* Header */}
      <div style={{
        padding: '16px 14px 12px', background: '#120020',
        borderBottom: '1px solid rgba(139,0,255,0.2)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <h2 style={{ margin: 0, fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 800, color: '#fff' }}>
          Messages
        </h2>
      </div>

      {/* Notification banner */}
      {convs.some(c => c.unread > 0) && (
        <div style={{
          margin: '12px 14px 4px',
          background: 'rgba(139,0,255,0.12)', borderRadius: 12, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          border: '1px solid rgba(139,0,255,0.3)',
        }}>
          <Bell size={18} style={{ color: '#8b00ff' }} />
          <span style={{ fontSize: 12, color: '#aa33ff', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
            {convs.reduce((acc, c) => acc + c.unread, 0)} nouveau(x) message(s)
          </span>
        </div>
      )}

      {/* List */}
      <div style={{ padding: '8px 14px 20px' }}>
        {convs.map(conv => {
          const last = conv.messages[conv.messages.length - 1]
          return (
            <button
              key={conv.id}
              onClick={() => setActive(conv)}
              style={{
                background: '#1a0038', borderRadius: 12, padding: '12px 14px',
                marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', width: '100%', textAlign: 'left',
                border: '1px solid rgba(139,0,255,0.2)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ position: 'relative' }}>
                <ConvAvatar name={conv.other.name} size={44} />
                {conv.unread > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    background: '#ff3355', color: '#fff', borderRadius: '50%',
                    width: 18, height: 18, fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {conv.unread}
                  </span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
                    {conv.other.name}
                  </span>
                  <span style={{ fontSize: 11, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
                    {conv.time}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: '#a0a0b0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>
                  {last.text}
                </p>
                <span style={{ fontSize: 10, color: '#8b00ff', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
                  📦 {conv.product.title.slice(0, 28)}{conv.product.title.length > 28 ? '…' : ''}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
