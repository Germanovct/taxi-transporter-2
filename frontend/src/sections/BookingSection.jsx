import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BookingSection.module.css';

export default function BookingSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    origin: '',
    destination: '',
    date: '',
    time: '',
    passengers: '1',
    luggage: 'None',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const serviceOptions = [
    { value: 'Ezeiza', labelKey: 'booking.serviceEzeiza' },
    { value: 'Aeroparque', labelKey: 'booking.serviceAeroparque' },
    { value: 'Terminal', labelKey: 'booking.serviceTerminal' },
    { value: 'Fluvio', labelKey: 'booking.serviceFluvio' },
    { value: 'Distance', labelKey: 'booking.serviceDistance' },
    { value: 'City', labelKey: 'booking.serviceCity' },
    { value: 'Stadium', labelKey: 'booking.serviceStadium' },
    { value: 'Gastro', labelKey: 'booking.serviceGastro' },
    { value: 'Costa', labelKey: 'booking.serviceCosta' },
    { value: 'Tourism', labelKey: 'booking.serviceTourism' },
    { value: 'Other', labelKey: 'booking.serviceOther' }
  ];

  const luggageOptions = [
    { value: 'None', labelKey: 'booking.luggageNone' },
    { value: 'Medium', labelKey: 'booking.luggageMedium' },
    { value: 'Large', labelKey: 'booking.luggageLarge' },
    { value: 'Special', labelKey: 'booking.luggageSpecial' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const requiredFields = ['name', 'phone', 'service', 'origin', 'destination', 'date', 'time'];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = t('booking.required');
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to the first error element
      const firstErrorKey = Object.keys(newErrors)[0];
      const errorEl = document.getElementsByName(firstErrorKey)[0];
      if (errorEl) {
        errorEl.focus();
      }
      return;
    }

    // Get translated service and luggage labels
    const selectedServiceObj = serviceOptions.find((opt) => opt.value === formData.service);
    const serviceLabel = selectedServiceObj ? t(selectedServiceObj.labelKey) : formData.service;

    const selectedLuggageObj = luggageOptions.find((opt) => opt.value === formData.luggage);
    const luggageLabel = selectedLuggageObj ? t(selectedLuggageObj.labelKey) : formData.luggage;

    // Generate WhatsApp message
    const message = `🚗 *NUEVA RESERVA — TAXI EL TRANSPORTER 2*

👤 *Nombre:* ${formData.name}
📞 *Teléfono:* ${formData.phone}
📧 *Email:* ${formData.email || '-'}

🚘 *Servicio:* ${serviceLabel}
📍 *Origen:* ${formData.origin}
🎯 *Destino:* ${formData.destination}
📅 *Fecha:* ${formData.date}
⏰ *Hora:* ${formData.time}
👥 *Pasajeros:* ${formData.passengers}
🧳 *Equipaje:* ${luggageLabel}
${formData.notes.trim() ? `📝 *Notas:* ${formData.notes.trim()}` : ''}

_Enviado desde taxieltransporter2.com_`;

    const whatsappUrl = `https://wa.me/541126281011?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    setSuccess(true);

    // Reset Form
    setFormData({
      name: '',
      phone: '',
      email: '',
      service: '',
      origin: '',
      destination: '',
      date: '',
      time: '',
      passengers: '1',
      luggage: 'None',
      notes: ''
    });

    setErrors({});

    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  return (
    <section id="booking" className={styles.section}>
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <span className={styles.badge}>{t('booking.badge')}</span>
          <h2 className={styles.title}>
            {t('booking.title1')}{' '}
            <span className={styles.gradientText}>{t('booking.title2')}</span>
          </h2>
          <p className={styles.subtitle}>{t('booking.subtitle')}</p>
        </div>

        {/* Success Banner */}
        {success && (
          <div className={styles.successBanner}>
            <span className={styles.successIcon}>✅</span>
            <p>{t('booking.success')}</p>
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.formGrid}>
            {/* Full Name */}
            <div className={`${styles.formGroup} ${styles.colSpan2}`}>
              <label htmlFor="name" className={styles.label}>
                {t('booking.labelName')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('booking.placeholderName')}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            {/* Phone */}
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                {t('booking.labelPhone')}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t('booking.placeholderPhone')}
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                {t('booking.labelEmail')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('booking.placeholderEmail')}
                className={styles.input}
              />
            </div>

            {/* Service Type */}
            <div className={styles.formGroup}>
              <label htmlFor="service" className={styles.label}>
                {t('booking.labelService')}
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className={`${styles.select} ${errors.service ? styles.inputError : ''}`}
              >
                <option value="">{t('booking.serviceSelect')}</option>
                {serviceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {t(opt.labelKey)}
                  </option>
                ))}
              </select>
              {errors.service && <span className={styles.errorText}>{errors.service}</span>}
            </div>

            {/* Origin */}
            <div className={styles.formGroup}>
              <label htmlFor="origin" className={styles.label}>
                {t('booking.labelOrigin')}
              </label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder={t('booking.placeholderOrigin')}
                className={`${styles.input} ${errors.origin ? styles.inputError : ''}`}
              />
              {errors.origin && <span className={styles.errorText}>{errors.origin}</span>}
            </div>

            {/* Destination */}
            <div className={styles.formGroup}>
              <label htmlFor="destination" className={styles.label}>
                {t('booking.labelDestination')}
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder={t('booking.placeholderDestination')}
                className={`${styles.input} ${errors.destination ? styles.inputError : ''}`}
              />
              {errors.destination && <span className={styles.errorText}>{errors.destination}</span>}
            </div>

            {/* Date */}
            <div className={styles.formGroup}>
              <label htmlFor="date" className={styles.label}>
                {t('booking.labelDate')}
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
              />
              {errors.date && <span className={styles.errorText}>{errors.date}</span>}
            </div>

            {/* Time */}
            <div className={styles.formGroup}>
              <label htmlFor="time" className={styles.label}>
                {t('booking.labelTime')}
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`${styles.input} ${errors.time ? styles.inputError : ''}`}
              />
              {errors.time && <span className={styles.errorText}>{errors.time}</span>}
            </div>

            {/* Passengers */}
            <div className={styles.formGroup}>
              <label htmlFor="passengers" className={styles.label}>
                {t('booking.labelPassengers')}
              </label>
              <input
                type="number"
                id="passengers"
                name="passengers"
                min="1"
                max="7"
                value={formData.passengers}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            {/* Luggage */}
            <div className={styles.formGroup}>
              <label htmlFor="luggage" className={styles.label}>
                {t('booking.labelLuggage')}
              </label>
              <select
                id="luggage"
                name="luggage"
                value={formData.luggage}
                onChange={handleChange}
                className={styles.select}
              >
                {luggageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {t(opt.labelKey)}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Notes */}
            <div className={`${styles.formGroup} ${styles.colSpan2}`}>
              <label htmlFor="notes" className={styles.label}>
                {t('booking.labelNotes')}
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder={t('booking.placeholderNotes')}
                className={styles.textarea}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className={styles.submitBtn}>
            <svg 
              className={styles.whatsappIcon} 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12.031 2c-5.516 0-9.984 4.478-9.984 10 0 1.768.462 3.424 1.258 4.88l-1.305 4.81 4.908-1.298c1.427.778 3.05 1.22 4.773 1.22 5.516 0 9.984-4.478 9.984-10 0-5.522-4.468-10-9.984-10zm4.973 14.155c-.206.581-1.019 1.127-1.402 1.18-.383.053-.873.08-2.65-.64-2.277-.92-3.708-3.238-3.822-3.39-.115-.152-.924-1.229-.924-2.353 0-1.124.584-1.677.795-1.905.206-.228.459-.286.613-.286.154 0 .307.006.441.012.14.006.329-.053.513.393.189.46.647 1.58.704 1.701.057.12.096.262.015.427-.077.166-.118.269-.236.407-.118.138-.25.31-.355.414-.115.115-.236.241-.102.473.134.228.599.988 1.286 1.6 1.137 1.01 1.944 1.34 2.219 1.45.275.11.435.093.596-.093.161-.186.689-.806.873-1.082.183-.275.367-.23.619-.136.253.093 1.6.755 1.876.893.275.138.459.206.527.323.067.117.067.68-.139 1.261z" />
            </svg>
            <span>{t('booking.submit')}</span>
          </button>
        </form>
      </div>
    </section>
  );
}
