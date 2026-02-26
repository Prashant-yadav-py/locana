"use client"

import { useState } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, CreditCard, Wallet, CheckCircle } from "lucide-react"

interface ReservationFlowProps {
  items: any[]
  onBack: () => void
  onComplete: (reservationId: string) => void
}

export function ReservationFlow({ items, onBack, onComplete }: ReservationFlowProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    pickupTime: "30min",
    customerName: "",
    customerPhone: "",
    notes: "",
    paymentMethod: "cash",
    agreeToTerms: false,
  })

  // Mock reservation data
  const reservationDetails = {
    items: [
      { name: "Dolo 650", shop: "Raj Medical", quantity: 2, price: 28 },
      { name: "Paracetamol 500mg", shop: "Local Pharmacy", quantity: 1, price: 12 },
    ],
    totalAmount: 68,
    reservationFee: 5,
    finalAmount: 73,
  }

  const handleSubmit = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Generate reservation ID
      const reservationId = `LOC${Date.now().toString().slice(-6)}`
      onComplete(reservationId)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.customerName && formData.customerPhone && formData.pickupTime
      case 2:
        return formData.paymentMethod && formData.agreeToTerms
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileHeader showBack onBack={onBack} title={step === 3 ? "Reservation Confirmed" : "Reserve Items"} />

      <div className="p-4 space-y-4">
        {/* Progress Indicator */}
        {step < 3 && (
          <div className="flex items-center justify-center space-x-2 mb-6">
            {[1, 2].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 2 && <div className={`w-12 h-0.5 ${step > stepNum ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Customer Details & Pickup Time */}
        {step === 1 && (
          <div className="space-y-4">
            <Card className="locana-shadow">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Customer Details</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="locana-shadow">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Pickup Time</h3>
                <RadioGroup
                  value={formData.pickupTime}
                  onValueChange={(value) => setFormData({ ...formData, pickupTime: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30min" id="30min" />
                    <Label htmlFor="30min" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Within 30 minutes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1hour" id="1hour" />
                    <Label htmlFor="1hour" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Within 1 hour
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2hours" id="2hours" />
                    <Label htmlFor="2hours" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Within 2 hours
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Custom time
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="locana-shadow">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Additional Notes</h3>
                <Textarea
                  placeholder="Any special instructions or requirements..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Payment & Confirmation */}
        {step === 2 && (
          <div className="space-y-4">
            <Card className="locana-shadow">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {reservationDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.shop} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{reservationDetails.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reservation Fee</span>
                      <span>₹{reservationDetails.reservationFee}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-primary">
                      <span>Total</span>
                      <span>₹{reservationDetails.finalAmount}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="locana-shadow">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Payment Method</h3>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Cash on Pickup
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      UPI / Digital Payment
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="locana-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: !!checked })}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the <button className="text-primary underline">Terms & Conditions</button> and{" "}
                    <button className="text-primary underline">Cancellation Policy</button>
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold">Reservation Confirmed!</h2>
              <p className="text-muted-foreground">Your items have been reserved successfully</p>
            </div>

            <Card className="locana-shadow">
              <CardContent className="p-4 text-left">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reservation ID</span>
                    <span className="font-mono font-medium">LOC123456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pickup Time</span>
                    <span>Within 30 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-semibold">₹{reservationDetails.finalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment</span>
                    <span>Cash on Pickup</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You will receive SMS updates about your reservation status
              </p>
              <p className="text-sm text-muted-foreground">Please carry a valid ID for pickup</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4">
          {step < 3 ? (
            <Button className="w-full" onClick={handleSubmit} disabled={!canProceed()}>
              {step === 1 ? "Continue to Payment" : "Confirm Reservation"}
            </Button>
          ) : (
            <div className="space-y-2">
              <Button className="w-full" onClick={() => onComplete("LOC123456")}>
                View Reservation Details
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Reserve More Items
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
