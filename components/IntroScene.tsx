import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';
import { AppState } from '../types';

interface Props {
  setAppState: (state: AppState) => void;
}

const IntroScene: React.FC<Props> = ({ setAppState }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Generate Heart Points using explicit BufferGeometry to avoid mounting issues
  const geometry = useMemo(() => {
    const count = 4000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      const r = Math.random(); // volume filler
      
      // Heart equation
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      
      // Scale down
      const scale = 0.15;
      
      positions[i * 3] = x * scale * Math.sqrt(r); // x
      positions[i * 3 + 1] = y * scale * Math.sqrt(r); // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1; // z depth

      // Colors: Pink to Gold
      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.1 + 0.9, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      if (!clicked) {
        // Pulse animation
        const time = state.clock.getElapsedTime();
        const scale = 1 + Math.sin(time * 2) * 0.05;
        pointsRef.current.scale.set(scale, scale, scale);
        pointsRef.current.rotation.y += delta * 0.2;
      } else {
        // Explosion + Tunnel Zoom animation
        pointsRef.current.scale.x += delta * 15;
        pointsRef.current.scale.y += delta * 15;
        pointsRef.current.scale.z += delta * 15;
        
        const material = pointsRef.current.material as THREE.PointsMaterial;
        if (material) {
            material.opacity = THREE.MathUtils.lerp(material.opacity, 0, delta * 3);
            
            // Move camera forward into the "portal"
            state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 0, delta * 3);

            if (material.opacity <= 0.05) {
               setAppState(AppState.MEMORIES);
            }
        }
      }
    }
  });

  const handleClick = () => {
    setClicked(true);
  };

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <points 
          ref={pointsRef} 
          geometry={geometry}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <pointsMaterial
            size={0.08}
            vertexColors
            transparent
            opacity={1}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </points>
      </Float>

      {!clicked && (
        <Text
          position={[0, -2.5, 0]}
          fontSize={0.25}
          color="#ffb7b2"
          anchorX="center"
          anchorY="middle"
          fillOpacity={hovered ? 1 : 0.7}
        >
          Click the Heart
        </Text>
      )}

      <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} color="#ffd700" />
    </group>
  );
};

export default IntroScene;