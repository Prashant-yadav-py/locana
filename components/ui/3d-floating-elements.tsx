"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, Environment } from "@react-three/drei"
import { Suspense, useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

interface FloatingElementProps {
  position: [number, number, number]
  color: string
  size: number
}

function FloatingElement({ position, color, size }: FloatingElementProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Sphere ref={meshRef} args={[size]} position={position}>
      <meshStandardMaterial color={color} transparent opacity={0.7} />
    </Sphere>
  )
}

export function ThreeDFloatingElements() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />

          <FloatingElement position={[-3, 2, -2]} color="#ef4444" size={0.3} />
          <FloatingElement position={[3, -1, -3]} color="#3b82f6" size={0.2} />
          <FloatingElement position={[-2, -2, -1]} color="#10b981" size={0.25} />
          <FloatingElement position={[2, 3, -2]} color="#f59e0b" size={0.15} />
          <FloatingElement position={[0, 1, -4]} color="#8b5cf6" size={0.2} />

          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
        </Suspense>
      </Canvas>
    </div>
  )
}
