import Navbar from './components/Navbar';
import WhatsAppFAB from './components/WhatsAppFAB';
import HeroSection from './sections/HeroSection';
import BookingSection from './sections/BookingSection';
import StatsSection from './sections/StatsSection';
import AboutSection from './sections/AboutSection';
import ServicesDestinationsSection from './sections/ServicesDestinationsSection';
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
        <BookingSection />
        <StatsSection />
        <AboutSection />
        <ServicesDestinationsSection />
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
