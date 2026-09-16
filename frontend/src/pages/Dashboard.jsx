import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Smile,
  BookOpen,
  MessageCircle,
  BarChart2,
  MapPin,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { getMoodHistory } from '../api/api'
import useAuthStore from '../store/authStore'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const tips = [
  "Start your morning with 5 minutes of silence. Let your thoughts settle before the day begins.",
  "Write down 3 things you are grateful for today. Gratitude rewires the brain toward positivity.",
  "Take a 10-minute walk outside. Nature reduces stress hormones significantly.",
  "Drink a full glass of water before checking your phone. Hydration improves mood and focus.",
  "Reach out to one person you care about today. Social connection is the #1 predictor of wellbeing.",
  "Put your phone away 30 minutes before bed. Blue light disrupts sleep quality.",
  "Do one thing today purely for joy — not productivity, not obligation. Just joy."
]

const quickActions = [
  {
    to: '/patient/mood',
    icon: Smile,
    label: "Log today's mood",
    desc: '30 seconds',
    color: '#2E8B57',
    bg: 'rgba(46,139,87,0.15)',
    border: 'rgba(46,139,87,0.3)'
  },
  {
    to: '/patient/journal',
    icon: BookOpen,
    label: 'Write journal entry',
    desc: 'Express yourself',
    color: '#3AAFA9',
    bg: 'rgba(58,175,169,0.15)',
    border: 'rgba(58,175,169,0.3)'
  },
  {
    to: '/patient/wellness',
    icon: BarChart2,
    label: 'Wellness report',
    desc: 'AI insights',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.15)',
    border: 'rgba(124,58,237,0.3)'
  },
  {
    to: '/patient/clinics',
    icon: MapPin,
    label: 'Find clinics',
    desc: 'Near you',
    color: '#D9C7FF',
    bg: 'rgba(217,199,255,0.12)',
    border: 'rgba(217,199,255,0.3)'
  },
  {
    to: '/patient/chat',
    icon: MessageCircle,
    label: 'AI Companion',
    desc: 'Talk to AI',
    color: '#CFF7E6',
    bg: 'rgba(207,247,230,0.12)',
    border: 'rgba(207,247,230,0.3)'
  },
  {
    to: '/patient/consent',
    icon: Sparkles,
    label: 'My Doctors',
    desc: 'Manage access',
    color: '#a8d8c8',
    bg: 'rgba(168,216,200,0.12)',
    border: 'rgba(168,216,200,0.3)'
  }
]

function StatCard({ value, label, icon, color, bg, delay }) {
  return (
    <motion.div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: bg,
        border: `1px solid ${color}30`
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="absolute top-3 right-3 text-2xl opacity-30">
        {icon}
      </div>

      <div
        className="text-3xl font-black text-white mb-1"
        style={{
          fontFamily: 'Poppins, sans-serif',
          color
        }}
      >
        {value}
      </div>

      <div
        className="text-xs"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        {label}
      </div>
    </motion.div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-xl text-sm"
        style={{
          background: 'rgba(10,22,40,0.95)',
          border: '1px solid rgba(58,175,169,0.3)',
          color: 'white'
        }}
      >
        <p style={{ color: '#a8d8c8' }}>{label}</p>

        <p
          className="font-bold"
          style={{ color: '#3AAFA9' }}
        >
          Score: {payload[0].value}/10
        </p>
      </div>
    )
  }

  return null
}

