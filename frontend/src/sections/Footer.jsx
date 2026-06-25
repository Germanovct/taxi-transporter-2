import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useTranslation();

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
            {t('footer.tagline')}
          </p>
        </div>

        <div className={styles.grid}>
          {/* Col 1 - Navigation */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t('footer.navigation')}</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="#hero" className={styles.link} onClick={(e) => handleLinkClick(e, 'hero')}>
                  {t('nav.inicio')}
                </a>
              </li>
              <li>
                <a href="#services-destinations" className={styles.link} onClick={(e) => handleLinkClick(e, 'services-destinations')}>
                  {t('nav.serviciosDestinos')}
                </a>
              </li>
              <li>
                <a href="#fleet" className={styles.link} onClick={(e) => handleLinkClick(e, 'fleet')}>
                  {t('nav.flota')}
                </a>
              </li>
              <li>
                <a href="#whyus" className={styles.link} onClick={(e) => handleLinkClick(e, 'whyus')}>
                  {t('nav.porQueElegirnos')}
                </a>
              </li>
              <li>
                <a href="#contact" className={styles.link} onClick={(e) => handleLinkClick(e, 'contact')}>
                  {t('nav.contacto')}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2 - Contact Info */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t('footer.contact')}</h4>
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
            <h4 className={styles.colTitle}>{t('footer.socials')}</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            {t('footer.rights')}
          </div>
          <div className={styles.copyright}>
            {t('footer.developedBy')}{" "}
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
