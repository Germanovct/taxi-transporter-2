import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './ResultPages.module.css';

export default function ReservaConfirmada() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.iconSuccess}`}>
          ✅
        </div>
        <h1 className={`${styles.title} ${styles.titleSuccess}`}>
          {t('booking.confirmedTitle')}
        </h1>
        <p className={styles.description}>
          {t('booking.confirmedDesc')}
        </p>
        <p className={styles.subtext}>
          {t('booking.confirmedContact')}
        </p>

        <div className={styles.actions}>
          <a
            href="https://wa.me/541126281011"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnWhatsApp}
          >
            💬 {t('booking.btnWhatsapp')}
          </a>
          <Link to="/" className={styles.btnPrimary}>
            {t('booking.btnHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
