import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Phone, ArrowRight } from 'lucide-react'
import { useMousePosition } from '../hooks/useMousePosition'
import Hero3DScene from './Hero3DScene'

export default function HeroSection() {
  const navigate = useNavigate()
  const mouse = useMousePosition()
  
  // Subtle parallax offset calculations for ambient glow elements
  const offsetX = typeof window !== 'undefined' ? (mouse.x - window.innerWidth/2) * 0.012 : 0
  const offsetY = typeof window !== 'undefined' ? (mouse.y - window.innerHeight/2) * 0.012 : 0

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Decorative ambient glowing layer */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px] animate-pulse-slow"
          style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }} />
        <div className="absolute bottom-12 right-1/4 w-[450px] h-[450px] bg-cyan-500/8 rounded-full blur-[110px] animate-pulse-slow"
          style={{ animationDelay: '2s', transform: `translate(${-offsetX*0.6}px, ${-offsetY*0.6}px)` }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left Column: Premium visual intro with Framer Motion staggered timings */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          {/* Label Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.8, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-xs text-purple-300 mb-6 font-mono tracking-wider shadow-lg shadow-purple-500/5 select-none"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
            ENTERPRISE AI OPERATING SYSTEM
          </motion.div>

          {/* Heading - Stage 9 */}
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 tracking-tight text-white">
            Automate the entire{' '}
            <span className="text-zinc-100">education &</span><br />
            admission journey{' '}
            <span className="text-gradient-neon font-extrabold">with AI Voice.</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-zinc-400 mb-8 max-w-xl leading-relaxed">
            ADhoc.ai enables colleges, universities, and training institutions to automate admissions, 
            counselling, onboarding, parent communication, and academic support through conversational AI 
            and intelligent voice automation.
          </p>

          {/* Buttons - Stage 10 */}
          <div className="flex flex-wrap gap-4 mb-12">
            <motion.button 
              whileHover={{ scale: 1.03, y: -2 }} 
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/voice-demo')}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 text-white rounded-full font-medium transition-all shadow-lg shadow-purple-500/20 border border-white/10 hover:border-purple-300/30 glow-purple"
            >
              <Phone size={18} className="group-hover:rotate-12 transition-transform duration-300" />
              Talk to AI Agent
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.03, y: -2 }} 
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/auth')}
              className="flex items-center gap-3 px-8 py-4 glass hover:bg-white/10 text-white rounded-full font-medium transition-all border border-white/15 shadow-sm"
            >
              Get Started Free
            </motion.button>
          </div>

          {/* Stats Badges */}
          <div className="flex gap-8 border-t border-white/5 pt-8">
            {[
              {v:'15+',l:'AI VOICE AGENTS'},
              {v:'24/7',l:'STUDENT SUPPORT'},
              {v:'100+',l:'WORKFLOWS'},
            ].map((s,i) => (
              <motion.div 
                key={s.l} 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 1.4 + i*0.12, duration: 0.6 }}
              >
                <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">{s.v}</div>
                <div className="text-[10px] text-zinc-500 font-mono tracking-widest mt-1.5">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: 3D centerpiece scene - Stages 5, 6, 8 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1.2, delay: 0.3 }}
          className="relative hidden lg:flex items-center justify-center h-[520px] w-full z-10"
        >
          <div className="absolute inset-0 w-full h-full">
            <Hero3DScene />
          </div>
          
          {/* Orbiting glowing tags representing system segments */}
          {[
            {label:'Live transcript', top:'10%', right:'5%', bottom:'auto', leftPos:'auto', color:'bg-neon-cyan'},
            {label:'Counselling agent', top:'25%', right:'-5%', bottom:'auto', leftPos:'auto', color:'bg-neon-purple'},
            {label:'Knowledge retrieval', top:'auto', right:'auto', bottom:'20%', leftPos:'-8%', color:'bg-neon-pink'},
            {label:'Voice synthesis', top:'auto', right:'5%', bottom:'10%', leftPos:'auto', color:'bg-neon-teal'}
          ].map((item,i) => (
            <motion.div 
              key={item.label} 
              className="absolute glass-panel px-4 py-2 rounded-full text-xs text-zinc-200 border border-white/10 font-mono tracking-wide shadow-lg select-none"
              style={{ top: item.top, right: item.right, bottom: item.bottom, left: item.leftPos }}
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1.6 + i*0.2, duration: 0.8 }}
              whileHover={{ scale: 1.05, borderColor: "rgba(255, 255, 255, 0.25)" }}
            >
              <span className={`w-2 h-2 rounded-full ${item.color} inline-block mr-2 animate-pulse`} />
              {item.label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
