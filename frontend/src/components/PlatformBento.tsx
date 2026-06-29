import { motion } from 'framer-motion'
import { Mic, BookOpen, FileCode, Brain, Phone, Globe, MessageSquare, BarChart3, Shield } from 'lucide-react'

const features = [
  { icon: Mic, title: 'Voice AI Conversations', desc: 'Realtime, low-latency speech with natural turn-taking.', size: 'large' },
  { icon: BookOpen, title: 'Knowledge Base Search', desc: 'Conversational retrieval over institution documents.', size: 'small' },
  { icon: FileCode, title: 'Prompt Engineering', desc: 'VS Code-inspired studio with variables and versions.', size: 'small' },
  { icon: Brain, title: 'RAG Intelligence', desc: 'Grounded answers with citations and confidence.', size: 'small' },
  { icon: Phone, title: 'Telephony Integration', desc: 'Inbound, outbound, queues and number management.', size: 'large' },
  { icon: Globe, title: 'WebRTC Browser Calling', desc: 'Native browser calling without plugins.', size: 'small' },
  { icon: MessageSquare, title: 'Real-time Transcripts', desc: 'Live conversation with speaker labels and search.', size: 'large' },
  { icon: Shield, title: 'Role-based Access', desc: 'Admin, faculty, student — scoped to the role.', size: 'small' },
  { icon: BarChart3, title: 'Analytics', desc: 'Admission funnel, voice quality, agent performance.', size: 'small' },
]

export default function PlatformBento() {
  return (
    <section id="platform" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-purple-400 text-sm font-medium tracking-widest mb-4">PLATFORM</p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">One <span className="text-gradient-neon">operating system</span> for the entire institution.</h2>
          <p className="text-zinc-400">Modular by design. Every capability is a building block of your AI workforce.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[180px]">
          {features.map((feature, i) => (
            <motion.div key={feature.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.015, y: -4 }}
              className={`glass-panel rounded-3xl p-6 flex flex-col justify-between hover:bg-white/5 transition-all duration-300 border border-white/10 hover:border-purple-500/30 cursor-pointer group relative overflow-hidden ${
                feature.size === 'large' ? 'md:col-span-2 md:row-span-2' : 'md:row-span-1'
              }`}>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
                <feature.icon size={20} className="text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400">{feature.desc}</p>
              </div>
              {feature.size === 'large' && (
                <div className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <feature.icon size={80} className="text-purple-400" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
