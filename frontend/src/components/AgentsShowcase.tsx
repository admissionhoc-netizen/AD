import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Heart, Users, MessageCircle, DollarSign, FileCheck, Calendar, BookOpen, Star, Sparkles, Wrench, Briefcase, Phone, BarChart3, Headphones } from 'lucide-react'

const agents = [
  { id: 1, category: 'ADMISSIONS', name: 'Admission Enquiry Agent', desc: 'Answers enquiries 24/7 with institution-specific knowledge.', icon: GraduationCap },
  { id: 2, category: 'COUNSELLING', name: 'Career Counselling Agent', desc: 'Personalized academic and career guidance.', icon: Heart },
  { id: 3, category: 'COUNSELLING', name: 'Student Counselling Agent', desc: 'Personalized academic and emotional support.', icon: Users },
  { id: 4, category: 'COMMUNICATION', name: 'Parent Counselling Agent', desc: 'Engages parents with clarity, calm and confidence.', icon: MessageCircle },
  { id: 5, category: 'FINANCE', name: 'Fee Assistant', desc: 'Payment reminders, fee structure, scholarship info.', icon: DollarSign },
  { id: 6, category: 'DOCUMENTS', name: 'Document Verification Agent', desc: 'Verifies and processes student documents.', icon: FileCheck },
  { id: 7, category: 'ONBOARDING', name: 'Student Onboarding Agent', desc: 'Walks new students through enrolment.', icon: Calendar },
  { id: 8, category: 'ACADEMIC', name: 'Attendance Reminder Agent', desc: 'Sends attendance alerts and reports.', icon: BookOpen },
  { id: 9, category: 'ACADEMIC', name: 'Exam Reminder Agent', desc: 'Exam schedules, preparation tips, results.', icon: Star },
  { id: 10, category: 'ACADEMIC', name: 'Academic Mentor', desc: 'Course guidance, study plans, progress tracking.', icon: Sparkles },
  { id: 11, category: 'SKILLS', name: 'ITI Counsellor', desc: 'Skill development and vocational guidance.', icon: Wrench },
  { id: 12, category: 'CAREERS', name: 'Placement Assistance Agent', desc: 'Interview prep, openings and placement readiness.', icon: Briefcase },
  { id: 13, category: 'OUTREACH', name: 'Outreach Agent', desc: 'Outbound campaigns across regions.', icon: Phone },
  { id: 14, category: 'ANALYTICS', name: 'Admission CRM Agent', desc: 'Lead tracking, follow-ups, conversion.', icon: BarChart3 },
  { id: 15, category: 'GENERAL', name: 'General College Assistant', desc: 'All-purpose institutional knowledge base.', icon: Headphones },
]

export default function AgentsShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <section id="agents" className="py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-purple-400 text-sm font-medium tracking-widest mb-4">15 AI VOICE AGENTS</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">An entire admissions <span className="text-gradient">department,</span> automated.</h2>
          <p className="text-zinc-400">Scroll to meet the team. Each agent owns one responsibility and speaks fluently across languages.</p>
        </motion.div>
        <div className="relative h-[500px] flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {agents.map((agent, i) => {
              const offset = i - activeIndex
              const isActive = i === activeIndex
              return (
                <motion.div key={agent.id} initial={false}
                  animate={{ y: offset * 30, scale: isActive ? 1 : 0.9, opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.2, zIndex: agents.length - Math.abs(offset), rotateX: offset * -5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  onClick={() => setActiveIndex(i)}
                  className={`absolute w-full max-w-md cursor-pointer ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
                  style={{ perspective: 1000 }}>
                  <div className={`glass rounded-3xl p-6 border transition-all ${isActive ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20' : 'border-white/5'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-purple-400 font-medium tracking-wider">{agent.category}</span>
                      <span className="text-xs text-zinc-500">{String(i + 1).padStart(2, '0')} / 15</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                        <agent.icon size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{agent.name}</h3>
                        <p className="text-sm text-zinc-400">{agent.desc}</p>
                      </div>
                    </div>
                    {isActive && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2">
                        <div className="flex-1 h-8 flex items-end gap-0.5">
                          {[...Array(20)].map((_, j) => (
                            <motion.div key={j} className="flex-1 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full"
                              animate={{ height: [4, 16 + Math.random() * 16, 4] }}
                              transition={{ duration: 0.8, delay: j * 0.03, repeat: Infinity }} />
                          ))}
                        </div>
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm text-white transition-colors">Try agent →</button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {agents.map((_, i) => (
            <button key={i} onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-purple-500 w-6' : 'bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
