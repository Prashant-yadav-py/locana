"use client"

import React, { useState, memo } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  shopName: string
  image: string
}

interface CartScreenProps {
  cartItems: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
}

export const CartScreen = memo(function CartScreen({ cartItems, onUpdateQuantity, onRemoveItem }: CartScreenProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = 25
  const total = subtotal + deliveryFee

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader title="Cart" />
        <div className="flex flex-col items-center justify-center h-96 p-4">
          <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 text-center">Add items from shops to see them here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <MobileHeader title="Cart" />
      
      <div className="p-4 space-y-4">
        {cartItems.map((item) => (
          <Card key={item.id} className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.shopName}</p>
                  <p className="text-lg font-bold text-primary">₹{item.price}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-20 left-0 right-0 bg-white border-t p-4 shadow-2xl">
        <Button className="w-full h-12 rounded-xl bg-primary text-white">
          Proceed to Checkout • ₹{total}
        </Button>
      </div>
    </div>
  )
})