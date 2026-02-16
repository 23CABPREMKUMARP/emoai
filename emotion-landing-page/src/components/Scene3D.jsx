import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedOrb() {
    const meshRef = useRef();

    useFrame((state) => {
        const { clock } = state;
        meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
        meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere ref={meshRef} args={[1, 100, 100]} scale={2}>
                <MeshDistortMaterial
                    color="#ff2d95"
                    attach="material"
                    distort={0.4}
                    speed={3}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
            <group>
                <Sphere args={[1.05, 100, 100]} scale={2.2}>
                    <meshPhongMaterial
                        color="#9d50bb"
                        transparent
                        opacity={0.1}
                        wireframe
                    />
                </Sphere>
            </group>
        </Float>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 -z-10">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ff2d95" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9d50bb" />
                <spotLight position={[0, 5, 0]} intensity={1.5} color="#00f2fe" />
                <AnimatedOrb />
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
                    <planeGeometry args={[100, 100]} />
                    <shadowMaterial transparent opacity={0.2} />
                </mesh>
            </Canvas>
        </div>
    );
}
