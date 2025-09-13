import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMediaQuery } from 'react-responsive';
import * as THREE from 'three';
import FallbackParticleBackground from './FallbackParticleBackground';

// Particle field component
function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const { camera, viewport } = useThree();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  
  // Particle count based on device
  const particleCount = isMobile ? 2000 : 5000;
  
  // Create particle positions
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Theme colors from CSS variables
    const primaryColor = new THREE.Color('#0166f8'); // Primary blue
    const accentColor = new THREE.Color('#ff94ff'); // Accent pink
    
    for (let i = 0; i < particleCount; i++) {
      // Random positions in a sphere
      const radius = 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random color between primary and accent
      const colorMix = Math.random();
      const color = primaryColor.clone().lerp(accentColor, colorMix);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, [particleCount]);

  // Animation frame
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += 0.0005;
      meshRef.current.rotation.x += 0.0002;
      
      // Parallax effect based on camera position
      const parallaxFactor = 0.5;
      meshRef.current.position.x = camera.position.x * parallaxFactor;
      meshRef.current.position.y = camera.position.y * parallaxFactor;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Scroll-based parallax component
function ScrollParallax() {
  const { camera } = useThree();
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const parallaxDepth = scrollY * 0.1; // Adjust for depth effect
      camera.position.z = 50 + parallaxDepth;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [camera]);

  return null;
}

// Main particle field background component
const ParticleFieldBackground = () => {
  const [hasError, setHasError] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const prefersReducedMotion = useMediaQuery({ query: '(prefers-reduced-motion: reduce)' });

  // If there's an error or reduced motion is preferred, show fallback
  if (hasError || prefersReducedMotion) {
    return <FallbackParticleBackground />;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75 }}
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
        }}
        className="three-canvas"
        onError={() => setHasError(true)}
      >
        {/* Ambient light for subtle illumination */}
        <ambientLight intensity={0.2} />
        
        {/* Particle field */}
        <ParticleField />
        
        {/* Scroll parallax effect */}
        <ScrollParallax />
        
        {/* Orbit controls for mouse interaction */}
        {!isMobile && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={-Math.PI / 2}
            maxAzimuthAngle={Math.PI / 4}
            minAzimuthAngle={-Math.PI / 4}
            enableDamping={true}
            dampingFactor={0.05}
          />
        )}
      </Canvas>
    </div>
  );
};

export default ParticleFieldBackground;
