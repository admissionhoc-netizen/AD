import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg text-white">ADhoc<span className="text-purple-400">.ai</span></span>
            </div>
            <p className="text-zinc-500 text-sm max-w-xs">The AI operating system for educational institutions.</p>
          </div>
          {[
            { title: 'PLATFORM', links: ['AI Agents','Voice Studio','Knowledge Base','Prompt Studio','Telephony','Analytics'] },
            { title: 'SOLUTIONS', links: ['Universities','Colleges','ITIs','Coaching','Skill Centers'] },
            { title: 'COMPANY', links: ['About','Careers','Customers','Security','Contact'] },
            { title: 'RESOURCES', links: ['Docs','Changelog','Blog','Status','Trust Center'] },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-medium text-zinc-500 tracking-wider mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}><span className="text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer">{link}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <p className="text-zinc-500 text-sm">© 2026 ADhoc.ai · All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="text-sm text-zinc-500 hover:text-white transition-colors cursor-pointer">Privacy</span>
            <span className="text-sm text-zinc-500 hover:text-white transition-colors cursor-pointer">Terms</span>
            <span className="text-sm text-zinc-500 hover:text-white transition-colors cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
