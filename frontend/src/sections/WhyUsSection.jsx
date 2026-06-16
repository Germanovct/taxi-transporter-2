import { useTranslation } from 'react-i18next';
import styles from './WhyUsSection.module.css';
import SectionWrapper from '../components/SectionWrapper';

export default function WhyUsSection() {
  const whatsappUrl = "https://wa.me/541126281011";
  const { t } = useTranslation();

  const featuresData = [
    {
      id: 1,
      number: "01",
      title: t('whyUs.f1Title'),
      desc: t('whyUs.f1Desc'),
      themeClass: styles.themeBlue,
      icon: (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      id: 2,
      number: "02",
      title: t('whyUs.f2Title'),
      desc: t('whyUs.f2Desc'),
      themeClass: styles.themeViolet,
      icon: (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      )
    },
    {
      id: 3,
      number: "03",
      title: t('whyUs.f3Title'),
      desc: t('whyUs.f3Desc'),
      themeClass: styles.themePink,
      icon: (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    },
    {
      id: 4,
      number: "04",
      title: t('whyUs.f4Title'),
      desc: t('whyUs.f4Desc'),
      themeClass: styles.themeBlue,
      icon: (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 11 11 13 15 9" />
        </svg>
      )
    },
    {
      id: 5,
      number: "05",
      title: t('whyUs.f5Title'),
      desc: t('whyUs.f5Desc'),
      themeClass: styles.themeViolet,
      icon: (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="11" width="14" height="6" rx="2" />
          <path d="M17 11l-1.5-6h-7L7 11M9 17v2m6-2v2" />
        </svg>
      )
    },
    {
      id: 6,
      number: "06",
      title: t('whyUs.f6Title'),
      desc: t('whyUs.f6Desc'),
      themeClass: styles.themePink,
      icon: (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <polygon points="19 11 20 13 22 13 20.5 14.5 21 16.5 19 15.5 17 16.5 17.5 14.5 16 13 18 13" />
        </svg>
      )
    }
  ];

  return (
    <SectionWrapper id="whyus" className={styles.section}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>{t('whyUs.badge')}</div>
          <h2 className={styles.title}>
            <span className={styles.titleWhite}>{t('whyUs.title1')}</span>
            <span className={styles.titleGradient}>{t('whyUs.title2')}</span>
          </h2>
          <p className={styles.subtitle}>
            {t('whyUs.subtitle')}
          </p>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {featuresData.map((feat) => (
            <div key={feat.id} className={`${styles.card} ${feat.themeClass}`}>
              <div className={styles.numberDeco}>{feat.number}</div>
              <div className={styles.iconWrapper}>{feat.icon}</div>
              <h3 className={styles.cardTitle}>{feat.title}</h3>
              <p className={styles.cardDesc}>{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.ctaWrapper}>
          <p className={styles.ctaText}>{t('whyUs.ctaText')}</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            {t('whyUs.cta')}
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
