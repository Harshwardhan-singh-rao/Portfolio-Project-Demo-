import { motion } from 'framer-motion'

export default function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="glass rounded-2xl p-6 card-hover">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-3 rounded-xl bg-white/10"><Icon /></div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-white/80">{desc}</p>
    </motion.div>
  )
}
