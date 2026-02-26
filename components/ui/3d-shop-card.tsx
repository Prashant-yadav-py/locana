"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Box } from "@react-three/drei"
import { Suspense, useRef, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock, Phone, MessageCircle } from "lucide-react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

interface Shop3DProps {
  position?: [number, number, number]
}

function Shop3D({ position = [0, 0, 0] }: Shop3DProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Shop building */}
      <Box args={[1.5, 1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4f46e5" />
      </Box>
      {/* Shop sign */}
      <Box args={[1.8, 0.3, 0.1]} position={[0, 0.8, 0.6]}>
        <meshStandardMaterial color="#ef4444" />
      </Box>
      {/* Door */}
      <Box args={[0.4, 0.8, 0.1]} position={[0, -0.1, 0.6]}>
        <meshStandardMaterial color="#8b5cf6" />
      </Box>
    </group>
  )
}

interface ThreeDShopCardProps {
  shop: {
    name: string
    category: string
    rating: number
    distance: string
    deliveryTime: string
    inStockItems: number
    isOpen: boolean
    image?: string
  }
  onContact: () => void
  onRequest: () => void
  onClick: () => void
}

export function ThreeDShopCard({ shop, onContact, onRequest, onClick }: ThreeDShopCardProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Card
      className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
      onClick={onClick}
      data-testid="shop-card"
      role="button"
      tabIndex={0}
    >
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* 3D Shop Display */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-100 rounded-2xl flex-shrink-0 overflow-hidden">
            {isClient ? (
              <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
                <Suspense fallback={null}>
                  <Environment preset="city" />
                  <ambientLight intensity={0.6} />
                  <pointLight position={[5, 5, 5]} intensity={0.8} />
                  <Shop3D />
                  <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
                </Suspense>
              </Canvas>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg"></div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-base text-gray-900">{shop.name}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {shop.category}
                  </Badge>
                  {shop.isOpen && (
                    <Badge className="text-xs bg-green-500 text-white font-medium animate-pulse">Open</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{shop.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{shop.distance}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{shop.deliveryTime}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-medium">In-stock: {shop.inStockItems} items</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 px-3 text-xs border-2 rounded-xl bg-transparent hover:bg-blue-50 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    onContact()
                  }}
                  data-testid="contact-owner"
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Contact
                </Button>
                <Button
                  size="sm"
                  className="h-9 px-3 text-xs rounded-xl shadow-md bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRequest()
                  }}
                  data-testid="request-item"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
