import { useEffect, useRef } from 'react';

export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spotlight = ref.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlight) return;
      const { clientX, clientY } = e;
      spotlight.style.setProperty('--x', `${clientX}px`);
      spotlight.style.setProperty('--y', `${clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-0"
      style={{
        background: 'radial-gradient(600px at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.1), transparent)',
        transition: 'background-position 0.2s',
      }}
    />
  );
}