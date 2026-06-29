import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'AI Agents', href: '#agents' },
    { label: 'Platform', href: '#platform' },
    { label: 'About', href: '#about' },
    { label: 'FAQ', href: '#faq' },
  ]

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-4 inset-x-0 z-50 flex justify-center transition-all duration-500 ${
        scrolled ? 'px-4' : 'px-4'
      }`}
    >
      <div
        className={`w-full max-w-6xl transition-all duration-500 ${
          scrolled
            ? 'glass-panel rounded-2xl shadow-2xl border border-white/10'
            : 'bg-transparent border border-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-extrabold text-lg text-white">ADhoc<span className="text-gradient-neon font-black">.ai</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white rounded-full hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate(`/${user.role}`)}
                className="px-5 py-2 text-sm bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/auth" className="px-5 py-2 text-sm text-zinc-300 hover:text-white transition-colors">
                  Log in
                </Link>
                <Link to="/auth" className="px-5 py-2 text-sm bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 hover:from-purple-500 hover:via-pink-400 hover:to-purple-400 text-white rounded-full transition-all shadow-lg shadow-purple-500/20 border border-white/10 hover:border-purple-300/30 glow-purple">
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-strong rounded-xl mx-2 mb-2 p-4"
            >
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  {link.label}
                </button>
              ))}
              <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
                <Link to="/auth" className="flex-1 text-center py-2 text-sm text-zinc-300 border border-white/20 rounded-full">Log in</Link>
                <Link to="/auth" className="flex-1 text-center py-2 text-sm bg-purple-600 text-white rounded-full">Sign up</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}