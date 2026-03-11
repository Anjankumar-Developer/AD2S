import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function WireframeGlobe() {
    const meshRef = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.05
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.08
        }
    })

    return (
        <mesh ref={meshRef} scale={1.8}>
            <icosahedronGeometry args={[4, 2]} />
            <meshBasicMaterial
                color="#0f172a"
                wireframe
                transparent
                opacity={0.05}
            />
        </mesh>
    )
}

function FloatingOrb({ position, speed, scale }: { position: [number, number, number], speed: number, scale: number }) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const initialY = position[1]

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * speed) * 0.4
            meshRef.current.rotation.x += 0.002
            meshRef.current.rotation.y += 0.003
        }
    })

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial
                color="#94a3b8"
                wireframe
                transparent
                opacity={0.15}
            />
        </mesh>
    )
}

export default function ParticleBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 15], fov: 60 }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 2]}
            >
                <WireframeGlobe />
                <FloatingOrb position={[-6, 4, -5]} speed={0.4} scale={0.8} />
                <FloatingOrb position={[8, -3, -8]} speed={0.3} scale={1.2} />
                <FloatingOrb position={[-7, -5, -10]} speed={0.5} scale={1.5} />
                <FloatingOrb position={[6, 5, -6]} speed={0.6} scale={0.6} />
            </Canvas>
        </div>
    )
}
