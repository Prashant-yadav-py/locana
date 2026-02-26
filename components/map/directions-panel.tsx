"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation, Clock, MapPin, Phone, X, Route } from "lucide-react"

interface DirectionsPanelProps {
  destination: {
    id: string
    name: string
    address: string
    phone: string
    category: string
  }
  route: {
    distance: string
    duration: string
    steps: string[]
  }
  onClose: () => void
  onCall: () => void
}

export function DirectionsPanel({ destination, route, onClose, onCall }: DirectionsPanelProps) {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div className="space-y-4">
      {/* Route Summary */}
      <Card className="locana-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Route className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">
                  {route.distance} • {route.duration}
                </p>
                <p className="text-sm text-muted-foreground">Fastest route</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">{destination.name}</p>
              <p className="text-sm text-muted-foreground">{destination.address}</p>
            </div>
            <Badge variant="secondary">{destination.category}</Badge>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onCall} className="bg-transparent">
              <Phone className="w-4 h-4 mr-2" />
              Call Shop
            </Button>
            <Button size="sm" className="flex-1">
              <Navigation className="w-4 h-4 mr-2" />
              Start Navigation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Turn-by-Turn Directions */}
      <Card className="locana-shadow">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Directions</h3>
          <div className="space-y-3">
            {route.steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  index === currentStep
                    ? "bg-primary/10 border border-primary/20"
                    : index < currentStep
                      ? "bg-muted/50 text-muted-foreground"
                      : "hover:bg-muted/30"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                    index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : index < currentStep
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? "✓" : index + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${index === currentStep ? "font-medium" : ""}`}>{step}</p>
                  {index === currentStep && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-primary">
                      <Clock className="w-3 h-3" />
                      <span>Current step</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="bg-transparent"
            >
              Previous
            </Button>
            <Button
              size="sm"
              onClick={() => setCurrentStep(Math.min(route.steps.length - 1, currentStep + 1))}
              disabled={currentStep === route.steps.length - 1}
              className="flex-1"
            >
              Next Step
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
