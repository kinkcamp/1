import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshReflectorMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { AppState } from '../types';
import { motion } from 'framer-motion';

interface Props {
  setAppState: (state: AppState) => void;
}

// --- FIREWORKS SYSTEM ---
const Fireworks = () => {
    const pointsRef = useRef<THREE.Points>(null);

    // Create 8 explosions, each with 150 particles
    const explosionCount = 8;
    const particlesPerExplosion = 150;
    const totalParticles = explosionCount * particlesPerExplosion;

    const { geometry, velocities, delays } = useMemo(() => {
        const positions = new Float32Array(totalParticles * 3);
        const colors = new Float32Array(totalParticles * 3);
        const velocities = []; // Store as array of Vector3 for ease
        const delays = [];

        for (let i = 0; i < explosionCount; i++) {
            const centerX = (Math.random() - 0.5) * 20;
            const centerY = Math.random() * 5 + 5;
            const centerZ = (Math.random() - 0.5) * 10 - 5;
            const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.6);
            const delay = Math.random() * 2; // Random start time

            for (let j = 0; j < particlesPerExplosion; j++) {
                const idx = (i * particlesPerExplosion + j);
                
                // Start at center
                positions[idx * 3] = centerX;
                positions[idx * 3 + 1] = centerY;
                positions[idx * 3 + 2] = centerZ;

                colors[idx * 3] = color.r;
                colors[idx * 3 + 1] = color.g;
                colors[idx * 3 + 2] = color.b;

                // Explosion velocity sphere
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);
                const speed = Math.random() * 0.2 + 0.05;
                
                const vx = speed * Math.sin(phi) * Math.cos(theta);
                const vy = speed * Math.sin(phi) * Math.sin(theta);
                const vz = speed * Math.cos(phi);

                velocities.push(new THREE.Vector3(vx, vy, vz));
                delays.push(delay);
            }
        }
        
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        return { geometry: geo, velocities, delays };
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;
        
        const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;
        const time = state.clock.getElapsedTime();

        for (let i = 0; i < totalParticles; i++) {
            // Check if explosion has started
            if (time > delays[i]) {
                const age = time - delays[i];
                
                // Reset loop every 3 seconds
                const loopTime = age % 3;
                
                if (loopTime > 0.1) {
                     // Gravity
                    velocities[i].y -= 0.002; 
                    
                    positions[i * 3] += velocities[i].x;
                    positions[i * 3 + 1] += velocities[i].y;
                    positions[i * 3 + 2] += velocities[i].z;
                }
            }
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} geometry={geometry}>
            <pointsMaterial 
                size={0.2} 
                vertexColors 
                blending={THREE.AdditiveBlending} 
                depthWrite={false} 
                transparent 
                opacity={1}
                toneMapped={false}
            />
        </points>
    );
};

// --- 3D RING MODEL ---
const Ring = () => {
    const ringRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (ringRef.current) {
            // Gentle rotation
            ringRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
            // Float up and down
            ringRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
        }
    });

    return (
        <group ref={ringRef} rotation={[0.5, 0, 0]} scale={0.8}>
            {/* Gold Band */}
            <mesh>
                <torusGeometry args={[1, 0.08, 16, 100]} />
                <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} envMapIntensity={1} />
            </mesh>
            {/* Diamond Setting */}
            <mesh position={[0, 1.05, 0]}>
                <cylinderGeometry args={[0.15, 0.1, 0.2, 8]} />
                <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
            </mesh>
            {/* Diamond */}
            <mesh position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]}>
                <octahedronGeometry args={[0.3, 0]} />
                <meshPhysicalMaterial 
                    color="#ffffff" 
                    transmission={1} 
                    opacity={1} 
                    metalness={0} 
                    roughness={0} 
                    ior={2.4} 
                    thickness={0.5}
                    envMapIntensity={2}
                    clearcoat={1}
                />
            </mesh>
        </group>
    );
};

// --- PROPOSAL SCENE ---
const ProposalScene: React.FC<Props> = ({ setAppState }) => {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
  const [displayText, setDisplayText] = useState("");
  const fullText = "Will you marry me?";

  // Typewriter effect
  useEffect(() => {
      let i = 0;
      const timer = setInterval(() => {
          if (i < fullText.length) {
              setDisplayText((prev) => prev + fullText.charAt(i));
              i++;
          } else {
              clearInterval(timer);
          }
      }, 150);
      return () => clearInterval(timer);
  }, []);

  const handleNoHover = () => {
      // Move button to random position within some bounds relative to center
      const x = (Math.random() - 0.5) * 300; // pixels
      const y = (Math.random() - 0.5) * 300;
      setNoBtnPosition({ x, y });
  };

  const handleYes = () => {
      setHasAccepted(true);
      setAppState(AppState.ACCEPTED);
  };

  return (
    <group>
        {/* Lights */}
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffb7b2" />
        <ambientLight intensity={0.2} />
        <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={2} castShadow />

        {/* The Ring in a Crystal Box */}
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group position={[0, 0, 0]}>
                <Ring />
                {/* Crystal Box */}
                <mesh>
                    <boxGeometry args={[3, 3, 3]} />
                    <meshPhysicalMaterial 
                        color="#ffe6f2"
                        transmission={0.6}
                        roughness={0}
                        metalness={0.1}
                        thickness={0.5}
                        transparent
                        opacity={0.3}
                        side={THREE.DoubleSide}
                    />
                </mesh>
                {/* Inner Glow */}
                <pointLight position={[0,0,0]} intensity={0.5} color="#ff69b4" distance={5} />
            </group>
        </Float>

        {/* Floor Reflection */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={40}
                roughness={1}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#101010"
                metalness={0.5}
                mirror={0.5}
            />
        </mesh>

        {/* Particles */}
        <Sparkles count={500} scale={12} size={4} speed={0.4} opacity={0.5} color="#ffb7b2" />

        {/* Fireworks on Accept */}
        {hasAccepted && <Fireworks />}

        {/* UI Overlay */}
        <Html fullscreen style={{ pointerEvents: 'none' }}>
            <div className="w-full h-full flex flex-col items-center justify-center select-none">
                {/* Main Text */}
                <h1 className="text-5xl md:text-7xl font-hand text-pink-200 drop-shadow-[0_0_15px_rgba(244,114,182,0.8)] mb-12 mt-64 transition-all duration-300">
                    {displayText}
                    <span className="animate-pulse text-pink-400">|</span>
                </h1>

                {/* Buttons Container */}
                <div className="relative w-full max-w-md h-32 pointer-events-auto">
                    {!hasAccepted ? (
                        <>
                             {/* YES Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleYes}
                                className="absolute left-1/2 -translate-x-1/2 bg-white/90 text-pink-600 font-sans font-bold text-xl px-12 py-4 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:bg-white hover:shadow-[0_0_50px_rgba(255,192,203,1)] transition-all"
                            >
                                YES
                            </motion.button>

                            {/* NO Button (Run away) */}
                            <motion.button
                                animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                onPointerOver={handleNoHover}
                                className="absolute left-1/2 top-20 -translate-x-1/2 bg-transparent border border-white/30 text-white/50 text-sm px-6 py-2 rounded-full backdrop-blur-sm"
                            >
                                No
                            </motion.button>
                        </>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <p className="text-3xl font-sans text-white font-light tracking-widest uppercase">
                                She Said Yes
                            </p>
                            <p className="text-sm font-code text-pink-400 mt-2">
                                System.commit("FUTURE_TOGETHER");
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </Html>
    </group>
  );
};

export default ProposalScene;