import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TestimonialsSection.module.css';

export default function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonialsData = [
    {
      id: 1,
      name: t('testimonials.t1Name'),
      quote: t('testimonials.t1Text'),
      initials: "CT",
      stars: 5
    },
    {
      id: 2,
      name: t('testimonials.t2Name'),
      quote: t('testimonials.t2Text'),
      initials: "MP",
      stars: 5
    },
    {
      id: 3,
      name: t('testimonials.t3Name'),
      quote: t('testimonials.t3Text'),
      initials: "EM",
      stars: 5
    },
    {
      id: 4,
      name: t('testimonials.t4Name'),
      quote: t('testimonials.t4Text'),
      initials: "LO",
      stars: 5
    },
    {
      id: 5,
      name: t('testimonials.t5Name'),
      quote: t('testimonials.t5Text'),
      initials: "ER",
      stars: 5
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoSlideInterval = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      autoSlideInterval.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
      }, 5000);
    }

    return () => {
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
      }
    };
  }, [isPaused, testimonialsData.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  const getCardClass = (index) => {
    let diff = index - activeIndex;
    const total = testimonialsData.length;
    if (diff < -Math.floor(total / 2)) diff += total;
    if (diff > Math.floor(total / 2)) diff -= total;

    if (diff === 0) return `${styles.card} ${styles.cardActive}`;
    if (diff === -1) return `${styles.card} ${styles.cardLeft}`;
    if (diff === 1) return `${styles.card} ${styles.cardRight}`;
    return `${styles.card} ${styles.cardHidden}`;
  };

  return (
    <section id="testimonials" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.badge}>{t('testimonials.badge')}</span>
          <h2 className={styles.title}>
            {t('testimonials.title1')} <br />
            <span className="text-gradient">{t('testimonials.title2')}</span>
          </h2>
          <p className={styles.subtitle}>{t('testimonials.subtitle')}</p>
        </div>

        <div 
          className={styles.carouselContainer}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={styles.carousel}>
            {testimonialsData.map((item, index) => (
              <div key={item.id} className={getCardClass(index)}>
                {/* Estrellas */}
                <div className={styles.stars}>
                  ⭐⭐⭐⭐⭐
                </div>

                {/* Testimonio */}
                <blockquote className={styles.quote}>
                  {item.quote}
                </blockquote>

                {/* Separador */}
                <div className={styles.separator} />

                {/* Fila inferior */}
                <div className={styles.bottomRow}>
                  <div className={styles.avatar}>{item.initials}</div>
                  <div className={styles.details}>
                    <span className={styles.name}>{item.name}</span>
                    <span className={styles.source}>
                      <svg className={styles.sourceIcon} viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                      </svg>
                      {t('testimonials.source')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Flechas de navegación */}
          <button 
            className={`${styles.arrow} ${styles.arrowLeft}`} 
            onClick={handlePrev}
            aria-label="Previous Testimonial"
          >
            <svg className={styles.arrowIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button 
            className={`${styles.arrow} ${styles.arrowRight}`} 
            onClick={handleNext}
            aria-label="Next Testimonial"
          >
            <svg className={styles.arrowIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>

        {/* Dots de navegación */}
        <div className={styles.dotsContainer}>
          {testimonialsData.map((_, idx) => (
            <button
              key={idx}
              className={`${styles.dotButton} ${activeIndex === idx ? styles.dotButtonActive : ''}`}
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
            >
              <span className={styles.dotInner} />
            </button>
          ))}
        </div>

        {/* CTA FINAL */}
        <div className={styles.ctaContainer}>
          <p className={styles.ctaText}>{t('testimonials.ctaText')}</p>
          <a 
            href="https://wa.me/541126281011"
            className={styles.ctaBtn}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('testimonials.cta')}
          </a>
        </div>
      </div>
    </section>
  );
}
