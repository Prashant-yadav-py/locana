"use client"

import React, { createContext, useContext, useState, useCallback, useMemo } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  shopName: string
  image: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: any, shopName: string) => void
  updateCartQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  totalCartItems: number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = useCallback((item: any, shopName: string) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prev, { ...item, quantity: 1, shopName }]
    })
  }, [])

  const updateCartQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id))
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ))
    }
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const totalCartItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }, [cartItems])

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    totalCartItems,
    clearCart
  }), [cartItems, addToCart, updateCartQuantity, removeFromCart, totalCartItems, clearCart])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}