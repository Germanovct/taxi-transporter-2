import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './ResultPages.module.css';

export default function ReservaError() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.iconError}`}>
          ❌
        </div>
        <h1 className={`${styles.title} ${styles.titleError}`}>
          {t('booking.errorTitle')}
        </h1>
        <p className={styles.description}>
          {t('booking.errorDesc')}
        </p>
        <p className={styles.subtext}>
          {t('booking.errorRetry')}
        </p>

        <div className={styles.actions}>
          <Link to="/#services-destinations" className={styles.btnPrimary}>
            {t('booking.btnRetry')}
          </Link>
          <a
            href="https://wa.me/541126281011"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnWhatsApp}
          >
            💬 {t('booking.btnWhatsapp')}
          </a>
          <Link to="/" className={styles.btnOutline}>
            {t('booking.btnHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
