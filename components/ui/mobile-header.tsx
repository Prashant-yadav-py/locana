"use client"

import type React from "react"

import { ArrowLeft, Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileHeaderProps {
  title?: string
  showBack?: boolean
  showSearch?: boolean
  showNotifications?: boolean
  onBack?: () => void
  onSearch?: () => void
  onNotifications?: () => void
  className?: string
  children?: React.ReactNode
}

export function MobileHeader({
  title,
  showBack,
  showSearch,
  showNotifications,
  onBack,
  onSearch,
  onNotifications,
  className,
  children,
}: MobileHeaderProps) {
  return (
    <header
      className={`bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-6 py-4 flex items-center justify-between shadow-lg rounded-b-3xl ${className}`}
    >
      <div className="flex items-center gap-4">
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/20 p-3 rounded-2xl transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}

        {title && <h1 className="text-xl font-bold">{title}</h1>}

        {children}
      </div>

      <div className="flex items-center gap-3">
        {showSearch && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSearch}
            className="text-primary-foreground hover:bg-primary-foreground/20 p-3 rounded-2xl transition-all duration-200"
          >
            <Search className="w-6 h-6" />
          </Button>
        )}

        {showNotifications && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNotifications}
            className="text-primary-foreground hover:bg-primary-foreground/20 p-3 rounded-2xl transition-all duration-200 relative"
          >
            <Bell className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></div>
          </Button>
        )}
      </div>
    </header>
  )
}
