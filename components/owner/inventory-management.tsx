"use client"

import { useState } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Plus, Edit, AlertTriangle, Package, Upload } from "lucide-react"

interface InventoryManagementProps {
  onBack: () => void
  onAddProduct: () => void
  onEditProduct: (productId: string) => void
}

export function InventoryManagement({ onBack, onAddProduct, onEditProduct }: InventoryManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const products = [
    {
      id: "1",
      name: "Dolo 650",
      description: "Strip of 15 tablets",
      category: "Medicines",
      mrp: 35,
      sellingPrice: 28,
      quantity: 25,
      reserved: 3,
      available: true,
      lowStock: false,
      image: "/medicine-tablet.png",
      sku: "MED001",
      lastUpdated: "2 hours ago",
    },
    {
      id: "2",
      name: "Aashirvaad Atta",
      description: "5kg pack",
      category: "Grocery",
      mrp: 280,
      sellingPrice: 259,
      quantity: 8,
      reserved: 1,
      available: true,
      lowStock: true,
      image: "/flour-bag.png",
      sku: "GRO001",
      lastUpdated: "1 day ago",
    },
    {
      id: "3",
      name: "Mother Dairy Milk",
      description: "1L pack",
      category: "Dairy",
      mrp: 60,
      sellingPrice: 56,
      quantity: 0,
      reserved: 0,
      available: false,
      lowStock: false,
      image: "/milk-packet.jpg",
      sku: "DAI001",
      lastUpdated: "3 hours ago",
    },
  ]

  const categories = ["All", "Medicines", "Grocery", "Dairy", "Personal Care", "Baby Care"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "low-stock" && (product.lowStock || product.quantity === 0)) ||
      (activeTab === "out-of-stock" && product.quantity === 0) ||
      (activeTab === "reserved" && product.reserved > 0)
    return matchesSearch && matchesTab
  })

  const getStockStatus = (product: any) => {
    if (product.quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (product.lowStock) return { label: "Low Stock", color: "bg-orange-100 text-orange-800" }
    return { label: "In Stock", color: "bg-green-100 text-green-800" }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileHeader showBack onBack={onBack} title="Inventory Management" />

      <div className="p-4 space-y-4">
        {/* Search and Actions */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowFilters(!showFilters)} className="bg-transparent">
            <Filter className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={onAddProduct}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Package className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({products.length})</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
            <TabsTrigger value="reserved">Reserved</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3 mt-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product)
                return (
                  <Card key={product.id} className="locana-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-12 h-12 object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-sm">{product.name}</h3>
                              <p className="text-xs text-muted-foreground">{product.description}</p>
                              <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch checked={product.available} size="sm" />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="p-1"
                                onClick={() => onEditProduct(product.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{product.category}</Badge>
                            <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
                            {product.reserved > 0 && <Badge variant="outline">{product.reserved} reserved</Badge>}
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <div>
                                <span className="text-primary font-semibold">₹{product.sellingPrice}</span>
                                <span className="text-xs text-muted-foreground line-through ml-1">₹{product.mrp}</span>
                              </div>
                              <div
                                className={`font-medium ${product.quantity === 0 ? "text-red-600" : product.quantity < 10 ? "text-orange-600" : ""}`}
                              >
                                Qty: {product.quantity}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">Updated {product.lastUpdated}</div>
                          </div>

                          {(product.lowStock || product.quantity === 0) && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{product.quantity === 0 ? "Restock immediately" : "Running low on stock"}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products found</p>
                <Button className="mt-4" onClick={onAddProduct}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
