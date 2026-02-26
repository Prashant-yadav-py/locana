"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, User, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("customer")

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        console.error("Login error:", error.message)
        return
      }

      if (data.user) {
        window.location.href = "/"
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      setError(errorMessage)
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            user_type: activeTab === 'owner' ? 'shop_owner' : 'customer'
          }
        },
      })

      if (error) {
        setError(error.message)
        console.error("Sign up error:", error.message)
        return
      }

      if (data.user) {
        // Wait a bit for trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Update user type if owner
        if (activeTab === 'owner') {
          await supabase.from("profiles").update({
            user_type: 'shop_owner'
          }).eq('id', data.user.id)
        }

        alert("Account created successfully!")
        window.location.href = "/"
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      setError(errorMessage)
      console.error("Sign up error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-[#E23744] rounded-full flex items-center justify-center">
            <Store className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome to Locana</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer
              </TabsTrigger>
              <TabsTrigger value="owner" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                Shop Owner
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customer">
              <p className="text-sm text-gray-600 text-center mb-4">Shop local and discover amazing products</p>
            </TabsContent>

            <TabsContent value="owner">
              <p className="text-sm text-gray-600 text-center mb-4">Manage your shop and connect with customers</p>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-[#E23744] text-sm text-center p-2 bg-red-50 rounded">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Button type="submit" className="w-full bg-[#E23744] hover:bg-[#E23744]/90" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent border-[#E23744] text-[#E23744] hover:bg-[#E23744] hover:text-white"
                onClick={handleSignUp}
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
