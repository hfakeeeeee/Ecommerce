import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BsFillSunFill, BsFillMoonStarsFill } from 'react-icons/bs';

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        return savedTheme === 'dark'
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return (
    <motion.button
      initial={false}
      animate={{ 
        backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
        rotate: isDark ? 180 : 0 
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => setIsDark(!isDark)}
      className="relative p-1.5 rounded-full shadow-lg flex items-center justify-center transition-colors duration-300"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ width: 36, height: 36 }}
    >
      <motion.div
        initial={false}
        animate={{}}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-6 h-6 flex items-center justify-center"
      >
        {/* Sun Icon */}
        <motion.span
          initial={false}
          animate={{ 
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.5 : 1,
            filter: isDark ? 'blur(0px)' : 'drop-shadow(0 0 6px #fde68a)',
            color: isDark ? '#fff' : '#fbbf24'
          }}
          className="absolute inset-0 flex items-center justify-center transition-transform"
        >
          <BsFillSunFill className="w-6 h-6" />
        </motion.span>
        {/* Moon Icon */}
        <motion.span
          initial={false}
          animate={{ 
            opacity: isDark ? 1 : 0,
            scale: isDark ? 1 : 0.5,
            filter: isDark ? 'drop-shadow(0 0 6px #818cf8)' : 'blur(0px)',
            color: isDark ? '#fff' : '#1e293b'
          }}
          className="absolute inset-0 flex items-center justify-center transition-transform"
        >
          <BsFillMoonStarsFill className="w-6 h-6" />
        </motion.span>
      </motion.div>
    </motion.button>
  )
} 