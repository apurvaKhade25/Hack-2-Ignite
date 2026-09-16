import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Trash2 } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import CrisisAlert from '../components/CrisisAlert'
import { sendMessage, getChatHistory } from '../api/api'
import useAuthStore from '../store/authStore'

const suggestions = [
  "I've been feeling anxious lately",
  "Help me calm down right now",
  "I need some motivation today",
  "Give me a breathing exercise",
  "I'm feeling overwhelmed",
  "How can I sleep better?",
]

const demoReplies = [
  "I hear you. That sounds really heavy to carry. Can you tell me more about what's been making you feel this way? I'm here to listen. 💙",
  "It's completely okay to feel that way. Every emotion is valid and temporary.\n\n**Try the 4-7-8 breathing technique:**\n- Inhale for **4 seconds**\n- Hold for **7 seconds**\n- Exhale for **8 seconds**\n\nRepeat 3 times and notice how your body relaxes. 🌿",
  "Thank you for trusting me with this. What's **one small thing** that usually brings you comfort when you're feeling this way?",
  "I'm really glad you're here talking about this. You're showing incredible self-awareness. What feels most heavy on your heart right now?",
  "You're doing **better than you think**. The fact that you're here, reflecting on your feelings, shows real courage and strength. 💚",
  "Remember — you don't have to have everything figured out. Take it **one breath at a time**. 🧘",
]

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#a8d8c8">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*?)$/gm, '<li style="margin-left:16px;list-style:disc">$1</li>')
    .replace(/\n/g, '<br/>')
}

