import Navbar from './components/Navbar';
import WhatsAppFAB from './components/WhatsAppFAB';
import HeroSection from './sections/HeroSection';
import StatsSection from './sections/StatsSection';
import AboutSection from './sections/AboutSection';
import DestinationsSection from './sections/DestinationsSection';
import ServicesSection from './sections/ServicesSection';
import WhyUsSection from './sections/WhyUsSection';
import FleetSection from './sections/FleetSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <DestinationsSection />
        <ServicesSection />
        <WhyUsSection />
        <FleetSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
