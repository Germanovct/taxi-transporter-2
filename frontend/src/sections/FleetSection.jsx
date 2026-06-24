import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FleetSection.module.css';
import SectionWrapper from '../components/SectionWrapper';

export default function FleetSection() {
  const [mediaItems, setMediaItems] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t } = useTranslation();

  const whatsappUrl = "https://wa.me/5491134324040";
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/media?active=true`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMediaItems(data);
        setError(false);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("Error fetching media from fleet API:", err);
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [apiUrl]);

  // Separate photos and videos
  const photos = mediaItems.filter(item => item.type === 'photo');
  const videos = mediaItems.filter(item => item.type === 'video');
  const featuredVideo = videos.length > 0 ? videos[0] : null;

  return (
    <SectionWrapper id="fleet" className={styles.section}>
      <div className="container">
        <div className={styles.titleGroup}>
          <span className={styles.badge}>{t('fleet.badge')}</span>
          <h2 className={styles.title}>
            {t('fleet.title1')} <span className="text-gradient">{t('fleet.title2')}</span>
          </h2>
          <p className={styles.subtitle}>
            {t('fleet.subtitle')}
          </p>
        </div>

        {/* Featured Video Highlight */}
        {featuredVideo && (
          <div className={styles.videoContainer}>
            <video
              className={styles.videoElement}
              src={featuredVideo.url}
              controls
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        )}

        {/* Gallery */}
        <div className={styles.galleryGrid}>
          {loading ? (
            // Show loading skeletons while fetching data
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className={styles.skeleton}></div>
            ))
          ) : error || photos.length === 0 ? (
            // Show premium placeholder cards if API fails or is empty
            [
              {
                model: t('fleet.car1Title'),
                desc: t('fleet.car1Desc'),
                image: "/images/toyota-corolla.jpg",
                badge: t('fleet.badge_gcba')
              },
              {
                model: t('fleet.car2Title'),
                desc: t('fleet.car2Desc'),
                image: "/images/renault-kangoo.jpg",
                badge: t('fleet.badge_gcba')
              },
              {
                model: t('fleet.car3Title'),
                desc: t('fleet.car3Desc'),
                image: "/images/chevrolet-spin.jpg",
                badge: t('fleet.badge_gcba')
              }
            ].map((vehicle, idx) => (
              <div
                key={idx}
                className={`${styles.fleetCard} ${activeCard === idx ? styles.cardActive : ''}`}
                style={{ backgroundImage: `url(${vehicle.image})` }}
                onClick={() => setActiveCard(activeCard === idx ? null : idx)}
              >
                <div className={styles.fleetCardContent}>
                  <span className={styles.fleetBadge}>{vehicle.badge}</span>
                  <h3 className={styles.fleetModel}>{vehicle.model}</h3>
                  <p className={styles.fleetDesc}>{vehicle.desc}</p>
                </div>
              </div>
            ))
          ) : (
            // Show photos from API
            photos.map((photo) => (
              <div
                key={photo.id}
                className={`${styles.photoCard} ${activeCard === `photo-${photo.id}` ? styles.cardActive : ''}`}
                onClick={() => setActiveCard(activeCard === `photo-${photo.id}` ? null : `photo-${photo.id}`)}
              >
                <img src={photo.url} alt={photo.description || photo.original_name} loading="lazy" />
                <div className={styles.photoOverlay}>
                  <div className={styles.photoTitle}>{photo.description || "Taxi El Transporter 2"}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.ctaWrapper}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            <svg style={{ width: '24px', height: '24px', fill: 'currentColor' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.488 1.459 5.416 1.46 5.58-.003 10.122-4.55 10.124-10.13.001-2.701-1.051-5.242-2.962-7.155C17.314 1.417 14.773.365 12.01.365 6.425.365 1.88 4.912 1.877 10.495c-.001 1.93.502 3.81 1.46 5.41l-.963 3.515 3.606-.948zm12.306-6.851c-.33-.165-1.951-.963-2.251-1.072-.3-.109-.518-.165-.736.165-.218.33-.845 1.072-1.036 1.29-.19.218-.381.243-.71.079-.33-.165-1.395-.515-2.656-1.64-1.026-.915-1.66-2.046-1.862-2.392-.202-.345-.022-.531.143-.695.148-.147.33-.385.495-.578.165-.192.22-.33.33-.55.11-.218.055-.41-.027-.577-.082-.166-.736-1.773-1.009-2.43-.266-.64-.536-.554-.736-.564-.19-.01-.41-.01-.628-.01-.218 0-.573.082-.873.41-.3.33-1.146 1.12-1.146 2.73s1.173 3.167 1.336 3.393c.164.225 2.308 3.52 5.59 4.943.78.338 1.39.54 1.862.69.784.249 1.497.214 2.061.129.629-.094 1.952-.797 2.224-1.528.272-.73.272-1.357.19-1.488-.081-.132-.3-.218-.63-.383z"/>
            </svg>
            {t('fleet.cta')}
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
