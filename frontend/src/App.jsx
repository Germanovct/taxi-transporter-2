import Navbar from './components/Navbar';
import WhatsAppFAB from './components/WhatsAppFAB';
import HeroSection from './sections/HeroSection';
import StatsSection from './sections/StatsSection';
import AboutSection from './sections/AboutSection';
import ServicesAndDestinationsSection from './sections/ServicesAndDestinationsSection';
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
        <ServicesAndDestinationsSection />
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
