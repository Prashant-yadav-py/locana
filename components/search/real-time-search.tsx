"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Loader2, Navigation, Star } from "lucide-react"
import { useLocation } from "@/hooks/use-location"
import { searchNearby } from "@/lib/location-service"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchResult {
  shops: Array<{
    id: string
    name: string
    address: string
    distance: number
    category: string
    rating?: number
    isOpen?: boolean
  }>
  products: Array<{
    id: string
    name: string
    shopName: string
    price: string
    availability: string
    distance: number
  }>
}

export function RealTimeSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult>({ shops: [], products: [] })
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const { location, error: locationError, loading: locationLoading, refetch } = useLocation()
  const debouncedQuery = useDebounce(query, 300)

  const categories = ["All", "Medical", "Grocery", "Electronics", "Bakery", "Pharmacy"]

  const performSearch = useCallback(async () => {
    if (!location) return

    setIsSearching(true)
    try {
      const searchResults = await searchNearby(
        debouncedQuery,
        location.latitude,
        location.longitude,
        5000, // 5km radius
      )

      // Filter by category if selected
      if (selectedCategory && selectedCategory !== "All") {
        searchResults.shops = searchResults.shops.filter((shop) => shop.category === selectedCategory)
      }

      setResults(searchResults)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }, [debouncedQuery, location, selectedCategory])

  useEffect(() => {
    if (location) {
      performSearch()
    }
  }, [performSearch])

  const handleLocationRefresh = () => {
    refetch()
  }

  if (locationLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Getting your location...</p>
        </div>
      </div>
    )
  }

  if (locationError) {
    return (
      <div className="p-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h3 className="font-semibold text-red-800 mb-1">Location Access Required</h3>
              <p className="text-sm text-red-600 mb-3">{locationError.message}</p>
              <Button onClick={handleLocationRefresh} size="sm" className="bg-red-500 hover:bg-red-600">
                <Navigation className="w-4 h-4 mr-2" />
                Enable Location
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          placeholder="Search products, shops nearby..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-12 h-14 rounded-2xl border-2 border-gray-100 bg-white/90 backdrop-blur-sm shadow-sm text-base"
        />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-primary" />
        )}
      </div>

      {/* Location Info */}
      {location && (
        <Card className="border-0 shadow-sm bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">Searching within 5km of your location</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLocationRefresh}
                className="text-blue-600 hover:text-blue-800"
              >
                <Navigation className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category === "All" ? "" : category)}
            className="whitespace-nowrap rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Search Results */}
      <div className="space-y-6">
        {/* Shops Results */}
        {results.shops.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Nearby Shops ({results.shops.length})</h3>
            <div className="space-y-3">
              {results.shops.map((shop) => (
                <Card key={shop.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base text-gray-900">{shop.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{shop.address}</p>

                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {shop.category}
                          </Badge>

                          {shop.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">{shop.rating}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-600">{shop.distance}km away</span>
                          </div>

                          {shop.isOpen !== undefined && (
                            <Badge
                              variant={shop.isOpen ? "default" : "secondary"}
                              className={`text-xs ${shop.isOpen ? "bg-green-500" : "bg-gray-500"}`}
                            >
                              {shop.isOpen ? "Open" : "Closed"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Products Results */}
        {results.products.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Products Found ({results.products.length})</h3>
            <div className="space-y-3">
              {results.products.map((product) => (
                <Card key={product.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">Available at {product.shopName}</p>

                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-lg font-bold text-primary">{product.price}</span>

                          <Badge
                            variant={product.availability === "In Stock" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {product.availability}
                          </Badge>

                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-600">{product.distance}km away</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!isSearching && results.shops.length === 0 && results.products.length === 0 && debouncedQuery && (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-600 mb-1">No results found</h3>
            <p className="text-sm text-gray-500">Try searching for different products or shops nearby</p>
          </div>
        )}
      </div>
    </div>
  )
}
