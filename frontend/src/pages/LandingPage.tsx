import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import WorkflowSection from '../components/WorkflowSection'
import PlatformBento from '../components/PlatformBento'
import AgentsShowcase from '../components/AgentsShowcase'
import DashboardShowcase from '../components/DashboardShowcase'
import Testimonials from '../components/Testimonials'
import FAQSection from '../components/FAQSection'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <WorkflowSection />
      <PlatformBento />
      <AgentsShowcase />
      <DashboardShowcase />
      <Testimonials />
      <FAQSection />
      <CTASection />
      <Footer />
    </motion.div>
  )
}
