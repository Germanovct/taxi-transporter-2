import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ServicesDestinationsSection.module.css';
import SectionWrapper from '../components/SectionWrapper';

export default function ServicesDestinationsSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'destinations' | 'gastro' | 'costa'
  const [activeCard, setActiveCard] = useState(null);

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
    { value: 'Groups', labelKey: 'booking.serviceGroups' },
    { value: 'Other', labelKey: 'booking.serviceOther' }
  ];

  const luggageOptions = [
    { value: 'None', labelKey: 'booking.luggageNone' },
    { value: 'Medium', labelKey: 'booking.luggageMedium' },
    { value: 'Large', labelKey: 'booking.luggageLarge' },
    { value: 'Special', labelKey: 'booking.luggageSpecial' }
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCardClick = (cardType, cardTitle, serviceValue) => {
    setFormData((prev) => {
      const updated = { ...prev };
      if (cardType === 'service') {
        updated.service = serviceValue;
      } else {
        updated.destination = cardTitle;
        if (cardType === 'gastro') {
          updated.service = 'Gastro';
        } else if (cardType === 'costa') {
          updated.service = 'Costa';
        } else if (cardType === 'destination') {
          updated.service = serviceValue;
        }
      }
      return updated;
    });

    const formEl = document.getElementById('booking-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ['name', 'phone', 'service', 'origin', 'destination', 'date', 'time'];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = t('booking.required');
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorKey = Object.keys(newErrors)[0];
      const errorEl = document.getElementById(`booking-${firstErrorKey}`);
      if (errorEl) {
        errorEl.focus();
      }
      return;
    }

    const selectedServiceObj = serviceOptions.find((opt) => opt.value === formData.service);
    const serviceLabel = selectedServiceObj ? t(selectedServiceObj.labelKey) : formData.service;

    const selectedLuggageObj = luggageOptions.find((opt) => opt.value === formData.luggage);
    const luggageLabel = selectedLuggageObj ? t(selectedLuggageObj.labelKey) : formData.luggage;

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

    setTimeout(() => {
      setSuccess(false);
    }, 5000);
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
    },
    {
      id: 7,
      title: t('services.s7Title'),
      desc: t('services.s7Desc'),
      bgImage: "/images/contingentes.jpg",
      icon: (
        <svg className={styles.icon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      )
    }
  ];

  // 🏟 Subcategory 1 in Tab 2: Estadios & Eventos
  const stadiumsData = [
    {
      id: 1,
      title: t('destinations.d1Title'), // Estadio Monumental - River Plate
      desc: t('destinations.d1Desc'),
      bgImage: "/images/monumental.jpg",
    },
    {
      id: 2,
      title: t('destinations.d2Title'), // La Bombonera - Boca Juniors
      desc: t('destinations.d2Desc'),
      bgImage: "/images/bombonera.jpg",
    },
    {
      id: 3,
      title: t('destinations.d3Title'), // Tecnópolis
      desc: t('destinations.d3Desc'),
      bgImage: "/images/tecnopolis.jpg",
    },
    {
      id: 4,
      title: t('destinations.d4Title'), // Recitales y Shows
      desc: t('destinations.d4Desc'),
      bgImage: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    }
  ];

  // 🗺 Subcategory 2 in Tab 2: Turismo & Cultura
  const cultureAttractionsData = [
    {
      id: 1,
      title: t('destinations.d5Title'), // Caminito, La Boca
      desc: t('destinations.d5Desc'),
      bgImage: "/images/caminito.jpg",
    },
    {
      id: 2,
      title: t('destinations.d6Title'), // Puerto Madero
      desc: t('destinations.d6Desc'),
      bgImage: "/images/puerto-madero.jpg",
    },
    {
      id: 3,
      title: t('servicesDestinations.attractions.a1Title'), // Teatro Colón
      desc: t('servicesDestinations.attractions.a1Desc'),
      bgImage: "/images/gastro/teatro-colon-panoramica-1500x610.jpg",
    },
    {
      id: 4,
      title: t('servicesDestinations.attractions.a3Title'), // Puente de la Mujer
      desc: t('servicesDestinations.attractions.a3Desc'),
      bgImage: "/images/gastro/puente-de-la-mujer-puerto-madero-gente-atardecer1500x610.jpg",
    },
    {
      id: 5,
      title: t('servicesDestinations.attractions.a4Title'), // Obelisco
      desc: t('servicesDestinations.attractions.a4Desc'),
      bgImage: "/images/gastro/obelisco-atardecer-1500x610-2026-cm.jpg",
    },
    {
      id: 6,
      title: t('servicesDestinations.attractions.a5Title'), // Planetario Galileo Galilei
      desc: t('servicesDestinations.attractions.a5Desc'),
      bgImage: "/images/gastro/planetario-noche-luces2025-1500x610.jpg",
    },
    {
      id: 7,
      title: t('servicesDestinations.attractions.a6Title'), // Rosedal de Palermo
      desc: t('servicesDestinations.attractions.a6Desc'),
      bgImage: "/images/gastro/rosedal-de-palermo-rosas-1500x610.jpg",
    },
    {
      id: 8,
      title: t('servicesDestinations.attractions.a8Title'), // Café Tortoni
      desc: t('servicesDestinations.attractions.a8Desc'),
      bgImage: "/images/gastro/cafe-tortoni-fachada-muneco1500x610.jpg",
    },
    {
      id: 9,
      title: t('servicesDestinations.attractions.a9Title'), // El Ateneo Grand Splendid
      desc: t('servicesDestinations.attractions.a9Desc'),
      bgImage: "/images/gastro/ateneo_grand_splendid_1500x610.jpg",
    },
    {
      id: 10,
      title: t('servicesDestinations.attractions.a10Title'), // Casa Rosada
      desc: t('servicesDestinations.attractions.a10Desc'),
      bgImage: "/images/gastro/casa_rosada_1200_fachada_sol_4.jpg",
    },
    {
      id: 11,
      title: t('servicesDestinations.attractions.a11Title'), // Cementerio de la Recoleta
      desc: t('servicesDestinations.attractions.a11Desc'),
      bgImage: "/images/gastro/cementerio-recoleta-fachada-1500x610-nn_0.jpg",
    },
    {
      id: 12,
      title: t('servicesDestinations.attractions.a12Title'), // Feria de Mataderos
      desc: t('servicesDestinations.attractions.a12Desc'),
      bgImage: "/images/gastro/feria-mataderos-24-1500x610-show.jpg",
    },
    {
      id: 13,
      title: t('servicesDestinations.attractions.a13Title'), // El Cabildo
      desc: t('servicesDestinations.attractions.a13Desc'),
      bgImage: "/images/gastro/cabildo-0-1500x610_0.jpg",
    },
    {
      id: 14,
      title: t('servicesDestinations.attractions.a14Title'), // Floralis Genérica
      desc: t('servicesDestinations.attractions.a14Desc'),
      bgImage: "/images/gastro/floralis-verano-gente-sol-26-1500x610.jpg",
    },
    {
      id: 15,
      title: t('servicesDestinations.attractions.a15Title'), // Catedral Metropolitana
      desc: t('servicesDestinations.attractions.a15Desc'),
      bgImage: "/images/gastro/catedral-metropolitana-2021-fachada-1500x610.jpg",
    },
    {
      id: 16,
      title: t('servicesDestinations.attractions.a16Title'), // Palacio Barolo
      desc: t('servicesDestinations.attractions.a16Desc'),
      bgImage: "/images/gastro/n_barolo1200_0.jpg",
    },
    {
      id: 17,
      title: t('servicesDestinations.attractions.a17Title'), // Museo Nacional Bellas Artes
      desc: t('servicesDestinations.attractions.a17Desc'),
      bgImage: "/images/gastro/museo-nacional-bellas-artes-1500x610-fachada.jpg",
    },
    {
      id: 18,
      title: t('servicesDestinations.attractions.a18Title'), // Reserva Ecológica
      desc: t('servicesDestinations.attractions.a18Desc'),
      bgImage: "/images/gastro/reserva_picaflor_1500x610.jpg",
    },
    {
      id: 19,
      title: t('servicesDestinations.attractions.a19Title'), // Galerías Pacífico
      desc: t('servicesDestinations.attractions.a19Desc'),
      bgImage: "/images/gastro/galerias_pacifico1200.jpg",
    },
    {
      id: 20,
      title: t('servicesDestinations.attractions.a20Title'), // Plaza Dorrego
      desc: t('servicesDestinations.attractions.a20Desc'),
      bgImage: "/images/gastro/feria_de_san_telmo_1200_plaza_1.jpg",
    },
    {
      id: 21,
      title: t('servicesDestinations.attractions.a21Title'), // Luján
      desc: t('servicesDestinations.attractions.a21Desc'),
      bgImage: "/images/gastro/lujan.jpg",
    }
  ];

  // 🍽 Tab 3: Pueblos Gastronómicos
  const gastroTownsData = [
    {
      id: 1,
      title: t('servicesDestinations.towns.t1Title'),
      location: t('servicesDestinations.towns.t1Loc'),
      desc: t('servicesDestinations.towns.t1Desc'),
      distance: t('servicesDestinations.towns.t1Dist'),
      bgImage: "/images/gastro/Tomas-Jofre-7.jpg",
    },
    {
      id: 2,
      title: t('servicesDestinations.towns.t2Title'),
      location: t('servicesDestinations.towns.t2Loc'),
      desc: t('servicesDestinations.towns.t2Desc'),
      distance: t('servicesDestinations.towns.t2Dist'),
      bgImage: "/images/gastro/carlos-keen-ba.jpg",
    },
    {
      id: 3,
      title: t('servicesDestinations.towns.t3Title'),
      location: t('servicesDestinations.towns.t3Loc'),
      desc: t('servicesDestinations.towns.t3Desc'),
      distance: t('servicesDestinations.towns.t3Dist'),
      bgImage: "/images/gastro/Uribelarrea.jpg",
    },
    {
      id: 4,
      title: t('servicesDestinations.towns.t4Title'),
      location: t('servicesDestinations.towns.t4Loc'),
      desc: t('servicesDestinations.towns.t4Desc'),
      distance: t('servicesDestinations.towns.t4Dist'),
      bgImage: "/images/gastro/san antorio de areco.jpg",
    },
    {
      id: 5,
      title: t('servicesDestinations.towns.t5Title'),
      location: t('servicesDestinations.towns.t5Loc'),
      desc: t('servicesDestinations.towns.t5Desc'),
      distance: t('servicesDestinations.towns.t5Dist'),
      bgImage: "/images/gastro/suipacha.jpg",
    },
    {
      id: 6,
      title: t('servicesDestinations.towns.t6Title'),
      location: t('servicesDestinations.towns.t6Loc'),
      desc: t('servicesDestinations.towns.t6Desc'),
      distance: t('servicesDestinations.towns.t6Dist'),
      bgImage: "/images/gastro/azcuenaga.jpg",
    },
    {
      id: 7,
      title: t('servicesDestinations.towns.t7Title'),
      location: t('servicesDestinations.towns.t7Loc'),
      desc: t('servicesDestinations.towns.t7Desc'),
      distance: t('servicesDestinations.towns.t7Dist'),
      bgImage: "/images/gastro/gouin.webp",
    },
    {
      id: 8,
      title: t('servicesDestinations.towns.t8Title'),
      location: t('servicesDestinations.towns.t8Loc'),
      desc: t('servicesDestinations.towns.t8Desc'),
      distance: t('servicesDestinations.towns.t8Dist'),
      bgImage: "/images/gastro/villa ruiz.jpg",
    }
  ];

  // 🌊 Tab 4: Costa Atlántica
  const costaData = [
    {
      id: 1,
      title: t('servicesDestinations.costa.c1Title'),
      desc: t('servicesDestinations.costa.c1Desc'),
      distance: t('servicesDestinations.costa.c1Dist'),
      badge: t('servicesDestinations.costa.c1Badge'),
      bgImage: "/images/gastro/mar del plata.jpg"
    },
    {
      id: 2,
      title: t('servicesDestinations.costa.c2Title'),
      desc: t('servicesDestinations.costa.c2Desc'),
      distance: t('servicesDestinations.costa.c2Dist'),
      badge: t('servicesDestinations.costa.c2Badge'),
      bgImage: "/images/gastro/partido de la costa.webp"
    }
  ];

  return (
    <SectionWrapper id="services-destinations" className={styles.section}>
      <div className="container">
        
        {/* Header */}
        <div className={styles.titleGroup}>
          <span className={styles.badge}>{t('servicesDestinations.badge')}</span>
          <h2 className={styles.title}>
            {t('servicesDestinations.title1')} <br />
            <span className="text-gradient">{t('servicesDestinations.title2')}</span>
          </h2>
          <div className={styles.subtitleWrapper}>
            <p className={styles.subtitle}>{t('servicesDestinations.subtitle')}</p>
            <span className={styles.phase2Badge}>{t('servicesDestinations.phase2Badge')}</span>
          </div>
        </div>

        {/* Tab System Selector */}
        <div className={styles.tabContainerWrapper}>
          <div className={styles.tabContainer}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'services' ? styles.tabBtnActive : ''}`}
              onClick={() => {
                setActiveTab('services');
                setActiveCard(null);
                setFormData(prev => ({ ...prev, service: '' }));
              }}
            >
              {t('servicesDestinations.tabServices')}
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'destinations' ? styles.tabBtnActive : ''}`}
              onClick={() => {
                setActiveTab('destinations');
                setActiveCard(null);
              }}
            >
              {t('servicesDestinations.tabDestinations')}
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'gastro' ? styles.tabBtnActive : ''}`}
              onClick={() => {
                setActiveTab('gastro');
                setActiveCard(null);
                setFormData(prev => ({ ...prev, service: 'Gastro' }));
              }}
            >
              {t('servicesDestinations.tabGastro')}
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'costa' ? styles.tabBtnActive : ''}`}
              onClick={() => {
                setActiveTab('costa');
                setActiveCard(null);
                setFormData(prev => ({ ...prev, service: 'Costa' }));
              }}
            >
              {t('servicesDestinations.tabCosta')}
            </button>
          </div>
        </div>

        {/* Dynamic Tab Content with Fade Animation */}
        <div className={styles.tabContentWrapper}>
          
          {/* Services Tab */}
          <div className={`${styles.tabPanel} ${activeTab === 'services' ? styles.panelVisible : styles.panelHidden}`}>
            <div className={styles.gridServices}>
              {servicesData.map((service) => (
                <div
                  key={service.id}
                  className={`${styles.cardService} ${activeCard === `service-${service.id}` ? styles.cardActive : ''} ${service.id === 7 ? styles.cardServiceWide : ''}`}
                  style={{ backgroundImage: `url('${service.bgImage}')` }}
                  onClick={() => {
                    setActiveCard(activeCard === `service-${service.id}` ? null : `service-${service.id}`);
                    const serviceValuesMap = {
                      1: 'Ezeiza',
                      2: 'Aeroparque',
                      3: 'Terminal',
                      4: 'Fluvio',
                      5: 'Distance',
                      6: 'City',
                      7: 'Groups'
                    };
                    handleCardClick('service', service.title, serviceValuesMap[service.id]);
                  }}
                >
                  <div className={styles.cardContent}>
                    <div className={styles.iconWrapper}>
                      {service.icon}
                    </div>
                    <h3 className={styles.cardTitle}>{service.title}</h3>
                    <p className={styles.cardDesc}>{service.desc}</p>
                    <div className={styles.servicePhase2BadgeWrapper}>
                      <span className={styles.servicePhase2Badge}>
                        {t('servicesDestinations.reservaBadge')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
 
          {/* Destinations & Tourism Tab */}
          <div className={`${styles.tabPanel} ${activeTab === 'destinations' ? styles.panelVisible : styles.panelHidden}`}>
            
            {/* Subcategory 1: Estadios & Eventos */}
            <div className={styles.gastroHeader}>
              <h3 className={styles.gastroSectionTitle}>{t('servicesDestinations.estadiosEventosTitle')}</h3>
              <p className={styles.gastroSectionSubtitle}>{t('servicesDestinations.estadiosEventosSubtitle')}</p>
            </div>
 
            <div className={styles.gridGastro}>
              {stadiumsData.map((dest) => (
                <div
                  key={dest.id}
                  className={`${styles.cardGastro} ${activeCard === `dest-${dest.id}` ? styles.cardActive : ''} ${!dest.bgImage ? styles.gradientPlaceholder : ''}`}
                  style={dest.bgImage ? { backgroundImage: `url('${dest.bgImage}')` } : {}}
                  onClick={() => {
                    setActiveCard(activeCard === `dest-${dest.id}` ? null : `dest-${dest.id}`);
                    handleCardClick('destination', dest.title, 'Stadium');
                  }}
                >
                  <div className={styles.cardGastroContent}>
                    <h3 className={styles.cardGastroTitle}>{dest.title}</h3>
                    <p className={styles.cardGastroDesc}>{dest.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className={styles.dividerContainer}>
              <div className={styles.dividerLine}></div>
              <span className={styles.dividerText}>🏛 {t('servicesDestinations.turismoCulturaTitle')}</span>
              <div className={styles.dividerLine}></div>
            </div>

            {/* Subcategory 2: Turismo & Cultura */}
            <div className={styles.gastroHeader}>
              <h3 className={styles.gastroSectionTitle}>{t('servicesDestinations.turismoCulturaTitle')}</h3>
              <p className={styles.gastroSectionSubtitle}>{t('servicesDestinations.turismoCulturaSubtitle')}</p>
            </div>

            <div className={styles.gridGastro}>
              {cultureAttractionsData.map((attr) => (
                <div
                  key={attr.id}
                  className={`${styles.cardGastro} ${activeCard === `attr-${attr.id}` ? styles.cardActive : ''} ${!attr.bgImage ? styles.gradientPlaceholder : ''}`}
                  style={attr.bgImage ? { backgroundImage: `url('${attr.bgImage}')` } : {}}
                  onClick={() => {
                    setActiveCard(activeCard === `attr-${attr.id}` ? null : `attr-${attr.id}`);
                    handleCardClick('destination', attr.title, 'Tourism');
                  }}
                >
                  <div className={styles.cardGastroContent}>
                    <h3 className={styles.cardGastroTitle}>{attr.title}</h3>
                    <p className={styles.cardGastroDesc}>{attr.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Pueblos Gastronómicos Tab */}
          <div className={`${styles.tabPanel} ${activeTab === 'gastro' ? styles.panelVisible : styles.panelHidden}`}>
            
            <div className={styles.gastroHeader}>
              <h3 className={styles.gastroSectionTitle}>{t('servicesDestinations.gastroTitle')}</h3>
              <p className={styles.gastroSectionSubtitle}>{t('servicesDestinations.gastroSubtitle')}</p>
            </div>

            <div className={styles.gridGastro}>
              {gastroTownsData.map((town) => (
                <div
                  key={town.id}
                  className={`${styles.cardGastro} ${activeCard === `town-${town.id}` ? styles.cardActive : ''} ${!town.bgImage ? styles.gradientPlaceholder : ''}`}
                  style={town.bgImage ? { backgroundImage: `url('${town.bgImage}')` } : {}}
                  onClick={() => {
                    setActiveCard(activeCard === `town-${town.id}` ? null : `town-${town.id}`);
                    handleCardClick('gastro', town.title, 'Gastro');
                  }}
                >
                  <div className={styles.cardGastroContent}>
                    <div className={styles.badgeGroup}>
                      <span className={styles.gastroBadgeLoc}>{town.location}</span>
                      <span className={styles.gastroBadgeDist}>{town.distance}</span>
                    </div>
                    <h3 className={styles.cardGastroTitle}>{town.title}</h3>
                    <p className={styles.cardGastroDesc}>{town.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Costa Atlántica Tab */}
          <div className={`${styles.tabPanel} ${activeTab === 'costa' ? styles.panelVisible : styles.panelHidden}`}>
            
            <div className={styles.gastroHeader}>
              <h3 className={styles.gastroSectionTitle}>{t('servicesDestinations.costaTitle')}</h3>
              <p className={styles.gastroSectionSubtitle}>{t('servicesDestinations.costaSubtitle')}</p>
            </div>

            <div className={styles.gridCosta}>
              {costaData.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.cardCosta} ${activeCard === `costa-${item.id}` ? styles.cardActive : ''}`}
                  style={{ backgroundImage: `url('${item.bgImage}')` }}
                  onClick={() => {
                    setActiveCard(activeCard === `costa-${item.id}` ? null : `costa-${item.id}`);
                    handleCardClick('costa', item.title, 'Costa');
                  }}
                >
                  <div className={styles.cardCostaContent}>
                    <div className={styles.badgeGroup}>
                      <span className={styles.gastroBadgeDist}>{item.distance}</span>
                      <span className={styles.gastroBadgeLoc}>{item.badge}</span>
                    </div>
                    <h3 className={styles.cardCostaTitle}>{item.title}</h3>
                    <p className={styles.cardCostaDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Banner CTA */}
            <div className={styles.costaBanner}>
              <div className={styles.costaBannerText}>
                <h4 className={styles.costaBannerTitle}>{t('servicesDestinations.costaCta')}</h4>
                <p className={styles.costaBannerSub}>{t('servicesDestinations.costaCtaDesc')}</p>
              </div>
              <a
                href="https://wa.me/541126281011"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.costaBannerBtn}
              >
                💬 {t('servicesDestinations.costaCtaBtn')}
              </a>
            </div>

          </div>

        </div>

        {/* Formulario de Reserva */}
        <div id="booking-form" className={styles.bookingFormContainer}>
          <div className={styles.bookingHeader}>
            <span className={styles.bookingBadge}>{t('booking.badgeCompact')}</span>
            <h3 className={styles.bookingTitle}>{t('booking.titleCompact')}</h3>
          </div>

          {success && (
            <div className={styles.successBanner}>
              <span className={styles.successIcon}>✅</span>
              <p>{t('booking.success')}</p>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className={styles.form} noValidate>
            <div className={styles.formGrid}>
              {/* Nombre completo */}
              <div className={`${styles.formGroup} ${styles.colName}`}>
                <label htmlFor="booking-name" className={styles.label}>{t('booking.labelName')}</label>
                <input
                  type="text"
                  id="booking-name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder={t('booking.placeholderName')}
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              {/* Teléfono */}
              <div className={`${styles.formGroup} ${styles.colPhone}`}>
                <label htmlFor="booking-phone" className={styles.label}>{t('booking.labelPhone')}</label>
                <input
                  type="tel"
                  id="booking-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder={t('booking.placeholderPhone')}
                  className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                />
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              </div>

              {/* Email */}
              <div className={`${styles.formGroup} ${styles.colEmail}`}>
                <label htmlFor="booking-email" className={styles.label}>{t('booking.labelEmail')}</label>
                <input
                  type="email"
                  id="booking-email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder={t('booking.placeholderEmail')}
                  className={styles.input}
                />
              </div>

              {/* Tipo de servicio */}
              <div className={`${styles.formGroup} ${styles.colService}`}>
                <label htmlFor="booking-service" className={styles.label}>{t('booking.labelService')}</label>
                <select
                  id="booking-service"
                  name="service"
                  value={formData.service}
                  onChange={handleFormChange}
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

              {/* Origen */}
              <div className={`${styles.formGroup} ${styles.colOrigin}`}>
                <label htmlFor="booking-origin" className={styles.label}>{t('booking.labelOrigin')}</label>
                <input
                  type="text"
                  id="booking-origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleFormChange}
                  placeholder={t('booking.placeholderOrigin')}
                  className={`${styles.input} ${errors.origin ? styles.inputError : ''}`}
                />
                {errors.origin && <span className={styles.errorText}>{errors.origin}</span>}
              </div>

              {/* Destino */}
              <div className={`${styles.formGroup} ${styles.colDestination}`}>
                <label htmlFor="booking-destination" className={styles.label}>{t('booking.labelDestination')}</label>
                <input
                  type="text"
                  id="booking-destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleFormChange}
                  placeholder={t('booking.placeholderDestination')}
                  className={`${styles.input} ${errors.destination ? styles.inputError : ''}`}
                />
                {errors.destination && <span className={styles.errorText}>{errors.destination}</span>}
              </div>

              {/* Fecha */}
              <div className={`${styles.formGroup} ${styles.colDate}`}>
                <label htmlFor="booking-date" className={styles.label}>{t('booking.labelDate')}</label>
                <input
                  type="date"
                  id="booking-date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
                />
                {errors.date && <span className={styles.errorText}>{errors.date}</span>}
              </div>

              {/* Hora */}
              <div className={`${styles.formGroup} ${styles.colTime}`}>
                <label htmlFor="booking-time" className={styles.label}>{t('booking.labelTime')}</label>
                <input
                  type="time"
                  id="booking-time"
                  name="time"
                  value={formData.time}
                  onChange={handleFormChange}
                  className={`${styles.input} ${errors.time ? styles.inputError : ''}`}
                />
                {errors.time && <span className={styles.errorText}>{errors.time}</span>}
              </div>

              {/* Pasajeros */}
              <div className={`${styles.formGroup} ${styles.colPassengers}`}>
                <label htmlFor="booking-passengers" className={styles.label}>{t('booking.labelPassengers')}</label>
                <input
                  type="number"
                  id="booking-passengers"
                  name="passengers"
                  min="1"
                  max="7"
                  value={formData.passengers}
                  onChange={handleFormChange}
                  className={styles.input}
                />
              </div>

              {/* Equipaje */}
              <div className={`${styles.formGroup} ${styles.colLuggage}`}>
                <label htmlFor="booking-luggage" className={styles.label}>{t('booking.labelLuggage')}</label>
                <select
                  id="booking-luggage"
                  name="luggage"
                  value={formData.luggage}
                  onChange={handleFormChange}
                  className={styles.select}
                >
                  {luggageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(opt.labelKey)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notas adicionales */}
              <div className={`${styles.formGroup} ${styles.colNotes}`}>
                <label htmlFor="booking-notes" className={styles.label}>{t('booking.labelNotes')}</label>
                <textarea
                  id="booking-notes"
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleFormChange}
                  placeholder={t('booking.placeholderNotes')}
                  className={styles.textarea}
                />
              </div>

              {/* Botón submit */}
              <div className={`${styles.formGroup} ${styles.colSubmit}`}>
                <button type="submit" className={styles.submitBtn}>
                  <svg className={styles.whatsappIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 2c-5.516 0-9.984 4.478-9.984 10 0 1.768.462 3.424 1.258 4.88l-1.305 4.81 4.908-1.298c1.427.778 3.05 1.22 4.773 1.22 5.516 0 9.984-4.478 9.984-10 0-5.522-4.468-10-9.984-10zm4.973 14.155c-.206.581-1.019 1.127-1.402 1.18-.383.053-.873.08-2.65-.64-2.277-.92-3.708-3.238-3.822-3.39-.115-.152-.924-1.229-.924-2.353 0-1.124.584-1.677.795-1.905.206-.228.459-.286.613-.286.154 0 .307.006.441.012.14.006.329-.053.513.393.189.46.647 1.58.704 1.701.057.12.096.262.015.427-.077.166-.118.269-.236.407-.118.138-.25.31-.355.414-.115.115-.236.241-.102.473.134.228.599.988 1.286 1.6 1.137 1.01 1.944 1.34 2.219 1.45.275.11.435.093.596-.093.161-.186.689-.806.873-1.082.183-.275.367-.23.619-.136.253.093 1.6.755 1.876.893.275.138.459.206.527.323.067.117.067.68-.139 1.261z" />
                  </svg>
                  <span>{t('booking.submit')}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* CTA Final */}
        <div className={styles.ctaFinal}>
          <div className={styles.ctaLeft}>
            <h3 className={styles.ctaTitle}>{t('servicesDestinations.ctaTitle')}</h3>
            <p className={styles.ctaSubtitle}>{t('servicesDestinations.ctaSubtitle')}</p>
            <a
              href="https://wa.me/541126281011"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
            >
              💬 {t('servicesDestinations.ctaButton')}
            </a>
          </div>
          <div className={styles.ctaDivider}></div>
          <div className={styles.ctaRight}>
            <span className={styles.ctaPhase2Badge}>{t('servicesDestinations.phase2Title')}</span>
            <p className={styles.ctaPhase2Desc}>
              {t('servicesDestinations.phase2Desc')}
            </p>
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}
