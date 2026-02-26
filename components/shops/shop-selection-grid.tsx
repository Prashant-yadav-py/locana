"use client"

import { useState } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { ShopCard } from "@/components/ui/shop-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Filter, ArrowUpDown, RefreshCw } from "lucide-react"

interface ShopSelectionGridProps {
  onShopSelect: (shopId: string) => void
  onBack: () => void
}

export function ShopSelectionGrid({ onShopSelect, onBack }: ShopSelectionGridProps) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"distance" | "price" | "rating" | "open">("distance")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filters, setFilters] = useState({
    maxDistance: [5],
    minRating: [4],
    openNow: true,
    hasDelivery: false,
    acceptsReservations: true,
  })

  const filterChips = [
    { id: "distance", label: "Distance" },
    { id: "price", label: "Price" },
    { id: "open", label: "Open now" },
    { id: "rating", label: "Rating" },
  ]

  const shops = [
    {
      id: "1",
      name: "prince general ",
      category: "Pharmacy",
      rating: 4.5,
      distance: "0.6 km",
      status: "Open till 11 PM",
      inStockItems: 27,
      image: "/pharmacy-storefront.png",
      isOpen: true,
      priceRange: "₹₹",
      hasDelivery: true,
    },
    {
      id: "2",
      name: "Mahalaxmi Kirana",
      category: "Grocery",
      rating: 4.2,
      distance: "1.2 km",
      status: "Open till 10 PM",
      inStockItems: 45,
      image: "/grocery-store-front.jpg",
      isOpen: true,
      priceRange: "₹",
      hasDelivery: false,
    },
    {
      id: "3",
      name: "Fresh Bakery Corner",
      category: "Bakery",
      rating: 4.7,
      distance: "0.8 km",
      status: "Open till 10:30 PM",
      inStockItems: 18,
      image: "/bakery-storefront.png",
      isOpen: true,
      priceRange: "₹₹",
      hasDelivery: true,
    },
    {
      id: "4",
      name: "Tech Zone Electronics",
      category: "Electronics",
      rating: 4.3,
      distance: "1.5 km",
      status: "Open till 9 PM",
      inStockItems: 32,
      image: "/electronics-store-interior.png",
      isOpen: true,
      priceRange: "₹₹₹",
      hasDelivery: false,
    },
    {
      id: "5",
      name: "Green Vegetables",
      category: "Vegetables",
      rating: 4.1,
      distance: "2.1 km",
      status: "Closed - Opens 6 AM",
      inStockItems: 0,
      image: "/vegetable-store.jpg",
      isOpen: false,
      priceRange: "₹",
      hasDelivery: false,
    },
    {
      id: "6",
      name: "City Stationery",
      category: "Stationery",
      rating: 4.4,
      distance: "1.8 km",
      status: "Open till 8 PM",
      inStockItems: 24,
      image: "/stationery-shop.png",
      isOpen: true,
      priceRange: "₹₹",
      hasDelivery: true,
    },
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const filteredShops = shops.filter((shop) => {
    if (filters.openNow && !shop.isOpen) return false
    if (shop.rating < filters.minRating[0]) return false
    const distance = Number.parseFloat(shop.distance.split(" ")[0])
    if (distance > filters.maxDistance[0]) return false
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileHeader showBack onBack={onBack}>
        <div className="text-xl font-bold text-primary-foreground">Select Shop</div>
      </MobileHeader>

      <div className="p-4 space-y-4">
        {/* Filter and Sort Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="bg-transparent whitespace-nowrap">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Filter Shops</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                {/* Distance Filter */}
                <div className="space-y-3">
                  <Label>Maximum Distance: {filters.maxDistance[0]} km</Label>
                  <Slider
                    value={filters.maxDistance}
                    onValueChange={(value) => setFilters({ ...filters, maxDistance: value })}
                    max={10}
                    min={0.5}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <Label>Minimum Rating: {filters.minRating[0]} stars</Label>
                  <Slider
                    value={filters.minRating}
                    onValueChange={(value) => setFilters({ ...filters, minRating: value })}
                    max={5}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Toggle Filters */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="open-now">Open Now</Label>
                    <Switch
                      id="open-now"
                      checked={filters.openNow}
                      onCheckedChange={(checked) => setFilters({ ...filters, openNow: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="has-delivery">Has Delivery</Label>
                    <Switch
                      id="has-delivery"
                      checked={filters.hasDelivery}
                      onCheckedChange={(checked) => setFilters({ ...filters, hasDelivery: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="accepts-reservations">Accepts Reservations</Label>
                    <Switch
                      id="accepts-reservations"
                      checked={filters.acceptsReservations}
                      onCheckedChange={(checked) => setFilters({ ...filters, acceptsReservations: checked })}
                    />
                  </div>
                </div>

                <Button className="w-full h-12 rounded-xl">Apply Filters</Button>
              </div>
            </SheetContent>
          </Sheet>

          {filterChips.map((chip) => (
            <Button
              key={chip.id}
              variant={selectedFilter === chip.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(selectedFilter === chip.id ? null : chip.id)}
              className={`whitespace-nowrap ${selectedFilter !== chip.id ? "bg-transparent" : ""}`}
            >
              {chip.label}
              {selectedFilter === chip.id && <ArrowUpDown className="w-3 h-3 ml-1" />}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-transparent whitespace-nowrap"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredShops.length} shops found • {filteredShops.filter((s) => s.isOpen).length} open now
          </p>
          <Badge variant="secondary">{sortBy}</Badge>
        </div>

        {/* Shop Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredShops.map((shop) => (
            <div key={shop.id} onClick={() => onShopSelect(shop.id)}>
              <ShopCard
                name={shop.name}
                category={shop.category}
                rating={shop.rating}
                distance={shop.distance}
                status={shop.status}
                inStockItems={shop.inStockItems}
                image={shop.image}
              />
            </div>
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No shops found matching your filters</p>
            <Button variant="outline" onClick={() => setFilters({ ...filters, openNow: false, minRating: [1] })}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
