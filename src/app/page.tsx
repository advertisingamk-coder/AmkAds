import Navbar from '@/components/nav/Navbar'
import HeroSection from '@/components/hero/HeroSection'
import CapabilitiesSection from '@/components/hero/CapabilitiesSection'
import StatsSection from '@/components/stats/StatsSection'
import PortfolioSection from '@/components/portfolio/PortfolioSection'
import GroupSection from '@/components/group/GroupSection'
import ContactSection from '@/components/contact/ContactSection'
import AboutSection from '@/components/about/AboutSection'
import Footer from '@/components/footer/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-black">
      <Navbar />
      <HeroSection />
      <CapabilitiesSection />
      <StatsSection />
      <AboutSection />
      <PortfolioSection />
      <GroupSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
