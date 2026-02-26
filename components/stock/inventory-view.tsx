"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingUp, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface InventoryItem {
  id: string
  product_name: string
  quantity: number
  unit: string
  stock_status: 'available' | 'low_stock' | 'out_of_stock'
  last_updated: string
}

interface InventoryViewProps {
  shopId: string
}

export function InventoryView({ shopId }: InventoryViewProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInventory()
    
    const supabase = createClient()
    const channel = supabase
      .channel('stock_inventory_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'stock_inventory', filter: `shop_id=eq.${shopId}` },
        () => fetchInventory()
      )
      .subscribe()
    
    return () => { supabase.removeChannel(channel) }
  }, [shopId])

  const fetchInventory = async () => {
    try {
      const response = await fetch(`/api/stock/inventory?shopId=${shopId}`)
      const result = await response.json()
      if (result.success) {
        setInventory(result.data)
      }
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'low_stock': return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) {
    return <div className="text-center py-4 text-sm text-muted-foreground">Loading inventory...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Total Stock
          </span>
          <Badge variant="secondary" className="text-lg">{totalStock} items</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {inventory.length === 0 ? (
          <p className="text-muted-foreground text-center py-4 text-sm">No items in inventory</p>
        ) : (
          <div className="space-y-2">
            {inventory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <Package className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} {item.unit}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(item.stock_status)} text-xs`}>
                  {item.stock_status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
