"use client"

import { useState, useEffect } from "react"
import { BottomNav } from "@/components/ui/bottom-nav"
import { CustomerHome } from "@/components/home/customer-home"
import { OwnerDashboard } from "@/components/home/owner-dashboard"
import { MapView } from "@/components/map/map-view"
import { ProfileScreen } from "@/components/profile/profile-screen"
import { CartScreen } from "@/components/cart/cart-screen"
import { useCart } from "@/contexts/cart-context"

interface HomeScreenProps {
  userRole: "customer" | "owner"
}

export function HomeScreen({ userRole }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<"home" | "map" | "profile" | "dashboard" | "cart">("home")
  const { cartItems, updateCartQuantity, removeFromCart, totalCartItems } = useCart()

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault()
      if (activeTab !== 'home') {
        setActiveTab('home')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== 'home') {
      window.history.pushState({ tab: activeTab }, '', '')
    }
  }, [activeTab])

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return userRole === "customer" ? <CustomerHome /> : <OwnerDashboard />
      case "map":
        return <MapView userRole={userRole} />
      case "profile":
        return <ProfileScreen userRole={userRole} />
      case "dashboard":
        return <OwnerDashboard />
      case "cart":
        return <CartScreen cartItems={cartItems} onUpdateQuantity={updateCartQuantity} onRemoveItem={removeFromCart} />
      default:
        return <CustomerHome />
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {renderContent()}
      <BottomNav activeTab={activeTab} userRole={userRole} onTabChange={setActiveTab} cartItemCount={totalCartItems} />
    </div>
  )
}
