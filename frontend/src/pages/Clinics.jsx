import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, Navigation, Phone, ExternalLink, Sparkles, Heart } from 'lucide-react'
import Sidebar from '../components/Sidebar'

const demoClinics = (city) => [
  { name:'Mpower — The Centre',        address:`Bandra West, ${city}`,   phone:'+91-22-2655-3344',  rating:4.8, type:'Mental Health Clinic'    },
  { name:'Vandrevala Foundation',      address:`Andheri East, ${city}`,  phone:'+91-1860-2662-345', rating:4.6, type:'Crisis Support'           },
  { name:'iCall Counselling Centre',   address:`TISS Campus, ${city}`,   phone:'+91-9152987821',    rating:4.9, type:'Counselling Centre'       },
  { name:'Fortis Mental Health',       address:`Mulund West, ${city}`,   phone:'+91-22-4545-2000',  rating:4.5, type:'Hospital'                 },
  { name:'Masina Hospital Psychiatry', address:`Byculla, ${city}`,       phone:'+91-22-2377-6300',  rating:4.3, type:'Psychiatry'               },
  { name:'Asha Hospital',              address:`Hyderabad, ${city}`,     phone:'+91-40-2354-1111',  rating:4.4, type:'Mental Health Hospital'   },
]

const typeColors = {
  'Mental Health Clinic':   { color:'#2E8B57', bg:'rgba(46,139,87,0.15)'   },
  'Crisis Support':         { color:'#EF4444', bg:'rgba(239,68,68,0.15)'   },
  'Counselling Centre':     { color:'#3AAFA9', bg:'rgba(58,175,169,0.15)'  },
  'Hospital':               { color:'#7C3AED', bg:'rgba(124,58,237,0.15)'  },
  'Psychiatry':             { color:'#F59E0B', bg:'rgba(245,158,11,0.15)'  },
  'Mental Health Hospital': { color:'#EC4899', bg:'rgba(236,72,153,0.15)'  },
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#F59E0B' : 'rgba(255,255,255,0.15)', fontSize:'11px' }}>
          ★
        </span>
      ))}
      <span className="text-xs ml-1 font-semibold" style={{ color:'#F59E0B' }}>{rating}</span>
    </div>
  )
}

