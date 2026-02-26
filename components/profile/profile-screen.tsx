"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronRight, ShoppingCart, Heart, MapPin, Globe, Headphones, LogOut, Package, Mic, Camera, FileText } from "lucide-react"

interface ProfileScreenProps {
  userRole: "customer" | "owner"
}

export function ProfileScreen({ userRole }: ProfileScreenProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await supabase.auth.signOut()
      window.location.href = "/auth/login"
    }
  }

  const handleMenuClick = (label: string) => {
    if (label === "Update Stock") {
      window.location.href = "/voice-chat"
    } else {
      alert(`${label} feature coming soon!`)
    }
  }

  const menuItems = userRole === "customer" ? [
    { icon: ShoppingCart, label: "Reservations", badge: "3" },
    { icon: Heart, label: "Favorite Shops" },
    { icon: MapPin, label: "Addresses" },
    { icon: Globe, label: "Language", value: "English" },
    { icon: Headphones, label: "Support" },
  ] : [
    { icon: ShoppingCart, label: "My Shop Details" },
    { icon: MapPin, label: "Shop Location" },
    { icon: Globe, label: "Language", value: "English" },
    { icon: Headphones, label: "Support" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileHeader>
        <div className="text-xl font-bold text-primary-foreground">Profile</div>
      </MobileHeader>

      <div className="p-4 space-y-6">
        {/* Profile Info */}
        <Card className="locana-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user?.user_metadata?.full_name || user?.email || "User"}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-primary capitalize">{userRole}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Only for Shop Owners */}
        {userRole === "owner" && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
            <Card className="locana-shadow cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4" onClick={() => handleMenuClick("Update Stock")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-primary" />
                    <div>
                      <span className="font-medium text-base">Update Stock</span>
                      <p className="text-sm text-muted-foreground">Voice, Image & Manual updates</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
          
        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Card key={index} className="locana-shadow cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-2" onClick={() => handleMenuClick(item.label)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.value && <span className="text-sm text-muted-foreground">{item.value}</span>}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Logout - no white background, but keeps red hover effect */}
        <div className="px-1">
          <Button 
            variant="ghost" 
            className="w-full h-12 text-red-600 hover:bg-red-50 justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-5 mr-2" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
