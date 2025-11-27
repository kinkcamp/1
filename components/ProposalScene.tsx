import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshReflectorMaterial, Text, Instance, Instances } from '@react-three/drei';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AppState } from '../types';
import { motion } from 'framer-motion';

interface Props {
  setAppState: (state: AppState) => void;
}

// Fireworks Particle System
const Fireworks = () => {
    const count = 1000;
    const root = useRef<THREE.Group>(null);
    const pointsRef = useRef<THREE.Points>(null);

    // Create multiple explosions
    const explosions = useMemo(() => {
        return Array.from({ length: 8 }).map((_, i) => ({
            position: new THREE.Vector3((Math.random() - 0.5) * 15, Math.random() * 8 + 4, (Math.random() - 0.5) * 10),
            color: new THREE.Color().setHSL(Math.random(), 0.9, 0.6),
            delay: Math.random() * 3,
            particles: Array.from({ length: 125 }).map(() => ({
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5), 
                    (Math.random() - 0.5), 
                    (Math.random() - 0.5)
                ).normalize().multiplyScalar(Math.random() * 0.3 + 0.1),
                life: Math.random() * 2 + 1
            }))
        }));
    }, []);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const totalParticles = 8 * 125; // explosions * particles
        const positions = new Float32Array(totalParticles * 3);
        const colors = new Float32Array(totalParticles * 3);
        
        explosions.forEach((exp, i) => {
             exp.particles.forEach((p, j) => {
                 const idx = (i * 125 + j) * 3;
                 // Initial positions (hidden or at center)
                 positions[idx] = exp.position.x;
                 positions[idx + 1] = exp.position.y;
                 positions[idx + 2] = exp.position.z;
                 
                 colors[idx] = exp.color.r;
                 colors[idx + 1] = exp.color.g;
                 colors[idx + 2] = exp.color.b;
             });
        });
        
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [explosions]);

    useFrame((state) => {
        if (!pointsRef.current) return;
        
        const positionAttribute = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const positions = positionAttribute.array as Float32Array;
        const time = state.clock.getElapsedTime();

        explosions.forEach((exp, i) => {
             const t = (time + exp.delay) % 3.5; 
             
             exp.particles.forEach((p, j) => {
                 const idx = (i * 125 + j) * 3;
                 if (t < 0.1) {
                     // Reset to center
                     positions[idx] = exp.position.x;
                     positions[idx+1] = exp.position.y;
                     positions[idx+2] = exp.position.z;
                 } else {
                     // Move particles
                     // Apply Gravity
                     const gravity = -0.005 * (t * t);
                     
                     positions[idx] += p.velocity.x;
                     positions[idx+1] += p.velocity.y + gravity; 
                     positions[idx+2] += p.velocity.z;
                 }
             });
        });
        
        positionAttribute.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} geometry={geometry}>
            <pointsMaterial size={0.15} vertexColors blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.9} />
        </points>
    );
};

const Ring = () => {
    const ringRef = useRef<THREE.Group>(null);
    const diamondRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.y += 0.005;
            ringRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1 + 0.5;
        }
    });

    return (
        <group ref={ringRef} rotation={[0.5, 0, 0]}>
            {/* Gold Band */}
            <mesh>
                <torusGeometry args={[0.8, 0.06, 16, 100]} />
                <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.15} envMapIntensity={1} />
            </mesh>
            {/* Setting */}
            <mesh position={[0, 0.88, 0]}>
                <cylinderGeometry args={[0.1, 0.08, 0.15]} />
                <meshStandardMaterial color="#FFD700" metalness={1