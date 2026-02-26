import { Badge } from "@/components/ui/badge"
import { Check, AlertTriangle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvailabilityBadgeProps {
  status: string // Made more flexible to accept any string
  className?: string
}

export function AvailabilityBadge({ status, className }: AvailabilityBadgeProps) {
  const normalizeStatus = (status: string): "available" | "low-stock" | "out-of-stock" => {
    const lowerStatus = status.toLowerCase()

    if (lowerStatus.includes("in stock") || lowerStatus === "available") {
      return "available"
    } else if (lowerStatus.includes("low stock") || lowerStatus === "low-stock") {
      return "low-stock"
    } else if (lowerStatus.includes("out of stock") || lowerStatus === "out-of-stock") {
      return "out-of-stock"
    }

    // Default fallback
    return "available"
  }

  const variants = {
    available: {
      icon: Check,
      text: "Available ✓",
      className: "bg-accent text-accent-foreground",
    },
    "low-stock": {
      icon: AlertTriangle,
      text: "Low stock",
      className: "bg-warning text-warning-foreground",
    },
    "out-of-stock": {
      icon: X,
      text: "Out of stock",
      className: "bg-destructive text-destructive-foreground",
    },
  }

  const normalizedStatus = normalizeStatus(status) // Normalize the status before lookup
  const variant = variants[normalizedStatus]
  const Icon = variant.icon

  return (
    <Badge className={cn(variant.className, className)}>
      <Icon className="w-3 h-3 mr-1" />
      {variant.text}
    </Badge>
  )
}
