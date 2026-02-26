"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Suspense, useRef, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

interface Product3DProps {
  position?: [number, number, number]
  color?: string
}

function Product3D({ position = [0, 0, 0], color = "#ef4444" }: Product3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

interface ThreeDProductCardProps {
  product: {
    name: string
    price: string
    originalPrice?: string
    availability: string
    shopCount: number
    image?: string
  }
  onClick?: () => void
}

export function ThreeDProductCard({ product, onClick }: ThreeDProductCardProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Card
      className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* 3D Product Display */}
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-4 overflow-hidden">
          {isClient ? (
            <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
              <Suspense fallback={null}>
                <Environment preset="studio" />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Product3D color="#ef4444" />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
              </Suspense>
            </Canvas>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-red-500 rounded-lg"></div>
            </div>
          )}
        </div>

        <h4 className="font-semibold text-sm mb-2 line-clamp-2 text-gray-900">{product.name}</h4>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary font-bold text-base">{product.price}</span>
          {product.originalPrice && <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>}
        </div>

        <div className="flex items-center justify-between">
          <Badge variant={product.availability === "available" ? "default" : "secondary"} className="text-xs">
            {product.availability === "available" ? "Available ✓" : "Low stock"}
          </Badge>
          <span className="text-xs text-gray-500 font-medium">{product.shopCount} shops</span>
        </div>
      </CardContent>
    </Card>
  )
}
