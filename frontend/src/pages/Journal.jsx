import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Sparkles, Trash2, Plus } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { getJournals, createJournal, deleteJournal } from '../api/api'

export default function Journal() {
  const [title,    setTitle]    = useState('')
  const [content,  setContent]  = useState('')
  const [journals, setJournals] = useState([])
  const [loading,  setLoading]  = useState(false)
  const [toast,    setToast]    = useState(null)
  const [selected, setSelected] = useState(null)

  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function loadJournals() {
    getJournals()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.journals || [])
        setJournals(data)
      })
      .catch(() => {
        setJournals([
          { id:1, title:'Morning clarity',    content:'Woke up feeling refreshed. Did a 10-minute meditation. Grateful for small peaceful moments.',         createdAt:new Date().toISOString() },
          { id:2, title:'A tough afternoon',  content:'Presentation did not go as planned. Feeling anxious but I know tomorrow will be better.',             createdAt:new Date(Date.now()-86400000).toISOString() },
          { id:3, title:'Weekend reflections',content:'Spent the afternoon with family. We cooked together and watched old home videos. It felt healing.',    createdAt:new Date(Date.now()-172800000).toISOString() },
        ])
      })
  }

  useEffect(() => { loadJournals() }, [])

  async function handleSave(e) {
    e.preventDefault()
    if (!title.trim())   { showToast('Please add a title!',    'error'); return }
    if (!content.trim()) { showToast('Please write something!', 'error'); return }
    setLoading(true)
    try {
      await createJournal({ title, content })
      showToast('Entry saved! AI is analysing emotions... 🧠')
      setTitle(''); setContent('')
      loadJournals()
    } catch {
      showToast('Entry saved (demo)! 🧠')
      setJournals(prev => [{ id:Date.now(), title, content, createdAt:new Date().toISOString() }, ...prev])
      setTitle(''); setContent('')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteJournal(id)
      setJournals(prev => prev.filter(j => j.id !== id))
      if (selected?.id === id) setSelected(null)
      showToast('Entry deleted!')
    } catch {
      setJournals(prev => prev.filter(j => j.id !== id))
      if (selected?.id === id) setSelected(null)
      showToast('Entry deleted!')
    }
  }

  return (
    <div className="flex min-h-screen"
      style={{ background:'linear-gradient(135deg, #060d1f 0%, #0a1628 50%, #0d1f3a 100%)' }}>
      <Sidebar />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2"
            style={{
              background: toast.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(46,139,87,0.15)',
              border: toast.type === 'error' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(46,139,87,0.3)',
              color: toast.type === 'error' ? '#fca5a5' : '#a8d8c8',
              backdropFilter:'blur(20px)'
            }}
            initial={{ opacity:0, x:50 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:50 }}
          >
            {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="ml-64 flex-1 p-8">

        {/* Header */}
        <motion.div className="mb-8"
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} color="#D9C7FF" />
            <span className="text-xs uppercase tracking-widest"
              style={{ color:'rgba(168,216,200,0.5)' }}>
              Private Journal
            </span>
          </div>
          <h2 className="text-3xl font-black text-white"
            style={{ fontFamily:'Poppins,sans-serif' }}>
            Your{' '}
            <span style={{ background:'linear-gradient(135deg, #D9C7FF, #7C3AED)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Journal
            </span>{' '}📓
          </h2>
          <p className="text-sm mt-1" style={{ color:'rgba(255,255,255,0.4)' }}>
            Write freely. Your entries are private and analysed for emotional patterns.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">

          {/* Write form */}
          <motion.div
            className="col-span-2 rounded-3xl p-7 relative overflow-hidden"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}
          >
            {/* Top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
              style={{ background:'linear-gradient(90deg, transparent, rgba(124,58,237,0.6), transparent)' }}
            />

            {/* Header image */}
            <div className="w-full h-28 rounded-2xl overflow-hidden mb-6 relative">
              <img
                src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop"
                alt=""
                className="w-full h-full object-cover"
                style={{ filter:'saturate(0.6) brightness(0.4)' }}
              />
              <div className="absolute inset-0 flex items-center justify-center gap-3">
                <BookOpen size={28} color="rgba(217,199,255,0.8)" />
                <span className="text-white font-bold text-lg"
                  style={{ fontFamily:'Poppins,sans-serif' }}>
                  Write a new entry
                </span>
              </div>
            </div>

            <form onSubmit={handleSave}>

              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color:'rgba(168,216,200,0.7)' }}>
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Give your entry a title..."
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                  style={{ background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.1)', color:'white', caretColor:'#a8d8c8' }}
                  onFocus={e => { e.target.style.borderColor='#7C3AED'; e.target.style.boxShadow='0 0 0 3px rgba(124,58,237,0.1)' }}
                  onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
                />
              </div>

              <div className="mb-2">
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color:'rgba(168,216,200,0.7)' }}>
                  Write your thoughts
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={8}
                  placeholder="What's on your mind today? How are you feeling? This is your safe space..."
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                  style={{ background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.1)', color:'white', caretColor:'#a8d8c8', minHeight:'200px' }}
                  onFocus={e => { e.target.style.borderColor='#7C3AED'; e.target.style.boxShadow='0 0 0 3px rgba(124,58,237,0.1)' }}
                  onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
                />
                <div className="text-right mt-1">
                  <span className="text-xs" style={{ color:'rgba(255,255,255,0.25)' }}>
                    {wordCount} words
                  </span>
                </div>
              </div>

              {/* AI notice */}
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5"
                style={{ background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)' }}>
                <span>🧠</span>
                <span className="text-xs" style={{ color:'rgba(217,199,255,0.8)' }}>
                  AI will automatically analyse emotions in your entry after saving.
                </span>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white text-sm relative overflow-hidden flex items-center justify-center gap-2"
                style={{
                  background:'linear-gradient(135deg, #7C3AED 0%, #3AAFA9 100%)',
                  boxShadow:'0 8px 30px rgba(124,58,237,0.3)',
                  cursor:loading ? 'not-allowed' : 'pointer',
                  opacity:loading ? 0.8 : 1,
                  fontFamily:'Poppins,sans-serif'
                }}
                whileHover={!loading ? { scale:1.02 } : {}}
                whileTap={!loading ? { scale:0.98 } : {}}
              >
                <motion.div className="absolute inset-0"
                  style={{ background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                  animate={{ x:['-100%','200%'] }}
                  transition={{ duration:2, repeat:Infinity, ease:'linear', repeatDelay:2 }}
                />
                {loading ? (
                  <>
                    <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:'linear' }} />
                    Saving...
                  </>
                ) : (
                  <><Plus size={16} /> Save Entry</>
                )}
              </motion.button>

            </form>
          </motion.div>

          {/* Journal list */}
          <motion.div
            className="rounded-3xl p-5 flex flex-col"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles size={14} color="#D9C7FF" />
                <span className="text-sm font-semibold text-white"
                  style={{ fontFamily:'Poppins,sans-serif' }}>
                  Your entries
                </span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ background:'rgba(124,58,237,0.2)', color:'#D9C7FF', border:'1px solid rgba(124,58,237,0.3)' }}>
                {journals.length}
              </span>
            </div>

            {journals.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-8">
                <div className="text-5xl mb-3 opacity-30">📓</div>
                <p className="text-sm text-center" style={{ color:'rgba(255,255,255,0.3)' }}>
                  No entries yet. Write your first one!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-auto">
                {[...journals].reverse().map((j, i) => {
                  const date = new Date(j.createdAt || Date.now())
                    .toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
                  const preview = (j.content || '').slice(0, 80) + ((j.content||'').length > 80 ? '...' : '')
                  const isSelected = selected?.id === j.id

                  return (
                    <motion.div
                      key={j.id}
                      className="p-4 rounded-2xl cursor-pointer relative group"
                      style={{
                        background: isSelected ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
                        border: isSelected ? '1.5px solid rgba(124,58,237,0.5)' : '1.5px solid rgba(255,255,255,0.07)'
                      }}
                      onClick={() => setSelected(isSelected ? null : j)}
                      whileHover={{ scale:1.02, background:'rgba(124,58,237,0.12)' }}
                      initial={{ opacity:0, y:10 }}
                      animate={{ opacity:1, y:0 }}
                      transition={{ delay:0.3 + i * 0.06 }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-sm font-semibold text-white leading-tight">
                          {j.title || 'Untitled'}
                        </span>
                        <motion.button
                          onClick={e => { e.stopPropagation(); handleDelete(j.id) }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          style={{ color:'rgba(239,68,68,0.7)' }}
                          whileHover={{ scale:1.2, color:'#ef4444' }}
                        >
                          <Trash2 size={13} />
                        </motion.button>
                      </div>
                      <p className="text-xs mb-2 leading-relaxed" style={{ color:'rgba(255,255,255,0.4)' }}>
                        {preview}
                      </p>
                      <span className="text-xs" style={{ color:'rgba(255,255,255,0.25)' }}>{date}</span>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Selected entry full view */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center p-6"
                  style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(10px)' }}
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  onClick={() => setSelected(null)}
                >
                  <motion.div
                    className="w-full max-w-lg rounded-3xl p-8 relative"
                    style={{ background:'#0d1f3a', border:'1px solid rgba(124,58,237,0.3)' }}
                    initial={{ scale:0.9, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9, y:20 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
                        {selected.title}
                      </h3>
                      <button onClick={() => setSelected(null)}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)' }}>
                        ✕
                      </button>
                    </div>
                    <p className="text-xs mb-4" style={{ color:'rgba(255,255,255,0.3)' }}>
                      {new Date(selected.createdAt).toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color:'rgba(255,255,255,0.7)', whiteSpace:'pre-wrap' }}>
                      {selected.content}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      </main>
    </div>
  )
}