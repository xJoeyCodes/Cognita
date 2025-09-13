import { useEffect, useRef } from 'react';

const WorkingVantaBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let effect: any = null;

    const initVanta = () => {
      if (typeof window === 'undefined') return;
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        if (containerRef.current) {
          containerRef.current.style.background = 'linear-gradient(135deg, hsl(217 95% 49% / 0.1) 0%, hsl(300 100% 79% / 0.1) 100%)';
        }
        return;
      }

      import('vanta/dist/vanta.net.min.js')
        .then((VANTA) => {
          return import('three').then((THREE) => {
            if (containerRef.current) {
              try {
                effect = VANTA.NET({
                  el: containerRef.current,
                  mouseControls: true,
                  touchControls: true,
                  minHeight: 200.00,
                  minWidth: 200.00,
                  scale: 1.00,
                  scaleMobile: 1.00,
                  points: window.innerWidth < 768 ? 6 : 10,
                  maxDistance: 20,
                  spacing: 15,
                  color: '#0166f8',
                  color2: '#ff94ff',
                  backgroundColor: 'transparent',
                  showDots: true,
                  showLines: true,
                  lineWidth: 1.0,
                  dotSize: 1.5,
                  gyroControls: false,
                  THREE: THREE,
                });
                console.log('Vanta.js NET effect initialized successfully');
              } catch (error) {
                console.error('Error creating Vanta effect:', error);
                if (containerRef.current) {
                  containerRef.current.style.background = 'linear-gradient(135deg, hsl(217 95% 49% / 0.1) 0%, hsl(300 100% 79% / 0.1) 100%)';
                }
              }
            }
          });
        })
        .catch((error) => {
          console.error('Failed to load Vanta.js or Three.js:', error);
          if (containerRef.current) {
            containerRef.current.style.background = 'linear-gradient(135deg, hsl(217 95% 49% / 0.1) 0%, hsl(300 100% 79% / 0.1) 100%)';
          }
        });
    };

    const timer = setTimeout(initVanta, 100);

    return () => {
      clearTimeout(timer);
      if (effect && effect.destroy) {
        effect.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10"
      style={{ 
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -10,
      }}
    />
  );
};

export default WorkingVantaBackground;

