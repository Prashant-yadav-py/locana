"use client"

import React, { useState, useEffect, useCallback, memo } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { CategoryChip } from "@/components/ui/category-chip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Mic, Camera } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { getShopsByLocation } from "@/lib/location-shops"
// import { ThreeDProductCard } from "@/components/ui/3d-product-card"
// import { ThreeDShopCard } from "@/components/ui/3d-shop-card"
// import { ThreeDFloatingElements } from "@/components/ui/3d-floating-elements"
import { RealTimeSearch } from "@/components/search/real-time-search"
import { InstagramStyleShop } from "@/components/shops/instagram-style-shop"

export const CustomerHome = memo(function CustomerHome() {
  const { addToCart } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedShop, setSelectedShop] = useState<any>(null)
  const [showSearch, setShowSearch] = useState(false)
  const [currentLocation, setCurrentLocation] = useState("Getting location...")
  const [popularShops, setPopularShops] = useState<any[]>([])
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null)

  useEffect(() => {
    setCurrentLocation("Detecting location...")
    setPopularShops([]) // Clear shops until location is detected
    getCurrentLocation()
  }, [])

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setCurrentLocation("Location not supported")
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setUserCoords({ lat: latitude, lng: longitude })
        
        console.log('📍 User Location Detected:', latitude, longitude)
        
        // Get location-based shops using actual user location from database
        const shops = await getShopsByLocation(latitude, longitude, 7) // 7km radius
        console.log('🏪 Shops to display:', shops.map(s => s.name).join(', '))
        console.log('🏪 Total shops:', shops.length)
        setPopularShops(shops)
        
        // Simple location display
        setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        
        // Try geocoding in background
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { 'User-Agent': 'Locana-App' } }
          )
          const data = await response.json()
          if (data?.display_name) {
            const parts = data.display_name.split(',')
            setCurrentLocation(parts.slice(0, 3).join(','))
          }
        } catch (e) {
          console.log('Geocoding failed:', e)
        }
      },
      async (error) => {
        console.error('❌ Location error:', error.message)
        setCurrentLocation("Location access denied")
        // Show default shops only on error
        const fallbackShops = await getShopsByLocation(0, 0, 7)
        setPopularShops(fallbackShops)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }, [])

  const categories = [
    { id: "grocery", label: "Grocery" },
    { id: "pharmacy", label: "Pharmacy" },
    { id: "bakery", label: "Bakery" },
    { id: "stationery", label: "Stationery" },
    { id: "electronics", label: "Electronics" },
    { id: "dairy", label: "Dairy" },
    { id: "vegetables", label: "Vegetables" },
  ]



  const trendingProducts = [
    {
      name: "Dolo 650",
      price: "₹28",
      originalPrice: "₹35",
      availability: "available",
      shopCount: 5,
      image: "/medicine-tablet.png",
    },
    {
      name: "Aashirvaad Atta 5kg",
      price: "₹259",
      originalPrice: "₹280",
      availability: "low-stock",
      shopCount: 3,
      image: "/flour-bag.png",
    },
    {
      name: "Mother Dairy Milk 1L",
      price: "₹56",
      originalPrice: "₹60",
      availability: "available",
      shopCount: 8,
      image: "/milk-packet.jpg",
    },
    {
      name: "Maggi 2-min Noodles",
      price: "₹12",
      originalPrice: "₹15",
      availability: "available",
      shopCount: 6,
      image: "/noodles-packet.jpg",
    },
  ]

  const quickActions = [
    { label: "Nearby Pharmacies", icon: "🏥", count: 12 },
    { label: "Open Now", icon: "🕐", count: 28 },
    { label: "Fast Delivery", icon: "⚡", count: 15 },
    { label: "Best Rated", icon: "⭐", count: 20 },
  ]

  const handleShopClick = useCallback((shop: any) => {
    console.log("[v0] Shop clicked:", shop.name)
    setSelectedShop(shop)
  }, [])

  const handleContactOwner = useCallback((shop: any) => {
    alert(`Contacting ${shop.owner} at ${shop.phone}`)
  }, [])

  const handleRequestItem = useCallback((shop: any) => {
    alert(`Request item from ${shop.name}`)
  }, [])

  if (selectedShop) {
    return (
      <InstagramStyleShop
        shop={selectedShop}
        onBack={() => setSelectedShop(null)}
        onContact={() => handleContactOwner(selectedShop)}
        onRequestItem={() => handleRequestItem(selectedShop)}
        onAddToCart={addToCart}
      />
    )
  }

  if (showSearch) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader showNotifications>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowSearch(false)} className="text-primary-foreground">
              ← Back
            </Button>
            <div className="text-xl font-bold text-primary-foreground">Search Nearby</div>
          </div>
        </MobileHeader>

        <div className="p-4 pb-20">
          <RealTimeSearch />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* <ThreeDFloatingElements /> */}

      <MobileHeader showNotifications>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <div className="text-xl font-bold text-primary-foreground">Locana</div>
        </div>
      </MobileHeader>

      <div className="p-4 space-y-6 pb-20 relative z-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search products, shops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearch(true)}
            className="pl-12 pr-24 h-14 rounded-2xl border-2 border-gray-100 bg-white/90 backdrop-blur-sm shadow-sm text-base"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
            <Button size="sm" variant="ghost" className="p-2 rounded-xl">
              <Mic className="w-5 h-5 text-primary" />
            </Button>
            <Button size="sm" variant="ghost" className="p-2 rounded-xl">
              <Camera className="w-5 h-5 text-primary" />
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1 text-gray-900">Search from nearby</h2>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <p className="text-sm text-gray-600">{currentLocation}</p>
                </div>
                <p className="text-sm text-gray-800 font-medium">{popularShops.length} shops nearby • {popularShops.filter(s => s.isOpen).length} open now</p>
                {userCoords && (
                  <p className="text-xs text-gray-500 mt-1">📍 {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}</p>
                )}
              </div>
              <Button
                className="rounded-2xl h-12 px-6 shadow-lg bg-[#E23744] hover:bg-[#E23744]/90 text-white transition-all duration-200"
                onClick={() => setShowSearch(true)}
                data-testid="gps-button"
              >
                <MapPin className="w-4 h-4 mr-2" />
                GPS
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
                data-testid="quick-action"
                role="button"
                tabIndex={0}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <div className="font-semibold text-base text-gray-900">{action.label}</div>
                  <div className="text-sm text-primary font-medium">{action.count} available</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Categories</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <CategoryChip
                key={category.id}
                label={category.label}
                isSelected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Popular near you</h3>
            <Button variant="ghost" size="sm" className="text-primary font-semibold">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {popularShops.map((shop, index) => (
              <Card key={index} className="p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleShopClick(shop)}>
                <h4 className="font-bold">{shop.name}</h4>
                <p className="text-sm text-gray-600">{shop.category} • {shop.distance}</p>
                <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" onClick={() => handleContactOwner(shop)}>Contact</Button>
                  <Button size="sm" variant="outline" onClick={() => handleRequestItem(shop)}>Request</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Trending products</h3>
            <Button variant="ghost" size="sm" className="text-primary font-semibold">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {trendingProducts.map((product, index) => (
              <Card key={index} className="p-4">
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-primary font-bold">{product.price}</p>
                <p className="text-sm text-gray-600">{product.shopCount} shops</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Recent Searches</h3>
          <div className="flex flex-wrap gap-3">
            {["Paracetamol", "Bread", "Milk", "Vegetables"].map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="rounded-full border-2 h-10 px-4 font-medium bg-transparent"
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})
