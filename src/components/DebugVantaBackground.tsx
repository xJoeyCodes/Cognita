import { useEffect, useRef, useState } from 'react';


const DebugVantaBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    console.log(info);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  useEffect(() => {
    addDebugInfo('Component mounted');
    
    const initVanta = async () => {
      try {
        addDebugInfo('Starting Vanta.js initialization...');
        
        
        if (!containerRef.current) {
          addDebugInfo('ERROR: Container ref is null');
          return;
        }
        
        addDebugInfo('Container ref found, importing Vanta.js...');
        
        const VANTA = await import('vanta/dist/vanta.net.min.js');
        addDebugInfo('Vanta.js imported successfully');
        
        const THREE = await import('three');
        addDebugInfo('Three.js imported successfully');
        
        addDebugInfo('Creating Vanta effect...');
        
        const effect = VANTA.NET({
          el: containerRef.current,
          mouseControls: true,
          touchControls: true,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          points: 8, // Start with fewer points for testing
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
        
        addDebugInfo('Vanta effect created successfully!');
        
        return () => {
          addDebugInfo('Cleaning up Vanta effect...');
          if (effect && effect.destroy) {
            effect.destroy();
          }
        };
        
      } catch (error) {
        addDebugInfo(`ERROR: ${error}`);
        console.error('Vanta.js error:', error);
        
        if (containerRef.current) {
          containerRef.current.style.background = 'linear-gradient(135deg, hsl(217 95% 49% / 0.1) 0%, hsl(300 100% 79% / 0.1) 100%)';
          addDebugInfo('Applied fallback gradient background');
        }
      }
    };

    const timer = setTimeout(initVanta, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
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
        }}
      />
      
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-sm max-h-64 overflow-y-auto text-xs z-50">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          {debugInfo.map((info, index) => (
            <div key={index} className="mb-1">{info}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DebugVantaBackground;
