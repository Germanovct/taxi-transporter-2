import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();

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
                {t('nav.inicio')}
              </a>
            </li>
            <li>
              <a href="#services-destinations" className={styles.navLink} onClick={(e) => handleLinkClick(e, 'services-destinations')}>
                {t('nav.serviciosDestinos')}
              </a>
            </li>
            <li>
              <a href="#fleet" className={styles.navLink} onClick={(e) => handleLinkClick(e, 'fleet')}>
                {t('nav.flota')}
              </a>
            </li>
            <li>
              <a href="#whyus" className={styles.navLink} onClick={(e) => handleLinkClick(e, 'whyus')}>
                {t('nav.porQueElegirnos')}
              </a>
            </li>
            <li>
              <a href="#contact" className={styles.navLink} onClick={(e) => handleLinkClick(e, 'contact')}>
                {t('nav.contacto')}
              </a>
            </li>
            <li className={styles.langSelectorWrapper}>
              <select 
                className={styles.langSelector} 
                value={i18n.language || 'es'} 
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                aria-label="Change language"
              >
                <option value="es">🇦🇷 ES</option>
                <option value="en">🇺🇸 EN</option>
                <option value="pt">🇧🇷 PT</option>
                <option value="fr">🇫🇷 FR</option>
                <option value="it">🇮🇹 IT</option>
              </select>
            </li>
            <li>
              <a href="https://wa.me/541126281011" className={styles.ctaBtn} target="_blank" rel="noopener noreferrer">
                {t('nav.reservar')}
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
              {t('nav.inicio')}
            </a>
          </li>
          <li>
            <a href="#services-destinations" className={styles.drawerLink} onClick={(e) => handleLinkClick(e, 'services-destinations')}>
              {t('nav.serviciosDestinos')}
            </a>
          </li>
          <li>
            <a href="#fleet" className={styles.drawerLink} onClick={(e) => handleLinkClick(e, 'fleet')}>
              {t('nav.flota')}
            </a>
          </li>
          <li>
            <a href="#whyus" className={styles.drawerLink} onClick={(e) => handleLinkClick(e, 'whyus')}>
              {t('nav.porQueElegirnos')}
            </a>
          </li>
          <li>
            <a href="#contact" className={styles.drawerLink} onClick={(e) => handleLinkClick(e, 'contact')}>
              {t('nav.contacto')}
            </a>
          </li>
          <li className={styles.drawerLangWrapper}>
            <select 
              className={styles.langSelector} 
              value={i18n.language || 'es'} 
              onChange={(e) => {
                i18n.changeLanguage(e.target.value);
                setMobileOpen(false);
              }}
              aria-label="Change language"
            >
              <option value="es">🇦🇷 ES</option>
              <option value="en">🇺🇸 EN</option>
              <option value="pt">🇧🇷 PT</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="it">🇮🇹 IT</option>
            </select>
          </li>
        </ul>
        <div className={styles.drawerCta}>
          <a 
            href="https://wa.me/541126281011" 
            className={`${styles.ctaBtn} ${styles.drawerCta}`} 
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block' }}
          >
            {t('nav.reservar')}
          </a>
        </div>
      </div>
    </>
  );
}
