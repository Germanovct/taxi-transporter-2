import styles from './HeroSection.module.css';

export default function HeroSection() {
  const whatsappUrl = "https://wa.me/541126281011";

  return (
    <section id="hero" className={styles.hero}>
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.35) saturate(1.2)',
          zIndex: 0
        }}
      >
        <source src="/videos/buenos-aires-hero.mp4" type="video/mp4" />
      </video>

      {/* Speed lines */}
      <div className={styles.speedLines}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>

      <div className={styles.content}>
        {/* Badge */}
        <div className={styles.badge}>
          ✦ SERVICIO PREMIUM DE TRASLADOS ✦
        </div>

        {/* Headline */}
        <h1 className={styles.headline}>
          <span className={styles.lineWhite}>RÁPIDO.</span>
          <span className={styles.lineGradient}>SEGURO.</span>
          <span className={styles.lineWhite}>IMPARABLE.</span>
        </h1>

        {/* Subtitle */}
        <h2 className={styles.subtitle}>
          Buenos Aires · Aeropuertos · Larga Distancia · City Tours
        </h2>

        {/* Quick Features */}
        <div className={styles.features}>
          <span className={styles.featureItem}>⏱ Puntualidad garantizada</span>
          <span className={styles.divider}>|</span>
          <span className={styles.featureItem}>🛡 Viaje seguro</span>
          <span className={styles.divider}>|</span>
          <span className={styles.featureItem}>💳 Todos los medios de pago</span>
        </div>

        {/* CTAs */}
        <div className={styles.ctaGroup}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryCta}
          >
            RESERVAR POR WHATSAPP
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <span className={styles.scrollText}>SCROLL</span>
        <div className={styles.scrollLine}></div>
      </div>
    </section>
  );
}