export default function Clinics() {
  const [city,     setCity]     = useState('')
  const [clinics,  setClinics]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [searched, setSearched] = useState(false)
  const [toast,    setToast]    = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function searchByCity() {
    if (!city.trim()) { showToast('Please enter a city name!', 'error'); return }
    setLoading(true)
    setSearched(false)
    try {
      const geoRes  = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
        { headers:{ 'User-Agent':'NirvanaApp/1.0' } }
      )
      const geoData = await geoRes.json()

      if (!geoData || geoData.length === 0) {
        showToast(`City "${city}" not found. Showing sample data.`, 'error')
        setClinics(demoClinics(city))
        setSearched(true)
        setLoading(false)
        return
      }

      const clinicRes  = await fetch(
        `https://nominatim.openstreetmap.org/search?q=mental+health+clinic+${encodeURIComponent(city)}&format=json&limit=8`,
        { headers:{ 'User-Agent':'NirvanaApp/1.0' } }
      )
      const clinicData = await clinicRes.json()

      if (clinicData && clinicData.length > 0) {
        const mapped = clinicData.map(item => ({
          name:    item.name || item.display_name?.split(',')[0] || 'Health Clinic',
          address: item.display_name || 'Address not available',
          phone:   '',
          rating:  (Math.random() * 1.5 + 3.5).toFixed(1),
          type:    'Mental Health Clinic'
        }))
        setClinics(mapped)
        showToast(`Found ${mapped.length} clinics near ${city}! 🏥`)
      } else {
        setClinics(demoClinics(city))
        showToast(`Showing sample clinics for ${city} 🏥`)
      }
      setSearched(true)
    } catch {
      setClinics(demoClinics(city))
      setSearched(true)
      showToast(`Showing sample clinics for ${city} 🏥`)
    } finally {
      setLoading(false)
    }
  }

  function getLocation() {
    if (!navigator.geolocation) { showToast('Geolocation not supported.', 'error'); return }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        try {
          const revRes  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers:{ 'User-Agent':'NirvanaApp/1.0' } }
          )
          const revData = await revRes.json()
          const cityName = revData?.address?.city || revData?.address?.town || 'your area'
          setCity(cityName)
          setClinics(demoClinics(cityName))
          setSearched(true)
          showToast(`Showing clinics near ${cityName} 🏥`)
        } catch {
          setClinics(demoClinics('your area'))
          setSearched(true)
          showToast('Showing sample clinics near you 🏥')
        } finally {
          setLoading(false)
        }
      },
      () => { showToast('Could not get location. Try city search.', 'error'); setLoading(false) },
      { timeout:10000 }
    )
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
            <span className="text-xs uppercase tracking-widest" style={{ color:'rgba(168,216,200,0.5)' }}>
              Find Support
            </span>
          </div>
          <h2 className="text-3xl font-black text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
            Find{' '}
            <span style={{ background:'linear-gradient(135deg, #a8d8c8, #3AAFA9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Clinics
            </span>{' '}🏥
          </h2>
          <p className="text-sm mt-1" style={{ color:'rgba(255,255,255,0.4)' }}>
            Search by city or use GPS to find mental health support near you.
          </p>
        </motion.div>

        {/* Hero */}
        <motion.div
          className="rounded-3xl p-8 mb-8 relative overflow-hidden"
          style={{
            background:'linear-gradient(135deg, rgba(46,139,87,0.15), rgba(58,175,169,0.1))',
            border:'1px solid rgba(46,139,87,0.2)'
          }}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-10"
            />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background:'rgba(46,139,87,0.3)', border:'1px solid rgba(46,139,87,0.4)' }}
              animate={{ boxShadow:['0 0 15px rgba(46,139,87,0.3)','0 0 30px rgba(46,139,87,0.5)','0 0 15px rgba(46,139,87,0.3)'] }}
              transition={{ duration:3, repeat:Infinity }}
            >
              <Heart size={28} color="#a8d8c8" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily:'Poppins,sans-serif' }}>
                You are not alone 🌿
              </h3>
              <p className="text-sm" style={{ color:'rgba(255,255,255,0.55)' }}>
                Reaching out for help is one of the bravest things you can do.
                Real support is closer than you think.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          className="rounded-3xl p-6 mb-8"
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Search size={16} color="#a8d8c8" />
            <span className="text-sm font-semibold text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
              Search by city name
            </span>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color:'rgba(168,216,200,0.5)' }} />
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchByCity()}
                placeholder="e.g. Mumbai, Pune, Delhi, Bangalore..."
                className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm outline-none transition-all"
                style={{ background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.1)', color:'white', caretColor:'#a8d8c8' }}
                onFocus={e => { e.target.style.borderColor='#3AAFA9'; e.target.style.boxShadow='0 0 0 3px rgba(58,175,169,0.1)' }}
                onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
              />
            </div>

            <motion.button
              onClick={searchByCity}
              disabled={loading}
              className="px-6 py-4 rounded-2xl font-bold text-white text-sm flex items-center gap-2"
              style={{
                background:'linear-gradient(135deg, #2E8B57, #3AAFA9)',
                boxShadow:'0 4px 20px rgba(46,139,87,0.3)',
                cursor:loading ? 'not-allowed' : 'pointer',
                opacity:loading ? 0.7 : 1
              }}
              whileHover={!loading ? { scale:1.05 } : {}}
              whileTap={!loading ? { scale:0.95 } : {}}
            >
              {loading ? (
                <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:'linear' }} />
              ) : (
                <Search size={16} />
              )}
              {loading ? 'Searching...' : 'Search'}
            </motion.button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background:'rgba(255,255,255,0.06)' }} />
            <span className="text-xs" style={{ color:'rgba(255,255,255,0.25)' }}>or</span>
            <div className="flex-1 h-px" style={{ background:'rgba(255,255,255,0.06)' }} />
          </div>

          {/* GPS button */}
          <motion.button
            onClick={getLocation}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{
              background:'rgba(58,175,169,0.1)',
              border:'1.5px solid rgba(58,175,169,0.25)',
              color:'#3AAFA9',
              cursor:loading ? 'not-allowed' : 'pointer'
            }}
            whileHover={!loading ? { background:'rgba(58,175,169,0.2)', scale:1.01 } : {}}
            whileTap={!loading ? { scale:0.99 } : {}}
          >
            <Navigation size={16} />
            Use my current location (GPS)
          </motion.button>
        </motion.div>

        {/* Results */}
        {!searched ? (
          <motion.div
            className="rounded-3xl p-16 text-center"
            style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderStyle:'dashed' }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
          >
            <motion.div
              className="text-7xl mb-4"
              animate={{ y:[-5,5,-5] }}
              transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
            >
              🏥
            </motion.div>
            <h4 className="text-lg font-semibold text-white mb-2" style={{ fontFamily:'Poppins,sans-serif' }}>
              Search for clinics
            </h4>
            <p className="text-sm" style={{ color:'rgba(255,255,255,0.3)' }}>
              Enter a city name or click "Use my current location" to find mental health clinics near you.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles size={16} color="#D9C7FF" />
                <span className="text-sm font-semibold text-white" style={{ fontFamily:'Poppins,sans-serif' }}>
                  {clinics.length} clinic{clinics.length !== 1 ? 's' : ''} found near{' '}
                  <span style={{ color:'#3AAFA9' }}>{city || 'you'}</span>
                </span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ background:'rgba(58,175,169,0.15)', color:'#3AAFA9', border:'1px solid rgba(58,175,169,0.3)' }}>
                Mental Health
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {clinics.map((c, i) => {
                const typeColor = typeColors[c.type] || typeColors['Mental Health Clinic']
                const mapsUrl   = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name + ' ' + c.address)}`

                return (
                  <motion.div
                    key={i}
                    className="rounded-2xl p-5 cursor-pointer group relative overflow-hidden"
                    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
                    onClick={() => window.open(mapsUrl, '_blank')}
                    initial={{ opacity:0, y:15 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay:i * 0.07 }}
                    whileHover={{ scale:1.02, y:-3, border:'1px solid rgba(58,175,169,0.3)', background:'rgba(58,175,169,0.06)' }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background:'linear-gradient(90deg, transparent, rgba(58,175,169,0.5), transparent)' }}
                    />

                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background:typeColor.bg, border:`1px solid ${typeColor.color}30` }}>
                        🏥
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white mb-1 leading-tight">{c.name}</div>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background:typeColor.bg, color:typeColor.color, border:`1px solid ${typeColor.color}30` }}>
                          {c.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mb-2">
                      <MapPin size={12} style={{ color:'rgba(255,255,255,0.3)', flexShrink:0, marginTop:2 }} />
                      <span className="text-xs leading-relaxed" style={{ color:'rgba(255,255,255,0.45)' }}>
                        {c.address.slice(0, 80)}{c.address.length > 80 ? '...' : ''}
                      </span>
                    </div>

                    {c.phone && (
                      <div className="flex items-center gap-2 mb-3">
                        <Phone size={12} style={{ color:'#3AAFA9' }} />
                        <span className="text-xs" style={{ color:'#3AAFA9' }}>{c.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <StarRating rating={Number(c.rating)} />
                      <motion.div
                        className="flex items-center gap-1 text-xs"
                        style={{ color:'rgba(58,175,169,0.6)' }}
                        whileHover={{ color:'#3AAFA9' }}
                      >
                        <ExternalLink size={11} />
                        Open Maps
                      </motion.div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Crisis helpline */}
            <motion.div
              className="mt-6 rounded-2xl p-5 flex items-center gap-4"
              style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            >
              <div className="text-3xl">🆘</div>
              <div className="flex-1">
                <div className="text-sm font-semibold mb-1" style={{ color:'#fca5a5', fontFamily:'Poppins,sans-serif' }}>
                  Need immediate help?
                </div>
                <div className="flex gap-4">
                  <a href="tel:9152987821" className="text-xs flex items-center gap-1" style={{ color:'rgba(252,165,165,0.8)' }}>
                    <Phone size={11} /> iCall: 9152987821
                  </a>
                  <a href="tel:18602662345" className="text-xs flex items-center gap-1" style={{ color:'rgba(252,165,165,0.8)' }}>
                    <Phone size={11} /> Vandrevala: 1860-2662-345
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

      </main>
    </div>
  )
}