import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DestinationsSection.module.css';
import SectionWrapper from '../components/SectionWrapper';

export default function DestinationsSection() {
  const { t } = useTranslation();
  const [activeCard, setActiveCard] = useState(null);

  const destinationsData = [
    {
      id: 1,
      title: t('destinations.d1Title'),
      desc: t('destinations.d1Desc'),
      bgImage: "/images/monumental.jpg",
      isLarge: true,
      gridClass: styles.itemMonumental,
    },
    {
      id: 2,
      title: t('destinations.d2Title'),
      desc: t('destinations.d2Desc'),
      bgImage: "/images/bombonera.jpg",
      isLarge: false,
      gridClass: styles.itemBombonera,
    },
    {
      id: 3,
      title: t('destinations.d3Title'),
      desc: t('destinations.d3Desc'),
      bgImage: "/images/tecnopolis.jpg",
      isLarge: false,
      gridClass: styles.itemTecnopolis,
    },
    {
      id: 4,
      title: t('destinations.d4Title'),
      desc: t('destinations.d4Desc'),
      bgImage: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
      isLarge: false,
      gridClass: styles.itemRecitales,
    },
    {
      id: 5,
      title: t('destinations.d5Title'),
      desc: t('destinations.d5Desc'),
      bgImage: "/images/caminito.jpg",
      isLarge: false,
      gridClass: styles.itemCaminito,
    },
    {
      id: 6,
      title: t('destinations.d6Title'),
      desc: t('destinations.d6Desc'),
      bgImage: "/images/puerto-madero.jpg",
      isLarge: true,
      gridClass: styles.itemPuertoMadero,
    },
  ];

  return (
    <SectionWrapper id="destinations" className={styles.section}>
      <div className="container">
        <div className={styles.titleGroup}>
          <span className={styles.badge}>{t('destinations.badge')}</span>
          <h2 className={styles.title}>
            {t('destinations.title1')} <br />
            <span className="text-gradient">{t('destinations.title2')}</span>
          </h2>
          <p className={styles.subtitle}>
            {t('destinations.subtitle')}
          </p>
        </div>

        <div className={styles.grid}>
          {destinationsData.map((dest) => {
            if (dest.id === 6) {
              return (
                <div
                  key={dest.id}
                  className={`${styles.card} ${dest.gridClass} ${styles.destinationCard} ${activeCard === dest.id ? styles.cardActive : ''}`}
                  style={{ padding: 0, overflow: 'hidden' }}
                  onClick={() => setActiveCard(activeCard === dest.id ? null : dest.id)}
                >
                  <img 
                    src={dest.bgImage}
                    alt={dest.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      background: '#06060e'
                    }}
                  />
                  <div className={styles.destinationOverlay}>
                    <h3>{dest.title.toUpperCase()}</h3>
                    <p>{dest.desc}</p>
                  </div>
                </div>
              );
            }
            return (
              <div
                key={dest.id}
                className={`${styles.card} ${dest.gridClass} ${activeCard === dest.id ? styles.cardActive : ''}`}
                style={{ backgroundImage: `url(${dest.bgImage})` }}
                onClick={() => setActiveCard(activeCard === dest.id ? null : dest.id)}
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{dest.title}</h3>
                  <p className={styles.cardDesc}>{dest.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.ctaWrapper}>
          <p className={styles.ctaText}>{t('destinations.cta')}</p>
          <a
            href="https://wa.me/541126281011"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            {t('testimonials.cta')}
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}

