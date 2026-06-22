import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

type AuthMode = 'signin' | 'signup'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const email = formData.email.trim().toLowerCase()

    if (!EMAIL_PATTERN.test(email)) {
      toast.error('Enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signin') {
        await login(email, formData.password)
        toast.success('Welcome back!')
      } else {
        await signup({ name: formData.name.trim(), email, password: formData.password })
        toast.success('Account created!')
      }
      const user = JSON.parse(localStorage.getItem('adhoc_user') || '{}')
      navigate(`/${user.role}`)
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-white">ADhoc<span className="text-purple-400">.ai</span></span>
          </Link>
          <p className="text-purple-400 text-sm font-medium tracking-widest mb-4">THE AI OPERATING SYSTEM</p>
          <h1 className="text-5xl font-bold mb-6 leading-tight">Step into the future of <span className="text-gradient">education.</span></h1>
          <p className="text-zinc-400 text-lg mb-8 leading-relaxed">Sign in to ADhoc.ai and unlock an intelligent digital workforce — voice agents that handle admissions, counselling, communication and student success.</p>
          <div className="flex gap-4">
            {[{v:'2.4M+',l:'Calls handled'},{v:'180+',l:'Institutions'},{v:'98%',l:'Resolution rate'}].map((s) => (
              <div key={s.l} className="glass rounded-2xl p-4">
                <div className="text-2xl font-bold text-white">{s.v}</div>
                <div className="text-xs text-zinc-500 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-3xl p-8 border border-white/10">
          <div className="glass rounded-full p-1 flex mb-8">
            <button onClick={() => setMode('signin')} className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${mode === 'signin' ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white' : 'text-zinc-400'}`}>Sign in</button>
            <button onClick={() => setMode('signup')} className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${mode === 'signup' ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white' : 'text-zinc-400'}`}>Create account</button>
          </div>
          <AnimatePresence mode="wait">
            <motion.form key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h2>
                <p className="text-zinc-400 text-sm">{mode === 'signin' ? 'Sign in to your ADhoc workspace.' : 'Create your student account.'}</p>
              </div>
              {mode === 'signup' && (
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input type="text" placeholder="Full name" value={formData.name} onChange={(e) => setFormData({...formData,name:e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-all" required />
                </div>
              )}
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({...formData,email:e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-all" required />
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData,password:e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-all" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : mode === 'signin' ? 'Sign in' : 'Create account'}
              </motion.button>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center"><span className="bg-[#0a0a0f] px-4 text-xs text-zinc-500">OR</span></div>
              </div>
              <button type="button" className="w-full py-3.5 glass rounded-xl text-white font-medium flex items-center justify-center gap-3 hover:bg-white/10 transition-all border border-white/10">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.67 0 3.17.58 4.35 1.72l3.24-3.24C17.32 1.36 14.86.36 12 .36 7.27.36 3.18 3.03 1.36 6.91l3.78 2.93C6.18 6.36 8.82 5.04 12 5.04z"/><path fill="#4285F4" d="M23.64 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.53c-.28 1.5-1.1 2.77-2.34 3.62l3.78 2.93c2.2-2.03 3.47-5.02 3.47-8.66z"/><path fill="#FBBC05" d="M5.14 14.18l-3.78 2.93C3.18 20.97 7.27 23.64 12 23.64c3.68 0 6.77-1.22 9.02-3.3l-3.78-2.93c-1.22.82-2.78 1.3-4.62 1.3-3.55 0-6.56-2.39-7.64-5.63z"/><path fill="#34A853" d="M12 5.04c3.18 0 5.82 1.32 7.14 3.43l3.24-3.24C20.17 1.36 17.32.36 12 .36 7.27.36 3.18 3.03 1.36 6.91l3.78 2.93C6.18 6.36 8.82 5.04 12 5.04z"/></svg>
                Continue with Google
              </button>
              <p className="text-xs text-zinc-500 text-center">By continuing you agree to ADhoc.ai's Terms & Privacy Policy.</p>
            </motion.form>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
