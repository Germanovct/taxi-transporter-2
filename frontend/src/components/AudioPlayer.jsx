import { useState, useEffect, useRef } from 'react';
import styles from './AudioPlayer.module.css';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // Iniciar en 30% para no ser molesto
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Crear el elemento de audio si no existe
    if (!audioRef.current) {
      const audio = new Audio('/audio/el-transporter2.mp3');
      audio.loop = true;
      audio.volume = volume;
      audioRef.current = audio;
    }

    const playAudio = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (err) {
        console.log("Autoplay blocked by browser. Waiting for user interaction.");
      }
    };

    // Intentar autoplay inmediato
    playAudio();

    // Fallback: reproducir ante la primera interacción del usuario con la página
    const handleFirstInteraction = () => {
      playAudio();
      // Remover listeners una vez que se interactuó
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      // Limpieza de listeners al desmontar
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Controlar volumen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Error playing audio:", err));
    }
    // Mantener expandido temporalmente tras interactuar en móvil
    setIsExpanded(true);
    setTimeout(() => setIsExpanded(false), 3000);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div 
      className={`${styles.playerContainer} ${
        (isExpanded || isPlaying) ? styles.playerContainerActive : ''
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Botón de reproducción */}
      <button 
        onClick={togglePlay} 
        className={styles.playBtn}
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
      >
        {isPlaying ? (
          // Ícono de Pause
          <svg style={{ width: '14px', height: '14px', fill: 'currentColor' }} viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        ) : (
          // Ícono de Play
          <svg style={{ width: '14px', height: '14px', fill: 'currentColor', marginLeft: '2px' }} viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>

      {/* Ondas animadas */}
      <div className={`${styles.wavesContainer} ${isPlaying ? styles.wavesActive : ''}`}>
        <div className={styles.waveBar} />
        <div className={styles.waveBar} />
        <div className={styles.waveBar} />
        <div className={styles.waveBar} />
      </div>

      {/* Control de volumen y slider */}
      <div className={styles.volumeContainer}>
        <button 
          onClick={toggleMute} 
          className={styles.volumeBtn}
          aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
        >
          {isMuted || volume === 0 ? (
            // Silencio
            <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : volume < 0.5 ? (
            // Volumen Bajo
            <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M7 9v6h4l5 5V4l-5 5H7zm11.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
          ) : (
            // Volumen Alto
            <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>

        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05" 
          value={isMuted ? 0 : volume} 
          onChange={handleVolumeChange} 
          className={styles.volumeSlider}
          aria-label="Deslizador de volumen"
        />
      </div>

      {/* Nombre de la canción (sutil) */}
      <span className={styles.trackName}>
        El Transporter
      </span>
    </div>
  );
}
