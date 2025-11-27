import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image, Text, useScroll, ScrollControls, Scroll } from '@react-three/drei';
import * as THREE from 'three';
import { AppState, PhotoData } from '../types';
import { PHOTOS } from '../constants';

interface Props {
  setAppState: (state: AppState) => void;
}

const PhotoFrame = ({ data, index }: { data: PhotoData, index: number }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={new THREE.Vector3(...data.position)} rotation={new THREE.Euler(...data.rotation)}>
      <Image
        url={data.url}
        scale={hovered ? [2.2, 3] : [2, 2.8]}
        transparent
        opacity={0.9}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
      <Text
        position={[0, -1.6, 0.1]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        maxWidth={2}
      >
        {data.caption}
      </Text>
      <Text
        position={[0, -1.8, 0.1]}
        fontSize={0.1}
        color="#ffb7b2"
        anchorX="center"
      >
        {data.date}
      </Text>
    </group>
  );
};

const MemoryLane = ({ setAppState }: Props) => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Smooth camera movement based on scroll
    // The scroll.offset goes from 0 to 1
    const targetZ = -scroll.offset * 25; 
    state.camera.position.lerp(new THREE.Vector3(0, 0, 2 + targetZ), 0.1);
    
    // Check if end reached
    if (scroll.offset > 0.95) {
       // Automatic transition handled by UI button in overlay usually, 
       // but here we can trigger it or wait for user to click button
    }
  });

  return (
    <group ref={groupRef}>
      {PHOTOS.map((photo, i) => (
        <PhotoFrame key={photo.id} data={photo} index={i} />
      ))}
      {/* Finish Line Text */}
      <Text
        position={[0, 0, -25]}
        fontSize={0.5}
        color="#ffcc00"
      >
        Our Future Awaits...
      </Text>
    </group>
  );
};

const MemoryScene: React.FC<Props> = ({ setAppState }) => {
  return (
    <ScrollControls pages={3} damping={0.3}>
        <MemoryLane setAppState={setAppState} />
        <Scroll html>
            <div className="w-full h-full pointer-events-none flex flex-col justify-end items-center pb-12">
                 {/* CSS driven fade out on scroll could go here */}
            </div>
            {/* Absolute positioned button at the very end of scroll height */}
            <div 
              style={{ position: 'absolute', top: '290vh', width: '100%', display:'flex', justifyContent:'center' }}
              className="pointer-events-auto"
            >
                <button 
                    onClick={() => setAppState(AppState.CODE)}
                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-full hover:bg-white/20 transition-all duration-500 font-sans"
                >
                    Compile Our Love &rarr;
                </button>
            </div>
        </Scroll>
    </ScrollControls>
  );
};

export default MemoryScene;