"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus, Minus, Search, Upload } from "lucide-react"
import { PRODUCT_CATALOG, CATEGORIES, type CatalogProduct } from "@/lib/product-catalog"
import { createClient } from "@/lib/supabase/client"

interface ManualUpdateModalProps {
  onClose: () => void
  shopId: string
  onSuccess?: () => void
}

export function ManualUpdateModal({ onClose, shopId, onSuccess }: ManualUpdateModalProps) {
  const [mode, setMode] = useState<'select' | 'custom'>('select')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null)
  const [customProduct, setCustomProduct] = useState({ name: '', price: '', image: '' })
  const [quantity, setQuantity] = useState(1)
  const [stockStatus, setStockStatus] = useState<'available' | 'low' | 'out'>('available')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState("")
  const supabase = createClient()

  const filteredProducts = PRODUCT_CATALOG.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSubmit = async () => {
    setIsProcessing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setResult('Please login first')
        setIsProcessing(false)
        return
      }

      let productData
      if (mode === 'select' && selectedProduct) {
        productData = {
          name: selectedProduct.name,
          price: selectedProduct.commonPrices[0],
          category: selectedProduct.category
        }
      } else if (mode === 'custom' && customProduct.name && customProduct.price) {
        productData = {
          name: customProduct.name,
          price: parseFloat(customProduct.price),
          category: 'Other'
        }
      } else {
        setResult('Please select or enter product details')
        setIsProcessing(false)
        return
      }

      const stockStatusMap = { available: 'available', low: 'low_stock', out: 'out_of_stock' }

      // Insert/Update stock_inventory
      const { error } = await supabase
        .from('stock_inventory')
        .upsert({
          shop_id: shopId,
          product_name: productData.name,
          category: productData.category,
          quantity: quantity,
          unit: 'pieces',
          price: productData.price,
          stock_status: stockStatusMap[stockStatus]
        }, { onConflict: 'shop_id,product_name' })

      if (error) throw error

      setResult(`✅ ${productData.name} updated successfully!`)
      onSuccess?.()
      setTimeout(() => onClose(), 1500)
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || 'Failed to update stock'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-md my-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Manual Update</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Mode Selection */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={mode === 'select' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setMode('select')}
            >
              Select from List
            </Button>
            <Button
              variant={mode === 'custom' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setMode('custom')}
            >
              Custom Product
            </Button>
          </div>

          {mode === 'select' ? (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {CATEGORIES.map(cat => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat)}
                    className="whitespace-nowrap"
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      selectedProduct?.id === product.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                    <p className="text-sm font-semibold truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">₹{product.commonPrices[0]}</p>
                  </div>
                ))}
              </div>

              {selectedProduct && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold">Selected: {selectedProduct.name}</p>
                  <p className="text-xs text-gray-600">Price: ₹{selectedProduct.commonPrices[0]}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="customName">Product Name *</Label>
                <Input
                  id="customName"
                  placeholder="Enter product name"
                  value={customProduct.name}
                  onChange={(e) => setCustomProduct({...customProduct, name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="customPrice">Price (₹) *</Label>
                <Input
                  id="customPrice"
                  type="number"
                  placeholder="0"
                  value={customProduct.price}
                  onChange={(e) => setCustomProduct({...customProduct, price: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="customImage">Product Image URL</Label>
                <Input
                  id="customImage"
                  placeholder="Paste image URL or leave empty"
                  value={customProduct.image}
                  onChange={(e) => setCustomProduct({...customProduct, image: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">Optional: Add product image URL</p>
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="mt-4">
            <Label>Stock Status *</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button
                type="button"
                size="sm"
                variant={stockStatus === 'available' ? 'default' : 'outline'}
                className={stockStatus === 'available' ? 'bg-green-600 hover:bg-green-700' : ''}
                onClick={() => setStockStatus('available')}
              >
                Available
              </Button>
              <Button
                type="button"
                size="sm"
                variant={stockStatus === 'low' ? 'default' : 'outline'}
                className={stockStatus === 'low' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                onClick={() => setStockStatus('low')}
              >
                Low Stock
              </Button>
              <Button
                type="button"
                size="sm"
                variant={stockStatus === 'out' ? 'default' : 'outline'}
                className={stockStatus === 'out' ? 'bg-red-600 hover:bg-red-700' : ''}
                onClick={() => setStockStatus('out')}
              >
                Out of Stock
              </Button>
            </div>
          </div>

          {result && (
            <div className={`p-3 rounded-lg mt-4 ${
              result.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="text-sm">{result}</p>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isProcessing || (mode === 'select' && !selectedProduct) || (mode === 'custom' && (!customProduct.name || !customProduct.price))}
            className="w-full mt-4"
            size="lg"
          >
            {isProcessing ? "Updating..." : "Update Stock"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}