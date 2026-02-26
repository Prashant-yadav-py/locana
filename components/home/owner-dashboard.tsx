"use client"

import { useState, useEffect } from "react"
import { MobileHeader } from "@/components/ui/mobile-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Package, TrendingUp, ShoppingBag, Plus, Edit, Trash2, Store, BarChart3, Clock, CheckCircle, XCircle, Camera, Search, AlertCircle, Users, Eye, MapPin, Settings, LogOut, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

export function OwnerDashboard() {
  const [activeView, setActiveView] = useState<'dashboard' | 'products' | 'stock-update' | 'add-product' | 'analytics' | 'profile' | 'account-settings'>('dashboard')
  const [products, setProducts] = useState<any[]>([])
  const [stats, setStats] = useState({ totalProducts: 0, needsUpdate: 0, todaySearches: 0, profileComplete: 75 })
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: '', stock: 'available' })
  const [shopName, setShopName] = useState('My Shop')
  const [shopOpen, setShopOpen] = useState(true)
  const [currentDate, setCurrentDate] = useState('')
  const [searchAnalytics, setSearchAnalytics] = useState<any[]>([])
  const [shopProfile, setShopProfile] = useState({ name: 'My Shop', category: '', phone: '', address: '', openTime: '', closeTime: '', image: '', latitude: 0, longitude: 0 })
  const [detectingLocation, setDetectingLocation] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }))
    loadDashboardData()
    loadShopProfile()
  }, [])

  const loadDashboardData = () => {
    setStats({
      totalProducts: 45,
      needsUpdate: 8,
      todaySearches: 127,
      profileComplete: 75
    })

    setProducts([
      { id: 1, name: 'Dolo 650', price: 28, stock: 'available', category: 'Medicine', lastUpdated: '2 hours ago', searches: 15 },
      { id: 2, name: 'Hand Sanitizer', price: 120, stock: 'low', category: 'Hygiene', lastUpdated: '5 hours ago', searches: 8 },
      { id: 3, name: 'Face Mask Pack', price: 250, stock: 'out', category: 'Hygiene', lastUpdated: '1 day ago', searches: 12 },
      { id: 4, name: 'Paracetamol', price: 15, stock: 'available', category: 'Medicine', lastUpdated: '1 hour ago', searches: 22 },
      
    ])

    setSearchAnalytics([
      { product: 'Dolo 650', searches: 15, inStock: true },
      { product: 'Vicks Vaporub', searches: 12, inStock: false },
      { product: 'Colgate Toothpaste', searches: 10, inStock: true },
      { product: 'Maggi Noodles', searches: 8, inStock: false },
    ])
  }

  const loadShopProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: shop } = await supabase.from('shops').select('*').eq('owner_id', user.id).single()
      if (shop) {
        setShopProfile({
          name: shop.name || 'My Shop',
          category: shop.category || '',
          phone: shop.phone || '',
          address: shop.address || '',
          openTime: '',
          closeTime: '',
          image: shop.image_url || '',
          latitude: shop.latitude || 0,
          longitude: shop.longitude || 0
        })
        setShopName(shop.name || 'My Shop')
      }
    }
  }

  const detectLocation = () => {
    setDetectingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            const data = await response.json()
            const address = data.display_name || `${lat}, ${lng}`
            
            setShopProfile(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng,
              address: address
            }))
            alert('Location detected successfully!')
          } catch (error) {
            setShopProfile(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng
            }))
            alert('Location detected!')
          }
          setDetectingLocation(false)
        },
        (error) => {
          alert('Unable to detect location. Please enable location access.')
          setDetectingLocation(false)
        }
      )
    } else {
      alert('Geolocation is not supported by your browser')
      setDetectingLocation(false)
    }
  }

  const handleSaveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: existingShop } = await supabase.from('shops').select('id').eq('owner_id', user.id).single()

    if (existingShop) {
      const { error } = await supabase.from('shops').update({
        name: shopProfile.name,
        category: shopProfile.category,
        phone: shopProfile.phone,
        address: shopProfile.address,
        image_url: shopProfile.image,
        latitude: shopProfile.latitude,
        longitude: shopProfile.longitude
      }).eq('owner_id', user.id)

      if (error) {
        alert('Error saving: ' + error.message)
      } else {
        setShopName(shopProfile.name)
        alert('Shop settings saved successfully!')
      }
    } else {
      const { error } = await supabase.from('shops').insert({
        owner_id: user.id,
        name: shopProfile.name,
        category: shopProfile.category,
        phone: shopProfile.phone,
        address: shopProfile.address,
        image_url: shopProfile.image,
        latitude: shopProfile.latitude,
        longitude: shopProfile.longitude
      })

      if (error) {
        alert('Error creating shop: ' + error.message)
      } else {
        setShopName(shopProfile.name)
        alert('Shop created successfully!')
      }
    }
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Please fill required fields')
      return
    }
    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: newProduct.stock,
      category: newProduct.category,
      lastUpdated: 'Just now',
      searches: 0
    }
    setProducts([...products, product])
    setNewProduct({ name: '', price: '', description: '', category: '', stock: 'available' })
    setActiveView('stock-update')
    alert('Product added successfully!')
  }

  const handleStockUpdate = (id: number, status: 'available' | 'low' | 'out') => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: status, lastUpdated: 'Just now' } : p))
  }

  const handleDeleteProduct = (id: number) => {
    if (confirm('Delete this product?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await supabase.auth.signOut()
      window.location.href = '/'
    }
  }

  if (activeView === 'dashboard') {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="text-xl font-bold text-primary-foreground">{shopName}</div>
              <div className="text-xs text-primary-foreground/80">{currentDate}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary-foreground">{shopOpen ? 'Open' : 'Closed'}</span>
              <Switch checked={shopOpen} onCheckedChange={setShopOpen} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-primary-foreground hover:bg-primary-foreground/10 p-2 rounded-md">
                    <Settings className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 z-50">
                  <DropdownMenuItem onSelect={() => setActiveView('account-settings')}>
                    <User className="w-4 h-4 mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setActiveView('profile')}>
                    <Store className="w-4 h-4 mr-2" />
                    Shop Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </MobileHeader>

        <div className="p-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg cursor-pointer" onClick={() => window.location.href = '/ai-stock'}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.needsUpdate}</p>
                    <p className="text-sm text-muted-foreground">Needs Update</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg cursor-pointer" onClick={() => setActiveView('analytics')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.todaySearches}</p>
                    <p className="text-sm text-muted-foreground">Searches Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg cursor-pointer" onClick={() => setActiveView('profile')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Store className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.profileComplete}%</p>
                    <p className="text-sm text-muted-foreground">Profile</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-24 flex-col gap-2 bg-[#E23744] hover:bg-[#E23744]/90" onClick={() => window.location.href = '/ai-stock'}>
                  <Package className="w-6 h-6" />
                  <span>Update Stock</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 bg-transparent" onClick={() => setActiveView('add-product')}>
                  <Plus className="w-6 h-6" />
                  <span>Add Product</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 bg-transparent" onClick={() => setActiveView('analytics')}>
                  <Eye className="w-6 h-6" />
                  <span>Customer Searches</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Today's Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Search className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">15 customers searched for Dolo 650</p>
                    <p className="text-xs text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">8 products need stock update</p>
                    <p className="text-xs text-gray-600">Update now for better visibility</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Your shop views increased by 23%</p>
                    <p className="text-xs text-gray-600">Keep your stock updated!</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }



  if (activeView === 'stock-update') {
    // Redirect to AI Stock Update page
    if (typeof window !== 'undefined') {
      window.location.href = '/ai-stock'
    }
    return null
  }

  if (activeView === 'add-product') {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader showBack onBack={() => setActiveView('dashboard')}>
          <div className="text-xl font-bold text-primary-foreground">Add Product</div>
        </MobileHeader>

        <div className="p-4 space-y-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <Button variant="outline" className="w-full h-32 flex-col gap-2 bg-transparent border-dashed border-2">
                <Camera className="w-8 h-8 text-gray-400" />
                <span className="text-sm">Take Photo of Product</span>
                <span className="text-xs text-gray-500">AI will extract details</span>
              </Button>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500">OR</div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="Enter product name" />
              </div>

              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input id="price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="0" />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} placeholder="e.g., Medicine, Grocery" />
              </div>

              <div>
                <Label>Stock Status *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button 
                    type="button"
                    size="sm" 
                    variant={newProduct.stock === 'available' ? 'default' : 'outline'}
                    className={newProduct.stock === 'available' ? 'bg-green-600' : 'bg-transparent'}
                    onClick={() => setNewProduct({...newProduct, stock: 'available'})}
                  >
                    Available
                  </Button>
                  <Button 
                    type="button"
                    size="sm" 
                    variant={newProduct.stock === 'low' ? 'default' : 'outline'}
                    className={newProduct.stock === 'low' ? 'bg-orange-600' : 'bg-transparent'}
                    onClick={() => setNewProduct({...newProduct, stock: 'low'})}
                  >
                    Low
                  </Button>
                  <Button 
                    type="button"
                    size="sm" 
                    variant={newProduct.stock === 'out' ? 'default' : 'outline'}
                    className={newProduct.stock === 'out' ? 'bg-red-600' : 'bg-transparent'}
                    onClick={() => setNewProduct({...newProduct, stock: 'out'})}
                  >
                    Out
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} placeholder="Product description" rows={3} />
              </div>

              <Button className="w-full bg-[#E23744] hover:bg-[#E23744]/90" onClick={handleAddProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (activeView === 'analytics') {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader showBack onBack={() => setActiveView('dashboard')}>
          <div className="text-xl font-bold text-primary-foreground">Customer Searches</div>
        </MobileHeader>

        <div className="p-4 space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Popular Searches Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {searchAnalytics.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">{item.product}</p>
                      <p className="text-sm text-gray-600">{item.searches} searches</p>
                    </div>
                    {item.inStock ? (
                      <Badge className="bg-green-600">In Stock</Badge>
                    ) : (
                      <Badge variant="destructive">Not Available</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Revenue Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Add Vicks Vaporub</p>
                      <p className="text-xs text-gray-600">12 customers searched for this today</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Add Maggi Noodles</p>
                      <p className="text-xs text-gray-600">8 customers searched for this today</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (activeView === 'account-settings') {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader showBack onBack={() => setActiveView('dashboard')}>
          <div className="text-xl font-bold text-primary-foreground">Account Settings</div>
        </MobileHeader>

        <div className="p-4 space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input id="ownerName" placeholder="Enter your name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" disabled />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Enter phone number" />
              </div>
              <Button className="w-full bg-[#E23744] hover:bg-[#E23744]/90">
                Save Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-xs text-gray-500">Receive order updates</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Alerts</p>
                  <p className="text-xs text-gray-500">Daily summary emails</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg border-red-200">
            <CardContent className="p-6">
              <Button variant="destructive" className="w-full" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (activeView === 'profile') {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader showBack onBack={() => setActiveView('dashboard')}>
          <div className="text-xl font-bold text-primary-foreground">Shop Settings</div>
        </MobileHeader>

        <div className="p-4 space-y-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label>Shop Image</Label>
                <div className="mt-2">
                  {shopProfile.image ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <img src={shopProfile.image} alt="Shop" className="w-full h-full object-cover" />
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="absolute top-2 right-2"
                        onClick={() => setShopProfile({...shopProfile, image: ''})}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 bg-gray-50">
                      <Camera className="w-8 h-8 text-gray-400" />
                      <Input 
                        type="text" 
                        placeholder="Paste image URL" 
                        className="max-w-xs"
                        onBlur={(e) => setShopProfile({...shopProfile, image: e.target.value})}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="shopName">Shop Name</Label>
                <Input id="shopName" value={shopProfile.name} onChange={(e) => setShopProfile({...shopProfile, name: e.target.value})} placeholder="Enter shop name" />
              </div>

              <div>
                <Label htmlFor="category">Shop Category</Label>
                <Input id="category" value={shopProfile.category} onChange={(e) => setShopProfile({...shopProfile, category: e.target.value})} placeholder="e.g., Kirana Store, Medical Shop" />
              </div>

              <div>
                <Label htmlFor="phone">Contact Number</Label>
                <Input id="phone" type="tel" value={shopProfile.phone} onChange={(e) => setShopProfile({...shopProfile, phone: e.target.value})} placeholder="Enter phone number" />
              </div>

              <div>
                <Label htmlFor="address">Shop Address</Label>
                <Textarea id="address" value={shopProfile.address} onChange={(e) => setShopProfile({...shopProfile, address: e.target.value})} placeholder="Enter complete address" rows={3} />
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full mt-2 bg-transparent" 
                  onClick={detectLocation}
                  disabled={detectingLocation}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {detectingLocation ? 'Detecting...' : 'Detect My Location'}
                </Button>
                {shopProfile.latitude !== 0 && shopProfile.longitude !== 0 && (
                  <p className="text-xs text-green-600 mt-1">✓ Location: {shopProfile.latitude.toFixed(4)}, {shopProfile.longitude.toFixed(4)}</p>
                )}
              </div>

              <div>
                <Label>Operating Hours</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input type="time" value={shopProfile.openTime} onChange={(e) => setShopProfile({...shopProfile, openTime: e.target.value})} placeholder="Opening" />
                  <Input type="time" value={shopProfile.closeTime} onChange={(e) => setShopProfile({...shopProfile, closeTime: e.target.value})} placeholder="Closing" />
                </div>
              </div>

              <Button className="w-full bg-[#E23744] hover:bg-[#E23744]/90" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Basic Information</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Shop Photos</span>
                  <XCircle className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verification Documents</span>
                  <XCircle className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
