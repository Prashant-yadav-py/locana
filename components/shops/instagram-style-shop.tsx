"use client"

import React, { useState, useCallback, memo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Box, Sphere } from "@react-three/drei"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AvailabilityBadge } from "@/components/ui/availability-badge"
import { MapPin, Phone, Plus, Minus, ShoppingCart, MessageCircle, Grid3X3, List, Heart, Share2, Navigation } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

interface InstagramStyleShopProps {
  shop: any
  onBack: () => void
  onContact?: () => void
  onRequestItem?: () => void
}

function ThreeDProductGrid({ products }: { products: any[] }) {
  return (
    <div className="h-96 w-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls enableZoom={false} enablePan={false} />

        {products.map((product, index) => {
          const x = ((index % 3) - 1) * 3
          const y = Math.floor(index / 3) * -2.5 + 2
          const z = Math.random() * 2 - 1

          return (
            <group key={index} position={[x, y, z]}>
              <Box args={[2, 2, 0.2]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#ffffff" />
              </Box>
              <Text
                position={[0, -0.8, 0.2]}
                fontSize={0.3}
                color="#333333"
                anchorX="center"
                anchorY="middle"
              >
                {product.name}
              </Text>
              <Text
                position={[0, -1.2, 0.2]}
                fontSize={0.25}
                color="#ef4444"
                anchorX="center"
                anchorY="middle"
              >
                {product.price}
              </Text>
              <Sphere args={[0.1]} position={[0.8, 0.8, 0.2]}>
                <meshStandardMaterial color={product.availability === "available" ? "#22c55e" : "#f59e0b"} />
              </Sphere>
            </group>
          )
        })}
      </Canvas>
    </div>
  )
}

export const InstagramStyleShop = memo(function InstagramStyleShop({ shop, onBack, onContact, onRequestItem }: InstagramStyleShopProps) {
  const { addToCart } = useCart()
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({})
  const [activeTab, setActiveTab] = useState("grid")
  const [viewMode, setViewMode] = useState<"grid" | "3d">("grid")
  const [isFollowing, setIsFollowing] = useState(false)

  const products = shop.items || [
    {
      id: "1",
      name: "Dolo 650",
      description: "Strip of 15 tablets",
      price: 28,
      mrp: 35,
      availability: "available" as const,
      category: "Medicines",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
      likes: 24,
      isLiked: false,
    },
    {
      id: "2",
      name: "Paracetamol 500mg",
      description: "Strip of 10 tablets",
      price: 15,
      mrp: 22,
      availability: "available" as const,
      category: "Medicines",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
      likes: 18,
      isLiked: true,
    },
    {
      id: "3",
      name: "Crocin Advance",
      description: "Strip of 15 tablets",
      price: 32,
      mrp: 40,
      availability: "low-stock" as const,
      category: "Medicines",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop",
      likes: 31,
      isLiked: false,
    },
    {
      id: "4",
      name: "Vicks VapoRub",
      description: "25ml bottle",
      price: 89,
      mrp: 95,
      availability: "available" as const,
      category: "Medicines",
      image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop",
      likes: 42,
      isLiked: true,
    },
    {
      id: "5",
      name: "Hand Sanitizer",
      description: "500ml bottle",
      price: 120,
      mrp: 150,
      availability: "available" as const,
      category: "Health & Hygiene",
      image: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&h=400&fit=crop",
      likes: 15,
      isLiked: false,
    },
    {
      id: "6",
      name: "Face Mask",
      description: "Pack of 50",
      price: 250,
      mrp: 300,
      availability: "low-stock" as const,
      category: "Health & Hygiene",
      image: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&h=400&fit=crop",
      likes: 28,
      isLiked: false,
    },
  ]

  const updateQuantity = useCallback((productId: string, change: number) => {
    const product = products.find(p => p.id === productId)
    if (change > 0 && addToCart && product) {
      addToCart(product, shop.name)
    }
    setSelectedItems((prev) => {
      const current = prev[productId] || 0
      const newQuantity = Math.max(0, current + change)
      if (newQuantity === 0) {
        const { [productId]: removed, ...rest } = prev
        return rest
      }
      return { ...prev, [productId]: newQuantity }
    })
  }, [addToCart, shop.name, products])

  const toggleLike = useCallback((productId: string) => {
    // In a real app, this would update the backend
    console.log(`Toggled like for product ${productId}`)
  }, [])

  const openDirections = useCallback(() => {
    const destination = encodeURIComponent(shop.address)
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`
    window.open(googleMapsUrl, '_blank')
  }, [shop.address])

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0)
  }

  const getTotalPrice = () => {
    return Object.entries(selectedItems).reduce((sum, [productId, qty]) => {
      const product = products.find((p) => p.id === productId)
      return sum + (product?.price || 0) * qty
    }, 0)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader showBack onBack={onBack}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <div className="text-xl font-bold text-primary-foreground">Locana</div>
        </div>
      </MobileHeader>

      <div className="p-4 space-y-4">
        {/* Shop Profile Header - Instagram Style */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-4 border-orange-500">
                <img
                  src={shop.image || "/placeholder.svg?height=80&width=80&query=pharmacy store"}
                  alt={shop.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 mb-1">{shop.name}</h1>
                <p className="text-sm text-gray-600 mb-2">
                  {shop.category} • {shop.distance}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{products.length}</div>
                    <div className="text-gray-600">Items</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{shop.reviewCount || 127}</div>
                    <div className="text-gray-600">Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">4.5</div>
                    <div className="text-gray-600">Rating</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <Button className="flex-1 rounded-xl h-10 bg-primary text-white" onClick={openDirections}>
                <Navigation className="w-4 h-4 mr-2" />
                Directions
              </Button>
              <Button variant="outline" className="flex-1 border-2 rounded-xl h-10 bg-transparent" onClick={onContact}>
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-2 rounded-xl h-10 bg-transparent"
                onClick={onRequestItem}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{shop.address}</span>
            </div>
          </CardContent>
        </Card>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              className="rounded-xl"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "3d" ? "default" : "outline"}
              size="sm"
              className="rounded-xl"
              onClick={() => setViewMode("3d")}
            >
              <List className="w-4 h-4 mr-2" />
              3D View
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="rounded-xl">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Products Display */}
        {viewMode === "3d" ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">3D Product View</h3>
              <ThreeDProductGrid products={products} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {products.map((product, index) => (
              <Card
                key={product.id || index}
                className="border-0 shadow-sm aspect-square relative overflow-hidden group cursor-pointer"
              >
                <CardContent className="p-0 h-full">
                  <div className="relative h-full">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Instagram-style overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="flex items-center gap-4 text-white">
                        <div className="flex items-center gap-1">
                          <Heart className="w-5 h-5" />
                          <span className="text-sm font-medium">{product.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShoppingCart className="w-5 h-5" />
                          <span className="text-sm font-medium">₹{product.price}</span>
                        </div>
                      </div>
                    </div>

                    {/* Availability indicator */}
                    <div className="absolute top-2 right-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          product.availability === "available"
                            ? "bg-green-500"
                            : product.availability === "low-stock"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                    </div>

                    {/* Like button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 left-2 p-1 rounded-full bg-white/80 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(product.id || index.toString())
                      }}
                    >
                      <Heart className={`w-4 h-4 ${product.isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Product Details Modal/List */}
        <div className="space-y-3">
          {products.slice(0, 3).map((product, index) => (
            <Card key={product.id || index} className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-base text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </div>
                      <AvailabilityBadge status={product.availability} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-bold text-lg">₹{product.price}</span>
                        {product.mrp && <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => toggleLike(product.id || index.toString())}
                        >
                          <Heart
                            className={`w-4 h-4 ${product.isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                          />
                        </Button>

                        {selectedItems[product.id || index] ? (
                          <div className="flex items-center gap-2" data-testid="quantity-control">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0 border-2 rounded-lg bg-transparent"
                              onClick={() => updateQuantity(product.id || index.toString(), -1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-6 text-center text-sm font-bold">
                              {selectedItems[product.id || index]}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0 border-2 rounded-lg bg-transparent"
                              onClick={() => updateQuantity(product.id || index.toString(), 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className="rounded-lg px-4 h-8"
                            onClick={() => updateQuantity(product.id || index.toString(), 1)}
                            data-testid="add-to-cart"
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-900">{getTotalItems()} items selected</p>
              <p className="text-2xl font-bold text-primary">₹{getTotalPrice()}</p>
            </div>
            <Button className="rounded-xl px-6 h-12 shadow-lg">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Reserve Items
            </Button>
          </div>
        </div>
      )}
    </div>
  )
})