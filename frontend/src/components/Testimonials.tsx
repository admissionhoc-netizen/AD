import { motion } from 'framer-motion'

const testimonials = [
  { quote: "We replaced our overflow call center within a semester. Counselling quality went up, not down.", name: "Dr. Anika Rao", role: "Dean of Admissions · Crestwood University", initials: "DA" },
  { quote: "Document verification used to take days. Now it's same-day, with an audit trail.", name: "Priya Sharma", role: "Admissions Officer · Skyline Polytechnic", initials: "PS" },
  { quote: "I get clear updates on attendance and exams without chasing anyone.", name: "Sunita Patel", role: "Parent", initials: "SP" },
  { quote: "ADhoc.ai handles 80% of parent enquiries before they ever reach our office.", name: "Rohan Mehta", role: "Principal · Apex Institute", initials: "RM" },
  { quote: "I was confused after 12th. The voice agent walked me through options in my own language.", name: "Arjun K.", role: "Student · First-year, B.Tech", initials: "AK" },
]

export default function Testimonials() {
  return (
    <section className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-purple-400 text-sm font-medium tracking-widest mb-4">VOICES</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by the people who run <span className="text-gradient">education.</span></h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }} className="glass rounded-3xl p-6 hover:bg-white/10 transition-all">
              <p className="text-zinc-300 mb-6 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">{t.initials}</div>
                <div>
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-zinc-500 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
