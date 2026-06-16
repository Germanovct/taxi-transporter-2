import { useTranslation } from 'react-i18next';
import styles from './ServicesSection.module.css';
import SectionWrapper from '../components/SectionWrapper';

export default function ServicesSection() {
  const { t } = useTranslation();

  const servicesData = [
    {
      id: 1,
      title: t('services.s1Title'),
      desc: t('services.s1Desc'),
      bgImage: "/images/ezeiza.jpg",
      icon: (
        <svg className={styles.icon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5l8 2.5z"/>
        </svg>
      )
    },
    {
      id: 2,
      title: t('services.s2Title'),
      desc: t('services.s2Desc'),
      bgImage: "/images/newbery.jpg",
      icon: (
        <svg className={styles.icon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 19h19v2h-19zm16.84-7.63l-8.49-8.49c-.39-.39-1.02-.39-1.41 0L8.02 4.3c-.39.39-.39 1.02 0 1.41l2.12 2.12-4.24 4.24-2.12-2.12c-.39-.39-1.02-.39-1.41 0l-1.42 1.42c-.39.39-.39 1.02 0 1.41l8.49 8.49c.39.39 1.02.39 1.41 0l1.42-1.42c.39-.39.39-1.02 0-1.41l-2.12-2.12 4.24-4.24 2.12 2.12c.39.39 1.02.39 1.41 0l1.42-1.42c.39-.38.39-1.02 0-1.41z"/>
        </svg>
      )
    },
    {
      id: 3,
      title: t('services.s3Title'),
      desc: t('services.s3Desc'),
      bgImage: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80",
      icon: (
        <svg className={styles.icon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM6 6h12v5H6V6z"/>
        </svg>
      )
    },
    {
      id: 4,
      title: t('services.s4Title'),
      desc: t('services.s4Desc'),
      bgImage: "/images/buquebus.jpg",
      icon: (
        <svg className={styles.icon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.91 0 3.71-.53 5.25-1.5 1.54.97 3.34 1.5 5.25 1.5s3.71-.53 5.25-1.5c1.54.97 3.34 1.5 5.25 1.5h2v-2h-2zm-12-8h8v2h-8zm11.43-3h-1.4l-2.07-5H8.04L5.97 10H4.57L3 13.5v1.5h18v-1.5L19.43 10z"/>
        </svg>
      )
    },
    {
      id: 5,
      title: t('services.s5Title'),
      desc: t('services.s5Desc'),
      bgImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
      icon: (
        <svg className={styles.icon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42.99L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.27-3.82c.14-.4.51-.68.94-.68h9.58c.43 0 .8.28.94.68L19 11H5z"/>
        </svg>
      )
    },
    {
      id: 6,
      title: t('services.s6Title'),
      desc: t('services.s6Desc'),
      bgImage: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80",
      icon: (
        <svg className={styles.icon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      )
    }
  ];

  return (
    <SectionWrapper id="services" className={styles.section}>
      <div className="container">
        <div className={styles.titleGroup}>
          <span className={styles.badge}>{t('services.badge')}</span>
          <h2 className={styles.title}>
            {t('services.title1')} <br />
            <span className="text-gradient">{t('services.title2')}</span>
          </h2>
        </div>

        <div className={styles.grid}>
          {servicesData.map((service) => (
            <div
              key={service.id}
              className={styles.card}
              style={{ backgroundImage: `url('${service.bgImage}')` }}
            >
              <div className={styles.cardContent}>
                <div className={styles.iconWrapper}>
                  {service.icon}
                </div>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDesc}>{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
