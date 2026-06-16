import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StatsSection.module.css';
import SectionWrapper from '../components/SectionWrapper';

function Counter({ target, duration = 2000, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let start = 0;
    const end = typeof target === 'number' ? target : parseInt(target, 10);
    if (isNaN(end)) {
      setCount(target);
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic curve
      const easeProgress = progress * (2 - progress);
      
      const currentCount = Math.floor(easeProgress * end);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [started, target, duration]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

export default function StatsSection() {
  const { t } = useTranslation();

  return (
    <SectionWrapper id="stats" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.statCard}>
            <div className={styles.number}>
              <Counter target={10} prefix="+" />
            </div>
            <div className={styles.label}>{t('stats.years')}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.number}>
              <Counter target={5000} prefix="+" />
            </div>
            <div className={styles.label}>{t('stats.trips')}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.number}>
              <Counter target={24} suffix="/7" />
            </div>
            <div className={styles.label}>{t('stats.availability')}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.number}>
              <Counter target={100} suffix="%" />
            </div>
            <div className={styles.label}>{t('stats.punctuality')}</div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
