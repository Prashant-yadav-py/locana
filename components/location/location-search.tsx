"use client"

import { useState } from "react"
import { Search, MapPin, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { searchLocation } from "@/lib/location-service-server"

interface LocationResult {
  lat: number
  lng: number
  address: string
}

interface LocationSearchProps {
  onLocationSelect: (location: LocationResult) => void
  placeholder?: string
}

export function LocationSearch({ onLocationSelect, placeholder = "Search for a location..." }: LocationSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<LocationResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const locations = await searchLocation(query)
      setResults(locations)
      setShowResults(true)
    } catch (error) {
      console.error("Search failed:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSelect = (location: LocationResult) => {
    onLocationSelect(location)
    setShowResults(false)
    setQuery(location.address)
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading || !query.trim()} size="sm">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.map((location, index) => (
            <button
              key={index}
              onClick={() => handleLocationSelect(location)}
              className="w-full text-left px-4 py-3 hover:bg-muted flex items-center gap-3 border-b last:border-b-0"
            >
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm">{location.address}</span>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && query && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-50 p-4">
          <div className="text-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mx-auto mb-2" />
            Demo Mode: Try searching for "Delhi", "Mumbai", or "Bangalore"
          </div>
        </div>
      )}
    </div>
  )
}
