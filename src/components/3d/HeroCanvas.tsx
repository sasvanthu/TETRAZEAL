import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

export const HeroCanvas = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#00ffcc" />
        
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <Sphere args={[1.5, 64, 64]} position={[2, 0, -2]}>
            <MeshDistortMaterial
              color="#4f46e5"
              attach="material"
              distort={0.4}
              speed={2}
              roughness={0.2}
              metalness={0.8}
            />
          </Sphere>
        </Float>

        <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
          <Sphere args={[1, 64, 64]} position={[-2, 1, -3]}>
            <MeshDistortMaterial
              color="#10b981"
              attach="material"
              distort={0.3}
              speed={3}
              roughness={0.1}
              metalness={0.9}
            />
          </Sphere>
        </Float>
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};
