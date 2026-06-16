import styles from './Footer.module.css';

export default function Footer() {
  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
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
    <footer className={styles.footer}>
      <div className="container">
        {/* Logo row */}
        <div className={styles.logoRow}>
          <div className={styles.logo}>TAXI EL TRANSPORTER 2</div>
          <p className={styles.desc}>
            Servicio de traslados ejecutivos y de pasajeros premium en Buenos Aires. Comprometidos con tu seguridad, puntualidad y comodidad las 24 horas.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Col 1 - Navigation */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Navegación</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="#hero" className={styles.link} onClick={(e) => handleLinkClick(e, 'hero')}>
                  Inicio
                </a>
              </li>
              <li>
                <a href="#services" className={styles.link} onClick={(e) => handleLinkClick(e, 'services')}>
                  Servicios
                </a>
              </li>
              <li>
                <a href="#fleet" className={styles.link} onClick={(e) => handleLinkClick(e, 'fleet')}>
                  Flota
                </a>
              </li>
              <li>
                <a href="#whyus" className={styles.link} onClick={(e) => handleLinkClick(e, 'whyus')}>
                  ¿Por qué elegirnos?
                </a>
              </li>
              <li>
                <a href="#contact" className={styles.link} onClick={(e) => handleLinkClick(e, 'contact')}>
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2 - Contact Info */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Contacto</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="https://wa.me/541126281011" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  WhatsApp: +54 11 2628-1011
                </a>
              </li>
              <li>
                <a href="mailto:taxieltransporter2@gmail.com" className={styles.link}>
                  taxieltransporter2@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 - Social Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Redes Sociales</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            &copy; 2025 Taxi El Transporter 2. Todos los derechos reservados.
          </div>
          <div className={styles.copyright}>
            Desarrollado por{" "}
            <a 
              href="https://dtsanddog-studio.com.ar" 
              className={styles.studioLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              DTS&amp;Dog Studio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
