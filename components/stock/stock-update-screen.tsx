"use client"

import { useState } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, Camera, FileText, ArrowLeft } from "lucide-react"
import { VoiceUpdateModal } from "./voice-update-modal"
import { ImageUpdateModal } from "./image-update-modal"
import { ManualUpdateModal } from "./manual-update-modal"
import { InventoryView } from "./inventory-view"
import { useShop } from "@/hooks/use-shop"

export function StockUpdateScreen() {
  const [activeModal, setActiveModal] = useState<"voice" | "image" | "manual" | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const { shopId, loading } = useShop()

  const updateMethods = [
    {
      id: "voice",
      icon: Mic,
      title: "Voice Update",
      description: "Say 'Maggie stock me add kro' and AI will update",
      color: "bg-blue-500"
    },
    {
      id: "image",
      icon: Camera,
      title: "Image Update",
      description: "Upload product image or bill for AI processing",
      color: "bg-green-500"
    },
    {
      id: "manual",
      icon: FileText,
      title: "Manual Update",
      description: "Enter product details manually",
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.history.back()}
            className="text-primary-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-xl font-bold text-primary-foreground">Update Stock</div>
        </div>
      </MobileHeader>

      <div className="p-4 space-y-6">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : !shopId ? (
          <div className="text-center py-8 text-red-500">Please complete your shop profile first</div>
        ) : (
          <>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">🤖 AI Stock Update</h2>
          <p className="text-muted-foreground">Choose your preferred AI update method</p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">✨ Powered by AI - Voice, Image & Manual updates</p>
          </div>
        </div>

        <InventoryView shopId={shopId} key={refreshKey} />

        <div className="space-y-4">
          {updateMethods.map((method) => {
            const Icon = method.icon
            return (
              <Card 
                key={method.id} 
                className="locana-shadow cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setActiveModal(method.id as any)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${method.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{method.title}</h3>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        </>
        )}
      </div>

      {/* Modals */}
      {activeModal === "voice" && shopId && (
        <VoiceUpdateModal shopId={shopId} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "image" && (
        <ImageUpdateModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "manual" && shopId && (
        <ManualUpdateModal 
          shopId={shopId} 
          onClose={() => setActiveModal(null)}
          onSuccess={() => setRefreshKey(prev => prev + 1)}
        />
      )}
    </div>
  )
}