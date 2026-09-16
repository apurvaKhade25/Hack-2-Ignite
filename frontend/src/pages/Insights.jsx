import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, TrendingUp, TrendingDown, Brain, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { getMoodPrediction } from '../api/api'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'

const confidenceConfig = {
  INSUFFICIENT_DATA: {
    color:   '#F59E0B',
    bg:      'rgba(245,158,11,0.15)',
    border:  'rgba(245,158,11,0.3)',
    icon:    Clock,
    label:   'Not enough data yet',
    desc:    'Keep logging daily — predictions unlock after 14 entries!'
  },
  LOW: {
    color:   '#3AAFA9',
    bg:      'rgba(58,175,169,0.15)',
    border:  'rgba(58,175,169,0.3)',
    icon:    AlertCircle,
    label:   'Low confidence',
    desc:    'Based on limited data. Keep logging for better accuracy!'
  },
  MODERATE: {
    color:   '#2E8B57',
    bg:      'rgba(46,139,87,0.15)',
    border:  'rgba(46,139,87,0.3)',
    icon:    CheckCircle,
    label:   'Moderate confidence',
    desc:    'Based on 20+ mood logs. Prediction is fairly reliable!'
  },
  HIGH: {
    color:   '#7C3AED',
    bg:      'rgba(124,58,237,0.15)',
    border:  'rgba(124,58,237,0.3)',
    icon:    Sparkles,
    label:   'High confidence',
    desc:    'Based on extensive data. Very reliable prediction!'
  }
}

const dayColors = {
  MONDAY:    '#EF4444',
  TUESDAY:   '#F59E0B',
  WEDNESDAY: '#3AAFA9',
  THURSDAY:  '#2E8B57',
  FRIDAY:    '#7C3AED',
  SATURDAY:  '#EC4899',
  SUNDAY:    '#a8d8c8'
}

const dayShort = {
  MONDAY:'Mon', TUESDAY:'Tue', WEDNESDAY:'Wed',
  THURSDAY:'Thu', FRIDAY:'Fri', SATURDAY:'Sat', SUNDAY:'Sun'
}

const scoreColor = (s) =>
  !s ? '#666' : s <= 3 ? '#EF4444' : s <= 5 ? '#F59E0B' : s <= 7 ? '#3AAFA9' : '#2E8B57'

const scoreEmoji = (s) =>
  !s ? '❓' : s <= 2 ? '😞' : s <= 4 ? '😔' : s <= 6 ? '😐' : s <= 8 ? '🙂' : '😄'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl text-sm"
        style={{ background:'rgba(10,22,40,0.95)', border:'1px solid rgba(58,175,169,0.3)', color:'white' }}>
        <p style={{ color:'#a8d8c8' }}>{label}</p>
        <p className="font-bold" style={{ color:'#3AAFA9' }}>Avg: {payload[0].value}/10</p>
      </div>
    )
  }
  return null
}

