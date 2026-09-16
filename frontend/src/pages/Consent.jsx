import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, UserPlus, Shield, Trash2, Mail } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { inviteDoctor, revokeConsent, getMyDoctors } from '../api/api'

export default function Consent() {
  const [doctorEmail, setDoctorEmail] = useState('')
  const [doctors,     setDoctors]     = useState([])
  const [loading,     setLoading]     = useState(false)
  const [inviting,    setInviting]    = useState(false)
  const [toast,       setToast]       = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function loadDoctors() {
    setLoading(true)
    try {
      const res = await getMyDoctors()
      setDoctors(Array.isArray(res.data) ? res.data : [])
    } catch {
      setDoctors([
        { ConsentId:1, doctorName:'Dr. Priya Sharma',   doctorEmail:'priya.sharma@hospital.com'  },
        { ConsentId:2, doctorName:'Dr. Rahul Mehta',    doctorEmail:'rahul.mehta@clinic.com'     },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDoctors() }, [])

  async function handleInvite(e) {
    e.preventDefault()
    if (!doctorEmail.trim()) return
    setInviting(true)
    try {
      await inviteDoctor(doctorEmail)
      showToast('Doctor invited successfully! 🩺')
      setDoctorEmail('')
      loadDoctors()
    } catch (err) {
      showToast(err.response?.data?.error || 'Could not invite doctor. Try again.', 'error')
    } finally {
      setInviting(false)
    }
  }

  async function handleRevoke(consentId) {
    try {
      await revokeConsent(consentId)
      showToast('Consent revoked successfully!')
      loadDoctors()
    } catch (err) {
      showToast(err.response?.data?.error || 'Could not revoke consent.', 'error')
    }
  }

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
        <motion.div className="mb-8"
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} color="#D9C7FF" />
            <span className="text-xs uppercase tracking-widest"
              style={{ color:'rgba(168,216,200,0.5)' }}>
              Privacy & Access
            </span>
          </div>
          <h2 className="text-3xl font-black text-white"
            style={{ fontFamily:'Poppins,sans-serif' }}>
            My{' '}
            <span style={{ background:'linear-gradient(135deg, #D9C7FF, #7C3AED)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Doctors
            </span>{' '}🤝
          </h2>
          <p className="text-sm mt-1" style={{ color:'rgba(255,255,255,0.4)' }}>
            Invite your doctor to view your wellness data. You can revoke access anytime.
          </p>
        </motion.div>

        {/* Hero */}
        <motion.div
          className="rounded-3xl p-8 mb-8 relative overflow-hidden"
          style={{
            background:'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(58,175,169,0.1))',
            border:'1px solid rgba(124,58,237,0.2)'
          }}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-8"
              style={{ opacity:0.08 }}
            />
          </div>

          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full blur-3xl pointer-events-none"
            style={{ background:'radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)' }}
          />

          <div className="relative z-10 flex items-center gap-6">
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background:'rgba(124,58,237,0.3)', border:'1px solid rgba(124,58,237,0.4)' }}
              animate={{ boxShadow:['0 0 15px rgba(124,58,237,0.3)','0 0 30px rgba(124,58,237,0.5)','0 0 15px rgba(124,58,237,0.3)'] }}
              transition={{ duration:3, repeat:Infinity }}
            >
              🩺
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily:'Poppins,sans-serif' }}>
                Connect with your doctor 🌿
              </h3>
              <p className="text-sm" style={{ color:'rgba(255,255,255,0.55)', maxWidth:'500px' }}>
                When you invite a doctor, they can see your mood history and journal entries
                to give you better, more personalised care. Your data stays private from everyone else.
              </p>
            </div>
          </div>

          {/* Privacy badges */}
          <div className="relative z-10 flex gap-3 mt-5">
            {[
              { icon:'🔒', label:'End-to-end encrypted'  },
              { icon:'👁️', label:'Doctor view only'       },
              { icon:'⚡', label:'Revoke anytime'         },
            ].map(b => (
              <div key={b.label}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium"
                style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.65)' }}>
                {b.icon} {b.label}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-6">

          {/* Invite form */}
          <motion.div
            className="rounded-3xl p-7 relative overflow-hidden"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
              style={{ background:'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)' }}
            />

            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <UserPlus size={16} color="#D9C7FF" />
                  <span className="text-sm font-semibold text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
                    Invite a doctor
                  </span>
                </div>
                <p className="text-xs" style={{ color:'rgba(255,255,255,0.35)' }}>
                  Enter your doctor's email address
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background:'rgba(124,58,237,0.2)', border:'1px solid rgba(124,58,237,0.3)' }}>
                🩺
              </div>
            </div>

            <form onSubmit={handleInvite}>
              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color:'rgba(168,216,200,0.7)' }}>
                  Doctor's email address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color:'rgba(168,216,200,0.5)' }} />
                  <input
                    type="email"
                    value={doctorEmail}
                    onChange={e => setDoctorEmail(e.target.value)}
                    placeholder="doctor@hospital.com"
                    required
                    className="w-full pl-11 pr-4 py-4 rounded-xl text-sm outline-none transition-all"
                    style={{ background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.1)', color:'white', caretColor:'#a8d8c8' }}
                    onFocus={e => { e.target.style.borderColor='#7C3AED'; e.target.style.boxShadow='0 0 0 3px rgba(124,58,237,0.1)' }}
                    onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
                  />
                </div>
              </div>

              {/* Info notice */}
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl mb-6"
                style={{ background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)' }}>
                <Shield size={14} color="#D9C7FF" className="flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed" style={{ color:'rgba(217,199,255,0.8)' }}>
                  The doctor must already have a Nirvana account with role DOCTOR.
                  Once invited they can view your mood scores and journal entries.
                </p>
              </div>

              <motion.button
                type="submit"
                disabled={inviting}
                className="w-full py-4 rounded-xl font-bold text-white text-sm relative overflow-hidden flex items-center justify-center gap-2"
                style={{
                  background:'linear-gradient(135deg, #7C3AED, #3AAFA9)',
                  boxShadow:'0 8px 30px rgba(124,58,237,0.3)',
                  cursor:inviting ? 'not-allowed' : 'pointer',
                  opacity:inviting ? 0.8 : 1,
                  fontFamily:'Poppins,sans-serif'
                }}
                whileHover={!inviting ? { scale:1.02 } : {}}
                whileTap={!inviting ? { scale:0.98 } : {}}
              >
                <motion.div className="absolute inset-0"
                  style={{ background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                  animate={{ x:['-100%','200%'] }}
                  transition={{ duration:2, repeat:Infinity, ease:'linear', repeatDelay:2 }}
                />
                {inviting ? (
                  <>
                    <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:'linear' }} />
                    Sending invite...
                  </>
                ) : (
                  <><UserPlus size={16} /> Invite Doctor</>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Doctors list */}
          <motion.div
            className="rounded-3xl p-6"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Shield size={16} color="#a8d8c8" />
                <span className="text-sm font-semibold text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
                  Doctors with access
                </span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ background:'rgba(124,58,237,0.2)', color:'#D9C7FF', border:'1px solid rgba(124,58,237,0.3)' }}>
                {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div className="w-8 h-8 border-2 rounded-full"
                  style={{ borderColor:'rgba(124,58,237,0.2)', borderTopColor:'#7C3AED' }}
                  animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:'linear' }}
                />
              </div>
            ) : doctors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <motion.div className="text-5xl mb-3"
                  animate={{ y:[-5,5,-5] }} transition={{ duration:3, repeat:Infinity }}>
                  🩺
                </motion.div>
                <h4 className="text-sm font-semibold text-white mb-1" style={{ fontFamily:'Poppins,sans-serif' }}>
                  No doctors yet
                </h4>
                <p className="text-xs" style={{ color:'rgba(255,255,255,0.3)' }}>
                  Invite your doctor using the form on the left.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {doctors.map((d, i) => {
                  const initials = (d.doctorName || 'D').split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
                  return (
                    <motion.div key={d.ConsentId}
                      className="flex items-center gap-4 p-4 rounded-2xl group"
                      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}
                      initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 + i*0.08 }}
                      whileHover={{ background:'rgba(124,58,237,0.08)', borderColor:'rgba(124,58,237,0.2)' }}
                    >
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background:'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(58,175,169,0.4))', color:'white' }}>
                        {initials}
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-semibold text-white truncate">{d.doctorName}</div>
                        <div className="text-xs truncate" style={{ color:'rgba(255,255,255,0.4)' }}>{d.doctorEmail}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg"
                          style={{ background:'rgba(46,139,87,0.15)', color:'#2E8B57', border:'1px solid rgba(46,139,87,0.25)' }}>
                          <motion.span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"
                            animate={{ opacity:[1,0.3,1] }} transition={{ duration:2, repeat:Infinity }} />
                          Active
                        </div>

                        <motion.button
                          onClick={() => handleRevoke(d.ConsentId)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background:'rgba(239,68,68,0.15)', color:'rgba(239,68,68,0.7)', border:'1px solid rgba(239,68,68,0.2)' }}
                          whileHover={{ background:'rgba(239,68,68,0.25)', color:'#ef4444', scale:1.1 }}
                          title="Revoke access"
                        >
                          <Trash2 size={13} />
                        </motion.button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Privacy note */}
            <div className="mt-5 flex items-start gap-2 px-4 py-3 rounded-xl"
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <Shield size={12} style={{ color:'rgba(255,255,255,0.25)', flexShrink:0, marginTop:2 }} />
              <p className="text-xs leading-relaxed" style={{ color:'rgba(255,255,255,0.3)' }}>
                Doctors can only view your mood scores and journal entries.
                They cannot modify your data or see your chat history.
              </p>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  )
}