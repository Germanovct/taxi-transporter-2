import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ContactSection.module.css';
import SectionWrapper from '../components/SectionWrapper';

export default function ContactSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const whatsappRaw = "541126281011";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // TODO: conectar con endpoint POST /contact
    // Enviar datos del formulario al backend si es necesario en el futuro.
    
    if (import.meta.env.DEV) {
      console.log("Form submitted locally:", formData);
    }
    
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <SectionWrapper id="contact" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {/* Left Column - Contact Details */}
          <div>
            <span className={styles.badge}>{t('contact.badge')}</span>
            <h2 className={styles.title}>
              {t('contact.title1')} <br />
              <span className="text-gradient">{t('contact.title2')}</span>
            </h2>
            <p className={styles.subtitle}>{t('contact.subtitle')}</p>

            <h3 className={styles.infoTitle}>{t('contact.infoTitle')}</h3>
            
            <ul className={styles.infoList}>
              <li className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <svg className={styles.infoIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.488 1.459 5.416 1.46 5.58-.003 10.122-4.55 10.124-10.13.001-2.701-1.051-5.242-2.962-7.155C17.314 1.417 14.773.365 12.01.365 6.425.365 1.88 4.912 1.877 10.495c-.001 1.93.502 3.81 1.46 5.41l-.963 3.515 3.606-.948zm12.306-6.851c-.33-.165-1.951-.963-2.251-1.072-.3-.109-.518-.165-.736.165-.218.33-.845 1.072-1.036 1.29-.19.218-.381.243-.71.079-.33-.165-1.395-.515-2.656-1.64-1.026-.915-1.66-2.046-1.862-2.392-.202-.345-.022-.531.143-.695.148-.147.33-.385.495-.578.165-.192.22-.33.33-.55.11-.218.055-.41-.027-.577-.082-.166-.736-1.773-1.009-2.43-.266-.64-.536-.554-.736-.564-.19-.01-.41-.01-.628-.01-.218 0-.573.082-.873.41-.3.33-1.146 1.12-1.146 2.73s1.173 3.167 1.336 3.393c.164.225 2.308 3.52 5.59 4.943.78.338 1.39.54 1.862.69.784.249 1.497.214 2.061.129.629-.094 1.952-.797 2.224-1.528.272-.73.272-1.357.19-1.488-.081-.132-.3-.218-.63-.383z"/>
                  </svg>
                </div>
                <div className={styles.infoText}>
                  <div className={styles.itemLabel}>{t('contact.whatsapp')}</div>
                  <a href={`https://wa.me/${whatsappRaw}`} target="_blank" rel="noopener noreferrer" className={styles.itemValue}>+54 11 2628-1011</a>
                </div>
              </li>
 
              <li className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <svg className={styles.infoIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div className={styles.infoText}>
                  <div className={styles.itemLabel}>{t('contact.email')}</div>
                  <a href="mailto:taxieltransporter2@gmail.com" className={styles.itemValue}>taxieltransporter2@gmail.com</a>
                </div>
              </li>
 
              <li className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <svg className={styles.infoIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm3.3 15.3L11 13V7h1.5v5.2l3.7 2.2-.7 1.1z"/>
                  </svg>
                </div>
                <div className={styles.infoText}>
                  <div className={styles.itemLabel}>{t('contact.hours')}</div>
                  <div className={styles.itemValue}>{t('contact.hoursValue')}</div>
                </div>
              </li>
            </ul>

            <div className={styles.socials}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8c0 2 1.6 3.6 3.6 3.6h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.6 18.4 4 16.4 4H7.6m4.4 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9m0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m4.7-.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column - Message Form */}
          <div className={styles.formCard}>
            {submitted ? (
              <div className={styles.successMessage}>
                <svg className={styles.successIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h3 className={styles.successTitle}>{t('contact.thanks')}</h3>
                <p className={styles.successDesc}>{t('contact.formSuccess')}</p>
                <button 
                  className={styles.submitBtn} 
                  style={{ marginTop: '1.5rem', width: 'auto', padding: '0.6rem 1.5rem' }} 
                  onClick={() => setSubmitted(false)}
                >
                  {t('contact.sendAnother')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>{t('contact.formName')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={styles.input}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>{t('contact.formEmail')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={styles.input}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>{t('contact.formPhone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={styles.input}
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>{t('contact.formMessage')}</label>
                  <textarea
                    id="message"
                    name="message"
                    className={styles.textarea}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  {t('contact.formSubmit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
