import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Loader, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { AppState } from './types';
import IntroScene from './components/IntroScene';
import MemoryScene from './components/MemoryScene';
import CodeScene from './components/CodeScene';
import ProposalScene from './components/ProposalScene';

// UI Overlay Component for non-3D elements (music control, simple prompts)
const UIOverlay = ({ appState }: { appState: AppState }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-6 flex justify-between pointer-events-none z-50 mix-blend-difference text-white/50">
      <div className="font-code text-xs">
        STATUS: {appState === AppState.ACCEPTED ? 'LOVE_COMPILED_SUCCESSFULLY' : 'COMPILING_LOVE...'}
      </div>
      <div className="font-code text-xs">
        SYSTEM: V2.14.26
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INTRO);

  return (
    <div className="w-full h-screen bg-black">
      <UIOverlay appState={appState} />
      
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: false, alpha: false, stencil: false, depth: true }}
        dpr={[1, 2]} // Performance optimization for varied screens
      >
        <color attach="background" args={['#050505']} />
        
        {/* Environment - persistent across scenes */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <fog attach="fog" args={['#050505', 5, 30]} />
        
        <Suspense fallback={null}>
            {/* Conditional Rendering of Scenes */}
            {appState === AppState.INTRO && <IntroScene setAppState={setAppState} />}
            {appState === AppState.MEMORIES && <MemoryScene setAppState={setAppState} />}
            {appState === AppState.CODE && <CodeScene setAppState={setAppState} />}
            {(appState === AppState.PROPOSAL || appState === AppState.ACCEPTED) && (
                <ProposalScene setAppState={setAppState} />
            )}
        </Suspense>

        {/* Orbit controls only allowed in certain scenes if needed, or restricted */}
        {appState === AppState.PROPOSAL && (
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
        )}

        {/* Cinematic Post Processing */}
        <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.5} levels={8} />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>

      </Canvas>

      <Loader 
        containerStyles={{ background: 'black' }}
        innerStyles={{ width: '200px', height: '2px', background: '#333' }}
        barStyles={{ background: '#f472b6', height: '2px' }}
        dataInterpolation={(p) => `Loading Love ${p.toFixed(0)}%`}
      />
    </div>
  );
};

export default App;