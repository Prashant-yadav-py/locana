"use client"

import { useState } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, Phone, MoreVertical, RefreshCw, X } from "lucide-react"

interface ReservationHistoryProps {
  onBack: () => void
  onReservationSelect: (reservationId: string) => void
}

export function ReservationHistory({ onBack, onReservationSelect }: ReservationHistoryProps) {
  const [activeTab, setActiveTab] = useState("active")

  // Mock reservation data
  const reservations = {
    active: [
      {
        id: "LOC123456",
        status: "confirmed",
        items: [
          { name: "Dolo 650", quantity: 2, shop: "Raj Medical" },
          { name: "Paracetamol 500mg", quantity: 1, shop: "Local Pharmacy" },
        ],
        totalAmount: 73,
        pickupTime: "Within 30 minutes",
        reservedAt: "2024-01-15T10:30:00Z",
        expiresAt: "2024-01-15T11:00:00Z",
        shops: ["Raj Medical", "Local Pharmacy"],
      },
      {
        id: "LOC123455",
        status: "ready",
        items: [{ name: "Hand Sanitizer", quantity: 1, shop: "Apollo Pharmacy" }],
        totalAmount: 85,
        pickupTime: "Within 1 hour",
        reservedAt: "2024-01-15T09:15:00Z",
        expiresAt: "2024-01-15T10:15:00Z",
        shops: ["Apollo Pharmacy"],
      },
    ],
    completed: [
      {
        id: "LOC123454",
        status: "completed",
        items: [
          { name: "Crocin Advance", quantity: 1, shop: "MedPlus" },
          { name: "Vitamin D3", quantity: 1, shop: "MedPlus" },
        ],
        totalAmount: 145,
        pickupTime: "Within 2 hours",
        reservedAt: "2024-01-14T14:20:00Z",
        completedAt: "2024-01-14T15:45:00Z",
        shops: ["MedPlus"],
      },
    ],
    cancelled: [
      {
        id: "LOC123453",
        status: "cancelled",
        items: [{ name: "Face Mask", quantity: 2, shop: "Local Store" }],
        totalAmount: 50,
        pickupTime: "Within 1 hour",
        reservedAt: "2024-01-13T16:30:00Z",
        cancelledAt: "2024-01-13T17:00:00Z",
        shops: ["Local Store"],
        cancellationReason: "Items out of stock",
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()

    if (diff <= 0) return "Expired"

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m remaining`
    }
    return `${minutes}m remaining`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const ReservationCard = ({ reservation }: { reservation: any }) => (
    <Card
      className="locana-shadow cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onReservationSelect(reservation.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-medium">{reservation.id}</span>
              <Badge className={getStatusColor(reservation.status)}>
                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{formatDate(reservation.reservedAt)}</p>
          </div>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 mb-3">
          {reservation.items.slice(0, 2).map((item: any, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="text-muted-foreground">{item.shop}</span>
            </div>
          ))}
          {reservation.items.length > 2 && (
            <p className="text-xs text-muted-foreground">+{reservation.items.length - 2} more items</p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">₹{reservation.totalAmount}</span>
          {reservation.status === "confirmed" && reservation.expiresAt && (
            <span className="text-xs text-orange-600">
              <Clock className="w-3 h-3 inline mr-1" />
              {getTimeRemaining(reservation.expiresAt)}
            </span>
          )}
          {reservation.status === "ready" && (
            <span className="text-xs text-green-600 font-medium">Ready for pickup</span>
          )}
        </div>

        {reservation.status === "cancelled" && reservation.cancellationReason && (
          <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
            Reason: {reservation.cancellationReason}
          </div>
        )}

        {(reservation.status === "confirmed" || reservation.status === "ready") && (
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <Phone className="w-3 h-3 mr-1" />
              Call Shop
            </Button>
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <MapPin className="w-3 h-3 mr-1" />
              Navigate
            </Button>
            {reservation.status === "confirmed" && (
              <Button size="sm" variant="outline" className="bg-transparent text-red-600 hover:text-red-700">
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileHeader showBack onBack={onBack} title="My Reservations" />

      <div className="p-4">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active ({reservations.active.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({reservations.completed.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({reservations.cancelled.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-4">
            {reservations.active.length > 0 ? (
              reservations.active.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active reservations</p>
                <Button className="mt-4">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            {reservations.completed.length > 0 ? (
              reservations.completed.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No completed reservations</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4 mt-4">
            {reservations.cancelled.length > 0 ? (
              reservations.cancelled.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No cancelled reservations</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
