"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useState, useEffect } from "react"
import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import Band from "@/components/band"

// Error boundary component
function ErrorBoundary({ children, fallback }: { children: React.ReactNode, fallback: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

function Scene3D() {
  const [physicsReady, setPhysicsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Preload assets
    try {
      useGLTF.preload("/assets/3d/card.glb");
      useTexture.preload("/assets/images/tag_texture.png");
      console.log("Assets preloaded successfully");
      
      // Give a moment for physics to initialize
      setTimeout(() => {
        setPhysicsReady(true);
      }, 1000);
    } catch (err) {
      console.error("Error preloading assets:", err);
      setError("Failed to load 3D assets");
    }
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">⚠️ 3D Loading Error</div>
          <div className="text-gray-500 text-sm">{error}</div>
          <div className="text-gray-400 text-xs mt-2">
            Please refresh the page or check console for details
          </div>
        </div>
      </div>
    );
  }

  if (!physicsReady) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-400 animate-pulse text-lg mb-2">Initializing 3D Scene...</div>
          <div className="text-gray-500 text-sm">Loading physics engine...</div>
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mt-3"></div>
        </div>
      </div>
    );
  }

  return (
    <Canvas 
      camera={{ position: [0, 0, 13], fov: 25 }} 
      style={{ backgroundColor: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={Math.PI} />
      
      <ErrorBoundary fallback={
        <mesh>
          <boxGeometry args={[2, 3, 0.1]} />
          <meshBasicMaterial color="green" opacity={0.3} transparent />
        </mesh>
      }>
        <Suspense fallback={null}>
          <Physics 
            debug={false} 
            interpolate 
            gravity={[0, -40, 0]} 
            timeStep={1 / 60}
          >
            <Band />
          </Physics>
        </Suspense>
      </ErrorBoundary>

      <Environment background blur={0.75}>
        <Lightformer
          intensity={2}
          color="white"
          position={[0, -1, 5]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[-1, -1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[1, 1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={10}
          color="white"
          position={[-10, 0, 14]}
          rotation={[0, Math.PI / 2, Math.PI / 3]}
          scale={[100, 10, 1]}
        />
      </Environment>
    </Canvas>
  );
}

export default Scene3D;
