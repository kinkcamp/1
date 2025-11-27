import React, { useState, useEffect } from 'react';
import { Html, Float, PerspectiveCamera, CameraShake } from '@react-three/drei';
import { AppState } from '../types';
import { LOVE_CODE } from '../constants';
import { motion } from 'framer-motion';

interface Props {
  setAppState: (state: AppState) => void;
}

const CodeScene: React.FC<Props> = ({ setAppState }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + LOVE_CODE.charAt(index));
      index++;
      if (index >= LOVE_CODE.length - 1) {
        clearInterval(interval);
        setTimeout(() => setShowButton(true), 500);
      }
    }, 25); // Typing speed
    return () => clearInterval(interval);
  }, []);

  const handleRun = () => {
      setIsCompiling(true);
      // Delay state change to allow camera shake to happen
      setTimeout(() => {
          setAppState(AppState.PROPOSAL);
      }, 1500);
  };

  return (
    <group>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      
      {/* Glitch Effect: Camera Shake */}
      <CameraShake 
         yawFrequency={isCompiling ? 2 : 0} 
         pitchFrequency={isCompiling ? 2 : 0} 
         rollFrequency={isCompiling ? 2 : 0}
         intensity={isCompiling ? 1 : 0}
         decay={false} 
         decayRate={0}
      />

      {/* 3D Code Editor Window */}
      <Float speed={isCompiling ? 20 : 1.5} rotationIntensity={isCompiling ? 2 : 0.2} floatIntensity={0.5}>
        <group rotation={[0, -0.1, 0]}>
            {/* Window Chrome */}
            <mesh position={[0, 2.2, 0]}>
                <boxGeometry args={[6.5, 0.4, 0.1]} />
                <meshStandardMaterial color="#333" roughness={0.5} />
            </mesh>
            {/* Window Body */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[6.5, 4, 0.1]} />
                <meshStandardMaterial color="#1e1e1e" roughness={0.8} emissive="#1e1e1e" emissiveIntensity={0.1} />
            </mesh>
            
            {/* Code Content via HTML Overlay */}
            <Html 
                transform 
                position={[0, 0.1, 0.06]} 
                occlude
                scale={0.5}
            >
                <div className="w-[800px] h-[500px] p-8 font-code text-pink-300 text-lg whitespace-pre-wrap leading-relaxed select-none overflow-hidden mix-blend-screen">
                    {displayedText}
                    <span className="animate-pulse">_</span>
                </div>
            </Html>
        </group>
      </Float>

      {/* Compile Button */}
      {showButton && !isCompiling && (
        <Html position={[0, -2.5, 0]} center>
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgb(244, 114, 182)" }}
            onClick={handleRun}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-xl font-sans tracking-wide cursor-pointer"
          >
            RUN SCRIPT
          </motion.button>
        </Html>
      )}
      
      {isCompiling && (
           <Html position={[0, -2.5, 0]} center>
                <div className="text-pink-500 font-code animate-pulse text-xl">COMPILING UNIVERSE...</div>
           </Html>
      )}
    </group>
  );
};

export default CodeScene;