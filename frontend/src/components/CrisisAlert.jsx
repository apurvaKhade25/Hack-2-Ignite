import { motion } from 'framer-motion'
import { Phone, Heart } from 'lucide-react'

export default function CrisisAlert() {
  return (
    <motion.div
      className="rounded-2xl p-5 my-4"
      style={{
        background: 'linear-gradient(135deg, rgba(220,38,38,0.15), rgba(239,68,68,0.1))',
        border: '1px solid rgba(220,38,38,0.3)'
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Heart size={18} color="#fca5a5" />
        <p className="font-semibold text-sm" style={{ color: '#fca5a5' }}>
          We're here for you 💙
        </p>
      </div>
      <p className="text-sm mb-3" style={{ color: 'rgba(252,165,165,0.8)' }}>
        If you're feeling overwhelmed, please reach out to a professional:
      </p>
      <div className="flex flex-col gap-2">
        <a href="tel:9152987821"
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: '#fca5a5' }}>
          <Phone size={14} />
          iCall: 9152987821
        </a>
        <a href="tel:18602662345"
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: '#fca5a5' }}>
          <Phone size={14} />
          Vandrevala Foundation: 1860-2662-345
        </a>
      </div>
    </motion.div>
  )
}