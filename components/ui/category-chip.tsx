"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface CategoryChipProps {
  label: string
  isSelected?: boolean
  onClick?: () => void
  icon?: React.ReactNode
}

export function CategoryChip({ label, isSelected, onClick, icon }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      )}
    >
      {icon}
      {label}
    </button>
  )
}
