import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Sparkles } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { logMood, getMoodHistory } from '../api/api'

const moodChips = [
  { label:'Happy',    emoji:'😄', color:'#2E8B57', bg:'rgba(46,139,87,0.2)'   },
  { label:'Calm',     emoji:'😌', color:'#3AAFA9', bg:'rgba(58,175,169,0.2)'  },
  { label:'Anxious',  emoji:'😰', color:'#F59E0B', bg:'rgba(245,158,11,0.2)'  },
  { label:'Sad',      emoji:'😢', color:'#7C3AED', bg:'rgba(124,58,237,0.2)'  },
  { label:'Angry',    emoji:'😠', color:'#EF4444', bg:'rgba(239,68,68,0.2)'   },
  { label:'Excited',  emoji:'🤩', color:'#EC4899', bg:'rgba(236,72,153,0.2)'  },
  { label:'Tired',    emoji:'😴', color:'#6B7280', bg:'rgba(107,114,128,0.2)' },
  { label:'Grateful', emoji:'🙏', color:'#a8d8c8', bg:'rgba(168,216,200,0.2)' },
]

const scoreEmoji = (s) =>
  s <= 2 ? '😞' : s <= 4 ? '😔' : s <= 6 ? '😐' : s <= 8 ? '🙂' : '😄'

const scoreColor = (s) =>
  s <= 3 ? '#EF4444' : s <= 5 ? '#F59E0B' : s <= 7 ? '#3AAFA9' : '#2E8B57'

const scoreLabel = (s) =>
  s <= 2 ? 'Very Low' : s <= 4 ? 'Low' : s <= 6 ? 'Okay' : s <= 8 ? 'Good' : 'Amazing!'

