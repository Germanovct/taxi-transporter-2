import { useTranslation } from 'react-i18next';
import styles from './AboutSection.module.css';
import SectionWrapper from '../components/SectionWrapper';

export default function AboutSection() {
  const { t } = useTranslation();

  const highlights = [
    {
      id: 1,
      num: t('about.card1Number'),
      title: t('about.card1Title'),
      desc: t('about.card1Desc'),
      accentClass: styles.accentBlue,
      numClass: styles.numBlue,
    },
    {
      id: 2,
      num: t('about.card2Number'),
      title: t('about.card2Title'),
      desc: t('about.card2Desc'),
      accentClass: styles.accentViolet,
      numClass: styles.numViolet,
    },
    {
      id: 3,
      num: t('about.card3Number'),
      title: t('about.card3Title'),
      desc: t('about.card3Desc'),
      accentClass: styles.accentMagenta,
      numClass: styles.numMagenta,
    }
  ];

  return (
    <SectionWrapper id="about" className={styles.section}>
      <div className={styles.bgDecor}></div>
      <div className="container">
        <div className={styles.layout}>
          {/* Left — Text content */}
          <div className={styles.textCol}>
            <div className={styles.langBlock}>
              <div className={styles.badge}>
                {t('about.badge')}
              </div>

              <h2 className={styles.title}>
                <span className={styles.titleGradient}>{t('about.title1')}</span>
                <span className={styles.titleWhite}>{t('about.title2')}</span>
                <span className={styles.titleSmall}>{t('about.title3')}</span>
              </h2>

              <p className={`${styles.paragraph} ${styles.paragraphFeatured}`}>
                {t('about.p1')}
              </p>
              
              <p className={styles.paragraph}>
                {t('about.p2')}
              </p>
              
              <p className={styles.paragraph}>
                {t('about.p3')}
              </p>

              {/* Marcelo Signature */}
              <div className={styles.signatureRow}>
                <div className={styles.avatar}>M</div>
                <div className={styles.signatureInfo}>
                  <div className={styles.signatureName}>Marcelo</div>
                  <div className={styles.signatureRole}>{t('about.founderTitle')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Highlight cards */}
          <div className={styles.highlightsCol}>
            <div className={styles.stickyContainer}>
              {highlights.map((item) => (
                <div key={item.id} className={styles.highlightCard}>
                  <div className={`${styles.accentLine} ${item.accentClass}`}></div>
                  <div className={`${styles.cardNumber} ${item.numClass}`}>{item.num}</div>
                  <h4 className={styles.highlightTitle}>{item.title}</h4>
                  <p className={styles.highlightDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
