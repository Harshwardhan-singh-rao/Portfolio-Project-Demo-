import { useTheme } from './ThemeProvider'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      aria-label="Toggle theme"
      className="p-2 rounded-xl glass hover:shadow-glow">
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </motion.button>
  )
}
