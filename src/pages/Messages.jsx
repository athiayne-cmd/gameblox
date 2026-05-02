import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Search, MessageCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { PRODUCTS, SELLERS } from '../utils/mockData'
import { formatRelativeDate } from '../utils/formatters'

const MOCK_CONVERSATIONS = [
  {
    id: 'c1', product: PRODUCTS[0], other: SELLERS[1],
    messages: [
      { id: 'm1', senderId: 's2', text: 'Bonjour, la PS5 est toujours disponible ?', createdAt: '2024-02-20T10:00:00' },
      { id: 'm2', senderId: 'me', text: 'Oui toujours dispo ! Tu veux la voir en vidéo ?', createdAt: '2024-02-20T10:05:00' },
      { id: 'm3', senderId: 's2', text: 'Oui ce serait super, et tu peux livrer sur Abidjan ?', createdAt: '2024-02-20T10:08:00' },
    ]
  },
  {
    id: 'c2', product: PRODUCTS[5], other: SELLERS[2],
    messages: [
      { id: 'm4', senderId: 's3', text: 'Hello, tu acceptes les négociations sur le prix ?', createdAt: '2024-02-19T14:30:00' },
      { id: 'm5', senderId: 'me', text: 'Je peux faire 185 000 FCFA, c\'est mon dernier prix.', createdAt: '2024-02-19T14:45:00' },
    ]
  },
]

export default function Messages() {
  const { user } = useAuth()
  const [activeConv, setActiveConv] = useState(MOCK_CONVERSATIONS[0])
  const [message, setMessage]       = useState('')
  const [conversations, setConvs]   = useState(MOCK_CONVERSATIONS)
  const [showList, setShowList]      = useState(true)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.messages.length])

  function send() {
    if (!message.trim()) return
    const newMsg = { id: Date.now().toString(), senderId: 'me', text: message.trim(), createdAt: new Date().toISOString() }
    setConvs(prev => prev.map(c =>
      c.id === activeConv.id ? { ...c, messages: [...c.messages, newMsg] } : c
    ))
    setActiveConv(prev => ({ ...prev, messages: [...prev.messages, newMsg] }))
    setMessage('')
  }

  const ConversationList = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gaming-border/30">
        <h2 className="font-heading font-bold text-gaming-text-primary mb-3">Messages</h2>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gaming-text-muted" />
          <input placeholder="Rechercher..." className="w-full pl-8 pr-3 py-2 bg-gaming-surface border border-gaming-border rounded-xl text-sm text-gaming-text-primary placeholder:text-gaming-text-muted focus:outline-none focus:border-gaming-purple font-body" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map(conv => {
          const last = conv.messages[conv.messages.length - 1]
          return (
            <button key={conv.id} onClick={() => { setActiveConv(conv); setShowList(false) }}
              className={`w-full flex items-start gap-3 p-4 text-left hover:bg-gaming-card-hover transition-colors border-b border-gaming-border/20
                ${activeConv?.id === conv.id ? 'bg-gaming-purple/10 border-l-2 border-l-gaming-purple' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-cyan flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {conv.other.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-heading font-semibold text-sm text-gaming-text-primary">{conv.other.name}</p>
                  <span className="text-xs text-gaming-text-muted">{formatRelativeDate(last.createdAt)}</span>
                </div>
                <p className="text-xs text-gaming-text-muted font-body truncate">{last.text}</p>
                <p className="text-xs text-gaming-purple font-body truncate mt-0.5">{conv.product.title}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )

  const ChatWindow = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gaming-border/30 flex items-center gap-3">
        <button onClick={() => setShowList(true)} className="lg:hidden p-1 text-gaming-text-muted hover:text-white">
          <ArrowLeft size={18}/>
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-cyan flex items-center justify-center text-sm font-bold text-white">
          {activeConv.other.name[0]}
        </div>
        <div>
          <p className="font-heading font-semibold text-gaming-text-primary text-sm">{activeConv.other.name}</p>
          <p className="text-xs text-gaming-purple font-body truncate max-w-[200px]">{activeConv.product.title}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeConv.messages.map(msg => {
          const isMe = msg.senderId === 'me'
          return (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-body leading-relaxed
                ${isMe
                  ? 'bg-gaming-purple text-white rounded-br-sm'
                  : 'bg-gaming-card border border-gaming-border text-gaming-text-primary rounded-bl-sm'}`}>
                {msg.text}
                <p className={`text-xs mt-1 ${isMe ? 'text-white/60' : 'text-gaming-text-muted'}`}>
                  {formatRelativeDate(msg.createdAt)}
                </p>
              </div>
            </motion.div>
          )
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gaming-border/30">
        <div className="flex items-center gap-3">
          <input value={message} onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Écris un message..."
            className="flex-1 bg-gaming-surface border border-gaming-border rounded-xl px-4 py-2.5 text-sm
                       text-gaming-text-primary placeholder:text-gaming-text-muted focus:outline-none
                       focus:border-gaming-purple transition-all font-body" />
          <button onClick={send} disabled={!message.trim()}
            className="p-2.5 bg-gaming-purple hover:bg-gaming-purple-dark rounded-xl text-white disabled:opacity-40 transition-all">
            <Send size={16}/>
          </button>
        </div>
      </div>
    </div>
  )

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <MessageCircle size={48} className="text-gaming-text-muted mx-auto mb-4" />
        <h2 className="font-display font-bold text-2xl text-white mb-3">Connecte-toi</h2>
        <p className="text-gaming-text-muted font-body mb-6">Pour accéder à tes messages</p>
        <a href="/connexion" className="inline-flex items-center gap-2 px-6 py-3 bg-gaming-purple rounded-xl text-white font-heading font-semibold">
          Se connecter
        </a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <div className="page-container py-6">
        <div className="gaming-card overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
          <div className="flex h-full">
            {/* List — hidden on mobile when chat open */}
            <div className={`w-full lg:w-72 border-r border-gaming-border/30 flex-shrink-0
              ${showList ? 'block' : 'hidden lg:block'}`}>
              <ConversationList />
            </div>

            {/* Chat window */}
            <div className={`flex-1 ${showList ? 'hidden lg:flex' : 'flex'} flex-col`}>
              {activeConv ? <ChatWindow /> : (
                <div className="flex-1 flex items-center justify-center text-gaming-text-muted">
                  <div className="text-center">
                    <MessageCircle size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="font-body text-sm">Sélectionne une conversation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
