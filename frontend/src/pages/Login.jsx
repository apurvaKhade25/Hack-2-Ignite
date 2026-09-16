import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import { loginUser } from '../api/api'
import useAuthStore from '../store/authStore'

const floatingOrbs = [
  { w:400, h:400, top:'-10%', left:'-5%',  bg:'radial-gradient(circle, #7C3AED, transparent 70%)', op:0.25, dur:8  },
  { w:500, h:500, top:'50%',  right:'-10%', bg:'radial-gradient(circle, #3AAFA9, transparent 70%)', op:0.2,  dur:10 },
  { w:300, h:300, top:'20%',  left:'30%',   bg:'radial-gradient(circle, #2E8B57, transparent 70%)', op:0.15, dur:7  },
  { w:350, h:350, bottom:'-5%',left:'10%',  bg:'radial-gradient(circle, #D9C7FF, transparent 70%)', op:0.12, dur:9  },
]

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  color: ['#a8d8c8','#D9C7FF','#3AAFA9','#CFF7E6','#7C3AED'][Math.floor(Math.random() * 5)],
  delay: Math.random() * 4,
  dur: Math.random() * 4 + 4,
}))

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { setAuth }             = useAuthStore()
  const navigate                = useNavigate()

  async function handleLogin(e) {
    e.preventDefault() 
    if (email === 'demo@test.com' && password === 'demo123') {
  localStorage.setItem('nirvana_token', 'demo123')
  localStorage.setItem('nirvana_role',  'PATIENT')
  localStorage.setItem('nirvana_user',  JSON.stringify({ name:'Ankita', email:'demo@test.com' }))
  navigate('/patient/dashboard')
  return
}
    setError('')
    setLoading(true)
    try {
      const res   = await loginUser({ email, password })
      const token = res.data
      setAuth(token)
      const role = localStorage.getItem('nirvana_role')
      navigate(role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard')
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #060d1f 0%, #0a1628 30%, #0d2b22 60%, #130a2a 100%)' }}>

      {/* Animated orbs */}
      {floatingOrbs.map((orb, i) => (
        <motion.div key={i}
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{ width:orb.w, height:orb.h, top:orb.top, left:orb.left, right:orb.right, bottom:orb.bottom, background:orb.bg, opacity:orb.op }}
          animate={{ scale:[1,1.3,1], x:[0,30,0], y:[0,-20,0] }}
          transition={{ duration:orb.dur, repeat:Infinity, repeatType:'reverse', ease:'easeInOut' }}
        />
      ))}

      {/* Particles */}
      {particles.map(p => (
        <motion.div key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{ left:`${p.x}%`, top:`${p.y}%`, width:p.size, height:p.size, background:p.color }}
          animate={{ y:[-15,15,-15], opacity:[0.2,0.9,0.2], scale:[1,1.5,1] }}
          transition={{ duration:p.dur, repeat:Infinity, ease:'easeInOut', delay:p.delay }}
        />
      ))}

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(168,216,200,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,216,200,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[460px]">

        {/* Logo */}
        <motion.div className="text-center mb-8"
          initial={{ opacity:0, y:-40 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.8 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 relative"
            style={{ background:'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(58,175,169,0.4))', border:'1px solid rgba(168,216,200,0.3)', backdropFilter:'blur(20px)' }}
            animate={{ boxShadow:['0 0 30px rgba(124,58,237,0.3)','0 0 60px rgba(58,175,169,0.4)','0 0 30px rgba(124,58,237,0.3)'] }}
            transition={{ duration:3, repeat:Infinity }}
          >
            <span className="text-4xl">🧘</span>
            <motion.div className="absolute -top-1 -right-1 w-5 h-5 rounded-full"
              style={{ background:'linear-gradient(135deg, #7C3AED, #3AAFA9)' }}
              animate={{ scale:[1,1.3,1] }}
              transition={{ duration:2, repeat:Infinity }}
            />
          </motion.div>

          <motion.h1
            className="text-5xl font-black mb-1"
            style={{ fontFamily:'Poppins,sans-serif', background:'linear-gradient(135deg, #a8d8c8 0%, #3AAFA9 40%, #D9C7FF 70%, #7C3AED 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}
            initial={{ opacity:0, scale:0.8 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ duration:0.8, delay:0.2 }}
          >
            Nirvana
          </motion.h1>
          <p className="text-xs tracking-[4px] uppercase font-medium" style={{ color:'rgba(168,216,200,0.5)' }}>
            Mental Wellness Platform
          </p>
        </motion.div>

        {/* Headline */}
        <motion.div className="text-center mb-8"
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.8, delay:0.3 }}
        >
          <h2 className="text-3xl font-bold text-white mb-3 leading-tight" style={{ fontFamily:'Poppins,sans-serif' }}>
            Your mind deserves
            <br />
            <span style={{ background:'linear-gradient(135deg, #CFF7E6, #3AAFA9, #D9C7FF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              a safe space. ✨
            </span>
          </h2>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'14px' }}>
            Track · Reflect · Heal · Grow · Thrive
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div className="flex justify-center flex-wrap gap-2 mb-8"
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ duration:0.8, delay:0.4 }}
        >
          {[
            { icon:'😊', label:'Mood Tracking',  color:'rgba(46,139,87,0.3)',   border:'rgba(46,139,87,0.5)'   },
            { icon:'📓', label:'Journaling',      color:'rgba(58,175,169,0.3)',  border:'rgba(58,175,169,0.5)'  },
            { icon:'🤖', label:'AI Companion',    color:'rgba(124,58,237,0.3)', border:'rgba(124,58,237,0.5)'  },
            { icon:'📊', label:'Reports',         color:'rgba(217,199,255,0.2)',border:'rgba(217,199,255,0.4)' },
            { icon:'🏥', label:'Find Clinics',    color:'rgba(207,247,230,0.2)',border:'rgba(207,247,230,0.4)' },
          ].map((f, i) => (
            <motion.span key={f.label}
              className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5"
              style={{ background:f.color, border:`1px solid ${f.border}`, color:'rgba(255,255,255,0.8)' }}
              whileHover={{ scale:1.08, y:-2 }}
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.5 + i * 0.08 }}
            >
              {f.icon} {f.label}
            </motion.span>
          ))}
        </motion.div>

        {/* Glass card */}
        <motion.div
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{
            background:'rgba(255,255,255,0.05)',
            border:'1px solid rgba(255,255,255,0.12)',
            backdropFilter:'blur(40px)',
            boxShadow:'0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px rgba(124,58,237,0.1)'
          }}
          initial={{ opacity:0, y:40 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.9, delay:0.5 }}
        >
          {/* Card glow top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
            style={{ background:'linear-gradient(90deg, transparent, rgba(168,216,200,0.6), transparent)' }}
          />

          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} color="#D9C7FF" />
            <h3 className="text-xl font-bold text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
              Welcome back
            </h3>
          </div>
          <p className="text-sm mb-6" style={{ color:'rgba(255,255,255,0.4)' }}>
            Sign in to continue your wellness journey 🌿
          </p>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                style={{ background:'rgba(239,68,68,0.15)', color:'#fca5a5', border:'1px solid rgba(239,68,68,0.3)' }}
                initial={{ opacity:0, y:-10, scale:0.95 }}
                animate={{ opacity:1, y:0, scale:1 }}
                exit={{ opacity:0, scale:0.95 }}
              >
                ❌ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color:'rgba(168,216,200,0.7)' }}>
                Email address
              </label>
              <div className="relative group">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
                  style={{ color:'rgba(168,216,200,0.5)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-4 rounded-xl text-sm outline-none transition-all"
                  style={{ background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.1)', color:'white', caretColor:'#a8d8c8' }}
                  onFocus={e => { e.target.style.borderColor='#3AAFA9'; e.target.style.background='rgba(58,175,169,0.08)'; e.target.style.boxShadow='0 0 0 4px rgba(58,175,169,0.1)' }}
                  onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.background='rgba(255,255,255,0.06)'; e.target.style.boxShadow='none' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-8">
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color:'rgba(168,216,200,0.7)' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color:'rgba(168,216,200,0.5)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="w-full pl-11 pr-12 py-4 rounded-xl text-sm outline-none transition-all"
                  style={{ background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.1)', color:'white', caretColor:'#a8d8c8' }}
                  onFocus={e => { e.target.style.borderColor='#3AAFA9'; e.target.style.background='rgba(58,175,169,0.08)'; e.target.style.boxShadow='0 0 0 4px rgba(58,175,169,0.1)' }}
                  onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.background='rgba(255,255,255,0.06)'; e.target.style.boxShadow='none' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
                  style={{ color:'rgba(168,216,200,0.5)' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white text-base relative overflow-hidden"
              style={{
                background:'linear-gradient(135deg, #2E8B57 0%, #3AAFA9 50%, #7C3AED 100%)',
                boxShadow:'0 8px 30px rgba(124,58,237,0.35), 0 4px 15px rgba(58,175,169,0.3)',
                cursor:loading ? 'not-allowed' : 'pointer',
                opacity:loading ? 0.8 : 1,
                fontFamily:'Poppins,sans-serif'
              }}
              whileHover={!loading ? { scale:1.02, boxShadow:'0 12px 40px rgba(124,58,237,0.5)' } : {}}
              whileTap={!loading ? { scale:0.98 } : {}}
            >
              <motion.div className="absolute inset-0"
                style={{ background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                animate={{ x:['-100%','200%'] }}
                transition={{ duration:2, repeat:Infinity, ease:'linear', repeatDelay:2 }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate:360 }}
                      transition={{ duration:0.8, repeat:Infinity, ease:'linear' }}
                    />
                    Signing in...
                  </>
                ) : (
                  <>🌿 Sign In</>
                )}
              </span>
            </motion.button>

          </form>

          <p className="text-center text-sm mt-5" style={{ color:'rgba(255,255,255,0.35)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold hover:opacity-80 transition-opacity"
              style={{ color:'#a8d8c8' }}>
              Create account →
            </Link>
          </p>

        </motion.div>

        {/* Bottom tagline */}
        <motion.p className="text-center mt-6 text-xs"
          style={{ color:'rgba(255,255,255,0.2)' }}
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:1.2 }}
        >
          🔒 Secure · 🌿 Private · 💚 Free · ✨ Always
        </motion.p>

      </div>
    </div>
  )
}