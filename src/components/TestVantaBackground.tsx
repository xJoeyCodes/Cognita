import { useEffect, useRef } from 'react';

const TestVantaBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('TestVantaBackground mounted');
    
    const initVanta = async () => {
      try {
        console.log('Starting Vanta.js test...');
        
        const VANTA = await import('vanta/dist/vanta.net.min.js');
        console.log('Vanta.js imported:', VANTA);
        
        const THREE = await import('three');
        console.log('Three.js imported:', THREE);
        
        if (containerRef.current) {
          console.log('Container found, creating effect...');
          
          const effect = VANTA.NET({
            el: containerRef.current,
            mouseControls: true,
            touchControls: true,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            points: 5, // Very few points for testing
            maxDistance: 20,
            spacing: 15,
            color: '#ff0000', // Bright red for visibility
            color2: '#00ff00', // Bright green for visibility
            backgroundColor: 'transparent',
            showDots: true,
            showLines: true,
            lineWidth: 2.0,
            dotSize: 3.0,
            gyroControls: false,
            THREE: THREE,
          });
          
          console.log('Vanta effect created:', effect);
          
          setTimeout(() => {
            const canvas = containerRef.current?.querySelector('canvas');
            console.log('Canvas found:', canvas);
            if (canvas) {
              console.log('Canvas dimensions:', canvas.width, canvas.height);
            }
          }, 1000);
          
        } else {
          console.error('Container ref is null');
        }
        
      } catch (error) {
        console.error('Vanta.js test failed:', error);
      }
    };

    setTimeout(initVanta, 500);

  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-gray-100">
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ 
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -10,
          backgroundColor: 'rgba(255, 0, 0, 0.1)', // Red background to see if container is there
        }}
      />
      {/* Debug text overlay */}
      <div className="fixed top-4 left-4 bg-black text-white p-2 rounded z-50 text-sm">
        Vanta Test - Check console for logs
      </div>
    </div>
  );
};

export default TestVantaBackground;

