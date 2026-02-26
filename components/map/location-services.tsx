"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Navigation, AlertCircle, CheckCircle } from "lucide-react"

interface LocationServicesProps {
  onLocationGranted: (location: { lat: number; lng: number }) => void
  onLocationDenied: () => void
}

export function LocationServices({ onLocationGranted, onLocationDenied }: LocationServicesProps) {
  const [locationStatus, setLocationStatus] = useState<"requesting" | "granted" | "denied" | "unavailable">(
    "requesting",
  )
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    requestLocation()
  }, [])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable")
      return
    }

    setLocationStatus("requesting")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setCurrentLocation(location)
        setLocationStatus("granted")
        onLocationGranted(location)
      },
      (error) => {
        console.error("[v0] Location error:", error)
        setLocationStatus("denied")
        onLocationDenied()
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  const getStatusIcon = () => {
    switch (locationStatus) {
      case "requesting":
        return <MapPin className="w-8 h-8 text-primary animate-pulse" />
      case "granted":
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case "denied":
      case "unavailable":
        return <AlertCircle className="w-8 h-8 text-red-500" />
    }
  }

  const getStatusMessage = () => {
    switch (locationStatus) {
      case "requesting":
        return {
          title: "Requesting Location Access",
          description: "Please allow location access to find nearby shops and get directions.",
        }
      case "granted":
        return {
          title: "Location Access Granted",
          description: "Great! We can now show you nearby shops and provide navigation.",
        }
      case "denied":
        return {
          title: "Location Access Denied",
          description: "You can still browse shops, but we won't be able to show distance or provide navigation.",
        }
      case "unavailable":
        return {
          title: "Location Not Available",
          description: "Your device doesn't support location services. You can still browse shops manually.",
        }
    }
  }

  const message = getStatusMessage()

  if (locationStatus === "granted") {
    return null // Hide component when location is granted
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm locana-shadow-modal">
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex justify-center">{getStatusIcon()}</div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{message.title}</h3>
            <p className="text-sm text-muted-foreground">{message.description}</p>
          </div>

          <div className="space-y-2">
            {locationStatus === "requesting" && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            )}

            {(locationStatus === "denied" || locationStatus === "unavailable") && (
              <div className="space-y-2">
                <Button onClick={requestLocation} className="w-full">
                  <Navigation className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={onLocationDenied} className="w-full bg-transparent">
                  Continue Without Location
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
