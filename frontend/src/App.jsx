import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import WhatsAppFAB from './components/WhatsAppFAB';
import HeroSection from './sections/HeroSection';
import StatsSection from './sections/StatsSection';
import AboutSection from './sections/AboutSection';
import ServicesDestinationsSection from './sections/ServicesDestinationsSection';
import WhyUsSection from './sections/WhyUsSection';
import FleetSection from './sections/FleetSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';
import ReservaConfirmada from './pages/ReservaConfirmada';
import ReservaError from './pages/ReservaError';
import ReservaPendiente from './pages/ReservaPendiente';

function LandingPage() {
  return (
    <>
      <main>
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <ServicesDestinationsSection />
        <WhyUsSection />
        <FleetSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/reserva/confirmada" element={<ReservaConfirmada />} />
        <Route path="/reserva/error" element={<ReservaError />} />
        <Route path="/reserva/pendiente" element={<ReservaPendiente />} />
      </Routes>
      <WhatsAppFAB />
    </>
  );
}
