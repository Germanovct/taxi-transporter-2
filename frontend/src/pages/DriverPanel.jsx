import { useState, useEffect, useRef, useCallback } from 'react';

const panelStyles = {
  container: {
    minHeight: '100vh',
    background: '#06060e',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: "'Inter', sans-serif",
    color: '#fff',
  },
  logo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '28px',
    letterSpacing: '3px',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #4F8EF7, #A855F7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '40px',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '32px 28px',
    width: '100%',
    maxWidth: '360px',
    textAlign: 'center',
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  switchLabel: {
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  switchTrack: (isActive) => ({
    width: '60px',
    height: '32px',
    borderRadius: '16px',
    background: isActive
      ? 'linear-gradient(135deg, #22c55e, #16a34a)'
      : 'rgba(255,255,255,0.15)',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: isActive
      ? '1px solid rgba(34,197,94,0.5)'
      : '1px solid rgba(255,255,255,0.2)',
  }),
  switchThumb: (isActive) => ({
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: '#fff',
    position: 'absolute',
    top: '2px',
    left: isActive ? '31px' : '2px',
    transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  }),
  statusActive: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: '12px',
    marginBottom: '16px',
    fontSize: '13px',
    color: '#22c55e',
    fontWeight: '600',
  },
  statusInactive: {
    padding: '12px 20px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    marginBottom: '16px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
  },
  lastUpdate: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '20px',
  },
  disconnectBtn: {
    width: '100%',
    padding: '14px',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    borderRadius: '12px',
    color: '#f87171',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Barlow Condensed', sans-serif",
  },
  errorText: {
    fontSize: '12px',
    color: '#f87171',
    marginTop: '12px',
  },
};

export default function DriverPanel() {
  const [isActive, setIsActive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const tickRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const DRIVER_KEY = import.meta.env.VITE_DRIVER_SECRET_KEY || '';

  const sendLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('GPS no disponible en este dispositivo');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`${API_URL}/location/driver/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secret_key: DRIVER_KEY,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            })
          });

          if (res.ok) {
            setLastUpdate(new Date());
            setSecondsAgo(0);
            setError(null);
          } else {
            const data = await res.json().catch(() => ({}));
            setError(data.detail || 'Error al enviar ubicación');
          }
        } catch (err) {
          setError('Sin conexión a internet');
        }
      },
      (err) => {
        setError('Permiso de GPS denegado. Activá la ubicación.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [API_URL, DRIVER_KEY]);

  const startSharing = () => {
    setIsActive(true);
    setError(null);
    // Send immediately
    sendLocation();
    // Then every 30 seconds
    intervalRef.current = setInterval(sendLocation, 30000);
  };

  const stopSharing = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const toggleActive = () => {
    if (isActive) {
      stopSharing();
    } else {
      startSharing();
    }
  };

  // Seconds ago ticker
  useEffect(() => {
    if (isActive && lastUpdate) {
      tickRef.current = setInterval(() => {
        const diff = Math.round((Date.now() - lastUpdate.getTime()) / 1000);
        setSecondsAgo(diff);
      }, 1000);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isActive, lastUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  return (
    <div style={panelStyles.container}>
      <h1 style={panelStyles.logo}>TAXI EL TRANSPORTER 2</h1>
      <p style={panelStyles.subtitle}>Panel del conductor</p>

      <div style={panelStyles.card}>
        {/* Toggle Switch */}
        <div style={panelStyles.switchContainer}>
          <span style={{
            ...panelStyles.switchLabel,
            color: isActive ? '#22c55e' : 'rgba(255,255,255,0.4)'
          }}>
            {isActive ? 'DISPONIBLE' : 'NO DISPONIBLE'}
          </span>
          <div
            style={panelStyles.switchTrack(isActive)}
            onClick={toggleActive}
            role="switch"
            aria-checked={isActive}
          >
            <div style={panelStyles.switchThumb(isActive)} />
          </div>
        </div>

        {/* Status */}
        {isActive ? (
          <div style={panelStyles.statusActive}>
            📍 GPS activo — Compartiendo ubicación
          </div>
        ) : (
          <div style={panelStyles.statusInactive}>
            GPS desactivado
          </div>
        )}

        {/* Last update */}
        {isActive && lastUpdate && (
          <p style={panelStyles.lastUpdate}>
            Última actualización: hace {secondsAgo} segundo{secondsAgo !== 1 ? 's' : ''}
          </p>
        )}

        {/* Disconnect button */}
        {isActive && (
          <button
            style={panelStyles.disconnectBtn}
            onClick={stopSharing}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.25)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.15)';
            }}
          >
            🔴 DESCONECTARME
          </button>
        )}

        {/* Error */}
        {error && <p style={panelStyles.errorText}>⚠️ {error}</p>}
      </div>
    </div>
  );
}
