import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ServicesAndDestinationsSection.module.css';
import SectionWrapper from '../components/SectionWrapper';

export default function ServicesAndDestinationsSection() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'destinations'
  const [bookingTab, setBookingTab] = useState('airport'); // 'airport' | 'longDistance' | 'cityTour'
  const [activeCard, setActiveCard] = useState(null);

  // Form states
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [suggestedVehicle, setSuggestedVehicle] = useState('Toyota Corolla');

  // Auto-suggest vehicle based on passenger count
  useEffect(() => {
    const num = parseInt(passengers, 10);
    if (num <= 4) {
      setSuggestedVehicle('Toyota Corolla (Sedan)');
    } else if (num === 5) {
      setSuggestedVehicle('Renault Kangoo (SUV / Equi. Extra)');
    } else {
      setSuggestedVehicle('Chevrolet Spin (7 Pax)');
    }
  }, [passengers]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (!origin.trim() || !destination.trim() || !dateTime) {
      alert(i18n.language === 'es' ? 'Por favor complete todos los campos.' : 'Please fill out all fields.');
      return;
    }

    // Format date beautifully
    const dateObj = new Date(dateTime);
    const formattedDate = dateObj.toLocaleDateString(i18n.language, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' a las ' + dateObj.toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
    });

    const tabNames = {
      airport: t('bookingWidget.tabAirport'),
      longDistance: t('bookingWidget.tabLongDistance'),
      cityTour: t('bookingWidget.tabCityTour'),
    };

    // Construct the WhatsApp message
    const message = `Hola Marcelo! Quisiera consultar disponibilidad y tarifa para un traslado privado:
      
📋 DETALLES DE LA SOLICITUD:
• Tipo: ${tabNames[bookingTab]}
• Origen: ${origin}
• Destino: ${destination}
• Fecha y Hora: ${formattedDate}
• Pasajeros: ${passengers}
• Vehículo sugerido: ${suggestedVehicle}

Quedo a la espera de la cotización. ¡Muchas gracias!`;

    const whatsappUrl = `https://wa.me/5491134324040?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

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

  const destinationsData = [
    {
      id: 1,
      title: t('destinations.d1Title'),
      desc: t('destinations.d1Desc'),
      bgImage: "/images/monumental.jpg",
      isLarge: true,
      gridClass: styles.itemMonumental,
    },
    {
      id: 2,
      title: t('destinations.d2Title'),
      desc: t('destinations.d2Desc'),
      bgImage: "/images/bombonera.jpg",
      isLarge: false,
      gridClass: styles.itemBombonera,
    },
    {
      id: 3,
      title: t('destinations.d3Title'),
      desc: t('destinations.d3Desc'),
      bgImage: "/images/tecnopolis.jpg",
      isLarge: false,
      gridClass: styles.itemTecnopolis,
    },
    {
      id: 4,
      title: t('destinations.d4Title'),
      desc: t('destinations.d4Desc'),
      bgImage: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
      isLarge: false,
      gridClass: styles.itemRecitales,
    },
    {
      id: 5,
      title: t('destinations.d5Title'),
      desc: t('destinations.d5Desc'),
      bgImage: "/images/caminito.jpg",
      isLarge: false,
      gridClass: styles.itemCaminito,
    },
    {
      id: 6,
      title: t('destinations.d6Title'),
      desc: t('destinations.d6Desc'),
      bgImage: "/images/puerto-madero.jpg",
      isLarge: true,
      gridClass: styles.itemPuertoMadero,
    },
  ];

  return (
    <SectionWrapper id="services" className={styles.section}>
      <div className="container">
        
        {/* Title Group */}
        <div className={styles.titleGroup}>
          <span className={styles.badge}>{t('servicesAndDestinations.badge')}</span>
          <h2 className={styles.title}>
            {t('servicesAndDestinations.title1')}<br />
            <span className="text-gradient">{t('servicesAndDestinations.title2')}</span>
          </h2>
        </div>

        {/* ✈️ Booking Search Widget (Despegar / Almundo style) */}
        <div className={styles.bookingCard}>
          <div className={styles.bookingTabs}>
            <button
              type="button"
              className={`${styles.bookingTabBtn} ${bookingTab === 'airport' ? styles.bookingTabBtnActive : ''}`}
              onClick={() => setBookingTab('airport')}
            >
              ✈️ {t('bookingWidget.tabAirport')}
            </button>
            <button
              type="button"
              className={`${styles.bookingTabBtn} ${bookingTab === 'longDistance' ? styles.bookingTabBtnActive : ''}`}
              onClick={() => setBookingTab('longDistance')}
            >
              🚗 {t('bookingWidget.tabLongDistance')}
            </button>
            <button
              type="button"
              className={`${styles.bookingTabBtn} ${bookingTab === 'cityTour' ? styles.bookingTabBtnActive : ''}`}
              onClick={() => setBookingTab('cityTour')}
            >
              🗺️ {t('bookingWidget.tabCityTour')}
            </button>
          </div>

          <form className={styles.bookingForm} onSubmit={handleBookingSubmit}>
            <div className={styles.formGrid}>
              
              {/* Origin Field */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t('bookingWidget.origin')}</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder={t('bookingWidget.placeholderOrigin')}
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Destination Field */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t('bookingWidget.destination')}</label>
                <div className={styles.inputWrapper}>
                  {bookingTab === 'airport' ? (
                    <select
                      className={styles.formSelect}
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    >
                      <option value="">-- Seleccionar Aeropuerto / Terminal --</option>
                      <option value="Aeropuerto Ezeiza (Ministro Pistarini)">Aeropuerto Ezeiza (EZE)</option>
                      <option value="Aeroparque Jorge Newbery">Aeroparque (AEP)</option>
                      <option value="Puerto Madero (Buquebus)">Buquebus / Colonia Express</option>
                      <option value="Terminal Retiro">Terminal de Ómnibus Retiro</option>
                      <option value="Terminal Liniers">Terminal de Ómnibus Liniers</option>
                    </select>
                  ) : bookingTab === 'cityTour' ? (
                    <select
                      className={styles.formSelect}
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    >
                      <option value="">-- Seleccionar Destino --</option>
                      <option value="Estadio Monumental (River Plate)">Estadio Monumental</option>
                      <option value="La Bombonera (Boca Juniors)">La Bombonera</option>
                      <option value="Caminito (La Boca)">Caminito / La Boca</option>
                      <option value="Puerto Madero">Puerto Madero (Turismo)</option>
                      <option value="Tecnópolis">Tecnópolis</option>
                      <option value="Movistar Arena / Luna Park">Movistar Arena / Luna Park</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder={t('bookingWidget.placeholderDestination')}
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    />
                  )}
                </div>
              </div>

              {/* Date & Time Field */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t('bookingWidget.dateTime')}</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="datetime-local"
                    className={styles.formInput}
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Passengers Selector */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t('bookingWidget.passengers')}</label>
                <div className={styles.inputWrapper}>
                  <select
                    className={styles.formSelect}
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value, 10))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? (i18n.language === 'es' ? 'Pasajero' : 'Passenger') : (i18n.language === 'es' ? 'Pasajeros' : 'Passengers')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            {/* Sugested Fleet Info & CTA Button */}
            <div className={styles.formFooter}>
              <div className={styles.suggestedVehicleBox}>
                <span className={styles.suggestedLabel}>{t('bookingWidget.vehicle')}:</span>
                <span className={styles.suggestedValue}>{suggestedVehicle}</span>
              </div>
              <button type="submit" className={styles.bookingSubmitBtn}>
                🚀 {t('bookingWidget.submit')}
              </button>
            </div>
          </form>
        </div>

        {/* 🎛️ Navigation Tabs for Services vs Destinations */}
        <div className={styles.navTabs}>
          <button
            type="button"
            className={`${styles.navTabBtn} ${activeTab === 'services' ? styles.navTabActive : ''}`}
            onClick={() => {
              setActiveTab('services');
              setActiveCard(null);
            }}
          >
            💼 {t('servicesAndDestinations.tabServices')}
          </button>
          <button
            type="button"
            className={`${styles.navTabBtn} ${activeTab === 'destinations' ? styles.navTabActive : ''}`}
            onClick={() => {
              setActiveTab('destinations');
              setActiveCard(null);
            }}
          >
            📍 {t('servicesAndDestinations.tabDestinations')}
          </button>
        </div>

        {/* 📦 Tab Content rendering */}
        {activeTab === 'services' ? (
          <div className={styles.gridServices}>
            {servicesData.map((service) => (
              <div
                key={service.id}
                className={`${styles.cardService} ${activeCard === `service-${service.id}` ? styles.cardActive : ''}`}
                style={{ backgroundImage: `url('${service.bgImage}')` }}
                onClick={() => setActiveCard(activeCard === `service-${service.id}` ? null : `service-${service.id}`)}
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
        ) : (
          <div className={styles.gridDestinations}>
            {destinationsData.map((dest) => {
              if (dest.id === 6) {
                return (
                  <div
                    key={dest.id}
                    className={`${styles.cardDestination} ${dest.gridClass} ${activeCard === `dest-${dest.id}` ? styles.cardActive : ''}`}
                    style={{ padding: 0, overflow: 'hidden' }}
                    onClick={() => setActiveCard(activeCard === `dest-${dest.id}` ? null : `dest-${dest.id}`)}
                  >
                    <img 
                      src={dest.bgImage}
                      alt={dest.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
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
                  className={`${styles.cardDestination} ${dest.gridClass} ${activeCard === `dest-${dest.id}` ? styles.cardActive : ''}`}
                  style={{ backgroundImage: `url(${dest.bgImage})` }}
                  onClick={() => setActiveCard(activeCard === `dest-${dest.id}` ? null : `dest-${dest.id}`)}
                >
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{dest.title}</h3>
                    <p className={styles.cardDesc}>{dest.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </SectionWrapper>
  );
}
