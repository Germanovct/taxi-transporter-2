import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setMobileOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <a href="#" className={styles.logo} onClick={(e) => handleLinkClick(e, 'hero')}>
            TAXI EL TRANSPORTER 2
          </a>

          {/* Desktop Navigation */}
          <ul className={styles.navLinks}>
            <li>
              <a href="#hero" className={styles.navLink} onClick={(e) => handleLinkClick(e, 'hero')}>
                Inicio
              </a>
            </li>
            <li>
              <a href="#services" className={styles.navLink} onClick={(e) => handleLinkClick(e, 'services')}>
                Servicios
              </a>
            </li>
            <li>
              <a href="#destinations" className={styles.navLink} onClick={(e) => handleLinkClick(e, 'destinations')}>
                Destinos
              </a>
            </li>
            <li>
              <a href="#fleet" className={styles.navLink} onClick={(e) => handleLinkClick(e, 'fleet')}>
                Flota
              </a>
            </li>
            <li>
              <a href="#whyus" className={styles.navLink} onClick={(e) => handleLinkClick(e, 'whyus')}>
                ¿Por qué elegirnos?
              </a>
            </li>
            <li>
              <a href="#contact" className={styles.navLink} onClick={(e) => handleLinkClick(e, 'contact')}>
                Contacto
              </a>
            </li>
            <li>
              <a href="https://wa.me/5491134324040" className={styles.ctaBtn} target="_blank" rel="noopener noreferrer">
                Reservar
              </a>
            </li>
          </ul>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button 
            className={`${styles.hamburger} ${mobileOpen ? styles.open : ''}`} 
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
            aria-expanded={mobileOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Drawer Overlay */}
      <div 
        className={`${styles.drawerOverlay} ${mobileOpen ? styles.open : ''}`} 
        onClick={() => setMobileOpen(false)}
      ></div>

      {/* Mobile Drawer */}
      <div className={`${styles.drawer} ${mobileOpen ? styles.open : ''}`}>
        <ul className={styles.drawerLinks}>
          <li>
            <a href="#hero" className={styles.drawerLink} onClick={(e) => handleLinkClick(e, 'hero')}>
              Inicio
            </a>
          </li>
          <li>
            <a href="#services" className={styles.drawerLink} onClick={(e) => handleLinkClick(e, 'services')}>
              Servicios
            </a>
          </li>
          <li>
            <a href="#destinations" className={styles.drawerLink} onClick={(e) => handleLinkClick(e, 'destinations')}>
              Destinos
            </a>
          </li>
          <li>
            <a href="#fleet" className={styles.drawerLink} onClick={(e) => handleLinkClick(e, 'fleet')}>
              Flota
            </a>
          </li>
          <li>
            <a href="#whyus" className={styles.drawerLink} onClick={(e) => handleLinkClick(e, 'whyus')}>
              ¿Por qué elegirnos?
            </a>
          </li>
          <li>
            <a href="#contact" className={styles.drawerLink} onClick={(e) => handleLinkClick(e, 'contact')}>
              Contacto
            </a>
          </li>
        </ul>
        <div className={styles.drawerCta}>
          <a 
            href="https://wa.me/5491134324040" 
            className={`${styles.ctaBtn} ${styles.drawerCta}`} 
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block' }}
          >
            Reservar
          </a>
        </div>
      </div>
    </>
  );
}
