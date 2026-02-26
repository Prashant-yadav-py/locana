"use client"

import type React from "react"

import { useState } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Camera, Upload, Save, X } from "lucide-react"

interface AddProductProps {
  onBack: () => void
  onSave: (product: any) => void
}

export function AddProduct({ onBack, onSave }: AddProductProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Medicines",
    mrp: "",
    sellingPrice: "",
    quantity: "",
    sku: "",
    available: true,
    image: null as File | null,
  })

  const categories = ["Medicines", "Grocery", "Dairy", "Personal Care", "Baby Care", "Electronics", "Clothes"]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
    }
  }

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.mrp || !formData.sellingPrice || !formData.quantity) {
      alert("Please fill in all required fields")
      return
    }

    const product = {
      ...formData,
      mrp: Number.parseFloat(formData.mrp),
      sellingPrice: Number.parseFloat(formData.sellingPrice),
      quantity: Number.parseInt(formData.quantity),
      id: Date.now().toString(),
      reserved: 0,
      lowStock: Number.parseInt(formData.quantity) < 10,
      lastUpdated: "Just now",
    }

    onSave(product)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileHeader showBack onBack={onBack} title="Add New Product" />

      <div className="p-4 space-y-4">
        {/* Product Image */}
        <Card className="locana-shadow">
          <CardContent className="p-4">
            <Label className="text-sm font-medium">Product Image</Label>
            <div className="mt-2">
              {formData.image ? (
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(formData.image) || "/placeholder.svg"}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-1 right-1 h-6 w-6 p-0 bg-black/50 hover:bg-black/70"
                    onClick={() => setFormData({ ...formData, image: null })}
                  >
                    <X className="w-3 h-3 text-white" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-muted-foreground rounded-lg hover:bg-muted/50">
                      <Camera className="w-4 h-4" />
                      <span className="text-sm">Take Photo</span>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-muted-foreground rounded-lg hover:bg-muted/50">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="locana-shadow">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold">Basic Information</h3>

            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Dolo 650"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Strip of 15 tablets"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                placeholder="e.g., MED001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Category</Label>
              <RadioGroup
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                className="mt-2"
              >
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <RadioGroupItem value={category} id={category} />
                      <Label htmlFor={category} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card className="locana-shadow">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold">Pricing & Inventory</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mrp">MRP *</Label>
                <Input
                  id="mrp"
                  type="number"
                  placeholder="0"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="sellingPrice">Selling Price *</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  placeholder="0"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="quantity">Initial Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Available for Sale</Label>
                <p className="text-xs text-muted-foreground">Customers can see and reserve this product</p>
              </div>
              <Switch
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button className="w-full h-12" onClick={handleSubmit}>
          <Save className="w-4 h-4 mr-2" />
          Save Product
        </Button>
      </div>
    </div>
  )
}