export default function Dashboard() {
  const { user } = useAuthStore()

  const [moods, setMoods] = useState([])
  const [loading, setLoading] = useState(true)

  const name = user?.name || user?.username || 'Friend'

  const hour = new Date().getHours()

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
        ? 'Good afternoon'
        : 'Good evening'

  const tip = tips[new Date().getDay()]

  useEffect(() => {
    getMoodHistory()
      .then(res => {
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data?.moods || [])

        setMoods(data.slice(-7))
      })
      .catch(() => {
        setMoods([
          { moodScore: 4, loggedAt: '2026-07-01' },
          { moodScore: 6, loggedAt: '2026-07-02' },
          { moodScore: 7, loggedAt: '2026-07-03' },
          { moodScore: 5, loggedAt: '2026-07-04' },
          { moodScore: 8, loggedAt: '2026-07-05' },
          { moodScore: 6, loggedAt: '2026-07-06' },
          { moodScore: 7, loggedAt: '2026-07-07' }
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  const avg = moods.length
    ? (
        moods.reduce(
          (s, m) => s + (m.moodScore || m.mood || 0),
          0
        ) / moods.length
      ).toFixed(1)
    : '—'

  const chartData = moods.map((m, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    mood: m.moodScore || m.mood || 0
  }))

  return (
    <div
      className="flex min-h-screen"
      style={{
        background:
          'linear-gradient(135deg, #060d1f 0%, #0a1628 50%, #0d1f3a 100%)'
      }}
    >
      <Sidebar />

      <main className="ml-64 flex-1 p-8">

        {/* Top bar */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <p
              className="text-sm mb-1"
              style={{ color: 'rgba(168,216,200,0.6)' }}
            >
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>

            <h2
              className="text-3xl font-black text-white"
              style={{ fontFamily: 'Poppins,sans-serif' }}
            >
              {greeting},{' '}

              <span
                style={{
                  background:
                    'linear-gradient(135deg, #a8d8c8, #3AAFA9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {name.split(' ')[0]}
              </span>{' '}
              🌿
            </h2>
          </div>

          <div className="flex gap-3">
            <Link to="/patient/mood">
              <motion.button
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{
                  background:
                    'linear-gradient(135deg, #2E8B57, #3AAFA9)',
                  boxShadow:
                    '0 4px 20px rgba(46,139,87,0.3)'
                }}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                + Log mood
              </motion.button>
            </Link>

            <Link to="/patient/journal">
              <motion.button
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)'
                }}
                whileHover={{
                  scale: 1.05,
                  y: -1,
                  background: 'rgba(255,255,255,0.1)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                ✏️ Journal
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Hero banner */}
        <motion.div
          className="rounded-3xl p-8 mb-8 relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(46,139,87,0.2) 0%, rgba(58,175,169,0.15) 50%, rgba(124,58,237,0.2) 100%)',
            border: '1px solid rgba(168,216,200,0.1)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Background image */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-10"
            />
          </div>

          <div
            className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full blur-3xl pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)'
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} color="#D9C7FF" />

              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: '#D9C7FF' }}
              >
                Your wellness space
              </span>
            </div>

            <h3
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: 'Poppins,sans-serif' }}
            >
              How are you feeling today?
            </h3>

            <p
              className="text-sm mb-6"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Your mental wellness journey is unique. Track, reflect,
              and grow — one day at a time.
            </p>

            <div className="flex gap-3">
              <Link to="/patient/mood">
                <motion.button
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white"
                  style={{
                    background:
                      'linear-gradient(135deg, #2E8B57, #3AAFA9)',
                    boxShadow:
                      '0 4px 20px rgba(46,139,87,0.35)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  😊 Log today's mood
                </motion.button>
              </Link>

              <Link to="/patient/chat">
                <motion.button
                  className="px-6 py-3 rounded-xl text-sm font-bold"
                  style={{
                    background: 'rgba(124,58,237,0.3)',
                    border:
                      '1px solid rgba(124,58,237,0.5)',
                    color: '#D9C7FF'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🤖 Talk to AI
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard
            value={avg}
            label="Avg mood this week"
            icon="😊"
            color="#2E8B57"
            bg="rgba(46,139,87,0.12)"
            delay={0.2}
          />

          <StatCard
            value={moods.length}
            label="Moods logged"
            icon="📊"
            color="#3AAFA9"
            bg="rgba(58,175,169,0.12)"
            delay={0.3}
          />

          <StatCard
            value="5🔥"
            label="Day streak"
            icon="🔥"
            color="#D9C7FF"
            bg="rgba(217,199,255,0.1)"
            delay={0.4}
          />

          <StatCard
            value="Joy"
            label="Top emotion"
            icon="🧠"
            color="#7C3AED"
            bg="rgba(124,58,237,0.12)"
            delay={0.5}
          />
        </div>

        {/* Middle grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">

          {/* Mood chart */}
          <motion.div
            className="rounded-3xl p-6 relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)'
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={16} color="#3AAFA9" />

                  <span
                    className="text-sm font-semibold text-white"
                    style={{
                      fontFamily: 'Poppins,sans-serif'
                    }}
                  >
                    This week's mood
                  </span>
                </div>

                <p
                  className="text-xs"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  Daily score out of 10
                </p>
              </div>

              <Link to="/patient/mood">
                <motion.span
                  className="text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                  style={{
                    background: 'rgba(58,175,169,0.15)',
                    color: '#3AAFA9',
                    border:
                      '1px solid rgba(58,175,169,0.3)'
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  View all →
                </motion.span>
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-40">
                <motion.div
                  className="w-8 h-8 border-2 rounded-full"
                  style={{
                    borderColor:
                      'rgba(58,175,169,0.2)',
                    borderTopColor: '#3AAFA9'
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="moodGrad"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop
                        offset="0%"
                        stopColor="#2E8B57"
                      />
                      <stop
                        offset="50%"
                        stopColor="#3AAFA9"
                      />
                      <stop
                        offset="100%"
                        stopColor="#7C3AED"
                      />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="day"
                    tick={{
                      fill: 'rgba(255,255,255,0.3)',
                      fontSize: 11
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[0, 10]}
                    tick={{
                      fill: 'rgba(255,255,255,0.3)',
                      fontSize: 11
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="url(#moodGrad)"
                    strokeWidth={3}
                    dot={{
                      fill: '#3AAFA9',
                      r: 5,
                      strokeWidth: 2,
                      stroke: '#0a1628'
                    }}
                    activeDot={{
                      r: 7,
                      fill: '#7C3AED'
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* AI Companion card */}
          <motion.div
            className="rounded-3xl p-6 relative overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(58,175,169,0.1))',
              border:
                '1px solid rgba(124,58,237,0.2)'
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div
              className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)'
              }}
            />

            <div className="flex items-center gap-3 mb-4 relative z-10">
              <motion.div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{
                  background:
                    'rgba(124,58,237,0.3)',
                  border:
                    '1px solid rgba(124,58,237,0.4)'
                }}
                animate={{
                  boxShadow: [
                    '0 0 15px rgba(124,58,237,0.3)',
                    '0 0 30px rgba(124,58,237,0.5)',
                    '0 0 15px rgba(124,58,237,0.3)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              >
                🤖
              </motion.div>

              <div>
                <div
                  className="text-sm font-bold text-white"
                  style={{
                    fontFamily: 'Poppins,sans-serif'
                  }}
                >
                  AI Companion
                </div>

                <div
                  className="text-xs flex items-center gap-1.5"
                  style={{ color: '#4ade80' }}
                >
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  />

                  Online · Gemini powered
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-4 mb-5 relative z-10"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border:
                  '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <p
                className="text-sm leading-relaxed italic"
                style={{
                  color: 'rgba(255,255,255,0.7)'
                }}
              >
                "I've noticed your mood has been improving
                this week. Would you like to talk about what's
                been going well?"
              </p>
            </div>

            <Link to="/patient/chat">
              <motion.button
                className="w-full py-3 rounded-xl text-sm font-bold text-white relative z-10"
                style={{
                  background:
                    'linear-gradient(135deg, #7C3AED, #3AAFA9)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Open chat →
              </motion.button>
            </Link>
          </motion.div>

        </div>

        {/* 🌱 Knowledge Boost */}
        <motion.div
          className="rounded-3xl p-6 mb-8 relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(46,139,87,0.15), rgba(58,175,169,0.08))',
            border:
              '1px solid rgba(58,175,169,0.2)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🌱</span>

                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: '#3AAFA9' }}
                >
                  Take a little break
                </span>
              </div>

              <h3
                className="text-xl font-bold text-white mb-1"
                style={{
                  fontFamily: 'Poppins,sans-serif'
                }}
              >
                Need a little break?
              </h3>

              <p
                className="text-sm"
                style={{
                  color: 'rgba(255,255,255,0.5)'
                }}
              >
                Take a 2-minute Knowledge Boost and learn
                something interesting.
              </p>
            </div>

            <Link to="/patient/knowledge-boost">
              <motion.button
                className="px-5 py-3 rounded-xl text-sm font-bold text-white whitespace-nowrap"
                style={{
                  background:
                    'linear-gradient(135deg, #2E8B57, #3AAFA9)',
                  boxShadow:
                    '0 4px 20px rgba(46,139,87,0.25)'
                }}
                whileHover={{
                  scale: 1.05,
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
              >
                Knowledge Boost →
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Bottom grid */}
        <div className="grid grid-cols-2 gap-6">

          {/* Quick actions */}
          <motion.div
            className="rounded-3xl p-6"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border:
                '1px solid rgba(255,255,255,0.07)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={16} color="#D9C7FF" />

              <span
                className="text-sm font-semibold text-white"
                style={{
                  fontFamily: 'Poppins,sans-serif'
                }}
              >
                Quick actions
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, i) => {
                const Icon = action.icon

                return (
                  <Link
                    key={action.to}
                    to={action.to}
                  >
                    <motion.div
                      className="p-4 rounded-2xl cursor-pointer"
                      style={{
                        background: action.bg,
                        border:
                          `1px solid ${action.border}`
                      }}
                      whileHover={{
                        scale: 1.03,
                        y: -2
                      }}
                      whileTap={{
                        scale: 0.97
                      }}
                      initial={{
                        opacity: 0,
                        y: 10
                      }}
                      animate={{
                        opacity: 1,
                        y: 0
                      }}
                      transition={{
                        delay: 0.6 + i * 0.05
                      }}
                    >
                      <Icon
                        size={18}
                        style={{
                          color: action.color
                        }}
                        className="mb-2"
                      />

                      <div className="text-xs font-semibold text-white leading-tight">
                        {action.label}
                      </div>

                      <div
                        className="text-xs mt-0.5"
                        style={{
                          color:
                            'rgba(255,255,255,0.35)'
                        }}
                      >
                        {action.desc}
                      </div>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </motion.div>

          {/* Daily wellness tip */}
          <motion.div
            className="rounded-3xl p-6 relative overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(46,139,87,0.12), rgba(58,175,169,0.08))',
              border:
                '1px solid rgba(46,139,87,0.2)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div
              className="absolute bottom-[-20px] right-[-20px] w-32 h-32 rounded-full blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(46,139,87,0.2), transparent 70%)'
              }}
            />

            {/* Nature image */}
            <div className="w-full h-28 rounded-2xl overflow-hidden mb-4 relative">
              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&fit=crop"
                alt="Nature"
                className="w-full h-full object-cover"
                style={{
                  filter:
                    'saturate(0.8) brightness(0.7)'
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">🌿</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 relative z-10">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: '#3AAFA9' }}
              >
                Daily tip
              </span>

              <div
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background:
                    'rgba(58,175,169,0.2)',
                  color: '#3AAFA9'
                }}
              >
                Refreshes daily
              </div>
            </div>

            <p
              className="text-sm leading-relaxed italic mb-4 relative z-10"
              style={{
                color: 'rgba(255,255,255,0.7)'
              }}
            >
              "{tip}"
            </p>

            <div
              className="rounded-xl p-3 relative z-10"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border:
                  '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: '#a8d8c8' }}
              >
                🧘 Breathing exercise
              </p>

              <p
                className="text-xs"
                style={{
                  color: 'rgba(255,255,255,0.5)'
                }}
              >
                Inhale{' '}
                <strong className="text-white">
                  4s
                </strong>{' '}
                → Hold{' '}
                <strong className="text-white">
                  7s
                </strong>{' '}
                → Exhale{' '}
                <strong className="text-white">
                  8s
                </strong>{' '}
                · Repeat 3x
              </p>
            </div>
          </motion.div>

        </div>

      </main>
    </div>
  )
}