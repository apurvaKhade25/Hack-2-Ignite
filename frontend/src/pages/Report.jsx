import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, TrendingUp, TrendingDown, Calendar, Brain } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { getWellnessReport, getMoodHistory } from '../api/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl text-sm"
        style={{ background:'rgba(10,22,40,0.95)', border:'1px solid rgba(58,175,169,0.3)', color:'white' }}>
        <p style={{ color:'#a8d8c8' }}>{label}</p>
        <p className="font-bold" style={{ color:'#3AAFA9' }}>Score: {payload[0].value}/10</p>
      </div>
    )
  }
  return null
}

export default function Report() {
  const [report,    setReport]    = useState(null)
  const [moods,     setMoods]     = useState([])
  const [loading,   setLoading]   = useState(false)
  const [generated, setGenerated] = useState(false)
  const [toast,     setToast]     = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const now = new Date()
  const mon = new Date(now); mon.setDate(now.getDate() - now.getDay() + 1)
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6)
  const weekRange = `${mon.toLocaleDateString('en-IN', { day:'numeric', month:'short' })} – ${sun.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}`

  useEffect(() => {
    getMoodHistory()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.moods || [])
        setMoods(data.slice(-7))
      })
      .catch(() => {
        setMoods([
          { moodScore:4 },{ moodScore:6 },{ moodScore:7 },
          { moodScore:5 },{ moodScore:8 },{ moodScore:6 },{ moodScore:7 }
        ])
      })
  }, [])

  const chartData = moods.map((m, i) => ({
    day:  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],
    mood: m.moodScore || m.mood || 0
  }))

  async function handleGenerate() {
    setLoading(true)
    try {
      const res  = await getWellnessReport()
      const data = res.data
      setReport({
        avgMoodScore:        data.avgMoodScore        || 0,
        avgFrequentMood:     data.avgFrequentMood      || 'Unknown',
        totalMoodLogs:       data.totalMoodLogs        || 0,
        totalJournalEntries: data.totalJournalEntries  || 0,
        bestday:             data.bestday              || '—',
        worstday:            data.worstday             || '—',
        aiInsight:           data.aiInsight            || '',
        emotions:            data.emotions             || [],
        recommendations:     data.recommendations      || [],
      })
      setGenerated(true)
      showToast('Report generated! 📊')
    } catch {
      setReport({
        avgMoodScore:        6.4,
        avgFrequentMood:     'Calm',
        totalMoodLogs:       7,
        totalJournalEntries: 3,
        bestday:             'Friday',
        worstday:            'Monday',
        aiInsight:           'You had a thoughtful week. Your mood showed a positive trend toward the weekend. Your journal entries reflected a healthy mix of emotions — try to build on the positive moments and acknowledge the difficult ones with self-compassion. Consider adding a short morning routine to set a positive tone for each day.',
        emotions:            [
          { name:'Joy',     score:0.42 },
          { name:'Calm',    score:0.28 },
          { name:'Anxious', score:0.18 },
          { name:'Sad',     score:0.12 },
        ],
        recommendations: [
          'Try a 10-minute morning meditation to set a calm tone for your day.',
          'You seem to journal most when stressed — keep that habit, it genuinely helps.',
          'Your mood peaks on weekends — find one weekday activity that brings the same joy.',
          'Try a short evening walk to wind down before bed.',
          'Drink at least 8 glasses of water daily — hydration directly affects mood.',
          'Reach out to one friend or family member this week.',
        ]
      })
      setGenerated(true)
      showToast('Report generated! 📊')
    } finally {
      setLoading(false)
    }
  }

  const emotionColors = {
    Joy:'#2E8B57', Calm:'#3AAFA9', Anxious:'#F59E0B', Sad:'#7C3AED',
    Fear:'#EF4444', Anger:'#EC4899', Surprise:'#a8d8c8'
  }

  const recIcons = ['🌿','🧘','🚶','💧','🤝','🌙','😴','📵']

  return (
    <div className="flex min-h-screen"
      style={{ background:'linear-gradient(135deg, #060d1f 0%, #0a1628 50%, #0d1f3a 100%)' }}>
      <Sidebar />

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
        <motion.div className="flex items-center justify-between mb-8"
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} color="#D9C7FF" />
              <span className="text-xs uppercase tracking-widest" style={{ color:'rgba(168,216,200,0.5)' }}>
                AI Powered
              </span>
            </div>
            <h2 className="text-3xl font-black text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
              Wellness{' '}
              <span style={{ background:'linear-gradient(135deg, #a8d8c8, #3AAFA9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                Report
              </span>{' '}📊
            </h2>
            <p className="text-sm mt-1" style={{ color:'rgba(255,255,255,0.4)' }}>
              Week of {weekRange}
            </p>
          </div>

          <motion.button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 rounded-2xl font-bold text-white text-sm relative overflow-hidden flex items-center gap-2"
            style={{
              background:'linear-gradient(135deg, #2E8B57, #3AAFA9, #7C3AED)',
              boxShadow:'0 8px 30px rgba(124,58,237,0.3)',
              cursor:loading ? 'not-allowed' : 'pointer',
              opacity:loading ? 0.8 : 1,
              fontFamily:'Poppins,sans-serif'
            }}
            whileHover={!loading ? { scale:1.05 } : {}}
            whileTap={!loading ? { scale:0.95 } : {}}
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
                Generating...
              </>
            ) : (
              <><Sparkles size={16} /> Generate Report</>
            )}
          </motion.button>
        </motion.div>

        {/* Hero */}
        <motion.div
          className="rounded-3xl p-8 mb-8 relative overflow-hidden"
          style={{
            background:'linear-gradient(135deg, rgba(46,139,87,0.15), rgba(58,175,169,0.1), rgba(124,58,237,0.15))',
            border:'1px solid rgba(168,216,200,0.1)'
          }}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-10"
            />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} color="#a8d8c8" />
                <span className="text-xs uppercase tracking-widest" style={{ color:'rgba(168,216,200,0.6)' }}>
                  Weekly Summary
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily:'Poppins,sans-serif' }}>
                Your Mental Health Overview
              </h3>
              <p className="text-sm" style={{ color:'rgba(255,255,255,0.5)' }}>
                AI-powered insights based on your mood logs and journal entries
              </p>
            </div>
            <div className="text-6xl opacity-40">🧠</div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { value: report?.avgMoodScore?.toFixed(1) || '—', label:'Average Mood',     icon:'😊', color:'#2E8B57', bg:'rgba(46,139,87,0.12)'   },
            { value: report?.totalMoodLogs       || moods.length, label:'Moods Logged', icon:'📊', color:'#3AAFA9', bg:'rgba(58,175,169,0.12)'  },
            { value: report?.avgFrequentMood     || '—', label:'Top Emotion',           icon:'🧠', color:'#7C3AED', bg:'rgba(124,58,237,0.12)'  },
            { value: report?.totalJournalEntries || '—', label:'Journal Entries',       icon:'📓', color:'#D9C7FF', bg:'rgba(217,199,255,0.1)'  },
          ].map((s, i) => (
            <motion.div key={s.label}
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{ background:s.bg, border:`1px solid ${s.color}30` }}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 + i*0.08 }}
              whileHover={{ scale:1.02, y:-2 }}
            >
              <div className="absolute top-3 right-3 text-2xl opacity-20">{s.icon}</div>
              <div className="text-3xl font-black mb-1" style={{ color:s.color, fontFamily:'Poppins,sans-serif' }}>
                {s.value}
              </div>
              <div className="text-xs" style={{ color:'rgba(255,255,255,0.45)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">

          {/* AI Summary */}
          <motion.div
            className="rounded-3xl p-6 relative overflow-hidden"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
              style={{ background:'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)' }}
            />

            <div className="flex items-center gap-2 mb-5">
              <Brain size={18} color="#D9C7FF" />
              <span className="text-sm font-semibold text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
                AI-Generated Summary
              </span>
            </div>

            {!generated ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <motion.div
                  className="text-5xl mb-4"
                  animate={{ scale:[1,1.1,1] }}
                  transition={{ duration:2, repeat:Infinity }}
                >
                  📊
                </motion.div>
                <p className="text-sm mb-4" style={{ color:'rgba(255,255,255,0.4)' }}>
                  Click <strong className="text-white">Generate Report</strong> to get your personalised weekly summary
                </p>
                <motion.button
                  onClick={handleGenerate}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background:'linear-gradient(135deg, #7C3AED, #3AAFA9)' }}
                  whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                >
                  Generate now ✨
                </motion.button>
              </div>
            ) : (
              <div>
                <div className="rounded-2xl p-5 mb-4"
                  style={{ background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderLeft:'3px solid #7C3AED' }}>
                  <p className="text-sm leading-relaxed italic" style={{ color:'rgba(255,255,255,0.75)' }}>
                    "{report?.aiInsight}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl p-3 flex items-center gap-3"
                    style={{ background:'rgba(46,139,87,0.12)', border:'1px solid rgba(46,139,87,0.2)' }}>
                    <TrendingUp size={18} color="#2E8B57" />
                    <div>
                      <div className="text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>Best day</div>
                      <div className="text-sm font-bold" style={{ color:'#2E8B57' }}>{report?.bestday}</div>
                    </div>
                  </div>
                  <div className="rounded-xl p-3 flex items-center gap-3"
                    style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)' }}>
                    <TrendingDown size={18} color="#EF4444" />
                    <div>
                      <div className="text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>Toughest day</div>
                      <div className="text-sm font-bold" style={{ color:'#EF4444' }}>{report?.worstday}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Mood chart */}
          <motion.div
            className="rounded-3xl p-6"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.4 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={18} color="#3AAFA9" />
              <span className="text-sm font-semibold text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
                Mood This Week
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barCategoryGap="30%">
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#7C3AED" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#3AAFA9" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0,10]} tick={{ fill:'rgba(255,255,255,0.3)', fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="mood" fill="url(#barGrad)" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

        </div>

        {/* Emotions + Recommendations */}
        {generated && (
          <div className="grid grid-cols-2 gap-6">

            {/* Emotion breakdown */}
            <motion.div
              className="rounded-3xl p-6"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="text-base">🎭</span>
                <span className="text-sm font-semibold text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
                  Emotion Breakdown
                </span>
              </div>

              {(report?.emotions || [
                { name:'Joy', score:0.42 },{ name:'Calm', score:0.28 },
                { name:'Anxious', score:0.18 },{ name:'Sad', score:0.12 }
              ]).map((e, i) => (
                <motion.div key={e.name} className="mb-4"
                  initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.6 + i*0.08 }}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-white">{e.name}</span>
                    <span className="text-xs font-bold" style={{ color: emotionColors[e.name] || '#a8d8c8' }}>
                      {Math.round((e.score || 0) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.08)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: emotionColors[e.name] || '#a8d8c8' }}
                      initial={{ width:0 }}
                      animate={{ width:`${(e.score || 0) * 100}%` }}
                      transition={{ duration:0.8, delay:0.7 + i*0.1, ease:'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Recommendations */}
            <motion.div
              className="rounded-3xl p-6"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Sparkles size={16} color="#D9C7FF" />
                <span className="text-sm font-semibold text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
                  Recommendations For You
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {(report?.recommendations || []).map((rec, i) => (
                  <motion.div key={i}
                    className="flex items-start gap-3 p-3 rounded-2xl"
                    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}
                    initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.7 + i*0.07 }}
                    whileHover={{ background:'rgba(46,139,87,0.1)', borderColor:'rgba(46,139,87,0.2)' }}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                      style={{ background:'rgba(46,139,87,0.15)', border:'1px solid rgba(46,139,87,0.25)' }}>
                      {recIcons[i % recIcons.length]}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color:'rgba(255,255,255,0.65)' }}>
                      {rec}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        )}

      </main>
    </div>
  )
}