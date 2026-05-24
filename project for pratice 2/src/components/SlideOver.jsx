import { AnimatePresence, motion } from 'framer-motion'

export default function SlideOver({ open, onClose, title, children, width = 420, footer }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.aside
            className="absolute right-0 top-0 h-full glass text-white shadow-2xl"
            style={{ width }}
            initial={{ x: width, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: width * 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button onClick={onClose} className="px-2 py-1 rounded-lg hover:bg-white/10">✕</button>
            </div>
            <div className="p-5 overflow-y-auto h-[calc(100%-72px)]">
              {children}
            </div>
            {footer && (
              <div className="p-4 border-t border-white/10 flex justify-end gap-2">
                {footer}
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
