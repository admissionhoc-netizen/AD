import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Phone, ArrowRight } from 'lucide-react'

export default function CTASection() {
  const navigate = useNavigate()
  return (
    <section className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-panel rounded-3xl p-12 md:p-16 text-center relative overflow-hidden border border-white/10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Bring your institution into the <span className="text-gradient-neon">AI era.</span></h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">See ADhoc.ai automate counselling, admissions and student support across your campus.</p>
            <div className="flex flex-wrap justify-center gap-4">
              {/* FIX: Single "Talk to AI" CTA, removed redundant "Try Voice Demo" */}
              <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/voice-demo')}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg shadow-purple-500/20 border border-white/10 hover:border-purple-300/30 glow-purple">
                <Phone size={18} />Talk to AI
              </motion.button>
              <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/auth')}
                className="flex items-center gap-3 px-8 py-4 glass text-white rounded-full font-medium border border-white/15 hover:bg-white/10 transition-colors">
                Get Started Free<ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}