import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Avatar({ name = '?', avatarUrl = null, size = 44 }) {
  const colors = ['#8b00ff', '#7b1fa2', '#1565c0', '#00695c', '#c62828', '#e65100']
  const color = colors[(name.charCodeAt(0) || 0) % colors.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.38, flexShrink: 0,
      fontFamily: 'Rajdhani, sans-serif', overflow: 'hidden',
    }}>
      {avatarUrl
        ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : name[0]?.toUpperCase() || '?'
      }
    </div>
  )
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now - d) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return d.toLocaleDateString('fr-FR', { weekday: 'short' })
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default function Messages() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [selectedMsgId, setSelectedMsgId] = useState(null)
  const endRef = useRef(null)

  useEffect(() => {
    if (!user) return
    loadConversations()
  }, [user])

  // Ouvrir la conv passée par navigation (depuis "Contacter")
  useEffect(() => {
    if (!user || !location.state?.convId || conversations.length === 0) return
    const conv = conversations.find(c => c.id === location.state.convId)
    if (conv) openConversation(conv)
  }, [conversations, location.state?.convId, user])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Realtime — nouveaux messages sans rechargement
  useEffect(() => {
    if (!activeConv) return
    const channel = supabase
      .channel(`messages:${activeConv.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${activeConv.id}`,
      }, payload => {
        setMessages(prev =>
          prev.find(m => m.id === payload.new.id) ? prev : [...prev, payload.new]
        )
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [activeConv?.id])

  async function loadConversations() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('conversations')
        .select(`
          id, last_message, updated_at,
          products(id, title, images),
          buyer:profiles!conversations_buyer_id_fkey(id, full_name, username),
          seller:profiles!conversations_seller_id_fkey(id, full_name, username)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false })
      setConversations(data || [])
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  async function openConversation(conv) {
    setActiveConv(conv)
    const { data } = await supabase
      .from('messages')
      .select('id, content, sender_id, created_at')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: true })
    setMessages(data || [])
    // Marquer comme lus
    supabase.from('messages').update({ read: true })
      .eq('conversation_id', conv.id)
      .neq('sender_id', user.id)
      .eq('read', false)
      .then(() => {})
  }

  async function sendMessage() {
    if (!input.trim() || !activeConv || sending) return
    setSending(true)
    const text = input.trim()
    setInput('')
    try {
      const { data: msg, error } = await supabase
        .from('messages')
        .insert({ conversation_id: activeConv.id, sender_id: user.id, content: text })
        .select('id, content, sender_id, created_at')
        .single()
      if (error) throw error
      setMessages(prev => [...prev, msg])
      await supabase.from('conversations')
        .update({ last_message: text, updated_at: new Date().toISOString() })
        .eq('id', activeConv.id)
    } catch {
      setInput(text)
    } finally {
      setSending(false)
    }
  }

  async function deleteMessage(msgId) {
    setSelectedMsgId(null)
    const { error } = await supabase.from('messages').delete().eq('id', msgId).eq('sender_id', user.id)
    if (error) return

    const updated = messages.filter(m => m.id !== msgId)
    setMessages(updated)

    // Mettre à jour last_message de la conversation
    const lastMsg = updated[updated.length - 1]
    await supabase.from('conversations')
      .update({ last_message: lastMsg?.content || '', updated_at: new Date().toISOString() })
      .eq('id', activeConv.id)
  }

  if (!user) return (
    <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0010' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48 }}>💬</div>
        <h2 style={{ color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 22, fontWeight: 800, marginTop: 12 }}>
          Connecte-toi
        </h2>
        <p style={{ color: '#6b6b8a', fontFamily: 'Inter, sans-serif', marginTop: 6 }}>
          Pour accéder à tes messages
        </p>
        <button onClick={() => navigate('/connexion')} style={{ marginTop: 16, background: '#8b00ff', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: 14 }}>
          Se connecter
        </button>
      </div>
    </div>
  )

  /* ── Chat view ── */
  if (activeConv) {
    const other = activeConv.buyer?.id === user.id ? activeConv.seller : activeConv.buyer
    const otherName = other?.full_name || other?.username || 'Utilisateur'
    const productTitle = activeConv.products?.title || ''

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0a0010' }}>

        <div style={{ background: '#120020', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(139,0,255,0.2)', position: 'sticky', top: 0, zIndex: 10 }}>
          <button onClick={() => { setActiveConv(null); setMessages([]) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b00ff', padding: 0 }}>
            <ArrowLeft size={22} />
          </button>
          <Avatar name={otherName} size={36} />
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>{otherName}</p>
            {productTitle && (
              <p style={{ margin: 0, fontSize: 11, color: '#8b00ff', fontFamily: 'Inter, sans-serif' }}>
                📦 {productTitle.slice(0, 30)}{productTitle.length > 30 ? '…' : ''}
              </p>
            )}
          </div>
        </div>

        <div
          style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}
          onClick={() => setSelectedMsgId(null)}
        >
          {messages.length === 0 && (
            <p style={{ textAlign: 'center', color: '#6b6b8a', fontSize: 13, fontFamily: 'Inter, sans-serif', marginTop: 40 }}>
              Commence la conversation 👋
            </p>
          )}
          {messages.map(msg => {
            const isMe = msg.sender_id === user.id
            const isSelected = selectedMsgId === msg.id
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                <div
                  onClick={e => { e.stopPropagation(); isMe && setSelectedMsgId(isSelected ? null : msg.id) }}
                  style={{
                    maxWidth: '75%', padding: '9px 13px', borderRadius: 16,
                    background: isMe ? (isSelected ? '#6a00cc' : '#8b00ff') : '#1a0038',
                    color: '#fff', fontSize: 13, fontFamily: 'Inter, sans-serif',
                    boxShadow: isMe ? '0 2px 12px rgba(139,0,255,0.3)' : '0 2px 8px rgba(0,0,0,0.4)',
                    borderBottomRightRadius: isMe ? 4 : 16,
                    borderBottomLeftRadius: isMe ? 16 : 4,
                    border: isMe ? 'none' : '1px solid rgba(139,0,255,0.2)',
                    cursor: isMe ? 'pointer' : 'default',
                    transition: 'background 0.15s',
                  }}
                >
                  {msg.content}
                </div>
                {isMe && isSelected && (
                  <button
                    onClick={e => { e.stopPropagation(); deleteMessage(msg.id) }}
                    style={{
                      marginTop: 4, display: 'flex', alignItems: 'center', gap: 5,
                      background: 'rgba(255,51,85,0.15)', border: '1px solid rgba(255,51,85,0.3)',
                      borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
                      color: '#ff3355', fontSize: 11, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif',
                    }}
                  >
                    <Trash2 size={11} /> Supprimer
                  </button>
                )}
              </div>
            )
          })}
          <div ref={endRef} />
        </div>

        <div style={{ background: '#120020', padding: '10px 12px', borderTop: '1px solid rgba(139,0,255,0.2)', display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Votre message..."
            style={{ flex: 1, background: 'rgba(139,0,255,0.08)', border: '1px solid rgba(139,0,255,0.25)', borderRadius: 22, padding: '10px 14px', fontSize: 13, outline: 'none', color: '#fff', fontFamily: 'Inter, sans-serif' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            style={{ background: '#8b00ff', color: '#fff', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, opacity: input.trim() && !sending ? 1 : 0.4, transition: 'opacity 0.2s', boxShadow: '0 0 20px rgba(139,0,255,0.4)' }}
          >
            →
          </button>
        </div>
      </div>
    )
  }

  /* ── Liste des conversations ── */
  return (
    <div style={{ minHeight: '100%', background: '#0a0010' }}>

      <div style={{ padding: '16px 14px 12px', background: '#120020', borderBottom: '1px solid rgba(139,0,255,0.2)', position: 'sticky', top: 0, zIndex: 10 }}>
        <h2 style={{ margin: 0, fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 800, color: '#fff' }}>
          Messages
        </h2>
      </div>

      <div style={{ padding: '8px 14px 90px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #8b00ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48 }}>💬</div>
            <p style={{ color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 800, marginTop: 16, marginBottom: 4 }}>
              Aucun message
            </p>
            <p style={{ color: '#6b6b8a', fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
              Contacte un vendeur depuis une annonce
            </p>
          </div>
        ) : (
          conversations.map(conv => {
            const other = conv.buyer?.id === user.id ? conv.seller : conv.buyer
            const otherName = other?.full_name || other?.username || 'Utilisateur'
            const productTitle = conv.products?.title || ''
            return (
              <button
                key={conv.id}
                onClick={() => openConversation(conv)}
                style={{ background: '#1a0038', borderRadius: 12, padding: '12px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', width: '100%', textAlign: 'left', border: '1px solid rgba(139,0,255,0.2)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
              >
                <Avatar name={otherName} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
                      {otherName}
                    </span>
                    <span style={{ fontSize: 11, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
                      {formatTime(conv.updated_at)}
                    </span>
                  </div>
                  {conv.last_message && (
                    <p style={{ margin: 0, fontSize: 12, color: '#a0a0b0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>
                      {conv.last_message}
                    </p>
                  )}
                  {productTitle && (
                    <span style={{ fontSize: 10, color: '#8b00ff', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
                      📦 {productTitle.slice(0, 30)}{productTitle.length > 30 ? '…' : ''}
                    </span>
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
