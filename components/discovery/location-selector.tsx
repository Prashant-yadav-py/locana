"use client"

import { useState } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Navigation, Clock } from "lucide-react"

interface LocationSelectorProps {
  onLocationSelect: (location: string) => void
  onBack: () => void
}

export function LocationSelector({ onLocationSelect, onBack }: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const recentLocations = [
    { name: "Koramangala", area: "Bangalore", distance: "Current location" },
    { name: "Indiranagar", area: "Bangalore", distance: "2.5 km away" },
    { name: "HSR Layout", area: "Bangalore", distance: "4.2 km away" },
  ]

  const popularAreas = [
    { name: "Whitefield", area: "Bangalore", shopCount: 45, distance: "12 km" },
    { name: "Electronic City", area: "Bangalore", shopCount: 38, distance: "15 km" },
    { name: "Marathahalli", area: "Bangalore", shopCount: 52, distance: "8 km" },
    { name: "Jayanagar", area: "Bangalore", shopCount: 41, distance: "6 km" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileHeader showBack onBack={onBack}>
        <div className="text-lg font-semibold text-primary-foreground">Select Location</div>
      </MobileHeader>

      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search area, landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </div>

        {/* Current Location */}
        <Button className="w-full h-12 rounded-xl justify-start">
          <Navigation className="w-5 h-5 mr-3" />
          Use Current Location
        </Button>

        {/* Recent Locations */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Recent</h3>
          <div className="space-y-2">
            {recentLocations.map((location, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-shadow locana-shadow"
                onClick={() => onLocationSelect(location.name)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{location.name}</h4>
                      <p className="text-xs text-muted-foreground">{location.area}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{location.distance}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Areas */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Popular Areas</h3>
          <div className="space-y-2">
            {popularAreas.map((area, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-shadow locana-shadow"
                onClick={() => onLocationSelect(area.name)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{area.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {area.shopCount} shops • {area.distance} away
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
