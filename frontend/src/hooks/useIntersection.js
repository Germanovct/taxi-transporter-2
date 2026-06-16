import { useEffect, useRef } from 'react';

export default function useIntersection() {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set up observer to trigger class additions
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Disconnect once animation is triggered
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15, // 15% of viewport
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return ref;
}
