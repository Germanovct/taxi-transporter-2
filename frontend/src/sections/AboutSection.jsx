import styles from './AboutSection.module.css';
import SectionWrapper from '../components/SectionWrapper';

const highlights = [
  {
    id: 1,
    num: "22",
    title: "AÑOS DE EXPERIENCIA",
    desc: "Más de dos décadas trasladando pasajeros con profesionalismo y dedicación",
    accentClass: styles.accentBlue,
    numClass: styles.numBlue,
  },
  {
    id: 2,
    num: "100%",
    title: "VEHÍCULOS HABILITADOS GCBA",
    desc: "Toda nuestra flota autorizada por el Gobierno de la Ciudad de Buenos Aires",
    accentClass: styles.accentViolet,
    numClass: styles.numViolet,
  },
  {
    id: 3,
    num: "24/7",
    title: "PASAJEROS Y CONDUCTOR ASEGURADOS",
    desc: "Cobertura integral de seguros para que viajes con total tranquilidad",
    accentClass: styles.accentMagenta,
    numClass: styles.numMagenta,
  }
];

export default function AboutSection() {
  return (
    <SectionWrapper id="about" className={styles.section}>
      <div className={styles.bgDecor}></div>
      <div className="container">
        <div className={styles.layout}>
          {/* Left — Text content */}
          <div className={styles.textCol}>
            {/* Spanish Block */}
            <div className={styles.langBlock}>
              <div className={styles.badge}>
                ✦ SOBRE NOSOTROS ✦
              </div>

              <h2 className={styles.title}>
                <span className={styles.titleGradient}>22 AÑOS</span>
                <span className={styles.titleWhite}>TRASLADANDO</span>
                <span className={styles.titleSmall}>CON CONFIANZA</span>
              </h2>

              <p className={`${styles.paragraph} ${styles.paragraphFeatured}`}>
                Somos un equipo profesional de taxis y autos particulares con más de 22 años de experiencia en traslados dentro de la Ciudad de Buenos Aires y el Gran Buenos Aires. Nos especializamos en conexiones a todos los aeropuertos, ofreciendo un servicio puntual, seguro y confortable.
              </p>
              
              <p className={styles.paragraph}>
                Mi nombre es Marcelo, soy el titular y responsable de cada viaje. Nuestra misión es simple: generar confianza y construir una relación duradera con cada pasajero, tratándolos como parte de nuestra familia.
              </p>
              
              <p className={styles.paragraph}>
                Todos nuestros vehículos están habilitados por el Gobierno de la Ciudad de Buenos Aires, con documentación al día y seguros que cubren tanto a pasajeros como al conductor. Viajá tranquilo — estás en buenas manos.
              </p>

              {/* Marcelo Signature */}
              <div className={styles.signatureRow}>
                <div className={styles.avatar}>M</div>
                <div className={styles.signatureInfo}>
                  <div className={styles.signatureName}>Marcelo</div>
                  <div className={styles.signatureRole}>Fundador & Titular</div>
                </div>
              </div>
            </div>

            {/* Bilingual Divider */}
            <div className={styles.dividerContainer}>
              <div className={styles.dividerLine}></div>
              <span className={styles.dividerText}>🌍 ALSO AVAILABLE IN ENGLISH</span>
              <div className={styles.dividerLine}></div>
            </div>

            {/* English Block */}
            <div className={styles.langBlock}>
              <div className={styles.badge}>
                ✦ ABOUT US ✦
              </div>

              <h2 className={styles.title}>
                <span className={styles.titleGradient}>22 YEARS</span>
                <span className={styles.titleWhite}>MOVING PEOPLE</span>
                <span className={styles.titleSmall}>WITH TRUST</span>
              </h2>

              <p className={`${styles.paragraph} ${styles.paragraphFeatured}`}>
                We are a professional team of taxis and private vehicles with over 22 years of experience in transfers across Buenos Aires City and Greater Buenos Aires. We specialize in airport connections, offering a punctual, safe, and comfortable service.
              </p>
              
              <p className={styles.paragraph}>
                My name is Marcelo, and I am personally responsible for every trip. Our mission is simple: to build trust and a lasting relationship with every passenger — treating you like family.
              </p>
              
              <p className={styles.paragraph}>
                All our vehicles are licensed by the Buenos Aires City Government, fully documented and insured — covering both passengers and driver. Travel with peace of mind — you're in good hands.
              </p>

              {/* Marcelo Signature English */}
              <div className={styles.signatureRow}>
                <div className={styles.avatar}>M</div>
                <div className={styles.signatureInfo}>
                  <div className={styles.signatureName}>Marcelo</div>
                  <div className={styles.signatureRole}>Founder & Owner</div>
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