export default function Insights() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  useEffect(() => {
    getMoodPrediction()
      .then(res => {
        setData(res.data)
      })
      .catch(() => {
        // Demo data for testing
        setData({
          data: {
            weeklyPattern: {
              MONDAY:    3.8,
              TUESDAY:   5.2,
              WEDNESDAY: 6.9,
              THURSDAY:  7.1,
              FRIDAY:    8.0,
              SATURDAY:  7.8,
              SUNDAY:    4.5
            },
            lowestDay:       'MONDAY',
            highestDay:      'FRIDAY',
            tomorrowEstimate: 6.4,
            confidence:      'MODERATE'
          },
          narrativeInsight: "Your mood pattern shows a dip on Mondays and Sundays, with Fridays consistently your best day. Tomorrow's trend looks moderate — nothing unusual to flag right now."
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const confidence    = data?.data?.confidence || 'INSUFFICIENT_DATA'
  const config        = confidenceConfig[confidence] || confidenceConfig.INSUFFICIENT_DATA
  const ConfigIcon    = config.icon
  const weeklyPattern = data?.data?.weeklyPattern || {}
  const tomorrow      = data?.data?.tomorrowEstimate
  const lowestDay     = data?.data?.lowestDay
  const highestDay    = data?.data?.highestDay
  const narrative     = data?.narrativeInsight || ''

  const chartData = Object.entries(weeklyPattern).map(([day, score]) => ({
    day:   dayShort[day] || day,
    score: Number(score.toFixed(1)),
    full:  day,
    color: dayColors[day] || '#3AAFA9'
  }))

  const tomorrow_day = new Date(Date.now() + 86400000)
    .toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'short' })

  return (
    <div className="flex min-h-screen"
      style={{ background:'linear-gradient(135deg, #060d1f 0%, #0a1628 50%, #0d1f3a 100%)' }}>
      <Sidebar />

      <main className="ml-64 flex-1 p-8">

        {/* Header */}
        <motion.div className="mb-8"
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>
          <div className="flex items-center gap-2 mb-1">
            <Brain size={16} color="#D9C7FF" />
            <span className="text-xs uppercase tracking-widest"
              style={{ color:'rgba(168,216,200,0.5)' }}>
              AI Powered · Gemini
            </span>
          </div>
          <h2 className="text-3xl font-black text-white"
            style={{ fontFamily:'Poppins,sans-serif' }}>
            Mood{' '}
            <span style={{ background:'linear-gradient(135deg, #D9C7FF, #7C3AED)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Insights
            </span>{' '}🔮
          </h2>
          <p className="text-sm mt-1" style={{ color:'rgba(255,255,255,0.4)' }}>
            AI-powered mood prediction based on your personal patterns.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="w-16 h-16 border-4 rounded-full"
                style={{ borderColor:'rgba(124,58,237,0.2)', borderTopColor:'#7C3AED' }}
                animate={{ rotate:360 }}
                transition={{ duration:1, repeat:Infinity, ease:'linear' }}
              />
              <p className="text-sm" style={{ color:'rgba(255,255,255,0.4)' }}>
                Analysing your mood patterns...
              </p>
            </div>
          </div>
        ) : (
          <>

            {/* Hero — Tomorrow prediction */}
            <motion.div
              className="rounded-3xl p-8 mb-8 relative overflow-hidden"
              style={{
                background:'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(58,175,169,0.15), rgba(46,139,87,0.2))',
                border:'1px solid rgba(124,58,237,0.25)'
              }}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            >
              <div className="absolute top-[-40px] right-[-40px] w-64 h-64 rounded-full blur-3xl pointer-events-none"
                style={{ background:'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)' }}
              />
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop"
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ opacity:0.05 }}
                />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} color="#D9C7FF" />
                    <span className="text-xs uppercase tracking-widest font-semibold"
                      style={{ color:'rgba(217,199,255,0.7)' }}>
                      Tomorrow's prediction · {tomorrow_day}
                    </span>
                  </div>

                  {confidence === 'INSUFFICIENT_DATA' ? (
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2"
                        style={{ fontFamily:'Poppins,sans-serif' }}>
                        Keep logging your mood! 📊
                      </h3>
                      <p className="text-sm" style={{ color:'rgba(255,255,255,0.55)', maxWidth:'450px' }}>
                        {narrative || "Log your mood daily for at least 2 weeks to unlock AI-powered mood predictions!"}
                      </p>
                      <div className="flex items-center gap-2 mt-4">
                        <div className="h-2 rounded-full overflow-hidden flex-1"
                          style={{ background:'rgba(255,255,255,0.1)', maxWidth:'200px' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background:'linear-gradient(90deg, #7C3AED, #3AAFA9)' }}
                            initial={{ width:0 }}
                            animate={{ width:'28%' }}
                            transition={{ duration:1, delay:0.5 }}
                          />
                        </div>
                        <span className="text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>
                          4/14 entries logged
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2"
                        style={{ fontFamily:'Poppins,sans-serif' }}>
                        Tomorrow looks{' '}
                        <span style={{ color: scoreColor(tomorrow) }}>
                          {tomorrow >= 7 ? 'great!' : tomorrow >= 5 ? 'okay.' : 'challenging.'}
                        </span>
                      </h3>
                      <p className="text-sm" style={{ color:'rgba(255,255,255,0.55)', maxWidth:'450px', lineHeight:'1.7' }}>
                        {narrative}
                      </p>
                    </div>
                  )}
                </div>

                {/* Tomorrow score circle */}
                {confidence !== 'INSUFFICIENT_DATA' && tomorrow && (
                  <motion.div
                    className="flex flex-col items-center justify-center w-32 h-32 rounded-3xl relative flex-shrink-0"
                    style={{
                      background:`${scoreColor(tomorrow)}20`,
                      border:`2px solid ${scoreColor(tomorrow)}50`
                    }}
                    initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.3, type:'spring' }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-3xl"
                      style={{ border:`2px solid ${scoreColor(tomorrow)}` }}
                      animate={{ opacity:[0.3, 0.7, 0.3] }}
                      transition={{ duration:2, repeat:Infinity }}
                    />
                    <div className="text-4xl mb-1">{scoreEmoji(tomorrow)}</div>
                    <div className="text-3xl font-black" style={{ color:scoreColor(tomorrow), fontFamily:'Poppins,sans-serif' }}>
                      {tomorrow}
                    </div>
                    <div className="text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>/10</div>
                  </motion.div>
                )}

                {confidence === 'INSUFFICIENT_DATA' && (
                  <motion.div
                    className="flex flex-col items-center justify-center w-32 h-32 rounded-3xl"
                    style={{ background:'rgba(245,158,11,0.15)', border:'2px solid rgba(245,158,11,0.3)' }}
                    animate={{ opacity:[0.5, 1, 0.5] }}
                    transition={{ duration:2, repeat:Infinity }}
                  >
                    <div className="text-4xl mb-1">🔮</div>
                    <div className="text-xs text-center px-2" style={{ color:'rgba(255,255,255,0.4)' }}>
                      Unlocks soon!
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Confidence badge */}
              <motion.div
                className="relative z-10 mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background:config.bg, border:`1px solid ${config.border}` }}
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
              >
                <ConfigIcon size={14} style={{ color:config.color }} />
                <span className="text-xs font-semibold" style={{ color:config.color }}>
                  {config.label}
                </span>
                <span className="text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>
                  · {config.desc}
                </span>
              </motion.div>
            </motion.div>

            {/* Best and worst day cards */}
            <div className="grid grid-cols-3 gap-5 mb-8">

              <motion.div
                className="rounded-3xl p-5 relative overflow-hidden"
                style={{ background:'rgba(46,139,87,0.12)', border:'1px solid rgba(46,139,87,0.25)' }}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
                whileHover={{ scale:1.02 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={16} color="#2E8B57" />
                  <span className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color:'rgba(46,139,87,0.8)' }}>Best day</span>
                </div>
                <div className="text-2xl font-black mb-1"
                  style={{ color:'#2E8B57', fontFamily:'Poppins,sans-serif' }}>
                  {highestDay ? (dayShort[highestDay] || highestDay) : '—'}
                </div>
                <div className="text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>
                  {highestDay && weeklyPattern[highestDay]
                    ? `Avg score: ${weeklyPattern[highestDay].toFixed(1)}/10`
                    : 'Not enough data yet'}
                </div>
                <div className="absolute bottom-4 right-4 text-3xl opacity-20">😄</div>
              </motion.div>

              <motion.div
                className="rounded-3xl p-5 relative overflow-hidden"
                style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)' }}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
                whileHover={{ scale:1.02 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown size={16} color="#EF4444" />
                  <span className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color:'rgba(239,68,68,0.8)' }}>Toughest day</span>
                </div>
                <div className="text-2xl font-black mb-1"
                  style={{ color:'#EF4444', fontFamily:'Poppins,sans-serif' }}>
                  {lowestDay ? (dayShort[lowestDay] || lowestDay) : '—'}
                </div>
                <div className="text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>
                  {lowestDay && weeklyPattern[lowestDay]
                    ? `Avg score: ${weeklyPattern[lowestDay].toFixed(1)}/10`
                    : 'Not enough data yet'}
                </div>
                <div className="absolute bottom-4 right-4 text-3xl opacity-20">😔</div>
              </motion.div>

              <motion.div
                className="rounded-3xl p-5 relative overflow-hidden"
                style={{ background:'rgba(124,58,237,0.12)', border:'1px solid rgba(124,58,237,0.25)' }}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
                whileHover={{ scale:1.02 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={16} color="#7C3AED" />
                  <span className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color:'rgba(124,58,237,0.8)' }}>Days tracked</span>
                </div>
                <div className="text-2xl font-black mb-1"
                  style={{ color:'#7C3AED', fontFamily:'Poppins,sans-serif' }}>
                  {Object.keys(weeklyPattern).length}/7
                </div>
                <div className="text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>
                  {Object.keys(weeklyPattern).length === 7
                    ? 'Full week pattern!'
                    : `${7 - Object.keys(weeklyPattern).length} more days needed`}
                </div>
                <div className="absolute bottom-4 right-4 text-3xl opacity-20">📅</div>
              </motion.div>

            </div>

            {/* Weekly pattern chart */}
            <div className="grid grid-cols-2 gap-6 mb-8">

              <motion.div
                className="rounded-3xl p-6"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
                initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.4 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp size={16} color="#3AAFA9" />
                      <span className="text-sm font-semibold text-white"
                        style={{ fontFamily:'Poppins,sans-serif' }}>
                        Weekly Pattern
                      </span>
                    </div>
                    <p className="text-xs" style={{ color:'rgba(255,255,255,0.35)' }}>
                      Average mood score by day of week
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{ background:config.bg, color:config.color, border:`1px solid ${config.border}` }}>
                    {confidence}
                  </div>
                </div>

                {chartData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="text-4xl mb-3 opacity-30">📊</div>
                    <p className="text-sm text-center" style={{ color:'rgba(255,255,255,0.3)' }}>
                      Not enough data yet. Keep logging daily!
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} barCategoryGap="25%">
                      <XAxis dataKey="day" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0,10]} tick={{ fill:'rgba(255,255,255,0.3)', fontSize:11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="score" radius={[8,8,0,0]}>
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} fillOpacity={0.8} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </motion.div>

              {/* Day by day breakdown */}
              <motion.div
                className="rounded-3xl p-6"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
                initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5 }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles size={16} color="#D9C7FF" />
                  <span className="text-sm font-semibold text-white"
                    style={{ fontFamily:'Poppins,sans-serif' }}>
                    Day by Day
                  </span>
                </div>

                {Object.keys(dayColors).map((day, i) => {
                  const score = weeklyPattern[day]
                  const color = score ? scoreColor(score) : 'rgba(255,255,255,0.15)'
                  const hasData = score !== undefined

                  return (
                    <motion.div key={day}
                      className="flex items-center gap-3 mb-3"
                      initial={{ opacity:0, x:10 }}
                      animate={{ opacity:1, x:0 }}
                      transition={{ delay:0.6 + i*0.06 }}
                    >
                      <div className="w-10 text-xs font-semibold" style={{ color:'rgba(255,255,255,0.4)' }}>
                        {dayShort[day]}
                      </div>
                      <div className="flex-1 h-2.5 rounded-full overflow-hidden"
                        style={{ background:'rgba(255,255,255,0.06)' }}>
                        {hasData && (
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background:color }}
                            initial={{ width:0 }}
                            animate={{ width:`${(score/10)*100}%` }}
                            transition={{ duration:0.8, delay:0.7 + i*0.06, ease:'easeOut' }}
                          />
                        )}
                      </div>
                      <div className="w-8 text-right">
                        {hasData ? (
                          <span className="text-xs font-bold" style={{ color }}>
                            {score.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-xs" style={{ color:'rgba(255,255,255,0.2)' }}>—</span>
                        )}
                      </div>
                      <div className="text-sm">{hasData ? scoreEmoji(score) : '❓'}</div>
                    </motion.div>
                  )
                })}
              </motion.div>

            </div>

            {/* Tips based on pattern */}
            {confidence !== 'INSUFFICIENT_DATA' && lowestDay && (
              <motion.div
                className="rounded-3xl p-6"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles size={16} color="#D9C7FF" />
                  <span className="text-sm font-semibold text-white"
                    style={{ fontFamily:'Poppins,sans-serif' }}>
                    Personalised Tips Based On Your Pattern
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      icon:'📅',
                      title:`${dayShort[lowestDay] || lowestDay} is your toughest day`,
                      desc:`Plan something you enjoy on ${dayShort[lowestDay] || lowestDay}s to boost your mood proactively.`,
                      color:'rgba(239,68,68,0.15)', border:'rgba(239,68,68,0.25)'
                    },
                    {
                      icon:'⭐',
                      title:`${dayShort[highestDay] || highestDay} is your best day`,
                      desc:`Use your energy on ${dayShort[highestDay] || highestDay}s for important tasks or social plans.`,
                      color:'rgba(46,139,87,0.15)', border:'rgba(46,139,87,0.25)'
                    },
                    {
                      icon:'🧘',
                      title:'Daily logging helps',
                      desc:'The more you log, the more accurate your predictions become. Try logging every morning!',
                      color:'rgba(124,58,237,0.15)', border:'rgba(124,58,237,0.25)'
                    },
                  ].map((tip, i) => (
                    <motion.div key={i}
                      className="rounded-2xl p-4"
                      style={{ background:tip.color, border:`1px solid ${tip.border}` }}
                      whileHover={{ scale:1.02, y:-2 }}
                    >
                      <div className="text-2xl mb-2">{tip.icon}</div>
                      <div className="text-sm font-semibold text-white mb-1"
                        style={{ fontFamily:'Poppins,sans-serif' }}>
                        {tip.title}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color:'rgba(255,255,255,0.55)' }}>
                        {tip.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

          </>
        )}

      </main>
    </div>
  )
}