import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home, Smile, BookOpen, MessageCircle,
  BarChart2, MapPin, Handshake, LogOut,
  Stethoscope, Sparkles, Brain
} from 'lucide-react'
import useAuthStore from '../store/authStore'

const patientNav = [
  { to:'/patient/dashboard', icon:Home,          label:'Dashboard',       section:'main'    },
  { to:'/patient/mood',      icon:Smile,         label:'Mood Tracker',    section:'main'    },
  { to:'/patient/journal',   icon:BookOpen,      label:'Journal',         section:'main'    },
  { to:'/patient/chat',      icon:MessageCircle, label:'AI Companion',    section:'ai'      },
  { to:'/patient/insights',icon:Brain,         label:'Mood Insights',   section:'ai'      },
  { to:'/patient/wellness',  icon:BarChart2,     label:'Wellness Report', section:'ai'      },
  { to:'/patient/clinics',   icon:MapPin,        label:'Find Clinics',    section:'help'    },
  { to:'/patient/consent',   icon:Sparkles,      label:'My Doctors',      section:'help'    },
]

const doctorNav = [
  { to:'/doctor/dashboard', icon:Stethoscope, label:'Dashboard', section:'main' },
]

const sectionColors = {
  main: { active:'rgba(46,139,87,0.25)',   border:'#2E8B57', dot:'#2E8B57'  },
  ai:   { active:'rgba(124,58,237,0.25)',  border:'#7C3AED', dot:'#7C3AED'  },
  help: { active:'rgba(58,175,169,0.25)',  border:'#3AAFA9', dot:'#3AAFA9'  },
}

export default function Sidebar() {
  const { user, role, logout } = useAuthStore()
  const navigate               = useNavigate()

  const name     = user?.name || user?.username || 'User'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const navItems = role === 'DOCTOR' ? doctorNav : patientNav

  const sections = role === 'DOCTOR'
    ? [{ label: 'Doctor Portal', key: 'main' }]
    : [
        { label: 'Main',        key: 'main' },
        { label: 'AI Features', key: 'ai'   },
        { label: 'Help',        key: 'help'  },
      ]

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <motion.aside
      className="w-64 min-h-screen fixed top-0 left-0 flex flex-col z-50 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #060d1f 0%, #0a1628 50%, #0d1f3a 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)'
      }}
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >

      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.6), rgba(58,175,169,0.6), transparent)' }}
      />

      {/* Background orb */}
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(46,139,87,0.1), transparent 70%)' }}
      />

      {/* Logo */}
      <div className="px-6 pt-7 pb-5 relative"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(58,175,169,0.4))',
              border: '1px solid rgba(168,216,200,0.3)'
            }}
            animate={{ boxShadow: ['0 0 15px rgba(124,58,237,0.3)', '0 0 25px rgba(58,175,169,0.4)', '0 0 15px rgba(124,58,237,0.3)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🧘
          </motion.div>
          <div>
            <h1 className="text-xl font-black"
              style={{
                fontFamily: 'Poppins, sans-serif',
                background: 'linear-gradient(135deg, #a8d8c8, #3AAFA9, #D9C7FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
              Nirvana
            </h1>
            <p className="text-[9px] tracking-[2px] uppercase"
              style={{ color: 'rgba(168,216,200,0.35)' }}>
              {role === 'DOCTOR' ? 'Doctor Portal' : 'Wellness'}
            </p>
          </div>
        </div>
      </div>

      {/* User card */}
      <motion.div
        className="mx-4 mt-4 mb-2 flex items-center gap-3 rounded-2xl px-4 py-3 relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)'
        }}
        whileHover={{ background: 'rgba(255,255,255,0.07)' }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #2E8B57, #3AAFA9)',
            color: 'white'
          }}>
          {initials}
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-semibold text-white truncate"
            style={{ fontFamily: 'Poppins, sans-serif' }}>
            {name}
          </div>
          <div className="text-xs" style={{ color: 'rgba(168,216,200,0.5)' }}>
            {role === 'DOCTOR' ? '🩺 Doctor' : '✦ Wellness member'}
          </div>
        </div>
        <motion.div
          className="absolute right-3 w-2 h-2 rounded-full"
          style={{ background: '#2E8B57' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        {sections.map(section => (
          <div key={section.key} className="mb-4">
            <p className="text-[9px] uppercase tracking-[2px] px-3 mb-2 font-semibold"
              style={{ color: 'rgba(255,255,255,0.2)' }}>
              {section.label}
            </p>

            {navItems.filter(item => item.section === section.key).map((item, i) => {
              const colors = sectionColors[item.section]
              const Icon   = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to.endsWith('dashboard')}
                >
                  {({ isActive }) => (
                    <motion.div
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 relative overflow-hidden cursor-pointer"
                      style={{
                        background: isActive ? colors.active : 'transparent',
                        borderLeft: isActive ? `3px solid ${colors.border}` : '3px solid transparent',
                      }}
                      whileHover={{
                        background: isActive ? colors.active : 'rgba(255,255,255,0.05)',
                        x: 2
                      }}
                      transition={{ duration: 0.15 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Icon
                        size={16}
                        style={{ color: isActive ? colors.dot : 'rgba(255,255,255,0.4)', flexShrink: 0 }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.45)' }}
                      >
                        {item.label}
                      </span>

                      {isActive && (
                        <motion.div
                          className="absolute right-3 w-1.5 h-1.5 rounded-full"
                          style={{ background: colors.dot }}
                          animate={{ scale: [1, 1.4, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <motion.button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          whileHover={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', x: 2 }}
          transition={{ duration: 0.15 }}
        >
          <LogOut size={16} />
          <span className="text-sm font-medium">Log out</span>
        </motion.button>
      </div>

    </motion.aside>
  )
}