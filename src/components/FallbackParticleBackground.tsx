import { useEffect, useRef } from 'react';

const FallbackParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      if (containerRef.current) {
        containerRef.current.style.background = 'linear-gradient(135deg, hsl(217 95% 49% / 0.1) 0%, hsl(300 100% 79% / 0.1) 100%)';
      }
      return;
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes particleFloat {
        0%, 100% { 
          transform: translateY(0px) translateX(0px) scale(1);
          opacity: 0.3;
        }
        25% { 
          transform: translateY(-20px) translateX(10px) scale(1.1);
          opacity: 0.8;
        }
        50% { 
          transform: translateY(-40px) translateX(-5px) scale(0.9);
          opacity: 0.6;
        }
        75% { 
          transform: translateY(-20px) translateX(-10px) scale(1.05);
          opacity: 0.7;
        }
      }
      
      @keyframes particlePulse {
        0%, 100% { 
          transform: scale(1);
          opacity: 0.4;
        }
        50% { 
          transform: scale(1.2);
          opacity: 0.8;
        }
      }
      
      .particle {
        position: absolute;
        border-radius: 50%;
        background: linear-gradient(45deg, #0166f8, #ff94ff);
        animation: particleFloat 8s ease-in-out infinite, particlePulse 4s ease-in-out infinite;
        pointer-events: none;
        will-change: transform, opacity;
      }
      
      .particle:nth-child(odd) {
        animation-delay: -2s;
        background: linear-gradient(45deg, #ff94ff, #0166f8);
      }
      
      .particle:nth-child(3n) {
        animation-delay: -4s;
        border-radius: 20%;
      }
      
      .particle:nth-child(5n) {
        animation-delay: -6s;
        background: linear-gradient(45deg, #0166f8, #0166f8);
      }
    `;
    document.head.appendChild(style);

    if (containerRef.current) {
      const particleCount = window.innerWidth < 768 ? 100 : 200;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        const size = Math.random() * 4 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particle.style.animationDelay = Math.random() * 8 + 's';
        
        containerRef.current.appendChild(particle);
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
        background: 'linear-gradient(135deg, hsl(217 95% 49% / 0.02) 0%, hsl(300 100% 79% / 0.02) 100%)',
      }}
    />
  );
};

export default FallbackParticleBackground;

