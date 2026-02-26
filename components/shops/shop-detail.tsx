"use client"

import { useState } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AvailabilityBadge } from "@/components/ui/availability-badge"
import { Star, MapPin, Phone, Clock, Navigation, Plus, Minus, ShoppingCart, MessageCircle, User } from "lucide-react"

interface ShopDetailProps {
  shop: any
  onBack: () => void
  onContact?: () => void
  onRequestItem?: () => void
}

export function ShopDetail({ shop, onBack, onContact, onRequestItem }: ShopDetailProps) {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({})
  const [activeTab, setActiveTab] = useState("items")

  const products = shop.items || [
    {
      id: "1",
      name: "Dolo 650",
      description: "Strip of 15 tablets",
      price: 28,
      mrp: 35,
      availability: "available" as const,
      category: "Medicines",
      image: "/medicine-tablet.png",
    },
    {
      id: "2",
      name: "Paracetamol 500mg",
      description: "Strip of 10 tablets",
      price: 15,
      mrp: 22,
      availability: "available" as const,
      category: "Medicines",
      image: "/paracetamol-tablets.png",
    },
    {
      id: "3",
      name: "Crocin Advance",
      description: "Strip of 15 tablets",
      price: 32,
      mrp: 40,
      availability: "low-stock" as const,
      category: "Medicines",
      image: "/crocin-tablets.jpg",
    },
  ]

  const categories = ["All", "Medicines", "Health & Hygiene", "Baby Care", "Personal Care"]

  const reviews = [
    {
      id: "1",
      user: "Priya S.",
      rating: 5,
      comment: "Great service and always has medicines in stock. Very helpful staff.",
      date: "2 days ago",
    },
    {
      id: "2",
      user: "Rajesh K.",
      rating: 4,
      comment: "Good pharmacy with reasonable prices. Quick service.",
      date: "1 week ago",
    },
  ]

  const updateQuantity = (productId: string, change: number) => {
    setSelectedItems((prev) => {
      const current = prev[productId] || 0
      const newQuantity = Math.max(0, current + change)
      if (newQuantity === 0) {
        const { [productId]: removed, ...rest } = prev
        return rest
      }
      return { ...prev, [productId]: newQuantity }
    })
  }

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0)
  }

  const getTotalPrice = () => {
    return Object.entries(selectedItems).reduce((sum, [productId, qty]) => {
      const product = products.find((p) => p.id === productId)
      return sum + (product?.price || 0) * qty
    }, 0)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader showBack onBack={onBack}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <div className="text-xl font-bold text-primary-foreground">Locana</div>
        </div>
      </MobileHeader>

      <div className="p-4 space-y-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src={shop.image || "/placeholder.svg"}
                  alt={shop.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{shop.name}</h1>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="font-medium">
                        {shop.category}
                      </Badge>
                      {shop.isOpen && <Badge className="bg-accent text-white font-medium">Open</Badge>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{shop.rating}</span>
                    <span>({shop.reviewCount || 127})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{shop.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{shop.deliveryTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-2 rounded-xl h-12 bg-transparent"
                onClick={onContact}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Owner
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-2 rounded-xl h-12 bg-transparent"
                onClick={onRequestItem}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Request Item
              </Button>
              <Button size="sm" className="flex-1 rounded-xl h-12 shadow-md">
                <Navigation className="w-4 h-4 mr-2" />
                Navigate
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-accent/5 to-accent/10">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                <p className="text-base font-semibold text-gray-900">{shop.status}</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <p className="text-sm text-gray-600 leading-relaxed">{shop.address}</p>
              </div>
              {shop.owner && (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <p className="text-sm text-gray-600">
                    Owner: <span className="font-medium">{shop.owner}</span>
                  </p>
                </div>
              )}
              {shop.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <p className="text-sm text-gray-600 font-medium">{shop.phone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <div className="px-4">
          <TabsList className="grid w-full grid-cols-3 h-12 rounded-2xl">
            <TabsTrigger value="items" className="rounded-xl font-medium">
              Items
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-xl font-medium">
              About
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-xl font-medium">
              Reviews
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="items" className="px-4 space-y-4 mt-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className="whitespace-nowrap border-2 rounded-xl bg-transparent"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {products.map((product, index) => (
              <Card key={product.id || index} className="border-0 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-base text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{product.description || product.category}</p>
                        </div>
                        <AvailabilityBadge status={product.availability || "available"} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-bold text-lg">
                            {typeof product.price === "string" ? product.price : `₹${product.price}`}
                          </span>
                          {product.mrp && <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>}
                        </div>

                        {product.availability !== "out-of-stock" && (
                          <div className="flex items-center gap-2">
                            {selectedItems[product.id || index] ? (
                              <div className="flex items-center gap-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-10 h-10 p-0 border-2 rounded-xl bg-transparent"
                                  onClick={() => updateQuantity(product.id || index.toString(), -1)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center text-base font-bold">
                                  {selectedItems[product.id || index]}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-10 h-10 p-0 border-2 rounded-xl bg-transparent"
                                  onClick={() => updateQuantity(product.id || index.toString(), 1)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                className="rounded-xl px-6 h-10 shadow-md"
                                onClick={() => updateQuantity(product.id || index.toString(), 1)}
                              >
                                Add
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="about" className="px-4 space-y-4 mt-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">About {shop.name}</h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {shop.description ||
                    "A trusted local business serving the community with quality products and excellent service."}
                </p>
              </div>

              {shop.services && (
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-900">Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {shop.services.map((service: string, index: number) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900">Opening Hours</h4>
                <div className="space-y-2 text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily</span>
                    <span className="font-medium text-gray-900">{shop.timings || "8:00 AM - 10:00 PM"}</span>
                  </div>
                </div>
              </div>

              {shop.owner && (
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-900">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="text-base text-gray-600">
                        Owner: <span className="font-medium">{shop.owner}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <span className="text-base text-gray-600 font-medium">{shop.phone}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="px-4 space-y-4 mt-6">
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="border-0 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-base text-gray-900">{review.user}</h4>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">{review.date}</span>
                  </div>
                  <p className="text-base text-gray-600 leading-relaxed">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-base font-semibold text-gray-900">{getTotalItems()} items selected</p>
              <p className="text-2xl font-bold text-primary">₹{getTotalPrice()}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-2 rounded-xl px-6 h-12 bg-transparent">
                Navigate
              </Button>
              <Button className="rounded-xl px-6 h-12 shadow-lg">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Reserve
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
