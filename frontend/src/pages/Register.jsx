import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Sparkles } from 'lucide-react'
import { registerUser } from '../api/api'
import useAuthStore from '../store/authStore'

const floatingOrbs = [
  { w:400, h:400, top:'-10%', left:'-5%',  bg:'radial-gradient(circle, #7C3AED, transparent 70%)', op:0.25, dur:8  },
  { w:500, h:500, top:'50%',  right:'-10%', bg:'radial-gradient(circle, #3AAFA9, transparent 70%)', op:0.2,  dur:10 },
  { w:300, h:300, top:'20%',  left:'30%',   bg:'radial-gradient(circle, #2E8B57, transparent 70%)', op:0.15, dur:7  },
  { w:350, h:350, bottom:'-5%',left:'10%',  bg:'radial-gradient(circle, #D9C7FF, transparent 70%)', op:0.12, dur:9  },
]

export default function Register() {
  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [role,     setRole]     = useState('PATIENT')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { setAuth }             = useAuthStore()
  const navigate                = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const res   = await registerUser({ username, email, password, role })
      const token = res.data
      setAuth(token)
      navigate(role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(255,255,255,0.1)',
    color: 'white',
    caretColor: '#a8d8c8'
  }

  const inputFocus = (e) => {
    e.target.style.borderColor = '#3AAFA9'
    e.target.style.background  = 'rgba(58,175,169,0.08)'
    e.target.style.boxShadow   = '0 0 0 4px rgba(58,175,169,0.1)'
  }

  const inputBlur = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
    e.target.style.background  = 'rgba(255,255,255,0.06)'
    e.target.style.boxShadow   = 'none'
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{ background:'linear-gradient(135deg, #060d1f 0%, #0a1628 30%, #0d2b22 60%, #130a2a 100%)' }}>

      {/* Orbs */}
      {floatingOrbs.map((orb, i) => (
        <motion.div key={i}
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{ width:orb.w, height:orb.h, top:orb.top, left:orb.left, right:orb.right, bottom:orb.bottom, background:orb.bg, opacity:orb.op }}
          animate={{ scale:[1,1.3,1], x:[0,30,0], y:[0,-20,0] }}
          transition={{ duration:orb.dur, repeat:Infinity, repeatType:'reverse', ease:'easeInOut' }}
        />
      ))}

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:'linear-gradient(rgba(168,216,200,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,216,200,0.03) 1px, transparent 1px)',
          backgroundSize:'60px 60px'
        }}
      />

      <div className="relative z-10 w-full max-w-[460px]">

        {/* Logo */}
        <motion.div className="text-center mb-6"
          initial={{ opacity:0, y:-30 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 relative"
            style={{ background:'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(58,175,169,0.4))', border:'1px solid rgba(168,216,200,0.3)', backdropFilter:'blur(20px)' }}
            animate={{ boxShadow:['0 0 30px rgba(124,58,237,0.3)','0 0 60px rgba(58,175,169,0.4)','0 0 30px rgba(124,58,237,0.3)'] }}
            transition={{ duration:3, repeat:Infinity }}
          >
            <span className="text-3xl">🧘</span>
          </motion.div>

          <h1 className="text-4xl font-black mb-1"
            style={{ fontFamily:'Poppins,sans-serif', background:'linear-gradient(135deg, #a8d8c8, #3AAFA9, #D9C7FF, #7C3AED)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Nirvana
          </h1>
          <p className="text-xs tracking-[4px] uppercase" style={{ color:'rgba(168,216,200,0.45)' }}>
            Begin Your Journey
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{
            background:'rgba(255,255,255,0.05)',
            border:'1px solid rgba(255,255,255,0.12)',
            backdropFilter:'blur(40px)',
            boxShadow:'0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
          initial={{ opacity:0, y:30 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.8, delay:0.2 }}
        >
          {/* Top glow line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
            style={{ background:'linear-gradient(90deg, transparent, rgba(168,216,200,0.6), transparent)' }}
          />

          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} color="#D9C7FF" />
            <h3 className="text-xl font-bold text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
              Create account
            </h3>
          </div>
          <p className="text-sm mb-6" style={{ color:'rgba(255,255,255,0.4)' }}>
            Start your mental wellness journey today 🌿
          </p>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div className="mb-4 px-4 py-3 rounded-xl text-sm"
                style={{ background:'rgba(239,68,68,0.15)', color:'#fca5a5', border:'1px solid rgba(239,68,68,0.3)' }}
                initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              >
                ❌ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold mb-3 uppercase tracking-widest"
              style={{ color:'rgba(168,216,200,0.7)' }}>
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value:'PATIENT', icon:'🧘', label:'Patient', desc:'Track my wellness', color:'#2E8B57' },
                { value:'DOCTOR',  icon:'🩺', label:'Doctor',  desc:'Monitor patients',  color:'#7C3AED' },
              ].map(r => (
                <motion.button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className="py-4 px-3 rounded-xl text-center transition-all relative overflow-hidden"
                  style={{
                    background: role === r.value ? `rgba(${r.value === 'PATIENT' ? '46,139,87' : '124,58,237'},0.2)` : 'rgba(255,255,255,0.04)',
                    border: role === r.value ? `2px solid ${r.color}` : '2px solid rgba(255,255,255,0.08)',
                  }}
                  whileHover={{ scale:1.03 }}
                  whileTap={{ scale:0.97 }}
                >
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <div className="text-sm font-semibold text-white">{r.label}</div>
                  <div className="text-xs mt-0.5" style={{ color:'rgba(255,255,255,0.4)' }}>{r.desc}</div>
                  {role === r.value && (
                    <motion.div className="absolute top-2 right-2 w-2 h-2 rounded-full"
                      style={{ background:r.color }}
                      animate={{ scale:[1,1.3,1] }}
                      transition={{ duration:1, repeat:Infinity }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <form onSubmit={handleRegister}>

            {/* Username */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color:'rgba(168,216,200,0.7)' }}>
                Username
              </label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color:'rgba(168,216,200,0.5)' }} />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Your username"
                  required
                  className="w-full pl-11 pr-4 py-4 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color:'rgba(168,216,200,0.7)' }}>
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color:'rgba(168,216,200,0.5)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-4 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-7">
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
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-11 pr-12 py-4 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color:'rgba(168,216,200,0.5)' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white text-base relative overflow-hidden"
              style={{
                background:'linear-gradient(135deg, #2E8B57 0%, #3AAFA9 50%, #7C3AED 100%)',
                boxShadow:'0 8px 30px rgba(124,58,237,0.35)',
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
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate:360 }}
                      transition={{ duration:0.8, repeat:Infinity, ease:'linear' }}
                    />
                    Creating account...
                  </>
                ) : (
                  <>✨ Create Account</>
                )}
              </span>
            </motion.button>

          </form>

          <p className="text-center text-sm mt-5" style={{ color:'rgba(255,255,255,0.35)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:opacity-80 transition-opacity"
              style={{ color:'#a8d8c8' }}>
              Sign in →
            </Link>
          </p>

        </motion.div>

        <motion.p className="text-center mt-5 text-xs"
          style={{ color:'rgba(255,255,255,0.2)' }}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1 }}
        >
          🔒 Secure · 🌿 Private · 💚 Free · ✨ Always
        </motion.p>

      </div>
    </div>
  )
}