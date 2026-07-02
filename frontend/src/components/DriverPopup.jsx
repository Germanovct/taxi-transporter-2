import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DriverPopup.module.css';

export default function DriverPopup() {
  const { t } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);
  const [etaMinutes, setEtaMinutes] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    // Don't show again in this session if already dismissed
    if (sessionStorage.getItem('driverPopupDismissed')) return;

    const timer = setTimeout(() => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const res = await fetch(`${API_URL}/location/passenger/eta`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                passenger_lat: latitude,
                passenger_lng: longitude
              })
            });

            const data = await res.json();

            if (data.available) {
              setEtaMinutes(data.eta_minutes);
              setShowPopup(true);
            }
          } catch (error) {
            console.log('ETA fetch failed:', error);
          }
        },
        (error) => {
          console.log('Ubicación no disponible:', error.message);
        }
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [API_URL]);

  // Auto-close after 15 seconds
  useEffect(() => {
    if (!showPopup) return;

    const autoClose = setTimeout(() => {
      handleClose();
    }, 15000);

    return () => clearTimeout(autoClose);
  }, [showPopup]);

  const handleClose = () => {
    setDismissed(true);
    setShowPopup(false);
    sessionStorage.setItem('driverPopupDismissed', 'true');
  };

  const handleReservar = () => {
    handleClose();
    const formEl = document.getElementById('booking-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!showPopup || dismissed) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupCard}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className={styles.closeBtn}
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Car icon with pulse */}
        <div className={styles.iconContainer}>
          <span className={styles.carIcon}>🚗</span>
        </div>

        {/* Title */}
        <p className={styles.title}>{t('driverPopup.available')}</p>

        {/* ETA */}
        <div className={styles.etaContainer}>
          <span className={styles.etaNumber}>{etaMinutes}</span>
          <span className={styles.etaUnit}>{t('driverPopup.minutes')}</span>
        </div>
        <p className={styles.etaSubtext}>{t('driverPopup.nearYou')}</p>

        {/* Online indicator */}
        <div className={styles.onlineIndicator}>
          <span className={styles.onlineDot} />
          <span className={styles.onlineText}>{t('driverPopup.online')}</span>
        </div>

        {/* CTA Button */}
        <button onClick={handleReservar} className={styles.ctaBtn}>
          {t('driverPopup.cta')}
        </button>
      </div>
    </div>
  );
}
