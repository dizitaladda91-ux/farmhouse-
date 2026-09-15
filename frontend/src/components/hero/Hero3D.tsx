"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, SoftShadows } from "@react-three/drei";
import * as THREE from "three";

// 3D Luxury Farmhouse Mesh Component
function FarmhouseMesh() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle natural breeze movement
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]} scale={0.85}>
      {/* Ground Lawn */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1B3B36" roughness={0.8} />
      </mesh>

      {/* Main Farmhouse Structure */}
      <mesh castShadow receiveShadow position={[0, 1.25, 0]}>
        <boxGeometry args={[4, 2.5, 3]} />
        <meshStandardMaterial color="#2A403A" roughness={0.4} />
      </mesh>

      {/* Slanted Roof */}
      <mesh castShadow position={[0, 2.8, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[3.2, 1.2, 4]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Glass Frontage Window */}
      <mesh position={[0, 1.2, 1.51]}>
        <planeGeometry args={[2.5, 1.6]} />
        <meshStandardMaterial color="#88C0D0" transparent opacity={0.6} metalness={0.8} />
      </mesh>

      {/* Swimming Pool */}
      <mesh position={[0, 0.05, 3.5]}>
        <boxGeometry args={[4.5, 0.1, 2.5]} />
        <meshStandardMaterial color="#0088AA" roughness={0.1} metalness={0.7} />
      </mesh>

      {/* Stylized Trees around Farmhouse */}
      {[-3, 3].map((x, i) => (
        <group key={i} position={[x, 0, -1]}>
          <mesh castShadow position={[0, 1, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 2]} />
            <meshStandardMaterial color="#5E402B" />
          </mesh>
          <mesh castShadow position={[0, 2.2, 0]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#154B3E" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function Hero3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] overflow-hidden bg-gradient-to-b from-[#0F1715] via-[#162521] to-[#0F1715]">
      {/* 3D Canvas Background */}
      {mounted && (
        <div className="absolute inset-0 z-0 opacity-85">
          <Canvas
            shadows
            camera={{ position: [0, 3, 8], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={1.2}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              color="#FFEAA7"
            />
            <pointLight position={[-4, 3, 2]} intensity={0.8} color="#D4AF37" />
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
              <FarmhouseMesh />
            </Float>
          </Canvas>
        </div>
      )}

      {/* Overlay Glow & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark via-transparent to-luxury-dark/80 z-10 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center pt-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-luxury-emerald/90 border border-luxury-accent/30 backdrop-blur-md mb-6 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-gold-gradient" />
          <span className="text-xs font-semibold uppercase tracking-widest text-luxury-accent font-sans">
            Curated Luxury Real Estate India
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
          Find a Place Worth <span className="gold-gradient-text">Calling Home</span>
        </h1>

        <p className="mt-4 font-sans text-sm sm:text-lg text-gray-300 max-w-2xl font-light leading-relaxed">
          Discover exceptional farmhouses, luxury bungalows, hilltop estates, and beachfront villas across India's most coveted destinations.
        </p>
      </div>
    </div>
  );
}