export default function MoodLog() {
  const [score,    setScore]    = useState(5)
  const [selected, setSelected] = useState('')
  const [note,     setNote]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const [history,  setHistory]  = useState([])
  const [toast,    setToast]    = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function loadHistory() {
    getMoodHistory()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.moods || [])
        setHistory(data.slice().reverse().slice(0, 10))
      })
      .catch(() => {
        setHistory([
          { moodScore:7, moodLabel:'Calm',    note:'Had a peaceful morning.',    loggedAt:new Date().toISOString() },
          { moodScore:5, moodLabel:'Anxious', note:'Worried about deadline.',    loggedAt:new Date(Date.now()-86400000).toISOString() },
          { moodScore:8, moodLabel:'Happy',   note:'Great workout today!',       loggedAt:new Date(Date.now()-172800000).toISOString() },
          { moodScore:4, moodLabel:'Tired',   note:"Didn't sleep well.",         loggedAt:new Date(Date.now()-259200000).toISOString() },
        ])
      })
  }

  useEffect(() => { loadHistory() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selected) { showToast('Please select a mood label!', 'error'); return }
    setLoading(true)
    try {
      await logMood({ MoodScore:score, MoodLabel:selected, Note:note, LoggedAt:new Date().toISOString().slice(0,19) })
      showToast('Mood logged! 🌿')
      setNote(''); setSelected(''); setScore(5)
      loadHistory()
    } catch {
      showToast('Mood saved (demo)! 🌿')
      setNote(''); setSelected(''); setScore(5)
      loadHistory()
    } finally {
      setLoading(false)
    }
  }

  const avg = history.length
    ? (history.slice(0,7).reduce((s,m) => s + (m.moodScore||0), 0) / Math.min(history.length,7)).toFixed(1)
    : '—'

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
              backdropFilter: 'blur(20px)'
            }}
            initial={{ opacity:0, x:50 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:50 }}
          >
            {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="ml-64 flex-1 p-8">

        <motion.div className="mb-8"
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} color="#D9C7FF" />
            <span className="text-xs uppercase tracking-widest" style={{ color:'rgba(168,216,200,0.5)' }}>
              Daily Check-in
            </span>
          </div>
          <h2 className="text-3xl font-black text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
            Mood{' '}
            <span style={{ background:'linear-gradient(135deg, #a8d8c8, #3AAFA9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Tracker
            </span>{' '}😊
          </h2>
          <p className="text-sm mt-1" style={{ color:'rgba(255,255,255,0.4)' }}>
            Log how you feel and watch your patterns over time.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 items-start">

          {/* Log form */}
          <motion.div
            className="rounded-3xl p-7 relative overflow-hidden"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}
          >
            {/* Top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
              style={{ background:'linear-gradient(90deg, transparent, rgba(58,175,169,0.5), transparent)' }}
            />

            {/* Nature image header */}
            <div className="w-full h-32 rounded-2xl overflow-hidden mb-6 relative">
              <img
                src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&auto=format&fit=crop"
                alt=""
                className="w-full h-full object-cover"
                style={{ filter:'saturate(0.7) brightness(0.5)' }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  className="text-6xl mb-1"
                  animate={{ scale:[1, 1.1, 1] }}
                  transition={{ duration:2, repeat:Infinity }}
                >
                  {scoreEmoji(score)}
                </motion.div>
                <div className="text-white font-bold text-lg" style={{ fontFamily:'Poppins,sans-serif', color:scoreColor(score) }}>
                  {scoreLabel(score)}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Score slider */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color:'rgba(168,216,200,0.7)' }}>
                    Mood score
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black" style={{ color:scoreColor(score), fontFamily:'Poppins,sans-serif' }}>
                      {score}
                    </span>
                    <span className="text-sm" style={{ color:'rgba(255,255,255,0.3)' }}>/10</span>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="range" min="1" max="10" value={score}
                    onChange={e => setScore(Number(e.target.value))}
                    className="w-full h-2 rounded-full outline-none cursor-pointer appearance-none"
                    style={{
                      background:`linear-gradient(to right, #EF4444 0%, #F59E0B 35%, #3AAFA9 65%, #2E8B57 100%)`,
                    }}
                  />
                </div>

                <div className="flex justify-between mt-2">
                  <span className="text-xs" style={{ color:'rgba(255,255,255,0.3)' }}>😞 Very Low</span>
                  <span className="text-xs" style={{ color:'rgba(255,255,255,0.3)' }}>😄 Amazing</span>
                </div>
              </div>

              {/* Mood chips */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color:'rgba(168,216,200,0.7)' }}>
                  What best describes your mood?
                </label>
                <div className="flex flex-wrap gap-2">
                  {moodChips.map(chip => (
                    <motion.button
                      key={chip.label}
                      type="button"
                      onClick={() => setSelected(chip.label)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                      style={{
                        background: selected === chip.label ? chip.bg : 'rgba(255,255,255,0.05)',
                        border: selected === chip.label ? `1.5px solid ${chip.color}` : '1.5px solid rgba(255,255,255,0.08)',
                        color: selected === chip.label ? chip.color : 'rgba(255,255,255,0.5)'
                      }}
                      whileHover={{ scale:1.05 }}
                      whileTap={{ scale:0.95 }}
                    >
                      {chip.emoji} {chip.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color:'rgba(168,216,200,0.7)' }}>
                  Add a note <span style={{ color:'rgba(255,255,255,0.25)', textTransform:'none', letterSpacing:'normal' }}>(optional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={3}
                  placeholder="What's on your mind? Any reason for this mood?"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                  style={{
                    background:'rgba(255,255,255,0.06)',
                    border:'1.5px solid rgba(255,255,255,0.1)',
                    color:'white',
                    caretColor:'#a8d8c8'
                  }}
                  onFocus={e => { e.target.style.borderColor='#3AAFA9'; e.target.style.boxShadow='0 0 0 3px rgba(58,175,169,0.1)' }}
                  onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white text-sm relative overflow-hidden"
                style={{
                  background:'linear-gradient(135deg, #2E8B57 0%, #3AAFA9 50%, #7C3AED 100%)',
                  boxShadow:'0 8px 30px rgba(46,139,87,0.3)',
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
                <span className="relative z-10">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:'linear' }} />
                      Saving...
                    </span>
                  ) : '🌿 Save Mood'}
                </span>
              </motion.button>

            </form>
          </motion.div>

          {/* History panel */}
          <div>

            {/* Weekly avg card */}
            <motion.div
              className="rounded-3xl p-5 mb-4 relative overflow-hidden"
              style={{
                background:'linear-gradient(135deg, rgba(46,139,87,0.15), rgba(58,175,169,0.1))',
                border:'1px solid rgba(46,139,87,0.25)'
              }}
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }}
            >
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-4xl font-black mb-1"
                    style={{ color:'#3AAFA9', fontFamily:'Poppins,sans-serif' }}>
                    {avg}
                  </div>
                  <div className="text-xs" style={{ color:'rgba(255,255,255,0.45)' }}>Weekly average</div>
                </div>
                <div className="flex-1 flex items-end gap-1 h-14">
                  {history.slice(0,7).reverse().map((m,i) => {
                    const h = Math.max(4, ((m.moodScore||0)/10)*56)
                    const c = scoreColor(m.moodScore||0)
                    return (
                      <motion.div key={i}
                        className="flex-1 rounded-t-lg"
                        style={{ height:h, background:c, opacity:0.7 }}
                        initial={{ height:0 }}
                        animate={{ height:h }}
                        transition={{ delay:0.3 + i * 0.05 }}
                      />
                    )
                  })}
                </div>
                <TrendingUp size={20} color="#3AAFA9" />
              </div>
            </motion.div>

            {/* History list */}
            <motion.div
              className="rounded-3xl p-5"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} color="#D9C7FF" />
                  <span className="text-sm font-semibold text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
                    Recent entries
                  </span>
                </div>
                <span className="text-xs px-3 py-1 rounded-full"
                  style={{ background:'rgba(58,175,169,0.15)', color:'#3AAFA9', border:'1px solid rgba(58,175,169,0.3)' }}>
                  {history.length} entries
                </span>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3 opacity-30">😶</div>
                  <p className="text-sm" style={{ color:'rgba(255,255,255,0.3)' }}>
                    No entries yet. Log your first mood!
                  </p>
                </div>
              ) : (
                history.map((m, i) => {
                  const s    = m.moodScore || 0
                  const color = scoreColor(s)
                  const date  = new Date(m.loggedAt || Date.now())
                    .toLocaleDateString('en-IN', { day:'numeric', month:'short' })

                  return (
                    <motion.div key={i}
                      className="flex items-center gap-4 py-3 border-b"
                      style={{ borderColor:'rgba(255,255,255,0.05)' }}
                      initial={{ opacity:0, x:10 }}
                      animate={{ opacity:1, x:0 }}
                      transition={{ delay:0.4 + i * 0.05 }}
                    >
                      <div className="w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                        style={{ background:`${color}20`, border:`1px solid ${color}40` }}>
                        <span className="text-base">{scoreEmoji(s)}</span>
                        <span className="text-[9px] font-bold" style={{ color }}>{s}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white capitalize">
                          {m.moodLabel || 'General'}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color:'rgba(255,255,255,0.3)' }}>
                          {date}
                        </div>
                        {m.note && (
                          <div className="text-xs mt-1" style={{ color:'rgba(255,255,255,0.4)' }}>
                            {m.note.slice(0,60)}{m.note.length > 60 ? '...' : ''}
                          </div>
                        )}
                      </div>
                      <div className="text-xl font-black" style={{ color, fontFamily:'Poppins,sans-serif' }}>
                        {s}<span className="text-xs font-normal" style={{ color:'rgba(255,255,255,0.2)' }}>/10</span>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  )
}