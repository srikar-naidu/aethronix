"use client";

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, PerspectiveCamera, Environment, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

const CUBIE_SIZE = 0.95;
const GAP = 0.05;

interface CubieProps {
  position: [number, number, number];
  color: string;
}

function Cubie({ position, color }: CubieProps) {
  return (
    <RoundedBox
      args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} 
      radius={0.12} 
      smoothness={4}
      position={position}
    >
      <meshPhysicalMaterial 
        color="#080808" // Deep Obsidian Body
        roughness={0.1}
        metalness={0.8}
        emissive={color}
        emissiveIntensity={0.4}
        clearcoat={1}
      />
    </RoundedBox>
  );
}

function RubikCube() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate 27 cubie positions
  const cubies = useMemo(() => {
    const layout = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          layout.push({
            id: `${x}-${y}-${z}`,
            pos: [x * (CUBIE_SIZE + GAP), y * (CUBIE_SIZE + GAP), z * (CUBIE_SIZE + GAP)] as [number, number, number],
          });
        }
      }
    }
    return layout;
  }, []);

  // Ambient rotation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.2;
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {cubies.map((c) => (
        <Cubie 
          key={c.id} 
          position={c.pos} 
          color="#DC143C" // Crimson Core Glow
        />
      ))}
    </group>
  );
}

export default function RubikScene() {
  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={40} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#DC143C" />
        
        <PresentationControls
          global
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <Float 
            speed={2} 
            rotationIntensity={0.5} 
            floatIntensity={0.5}
            floatingRange={[-0.2, 0.2]}
          >
            <RubikCube />
          </Float>
        </PresentationControls>

        {/* Removed external Environment map to prevent loading crashes */}
      </Canvas>
    </div>
  );
}
