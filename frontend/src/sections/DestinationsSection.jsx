import styles from './DestinationsSection.module.css';
import SectionWrapper from '../components/SectionWrapper';

const destinationsData = [
  {
    id: 1,
    title: "Estadio Monumental - River Plate",
    desc: "El más grande de Argentina",
    bgImage: "/images/monumental.jpg",
    isLarge: true,
    gridClass: styles.itemMonumental,
  },
  {
    id: 2,
    title: "La Bombonera - Boca Juniors",
    desc: "El estadio más pasional del mundo",
    bgImage: "/images/bombonera.jpg",
    isLarge: false,
    gridClass: styles.itemBombonera,
  },
  {
    id: 3,
    title: "Tecnópolis",
    desc: "El parque tecnológico más grande de Latinoamérica",
    bgImage: "/images/tecnopolis.jpg",
    isLarge: false,
    gridClass: styles.itemTecnopolis,
  },
  {
    id: 4,
    title: "Recitales y Shows",
    desc: "Luna Park, Movistar Arena, Vélez y más",
    bgImage: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    isLarge: false,
    gridClass: styles.itemRecitales,
  },
  {
    id: 5,
    title: "Caminito - La Boca",
    desc: "El barrio más colorido de Buenos Aires",
    bgImage: "/images/caminito.jpg",
    isLarge: false,
    gridClass: styles.itemCaminito,
  },
  {
    id: 6,
    title: "Puerto Madero",
    desc: "El moderno corazón porteño",
    bgImage: "/images/puerto-madero.jpg",
    isLarge: true,
    gridClass: styles.itemPuertoMadero,
  },
];

export default function DestinationsSection() {
  return (
    <SectionWrapper id="destinations" className={styles.section}>
      <div className="container">
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>Te llevamos a todos lados</h2>
          <p className={styles.subtitle}>
            Estadios, eventos, turismo y más — donde vayas, llegás con Transporter
          </p>
        </div>

        <div className={styles.grid}>
          {destinationsData.map((dest) => {
            if (dest.id === 6) {
              return (
                <div
                  key={dest.id}
                  className={`${styles.card} ${dest.gridClass} ${styles.destinationCard}`}
                  style={{ padding: 0, overflow: 'hidden' }}
                >
                  <img 
                    src={dest.bgImage}
                    alt={dest.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      background: '#06060e'
                    }}
                  />
                  <div className={styles.destinationOverlay}>
                    <h3>{dest.title.toUpperCase()}</h3>
                    <p>{dest.desc}</p>
                  </div>
                </div>
              );
            }
            return (
              <div
                key={dest.id}
                className={`${styles.card} ${dest.gridClass}`}
                style={{ backgroundImage: `url(${dest.bgImage})` }}
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{dest.title}</h3>
                  <p className={styles.cardDesc}>{dest.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.ctaWrapper}>
          <p className={styles.ctaText}>¿Vas a un evento? Reservá tu traslado</p>
          <a
            href="https://wa.me/541126281011"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            Reservar en WhatsApp
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
