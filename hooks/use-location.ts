"use client"

import { useState, useEffect } from "react"

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
}

interface LocationError {
  code: number
  message: string
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [error, setError] = useState<LocationError | null>(null)
  const [loading, setLoading] = useState(false)

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: "Geolocation is not supported by this browser.",
      })
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
        setLoading(false)
      },
      (error) => {
        setError({
          code: error.code,
          message: error.message,
        })
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  return {
    location,
    error,
    loading,
    refetch: getCurrentLocation,
  }
}
