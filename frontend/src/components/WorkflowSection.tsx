import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const steps = [
  { num: '01', text: 'Student discovers career options', side: 'left' },
  { num: '02', text: 'Talks with AI Voice Agent', side: 'right' },
  { num: '03', text: 'AI asks intelligent counselling questions', side: 'left' },
  { num: '04', text: 'AI recommends a career path', side: 'right' },
  { num: '05', text: 'College recommendations generated', side: 'left' },
  { num: '06', text: 'Admission guidance begins', side: 'right' },
  { num: '07', text: 'Documents uploaded & verified', side: 'left' },
  { num: '08', text: 'Scholarship eligibility checked', side: 'right' },
  { num: '09', text: 'Application completed', side: 'left' },
  { num: '10', text: 'Fee payment initiated', side: 'right' },
  { num: '11', text: 'Student onboarding begins', side: 'left' },
  { num: '12', text: 'Semester roadmap generated', side: 'right' },
  { num: '13', text: 'Academic support continues', side: 'left' },
  { num: '14', text: 'Placement guidance begins', side: 'right' },
]

export default function WorkflowSection() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  return (
    <section id="solutions" className="py-32 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <p className="text-purple-400 text-sm font-medium tracking-widest mb-4">HOW IT WORKS</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">From first question to <span className="text-gradient">first placement.</span></h2>
          <p className="text-zinc-400">A continuous, AI-guided journey — every step tracked, every conversation remembered.</p>
        </motion.div>
        <div ref={ref} className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-cyan-500/50 to-purple-500/50" />
          {steps.map((step, i) => (
            <motion.div key={step.num}
              initial={{ opacity: 0, x: step.side === 'left' ? -50 : 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`flex items-center gap-6 mb-8 ${step.side === 'right' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-1 ${step.side === 'right' ? 'text-left' : 'text-right'}`}>
                <div className="inline-block glass px-5 py-3 rounded-2xl text-sm text-zinc-200 hover:bg-white/10 transition-all cursor-default">{step.text}</div>
              </div>
              <motion.div whileHover={{ scale: 1.2 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg shadow-purple-500/30">
                {step.num}
              </motion.div>
              <div className="flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