export default function Chat() {
  const { user }                    = useAuthStore()
  const [messages,   setMessages]   = useState([])
  const [input,      setInput]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const [showSugg,   setShowSugg]   = useState(true)
  const [crisis,     setCrisis]     = useState(false)
  const bottomRef                   = useRef(null)
  const inputRef                    = useRef(null)

  const name     = user?.name || user?.username || 'Friend'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  useEffect(() => {
    getChatHistory()
      .then(res => {
        const history = Array.isArray(res.data) ? res.data : []
        if (history.length > 0) {
          const mapped = history.map(h => ({
            role: h.role === 'user' ? 'user' : 'ai',
            text: h.message,
            time: new Date(h.sentAt || Date.now())
              .toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })
          }))
          setMessages(mapped)
          setShowSugg(false)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages, loading])

  function getTime() {
    return new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return
    setShowSugg(false)
    setInput('')
    const userMsg = { role:'user', text, time:getTime() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    try {
      const res  = await sendMessage({ message:text })
      const data = res.data
      const reply = data.message || data.reply || 'I hear you. Tell me more.'
      const time  = data.sentAt
        ? new Date(data.sentAt).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })
        : getTime()
      if (data.crisis === true) setCrisis(true)
      setMessages(prev => [...prev, { role:'ai', text:reply, time }])
    } catch {
      const reply = demoReplies[messages.length % demoReplies.length]
      setMessages(prev => [...prev, { role:'ai', text:reply, time:getTime() }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex min-h-screen"
      style={{ background:'linear-gradient(135deg, #060d1f 0%, #0a1628 50%, #0d1f3a 100%)' }}>
      <Sidebar />

      <main className="ml-64 flex-1 flex flex-col h-screen overflow-hidden">

        {/* Header */}
        <motion.div
          className="px-8 py-5 flex items-center justify-between flex-shrink-0 relative"
          style={{ borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(6,13,31,0.8)', backdropFilter:'blur(20px)' }}
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background:'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(58,175,169,0.4))', border:'1px solid rgba(124,58,237,0.3)' }}
              animate={{ boxShadow:['0 0 15px rgba(124,58,237,0.3)','0 0 30px rgba(58,175,169,0.4)','0 0 15px rgba(124,58,237,0.3)'] }}
              transition={{ duration:3, repeat:Infinity }}
            >
              🤖
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
                  Nirvana AI Companion
                </span>
                <Sparkles size={14} color="#D9C7FF" />
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color:'#4ade80' }}>
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"
                  animate={{ opacity:[1,0.3,1] }}
                  transition={{ duration:2, repeat:Infinity }}
                />
                Online · Powered by Gemini AI · Aware of your moods
              </div>
            </div>
          </div>

          <motion.button
            onClick={() => { setMessages([]); setShowSugg(true); setCrisis(false) }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium"
            style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'rgba(239,68,68,0.7)' }}
            whileHover={{ background:'rgba(239,68,68,0.2)', color:'#fca5a5' }}
          >
            <Trash2 size={13} /> Clear chat
          </motion.button>
        </motion.div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-5">

          {/* Welcome */}
          {messages.length === 0 && (
            <motion.div
              className="flex gap-3 max-w-2xl"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background:'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(58,175,169,0.4))', border:'1px solid rgba(124,58,237,0.3)' }}>
                🤖
              </div>
              <div>
                <div className="px-5 py-4 rounded-3xl rounded-tl-lg text-sm leading-relaxed"
                  style={{ background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.2)', color:'rgba(255,255,255,0.85)' }}>
                  Hi <strong style={{ color:'#a8d8c8' }}>{name.split(' ')[0]}</strong>! 🌿 I'm your Nirvana AI Companion, powered by Gemini.
                  <br /><br />
                  I'm here to listen, support, and guide you through whatever you're feeling. Everything you share with me stays between us.
                  <br /><br />
                  <strong style={{ color:'#D9C7FF' }}>How are you feeling today?</strong>
                </div>
                <div className="text-xs mt-1.5 ml-1" style={{ color:'rgba(255,255,255,0.25)' }}>
                  {getTime()}
                </div>
              </div>
            </motion.div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`flex gap-3 max-w-2xl ${msg.role === 'user' ? 'flex-row-reverse ml-auto' : ''}`}
              initial={{ opacity:0, y:15, scale:0.98 }}
              animate={{ opacity:1, y:0, scale:1 }}
              transition={{ duration:0.3 }}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-teal to-primary text-white'
                  : ''
              }`}
                style={msg.role === 'ai' ? {
                  background:'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(58,175,169,0.4))',
                  border:'1px solid rgba(124,58,237,0.3)'
                } : {
                  background:'linear-gradient(135deg, #2E8B57, #3AAFA9)'
                }}>
                {msg.role === 'user' ? initials : '🤖'}
              </div>

              <div>
                <div
                  className="px-5 py-4 rounded-3xl text-sm leading-relaxed"
                  style={msg.role === 'user' ? {
                    background:'linear-gradient(135deg, rgba(46,139,87,0.25), rgba(58,175,169,0.2))',
                    border:'1px solid rgba(58,175,169,0.25)',
                    color:'rgba(255,255,255,0.9)',
                    borderTopRightRadius:'6px'
                  } : {
                    background:'rgba(124,58,237,0.12)',
                    border:'1px solid rgba(124,58,237,0.2)',
                    color:'rgba(255,255,255,0.85)',
                    borderTopLeftRadius:'6px'
                  }}
                  dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                />
                <div className={`text-xs mt-1.5 ${msg.role === 'user' ? 'text-right mr-1' : 'ml-1'}`}
                  style={{ color:'rgba(255,255,255,0.25)' }}>
                  {msg.time}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing dots */}
          {loading && (
            <motion.div className="flex gap-3 max-w-2xl"
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background:'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(58,175,169,0.4))', border:'1px solid rgba(124,58,237,0.3)' }}>
                🤖
              </div>
              <div className="px-5 py-4 rounded-3xl flex items-center gap-2"
                style={{ background:'rgba(124,58,237,0.12)', border:'1px solid rgba(124,58,237,0.2)' }}>
                {[0,1,2].map(i => (
                  <motion.div key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background:'#7C3AED' }}
                    animate={{ y:[0,-6,0], opacity:[0.4,1,0.4] }}
                    transition={{ duration:0.8, delay:i*0.15, repeat:Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {crisis && <CrisisAlert />}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <AnimatePresence>
          {showSugg && messages.length === 0 && (
            <motion.div
              className="px-8 pb-4 flex gap-2 flex-wrap flex-shrink-0"
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            >
              {suggestions.map((s, i) => (
                <motion.button
                  key={s}
                  onClick={() => { setInput(s); setShowSugg(false); inputRef.current?.focus() }}
                  className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)' }}
                  whileHover={{ background:'rgba(124,58,237,0.2)', borderColor:'rgba(124,58,237,0.4)', color:'#D9C7FF', y:-2 }}
                  initial={{ opacity:0, y:10 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay:i*0.06 }}
                >
                  {s}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input area */}
        <motion.div
          className="px-8 py-5 flex gap-3 items-end flex-shrink-0"
          style={{ borderTop:'1px solid rgba(255,255,255,0.06)', background:'rgba(6,13,31,0.8)', backdropFilter:'blur(20px)' }}
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
        >
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              className="w-full px-5 py-3.5 rounded-2xl text-sm outline-none transition-all resize-none"
              style={{
                background:'rgba(255,255,255,0.06)',
                border:'1.5px solid rgba(255,255,255,0.1)',
                color:'white',
                caretColor:'#a8d8c8',
                maxHeight:'120px',
                lineHeight:'1.5'
              }}
              onFocus={e => { e.target.style.borderColor='#7C3AED'; e.target.style.boxShadow='0 0 0 3px rgba(124,58,237,0.1)' }}
              onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
            />
          </div>

          <motion.button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
            style={{
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, #7C3AED, #3AAFA9)'
                : 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              boxShadow: input.trim() && !loading ? '0 4px 20px rgba(124,58,237,0.3)' : 'none'
            }}
            whileHover={!loading && input.trim() ? { scale:1.1 } : {}}
            whileTap={!loading && input.trim() ? { scale:0.9 } : {}}
          >
            {loading ? (
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate:360 }}
                transition={{ duration:0.8, repeat:Infinity, ease:'linear' }}
              />
            ) : (
              <Send size={16} color={input.trim() ? 'white' : 'rgba(255,255,255,0.3)'} />
            )}
          </motion.button>
        </motion.div>

      </main>
    </div>
  )
}