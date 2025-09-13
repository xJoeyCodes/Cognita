import { useEffect, useRef } from 'react';


const CSSAnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.1); }
      }
      
      .floating-shape {
        position: absolute;
        border-radius: 50%;
        background: linear-gradient(45deg, #0166f8, #ff94ff);
        animation: float 6s ease-in-out infinite, pulse 4s ease-in-out infinite;
        pointer-events: none;
      }
      
      .floating-shape:nth-child(odd) {
        animation-delay: -2s;
        background: linear-gradient(45deg, #ff94ff, #0166f8);
      }
      
      .floating-shape:nth-child(3n) {
        animation-delay: -4s;
        border-radius: 20%;
      }
    `;
    document.head.appendChild(style);

    if (containerRef.current) {
      for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        shape.style.width = (Math.random() * 60 + 20) + 'px';
        shape.style.height = shape.style.width;
        shape.style.animationDelay = Math.random() * 6 + 's';
        containerRef.current.appendChild(shape);
      }
    }

    return () => {
      document.head.removeChild(style);
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
        background: 'linear-gradient(135deg, hsl(217 95% 49% / 0.05) 0%, hsl(300 100% 79% / 0.05) 100%)',
      }}
    />
  );
};

export default CSSAnimatedBackground;

