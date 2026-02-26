"use client"

interface NearbyPlace {
  place_id: string
  name: string
  vicinity: string
  rating?: number
  types: string[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  opening_hours?: {
    open_now: boolean
  }
  photos?: Array<{
    photo_reference: string
  }>
}

interface SearchResult {
  shops: Array<{
    id: string
    name: string
    address: string
    latitude: number
    longitude: number
    distance: number
    category: string
    rating?: number
    isOpen?: boolean
    phone?: string
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

// Mock data for demonstration (replace with actual API calls)
const mockShops = [
  {
    id: "1",
    name: "Raj Medical & General Store",
    address: "123 Main Street, Delhi",
    latitude: 28.6139,
    longitude: 77.209,
    category: "Medical",
    rating: 4.5,
    isOpen: true,
    phone: "+91-9876543210",
  },
  {
    id: "2",
    name: "Fresh Fruits Corner",
    address: "456 Market Road, Mumbai",
    latitude: 19.076,
    longitude: 72.8777,
    category: "Grocery",
    rating: 4.2,
    isOpen: true,
    phone: "+91-9876543211",
  },
  {
    id: "3",
    name: "Tech Electronics Hub",
    address: "789 Tech Street, Bangalore",
    latitude: 12.9716,
    longitude: 77.5946,
    category: "Electronics",
    rating: 4.3,
    isOpen: false,
    phone: "+91-9876543212",
  },
]

const mockProducts = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    shopName: "Raj Medical & General Store",
    price: "₹25.00",
    availability: "In Stock",
  },
  {
    id: "2",
    name: "Fresh Apples",
    shopName: "Fresh Fruits Corner",
    price: "₹180.00",
    availability: "In Stock",
  },
  {
    id: "3",
    name: "Smartphone",
    shopName: "Tech Electronics Hub",
    price: "₹15999.00",
    availability: "In Stock",
  },
]

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers
  return Math.round(distance * 100) / 100 // Round to 2 decimal places
}

export async function searchNearby(
  query: string,
  userLat: number,
  userLng: number,
  radius = 5000, // 5km default
): Promise<SearchResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const filteredShops = mockShops
    .map((shop) => ({
      ...shop,
      distance: calculateDistance(userLat, userLng, shop.latitude, shop.longitude),
    }))
    .filter((shop) => {
      const matchesQuery =
        query === "" ||
        shop.name.toLowerCase().includes(query.toLowerCase()) ||
        shop.category.toLowerCase().includes(query.toLowerCase())
      const withinRadius = shop.distance <= radius / 1000 // Convert meters to km
      return matchesQuery && withinRadius
    })
    .sort((a, b) => a.distance - b.distance)

  const filteredProducts = mockProducts
    .map((product) => {
      const shop = mockShops.find((s) => s.name === product.shopName)
      return {
        ...product,
        distance: shop ? calculateDistance(userLat, userLng, shop.latitude, shop.longitude) : 999,
      }
    })
    .filter((product) => {
      const matchesQuery = query === "" || product.name.toLowerCase().includes(query.toLowerCase())
      const withinRadius = product.distance <= radius / 1000
      return matchesQuery && withinRadius
    })
    .sort((a, b) => a.distance - b.distance)

  return {
    shops: filteredShops,
    products: filteredProducts,
  }
}

export async function getNearbyShops(userLat: number, userLng: number, category?: string, radius = 5000) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return mockShops
    .map((shop) => ({
      ...shop,
      distance: calculateDistance(userLat, userLng, shop.latitude, shop.longitude),
    }))
    .filter((shop) => {
      const matchesCategory = !category || shop.category.toLowerCase() === category.toLowerCase()
      const withinRadius = shop.distance <= radius / 1000
      return matchesCategory && withinRadius
    })
    .sort((a, b) => a.distance - b.distance)
}

// For future Google Places API integration
// export async function searchWithGooglePlaces(
//   query: string,
//   userLat: number,
//   userLng: number,
//   radius = 5000,
// ): Promise<NearbyPlace[]> {
//   // This would be the actual Google Places API call
//   // const response = await fetch(
//   //   `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLat},${userLng}&radius=${radius}&keyword=${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
//   // );
//   // return response.json();

//   // For now, return empty array as placeholder
//   return []
// }
