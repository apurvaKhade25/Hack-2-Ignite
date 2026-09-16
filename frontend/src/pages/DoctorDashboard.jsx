import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Users, TrendingUp, BookOpen, Shield } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { getMyPatients, getDoctorPatientMoods, getDoctorPatientJournals } from '../api/api'

const scoreColor = (s) =>
  s <= 3 ? '#EF4444' : s <= 5 ? '#F59E0B' : s <= 7 ? '#3AAFA9' : '#2E8B57'

const scoreEmoji = (s) =>
  s <= 2 ? '😞' : s <= 4 ? '😔' : s <= 6 ? '😐' : s <= 8 ? '🙂' : '😄'

export default function DoctorDashboard() {
  const [patients,        setPatients]        = useState([])
  const [selected,        setSelected]        = useState(null)
  const [moods,           setMoods]           = useState([])
  const [journals,        setJournals]        = useState([])
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [loadingData,     setLoadingData]     = useState(false)
  const [tab,             setTab]             = useState('mood')

  useEffect(() => {
    getMyPatients()
      .then(res => setPatients(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        setPatients([
          { ConsentId:1, patientId:101, patientName:'Rahul Sharma',   patientEmail:'rahul@example.com'  },
          { ConsentId:2, patientId:102, patientName:'Priya Mehta',    patientEmail:'priya@example.com'  },
          { ConsentId:3, patientId:103, patientName:'Aarav Kulkarni', patientEmail:'aarav@example.com'  },
          { ConsentId:4, patientId:104, patientName:'Sneha Joshi',    patientEmail:'sneha@example.com'  },
        ])
      })
      .finally(() => setLoadingPatients(false))
  }, [])

  async function selectPatient(patient) {
    setSelected(patient)
    setMoods([])
    setJournals([])
    setTab('mood')
    setLoadingData(true)

    try {
      const moodRes = await getDoctorPatientMoods(patient.patientId)
      setMoods(Array.isArray(moodRes.data) ? moodRes.data : [])
    } catch {
      setMoods([
        { moodScore:7, moodLabel:'Calm',    note:'Had a peaceful morning.',     loggedAt:new Date().toISOString()                     },
        { moodScore:5, moodLabel:'Anxious', note:'Worried about exam.',         loggedAt:new Date(Date.now()-86400000).toISOString()  },
        { moodScore:8, moodLabel:'Happy',   note:'Great session today!',        loggedAt:new Date(Date.now()-172800000).toISOString() },
        { moodScore:4, moodLabel:'Sad',     note:'Feeling low today.',          loggedAt:new Date(Date.now()-259200000).toISOString() },
        { moodScore:6, moodLabel:'Calm',    note:'Meditated in the morning.',   loggedAt:new Date(Date.now()-345600000).toISOString() },
      ])
    }

    try {
      const journalRes = await getDoctorPatientJournals(patient.patientId)
      setJournals(Array.isArray(journalRes.data) ? journalRes.data : [])
    } catch {
      setJournals([
        { id:1, title:'Morning thoughts',    content:'Feeling better today after our session. The breathing exercises really helped me stay calm.', createdAt:new Date().toISOString()                    },
        { id:2, title:'A difficult evening', content:'Struggled with anxiety again. Could not focus on anything. Hope things get better soon.',     createdAt:new Date(Date.now()-86400000).toISOString() },
      ])
    }

    setLoadingData(false)
  }

  const avg = moods.length
    ? (moods.reduce((s, m) => s + (m.moodScore || 0), 0) / moods.length).toFixed(1)
    : '—'

  return (
    <div className="flex min-h-screen"
      style={{ background:'linear-gradient(135deg, #060d1f 0%, #0a1628 50%, #0d1f3a 100%)' }}>
      <Sidebar />

      <main className="ml-64 flex-1 p-8">

        {/* Header */}
        <motion.div className="mb-8"
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} color="#D9C7FF" />
            <span className="text-xs uppercase tracking-widest"
              style={{ color:'rgba(168,216,200,0.5)' }}>
              Doctor Portal
            </span>
          </div>
          <h2 className="text-3xl font-black text-white"
            style={{ fontFamily:'Poppins,sans-serif' }}>
            Patient{' '}
            <span style={{ background:'linear-gradient(135deg, #a8d8c8, #3AAFA9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Dashboard
            </span>{' '}🩺
          </h2>
          <p className="text-sm mt-1" style={{ color:'rgba(255,255,255,0.4)' }}>
            View your patients' mood history and journal entries. Only patients who gave consent are shown.
          </p>
        </motion.div>

        {/* Hero */}
        <motion.div
          className="rounded-3xl p-8 mb-8 relative overflow-hidden"
          style={{
            background:'linear-gradient(135deg, rgba(58,175,169,0.15), rgba(46,139,87,0.1), rgba(124,58,237,0.15))',
            border:'1px solid rgba(58,175,169,0.2)'
          }}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-8"
              style={{ opacity:0.08 }}
            />
          </div>
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full blur-3xl pointer-events-none"
            style={{ background:'radial-gradient(circle, rgba(58,175,169,0.2), transparent 70%)' }}
          />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily:'Poppins,sans-serif' }}>
                Your patients 🌿
              </h3>
              <p className="text-sm" style={{ color:'rgba(255,255,255,0.5)', maxWidth:'500px' }}>
                Select a patient to view their mood history and journal entries.
                All data is protected by patient consent.
              </p>
            </div>
            <div className="flex gap-4">
              {[
                { value:patients.length, label:'Total patients', icon:'👥', color:'#3AAFA9', bg:'rgba(58,175,169,0.15)'  },
                { value:'Active',        label:'Consent status', icon:'🔒', color:'#2E8B57', bg:'rgba(46,139,87,0.15)'  },
              ].map(s => (
                <div key={s.label}
                  className="px-5 py-3 rounded-2xl text-center"
                  style={{ background:s.bg, border:`1px solid ${s.color}30` }}>
                  <div className="text-2xl font-black mb-0.5" style={{ color:s.color, fontFamily:'Poppins,sans-serif' }}>
                    {s.value}
                  </div>
                  <div className="text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">

          {/* Patient list */}
          <motion.div
            className="rounded-3xl p-5"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Users size={16} color="#a8d8c8" />
                <span className="text-sm font-semibold text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
                  My patients
                </span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ background:'rgba(58,175,169,0.15)', color:'#3AAFA9', border:'1px solid rgba(58,175,169,0.3)' }}>
                {patients.length}
              </span>
            </div>

            {loadingPatients ? (
              <div className="flex items-center justify-center py-10">
                <motion.div className="w-8 h-8 border-2 rounded-full"
                  style={{ borderColor:'rgba(58,175,169,0.2)', borderTopColor:'#3AAFA9' }}
                  animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:'linear' }}
                />
              </div>
            ) : patients.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-3 opacity-30">👥</div>
                <p className="text-sm" style={{ color:'rgba(255,255,255,0.3)' }}>
                  No patients yet. Patients need to invite you using your email.
                </p>
              </div>
            ) : (
              patients.map((p, i) => {
                const initials = (p.patientName || 'P').split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
                const isActive = selected?.patientId === p.patientId

                return (
                  <motion.div
                    key={p.ConsentId}
                    onClick={() => selectPatient(p)}
                    className="flex items-center gap-3 p-3 rounded-2xl mb-2 cursor-pointer"
                    style={{
                      background: isActive ? 'rgba(58,175,169,0.15)' : 'rgba(255,255,255,0.03)',
                      border: isActive ? '1.5px solid rgba(58,175,169,0.4)' : '1.5px solid rgba(255,255,255,0.06)'
                    }}
                    whileHover={{ background:'rgba(58,175,169,0.1)', borderColor:'rgba(58,175,169,0.3)' }}
                    initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 + i*0.07 }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background:'linear-gradient(135deg, #2E8B57, #3AAFA9)', color:'white' }}>
                      {initials}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-sm font-semibold text-white truncate">{p.patientName}</div>
                      <div className="text-xs truncate" style={{ color:'rgba(255,255,255,0.4)' }}>{p.patientEmail}</div>
                    </div>
                    {isActive && (
                      <motion.div className="w-2 h-2 rounded-full ml-auto flex-shrink-0"
                        style={{ background:'#3AAFA9' }}
                        animate={{ opacity:[1,0.3,1] }} transition={{ duration:2, repeat:Infinity }}
                      />
                    )}
                  </motion.div>
                )
              })
            )}
          </motion.div>

          {/* Patient data */}
          <div className="col-span-2">
            {!selected ? (
              <motion.div
                className="rounded-3xl p-16 text-center h-full flex flex-col items-center justify-center"
                style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderStyle:'dashed' }}
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
              >
                <motion.div className="text-7xl mb-4"
                  animate={{ y:[-5,5,-5] }} transition={{ duration:3, repeat:Infinity }}>
                  👈
                </motion.div>
                <h4 className="text-lg font-semibold text-white mb-2" style={{ fontFamily:'Poppins,sans-serif' }}>
                  Select a patient
                </h4>
                <p className="text-sm" style={{ color:'rgba(255,255,255,0.3)' }}>
                  Click on a patient from the list to view their health data.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              >
                {/* Patient header */}
                <div className="rounded-3xl p-5 mb-5 relative overflow-hidden"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold"
                      style={{ background:'linear-gradient(135deg, #2E8B57, #3AAFA9)', color:'white' }}>
                      {selected.patientName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-bold text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
                        {selected.patientName}
                      </div>
                      <div className="text-sm" style={{ color:'rgba(255,255,255,0.45)' }}>
                        {selected.patientEmail}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {[
                        { value:avg,            label:'Avg mood',    color:'#3AAFA9' },
                        { value:moods.length,   label:'Mood logs',   color:'#2E8B57' },
                        { value:journals.length,label:'Journals',    color:'#7C3AED' },
                      ].map(s => (
                        <div key={s.label} className="text-center">
                          <div className="text-2xl font-black" style={{ color:s.color, fontFamily:'Poppins,sans-serif' }}>
                            {s.value}
                          </div>
                          <div className="text-xs" style={{ color:'rgba(255,255,255,0.35)' }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-3 mb-5">
                  {[
                    { key:'mood',    icon:TrendingUp, label:'Mood History'     },
                    { key:'journal', icon:BookOpen,   label:'Journal Entries'  },
                  ].map(t => {
                    const Icon = t.icon
                    return (
                      <motion.button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold"
                        style={{
                          background: tab === t.key ? 'linear-gradient(135deg, #2E8B57, #3AAFA9)' : 'rgba(255,255,255,0.05)',
                          border: tab === t.key ? 'none' : '1px solid rgba(255,255,255,0.08)',
                          color: tab === t.key ? 'white' : 'rgba(255,255,255,0.5)',
                          boxShadow: tab === t.key ? '0 4px 20px rgba(46,139,87,0.3)' : 'none'
                        }}
                        whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                      >
                        <Icon size={16} /> {t.label}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Content */}
                <div className="rounded-3xl p-5"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>

                  {loadingData ? (
                    <div className="flex items-center justify-center py-12 gap-3">
                      <motion.div className="w-6 h-6 border-2 rounded-full"
                        style={{ borderColor:'rgba(58,175,169,0.2)', borderTopColor:'#3AAFA9' }}
                        animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:'linear' }}
                      />
                      <span className="text-sm" style={{ color:'rgba(255,255,255,0.4)' }}>
                        Loading patient data...
                      </span>
                    </div>
                  ) : tab === 'mood' ? (
                    moods.length === 0 ? (
                      <div className="text-center py-10">
                        <div className="text-5xl mb-3 opacity-30">😶</div>
                        <p className="text-sm" style={{ color:'rgba(255,255,255,0.3)' }}>No mood entries yet.</p>
                      </div>
                    ) : (
                      moods.map((m, i) => {
                        const s     = m.moodScore || 0
                        const color = scoreColor(s)
                        const date  = new Date(m.loggedAt || Date.now())
                          .toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })

                        return (
                          <motion.div key={i}
                            className="flex items-center gap-4 py-3 border-b"
                            style={{ borderColor:'rgba(255,255,255,0.05)' }}
                            initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.06 }}
                          >
                            <div className="w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                              style={{ background:`${color}20`, border:`1px solid ${color}40` }}>
                              <span className="text-sm">{scoreEmoji(s)}</span>
                              <span className="text-[9px] font-bold" style={{ color }}>{s}</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-white capitalize">
                                {m.moodLabel || 'General'}
                              </div>
                              <div className="text-xs mt-0.5" style={{ color:'rgba(255,255,255,0.3)' }}>{date}</div>
                              {m.note && (
                                <div className="text-xs mt-1" style={{ color:'rgba(255,255,255,0.4)' }}>
                                  {m.note.slice(0,80)}{m.note.length > 80 ? '...' : ''}
                                </div>
                              )}
                            </div>
                            <div className="text-2xl font-black" style={{ color, fontFamily:'Poppins,sans-serif' }}>
                              {s}<span className="text-xs font-normal" style={{ color:'rgba(255,255,255,0.2)' }}>/10</span>
                            </div>
                          </motion.div>
                        )
                      })
                    )
                  ) : (
                    journals.length === 0 ? (
                      <div className="text-center py-10">
                        <div className="text-5xl mb-3 opacity-30">📓</div>
                        <p className="text-sm" style={{ color:'rgba(255,255,255,0.3)' }}>No journal entries yet.</p>
                      </div>
                    ) : (
                      journals.map((j, i) => {
                        const date = new Date(j.createdAt || Date.now())
                          .toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
                        return (
                          <motion.div key={j.id}
                            className="p-4 rounded-2xl mb-3"
                            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}
                            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
                            whileHover={{ background:'rgba(124,58,237,0.08)', borderColor:'rgba(124,58,237,0.2)' }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-white">{j.title}</span>
                              <span className="text-xs" style={{ color:'rgba(255,255,255,0.3)' }}>{date}</span>
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color:'rgba(255,255,255,0.5)' }}>
                              {j.content}
                            </p>
                          </motion.div>
                        )
                      })
                    )
                  )}

                </div>

                {/* Privacy footer */}
                <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-2xl"
                  style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <Shield size={12} style={{ color:'rgba(255,255,255,0.2)' }} />
                  <p className="text-xs" style={{ color:'rgba(255,255,255,0.25)' }}>
                    You are viewing this data because {selected.patientName} gave you consent.
                    This data is read-only and protected by Nirvana's privacy policy.
                  </p>
                </div>

              </motion.div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}