"use client"

import { useState } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AvailabilityBadge } from "@/components/ui/availability-badge"
import { Search, Filter, MapPin, Star, Plus, Minus, ShoppingCart } from "lucide-react"

interface ProductSearchProps {
  onBack: () => void
  onReserve: (items: any[]) => void
  onShopSelect: (shopId: string) => void
}

export function ProductSearch({ onBack, onReserve, onShopSelect }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({})
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")

  // Mock search results with cross-shop comparison
  const searchResults = [
    {
      id: "1",
      name: "Dolo 650",
      description: "Strip of 15 tablets",
      category: "Medicines",
      image: "/medicine-tablet.png",
      shops: [
        {
          shopId: "shop1",
          shopName: "Raj Medical",
          distance: "0.6 km",
          rating: 4.5,
          price: 28,
          mrp: 35,
          availability: "available" as const,
          estimatedTime: "15 min",
        },
        {
          shopId: "shop2",
          shopName: "Apollo Pharmacy",
          distance: "1.2 km",
          rating: 4.3,
          price: 32,
          mrp: 35,
          availability: "available" as const,
          estimatedTime: "20 min",
        },
        {
          shopId: "shop3",
          shopName: "MedPlus",
          distance: "0.8 km",
          rating: 4.1,
          price: 30,
          mrp: 35,
          availability: "low-stock" as const,
          estimatedTime: "18 min",
        },
      ],
    },
    {
      id: "2",
      name: "Paracetamol 500mg",
      description: "Strip of 10 tablets",
      category: "Medicines",
      image: "/paracetamol-tablets.png",
      shops: [
        {
          shopId: "shop1",
          shopName: "Raj Medical",
          distance: "0.6 km",
          rating: 4.5,
          price: 15,
          mrp: 22,
          availability: "available" as const,
          estimatedTime: "15 min",
        },
        {
          shopId: "shop4",
          shopName: "Local Pharmacy",
          distance: "0.4 km",
          rating: 4.0,
          price: 12,
          mrp: 22,
          availability: "available" as const,
          estimatedTime: "12 min",
        },
      ],
    },
  ]

  const updateQuantity = (productId: string, shopId: string, change: number) => {
    const key = `${productId}-${shopId}`
    setSelectedItems((prev) => {
      const current = prev[key] || 0
      const newQuantity = Math.max(0, current + change)
      if (newQuantity === 0) {
        const { [key]: removed, ...rest } = prev
        return rest
      }
      return { ...prev, [key]: newQuantity }
    })
  }

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0)
  }

  const getTotalPrice = () => {
    return Object.entries(selectedItems).reduce((sum, [key, qty]) => {
      const [productId, shopId] = key.split("-")
      const product = searchResults.find((p) => p.id === productId)
      const shop = product?.shops.find((s) => s.shopId === shopId)
      return sum + (shop?.price || 0) * qty
    }, 0)
  }

  const filteredResults = searchResults.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <MobileHeader showBack onBack={onBack} title="Search Products" />

      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search medicines, products..."
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

        {/* Filters */}
        {showFilters && (
          <Card className="locana-shadow">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Sort by</h4>
                  <div className="flex gap-2 flex-wrap">
                    {["relevance", "price-low", "price-high", "distance", "rating"].map((sort) => (
                      <Button
                        key={sort}
                        size="sm"
                        variant={sortBy === sort ? "default" : "outline"}
                        onClick={() => setSortBy(sort)}
                        className={sortBy !== sort ? "bg-transparent" : ""}
                      >
                        {sort === "price-low"
                          ? "Price: Low to High"
                          : sort === "price-high"
                            ? "Price: High to Low"
                            : sort.charAt(0).toUpperCase() + sort.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Availability</h4>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="bg-transparent">
                      In Stock
                    </Button>
                    <Button size="sm" variant="outline" className="bg-transparent">
                      Low Stock
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        <div className="space-y-4">
          {filteredResults.map((product) => (
            <Card key={product.id} className="locana-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-12 h-12 object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <Badge variant="secondary" className="mt-1">
                      {product.category}
                    </Badge>
                  </div>
                </div>

                {/* Shop Options */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Available at {product.shops.length} shops
                  </h4>
                  {product.shops.map((shop) => (
                    <div key={shop.shopId} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <button
                              onClick={() => onShopSelect(shop.shopId)}
                              className="font-medium text-sm hover:text-primary"
                            >
                              {shop.shopName}
                            </button>
                            <AvailabilityBadge status={shop.availability} />
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{shop.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{shop.distance}</span>
                            </div>
                            <span>{shop.estimatedTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-semibold">₹{shop.price}</span>
                          <span className="text-xs text-muted-foreground line-through">₹{shop.mrp}</span>
                          <span className="text-xs text-accent">
                            {Math.round(((shop.mrp - shop.price) / shop.mrp) * 100)}% off
                          </span>
                        </div>

                        {shop.availability !== "out-of-stock" && (
                          <div className="flex items-center gap-2">
                            {selectedItems[`${product.id}-${shop.shopId}`] ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-8 h-8 p-0 bg-transparent"
                                  onClick={() => updateQuantity(product.id, shop.shopId, -1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">
                                  {selectedItems[`${product.id}-${shop.shopId}`]}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-8 h-8 p-0 bg-transparent"
                                  onClick={() => updateQuantity(product.id, shop.shopId, 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button size="sm" onClick={() => updateQuantity(product.id, shop.shopId, 1)}>
                                Add
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResults.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No products found for "{searchQuery}"</p>
            <p className="text-sm text-muted-foreground mt-1">Try searching with different keywords</p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{getTotalItems()} items selected</p>
              <p className="text-lg font-bold text-primary">₹{getTotalPrice()}</p>
            </div>
            <Button onClick={() => onReserve(Object.entries(selectedItems))}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Reserve Items
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
