import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Phone, ArrowRight } from 'lucide-react'
import { useMousePosition } from '../hooks/useMousePosition'

export default function HeroSection() {
  const navigate = useNavigate()
  const mouse = useMousePosition()
  const offsetX = typeof window !== 'undefined' ? (mouse.x - window.innerWidth/2) * 0.02 : 0
  const offsetY = typeof window !== 'undefined' ? (mouse.y - window.innerHeight/2) * 0.02 : 0

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow"
          style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[100px] animate-pulse-slow"
          style={{ animationDelay: '2s', transform: `translate(${-offsetX*0.75}px, ${-offsetY*0.75}px)` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-800/10 rounded-full blur-[150px]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-purple-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Enterprise AI for Educational Institutions
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Automate the entire{' '}
            <span className="text-white">education &</span><br />
            admission journey{' '}
            <span className="text-gradient">with AI Voice Agents.</span>
          </h1>

          <p className="text-lg text-zinc-400 mb-8 max-w-xl leading-relaxed">
            ADhoc.ai enables colleges, universities and training institutions to automate admissions, 
            counselling, onboarding, parent communication and academic support through conversational AI 
            and intelligent voice automation.
          </p>

          {/* FIX: Single CTA - "Talk to AI" only, removed redundant "Try Voice Demo" */}
          <div className="flex flex-wrap gap-4 mb-12">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/voice-demo')}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-full font-medium transition-all shadow-lg shadow-purple-500/30 glow-purple">
              <Phone size={20} className="group-hover:rotate-12 transition-transform" />
              Talk to AI
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
              className="flex items-center gap-3 px-8 py-4 glass hover:glass-strong text-white rounded-full font-medium transition-all border border-white/20">
              Get Started Free
            </motion.button>
          </div>

          <div className="flex gap-8">
            {[{v:'15+',l:'AI VOICE AGENTS'},{v:'24/7',l:'STUDENT SUPPORT'},{v:'100+',l:'ADMISSION WORKFLOWS'},{v:'∞',l:'CONVERSATIONS'}].map((s,i) => (
              <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i*0.1 }}>
                <div className="text-2xl md:text-3xl font-bold text-white">{s.v}</div>
                <div className="text-xs text-zinc-500 mt-1">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
          className="relative hidden lg:flex items-center justify-center">
          <div className="relative w-[500px] h-[500px]">
            {[...Array(3)].map((_,i) => (
              <motion.div key={i} className="absolute inset-0 rounded-full border border-purple-500/20"
                animate={{ scale: [1,1.2,1], opacity: [0.3,0.1,0.3] }}
                transition={{ duration: 3, delay: i*0.8, repeat: Infinity, ease: "easeInOut" }} />
            ))}
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-600/30 to-cyan-500/20 backdrop-blur-3xl flex items-center justify-center border border-white/10">
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500/40 to-cyan-400/30 animate-pulse-slow" />
              <div className="flex items-center gap-1 h-16">
                {[...Array(20)].map((_,i) => (
                  <motion.div key={i} className="w-1.5 bg-gradient-to-t from-purple-400 to-cyan-400 rounded-full"
                    animate={{ height: [8, 32+Math.random()*32, 8] }}
                    transition={{ duration: 1.2, delay: i*0.05, repeat: Infinity, ease: "easeInOut" }} />
                ))}
              </div>
            </div>
            {[
              {label:'Live transcript', top:'10%', right:'5%', bottom:'auto', leftPos:'auto'},
              {label:'Counselling agent', top:'20%', right:'-5%', bottom:'auto', leftPos:'auto'},
              {label:'Knowledge retrieval', top:'auto', right:'auto', bottom:'25%', leftPos:'-10%'},
              {label:'Voice synthesis', top:'auto', right:'5%', bottom:'10%', leftPos:'auto'}
            ].map((item,i) => (
              <motion.div key={item.label} className="absolute glass px-3 py-1.5 rounded-full text-xs text-zinc-300"
                style={{ top: item.top, right: item.right, bottom: item.bottom, left: item.leftPos }}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1+i*0.2 }}>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block mr-1.5" />{item.label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}