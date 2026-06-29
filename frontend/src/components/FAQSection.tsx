import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'

const faqs = [
  { q: "What exactly does ADhoc.ai automate?", a: "Admission enquiries, course recommendation, counselling, fee structure, scholarship guidance, document verification, parent communication, onboarding, attendance and exam notifications, academic guidance, ITI/skill counselling and placement support — across voice and chat." },
  { q: "Does it integrate with our existing systems?", a: "Yes, ADhoc.ai provides REST APIs and webhooks for seamless integration with your existing ERP, LMS, CRM, and payment systems. We support SSO via SAML and OAuth 2.0." },
  { q: "Which languages do the AI agents support?", a: "Our AI agents support 50+ languages including Hindi, English, Tamil, Telugu, Marathi, Bengali, Kannada, Malayalam, Gujarati, and Punjabi. New languages can be added on request." },
  { q: "How is institutional knowledge kept up to date?", a: "Upload PDFs, DOCX, spreadsheets, or connect URLs. Our system automatically parses, chunks, embeds, and indexes your content. Updates are reflected in real-time." },
  { q: "Is it secure and compliant?", a: "ADhoc.ai is SOC 2 Type II certified, GDPR compliant, and uses end-to-end encryption. All data is stored in ISO 27001 certified data centers with 99.9% uptime SLA." },
  { q: "Can students and parents use the same dashboard?", a: "No, each role gets a tailored dashboard. Students see career tools, admission trackers, and academic progress. Parents get attendance, fee, and communication updates. Admins control everything." },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  return (
    <section id="faq" className="py-32 relative">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-purple-400 text-sm font-medium tracking-widest mb-4">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Questions, <span className="text-gradient-neon">answered.</span></h2>
        </motion.div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <div className={`glass-panel rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === i ? 'border-purple-500/40 bg-purple-950/10' : ''}`}>
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left">
                  <span className="font-medium text-white">{faq.q}</span>
                  <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-transform hover:scale-105">{openIndex === i ? <X size={16} className="text-purple-400" /> : <Plus size={16} />}</span>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <div className="px-6 pb-6 text-zinc-400 leading-relaxed">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
