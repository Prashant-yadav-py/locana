"use server"

interface LocationResult {
  lat: number
  lng: number
  address: string
}

export async function searchLocation(query: string): Promise<LocationResult[]> {
  // Using mock location data for demo purposes (no API required)
  const mockLocations: LocationResult[] = [
    {
      lat: 28.6139,
      lng: 77.209,
      address: `${query}, Delhi, India`,
    },
    {
      lat: 19.076,
      lng: 72.8777,
      address: `${query}, Mumbai, Maharashtra, India`,
    },
    {
      lat: 12.9716,
      lng: 77.5946,
      address: `${query}, Bangalore, Karnataka, India`,
    },
  ]

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Filter results based on query
  return mockLocations.filter((location) => location.address.toLowerCase().includes(query.toLowerCase()))
}

export async function getCurrentLocation(): Promise<LocationResult | null> {
  // Return default location (Delhi, India)
  return {
    lat: 28.6139,
    lng: 77.209,
    address: "Delhi, India",
  }
}
