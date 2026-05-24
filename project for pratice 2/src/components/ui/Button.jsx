import { motion } from 'framer-motion'

export function Button({ children, onClick, variant = 'primary', className = '', type = 'button' }) {
  const base = 'rounded-xl px-6 py-3 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400'
  const variants = {
    primary: 'btn-gradient',
    outline: 'glass border border-white/30 hover:border-white/50',
    ghost: 'bg-transparent hover:bg-white/10'
  }
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -1 }}
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}
