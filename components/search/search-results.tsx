"use client"

import { useState } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AvailabilityBadge } from "@/components/ui/availability-badge"
import { Search, Filter, ArrowUpDown, MapPin } from "lucide-react"

interface SearchResultsProps {
  query: string
  onBack: () => void
}

export function SearchResults({ query, onBack }: SearchResultsProps) {
  const [searchQuery, setSearchQuery] = useState(query)
  const [sortBy, setSortBy] = useState<"distance" | "price" | "rating">("distance")

  const searchResults = [
    {
      name: "Dolo 650 - strip of 15",
      image: "/medicine-tablet.png",
      packSize: "Strip of 15 tablets",
      priceRange: "₹28–₹35",
      availability: "available" as const,
      shops: [
        { name: "Raj Medical", distance: "0.6 km", price: "₹28", inStock: true },
        { name: "City Pharmacy", distance: "1.2 km", price: "₹30", inStock: true },
        { name: "Health Plus", distance: "1.8 km", price: "₹35", inStock: false },
      ],
    },
    {
      name: "Paracetamol 500mg",
      image: "/paracetamol-tablets.png",
      packSize: "Strip of 10 tablets",
      priceRange: "₹15–₹22",
      availability: "available" as const,
      shops: [
        { name: "Raj Medical", distance: "0.6 km", price: "₹15", inStock: true },
        { name: "Apollo Pharmacy", distance: "2.1 km", price: "₹18", inStock: true },
        { name: "MedPlus", distance: "2.5 km", price: "₹22", inStock: true },
      ],
    },
    {
      name: "Crocin Advance",
      image: "/crocin-tablets.jpg",
      packSize: "Strip of 15 tablets",
      priceRange: "₹32–₹40",
      availability: "low-stock" as const,
      shops: [
        { name: "City Pharmacy", distance: "1.2 km", price: "₹32", inStock: true },
        { name: "Health Plus", distance: "1.8 km", price: "₹35", inStock: false },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileHeader showBack onBack={onBack}>
        <div className="text-lg font-semibold text-primary-foreground">Search Results</div>
      </MobileHeader>

      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products, shops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </div>

        {/* Filter and Sort */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Sort: {sortBy}
          </Button>
        </div>

        {/* Results Summary */}
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm text-muted-foreground">
            Found <span className="font-semibold text-foreground">{searchResults.length} products</span> in{" "}
            <span className="font-semibold text-foreground">8 shops</span> within 3 km
          </p>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {searchResults.map((result, index) => (
            <Card key={index} className="locana-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img
                      src={result.image || "/placeholder.svg"}
                      alt={result.name}
                      className="w-12 h-12 object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm">{result.name}</h3>
                        <p className="text-xs text-muted-foreground">{result.packSize}</p>
                      </div>
                      <AvailabilityBadge status={result.availability} />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-primary font-semibold">{result.priceRange}</span>
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs bg-transparent">
                        Compare Prices
                      </Button>
                    </div>

                    {/* Shop List */}
                    <div className="space-y-2">
                      {result.shops.slice(0, 2).map((shop, shopIndex) => (
                        <div key={shopIndex} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{shop.name}</span>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span>{shop.distance}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-primary">{shop.price}</span>
                            <Badge
                              variant={shop.inStock ? "default" : "secondary"}
                              className={`text-xs ${shop.inStock ? "bg-accent text-accent-foreground" : ""}`}
                            >
                              {shop.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {result.shops.length > 2 && (
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-primary p-0">
                          +{result.shops.length - 2} more shops
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
