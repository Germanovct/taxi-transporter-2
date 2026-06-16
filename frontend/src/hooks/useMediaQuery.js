import { useState, useEffect } from 'react';

/**
 * Custom hook to monitor match states of CSS media queries.
 * E.g., const isMobile = useMediaQuery('(max-width: 767px)');
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e) => {
      setMatches(e.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
