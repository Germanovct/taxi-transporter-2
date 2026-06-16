import useIntersection from '../hooks/useIntersection';

export default function SectionWrapper({ children, className = '', id }) {
  const ref = useIntersection();

  return (
    <section ref={ref} id={id} className={`reveal-on-scroll ${className}`}>
      {children}
    </section>
  );
}
