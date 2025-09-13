import { useEffect, useRef } from 'react';

const SimpleVantaBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let effect: any = null;

    const initVanta = async () => {
      try {
        const VANTA = await import('vanta/dist/vanta.net.min.js');
        
        const THREE = await import('three');
        
        if (containerRef.current) {
          console.log('Initializing Vanta.js NET effect...');
          
          effect = VANTA.NET({
            el: containerRef.current,
            mouseControls: true,
            touchControls: true,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            points: window.innerWidth < 768 ? 8 : 12,
            maxDistance: 20,
            spacing: 15,
            color: '#0166f8',
            color2: '#ff94ff',
            backgroundColor: 'transparent',
            showDots: true,
            showLines: true,
            lineWidth: 1.2,
            dotSize: 2.0,
            gyroControls: false,
            THREE: THREE,
          });
          
          console.log('Vanta.js effect created successfully');
        }
      } catch (error) {
        console.error('Error initializing Vanta.js:', error);
        if (containerRef.current) {
          containerRef.current.style.background = 'linear-gradient(135deg, hsl(217 95% 49% / 0.1) 0%, hsl(300 100% 79% / 0.1) 100%)';
        }
      }
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

export default SimpleVantaBackground;
