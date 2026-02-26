"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Store, ShoppingBag, MapPin } from "lucide-react"

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      icon: <Store className="w-16 h-16 text-red-600" />,
      title: "Welcome to Locana",
      description: "Discover local shops and support your community",
    },
    {
      icon: <ShoppingBag className="w-16 h-16 text-red-600" />,
      title: "Shop Local",
      description: "Browse products from nearby stores and reserve items",
    },
    {
      icon: <MapPin className="w-16 h-16 text-red-600" />,
      title: "Find Nearby",
      description: "Locate shops around you and check real-time availability",
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-8">{steps[currentStep].icon}</div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{steps[currentStep].title}</h1>

          <p className="text-gray-600 mb-8">{steps[currentStep].description}</p>

          <div className="flex justify-center mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${index === currentStep ? "bg-red-600" : "bg-gray-300"}`}
              />
            ))}
          </div>

          <div className="space-y-3">
            <Button onClick={handleNext} className="w-full bg-red-600 hover:bg-red-700">
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                "Get Started"
              )}
            </Button>

            <Button variant="ghost" onClick={handleSkip} className="w-full text-gray-500">
              Skip
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
