import { useEffect, useRef, useState } from 'react';

const VantaBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    if (!isReducedMotion && containerRef.current) {
      Promise.all([
        import('vanta/dist/vanta.net.min.js'),
        import('three')
      ]).then(([VANTA, THREE]) => {
        console.log('Vanta.js and Three.js loaded successfully');
        
        const effect = VANTA.NET({
          el: containerRef.current,
          mouseControls: true,
          touchControls: true,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          points: window.innerWidth < 768 ? 8 : 12, // Responsive points
          maxDistance: 20,
          spacing: 15,
          color: '#0166f8', // Primary blue from theme
          color2: '#ff94ff', // Accent pink from theme
          backgroundColor: 'transparent',
          showDots: true,
          showLines: true,
          lineWidth: 1.2,
          dotSize: 2.0,
          gyroControls: false,
          THREE: THREE,
        });

        setVantaEffect(effect);
        console.log('Vanta effect initialized');

        return () => {
          if (effect && effect.destroy) {
            effect.destroy();
          }
        };
      }).catch((error) => {
        console.error('Failed to load Vanta.js or Three.js:', error);
        if (containerRef.current) {
          containerRef.current.style.background = 'linear-gradient(135deg, hsl(217 95% 49% / 0.1) 0%, hsl(300 100% 79% / 0.1) 100%)';
        }
      });
    }

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      if (vantaEffect && vantaEffect.destroy) {
        vantaEffect.destroy();
      }
    };
  }, [isReducedMotion, vantaEffect]);

  if (isReducedMotion) {
    return (
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, hsl(217 95% 49% / 0.1) 0%, hsl(300 100% 79% / 0.1) 100%)',
        }}
      />
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 vanta-canvas"
      style={{ 
        minHeight: '100vh',
        minWidth: '100vw',
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    />
  );
};

export default VantaBackground;
