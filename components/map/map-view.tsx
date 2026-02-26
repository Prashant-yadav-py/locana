"use client"

import React, { useState, useCallback, memo, useEffect } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navigation, MapPin, Search, Filter, Locate, Star, Phone, Clock, Layers, Route } from "lucide-react"
import { getShopsByLocation } from "@/lib/location-shops"

interface MapViewProps {
  userRole: "customer" | "owner"
  onShopSelect?: (shopId: string) => void
  onNavigate?: (shopId: string) => void
}

export const MapView = memo(function MapView({ userRole, onShopSelect, onNavigate }: MapViewProps) {
  const [selectedShop, setSelectedShop] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [userLocation, setUserLocation] = useState({ lat: 12.9716, lng: 77.5946 })
  const [mapMode, setMapMode] = useState<"shops" | "navigation">("shops")
  const [nearbyShops, setNearbyShops] = useState<any[]>([])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          
          const shops = await getShopsByLocation(latitude, longitude)
          setNearbyShops(shops.map((shop, index) => ({
            ...shop,
            coordinates: { lat: latitude + (index * 0.001), lng: longitude + (index * 0.001) },
            estimatedTime: shop.deliveryTime
          })))
          if (shops.length > 0) {
            setSelectedShop(shops[0].id)
          }
        },
        async (error) => {
          console.log('Map location error:', error.message)
          const shops = await getShopsByLocation(12.9716, 77.5946)
          setNearbyShops(shops.map((shop, index) => ({
            ...shop,
            coordinates: { lat: 12.9716 + (index * 0.001), lng: 77.5946 + (index * 0.001) },
            estimatedTime: shop.deliveryTime
          })))
          if (shops.length > 0) {
            setSelectedShop(shops[0].id)
          }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      )
    }
  }, [])

  const currentShop = nearbyShops.find((shop) => shop.id === selectedShop)

  const navigationRoute = {
    distance: "0.6 km",
    duration: "15 min",
    steps: ["Head north on Current Street", "Turn right onto Main Street", "Destination will be on your left"],
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      Pharmacy: "💊",
      Grocery: "🛒",
      Clothes: "👕",
      Restaurant: "🍽️",
      Bakery: "🥖",
      Electronics: "📱",
    }
    return icons[category as keyof typeof icons] || "🏪"
  }

  const handleLocateUser = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          const shops = await getShopsByLocation(latitude, longitude)
          setNearbyShops(shops.map((shop, index) => ({
            ...shop,
            coordinates: { lat: latitude + (index * 0.001), lng: longitude + (index * 0.001) },
            estimatedTime: shop.deliveryTime
          })))
        }
      )
    }
  }, [])

  const handleStartNavigation = useCallback((shopId: string) => {
    setMapMode("navigation")
    setSelectedShop(shopId)
    onNavigate?.(shopId)
  }, [onNavigate])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileHeader>
        <div className="flex items-center justify-between w-full">
          <div className="text-xl font-bold text-primary-foreground">
            {mapMode === "navigation" ? "Navigation" : "Nearby Shops"}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setMapMode(mapMode === "shops" ? "navigation" : "shops")}
            >
              <Layers className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleLocateUser}
            >
              <Locate className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </MobileHeader>

      {/* Search Bar */}
      {mapMode === "shops" && (
        <div className="p-4 bg-card border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search shops, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        className="relative flex-1"
        style={{ height: mapMode === "navigation" ? "calc(100vh - 200px)" : "calc(100vh - 280px)" }}
      >
        <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-gray-300"></div>
              ))}
            </div>
          </div>

          {/* User Location Marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-500/20 rounded-full animate-ping"></div>
          </div>

          {/* Shop Markers */}
          {mapMode === "shops" &&
            nearbyShops.map((shop, index) => (
              <div
                key={shop.id}
                className={`absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                  selectedShop === shop.id ? "scale-110" : "hover:scale-105"
                } transition-transform`}
                style={{
                  top: `${45 + index * 15}%`,
                  left: `${40 + index * 20}%`,
                }}
                onClick={() => setSelectedShop(shop.id)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg border-2 ${
                    selectedShop === shop.id ? "bg-primary border-primary-foreground" : "bg-white border-gray-300"
                  }`}
                >
                  {getCategoryIcon(shop.category)}
                </div>
                {selectedShop === shop.id && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rotate-45"></div>
                )}
              </div>
            ))}

          {/* Navigation Route */}
          {mapMode === "navigation" && currentShop && (
            <div className="absolute inset-0 z-15">
              <svg className="w-full h-full">
                <path
                  d="M 50% 50% Q 60% 30% 70% 45%"
                  stroke="#D7262F"
                  strokeWidth="4"
                  strokeDasharray="10,5"
                  fill="none"
                  className="animate-pulse"
                />
              </svg>
              {/* Destination Marker */}
              <div className="absolute top-[45%] left-[70%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl shadow-lg animate-bounce">
                  🏁
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        {mapMode === "navigation" && (
          <div className="absolute top-4 left-4 right-4 z-30">
            <Card className="locana-shadow-modal">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Route className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {navigationRoute.distance} • {navigationRoute.duration}
                    </p>
                    <p className="text-sm text-muted-foreground">to {currentShop?.name}</p>
                  </div>
                  <Button size="sm" onClick={() => setMapMode("shops")}>
                    Exit
                  </Button>
                </div>
                <div className="text-sm">
                  <p className="font-medium mb-1">Next:</p>
                  <p>{navigationRoute.steps[0]}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Shop Info Card */}
      {mapMode === "shops" && currentShop && (
        <Card className="absolute bottom-4 left-4 right-4 locana-shadow-modal z-40">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                {getCategoryIcon(currentShop.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{currentShop.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{currentShop.category}</Badge>
                      {currentShop.isOpen ? (
                        <Badge className="bg-accent text-accent-foreground">Open</Badge>
                      ) : (
                        <Badge variant="destructive">Closed</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{currentShop.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{currentShop.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{currentShop.estimatedTime}</span>
                  </div>
                </div>

                <p className="text-sm text-accent font-medium mb-3">In stock: {currentShop.inStockItems} items</p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => onShopSelect?.(currentShop.id)}
                  >
                    View Items
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => handleStartNavigation(currentShop.id)}>
                    <Navigation className="w-4 h-4 mr-2" />
                    Navigate
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Bottom Panel */}
      {mapMode === "navigation" && currentShop && (
        <div className="absolute bottom-0 left-0 right-0 bg-card border-t p-4 z-40">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{currentShop.name}</p>
                <p className="text-sm text-muted-foreground">{currentShop.address}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-transparent">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={() => setMapMode("shops")}>
                  End Navigation
                </Button>
              </div>
            </div>

            <div className="text-sm space-y-1">
              {navigationRoute.steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 ${index === 0 ? "font-medium" : "text-muted-foreground"}`}
                >
                  <div className={`w-2 h-2 rounded-full ${index === 0 ? "bg-primary" : "bg-muted"}`}></div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
