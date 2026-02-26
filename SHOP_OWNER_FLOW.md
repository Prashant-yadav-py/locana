# 🔄 Shop Owner Update Process - Visual Flow

## 🎯 Complete User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    SHOP OWNER JOURNEY                        │
└─────────────────────────────────────────────────────────────┘

1. AUTHENTICATION
   ↓
   Login/Sign Up → Role Detection → Owner Dashboard
   
2. DASHBOARD
   ↓
   View Metrics → Quick Actions → Activity Feed
   
3. STOCK UPDATE (3 Methods)
   ↓
   Voice / Image / Manual → AI Processing → Database Update
   
4. ANALYTICS
   ↓
   View Searches → Identify Trends → Add Products
   
5. SETTINGS
   ↓
   Shop Profile → Location → Operating Hours
```

---

## 📍 Navigation Map

```
┌──────────────────────────────────────────────────────────────┐
│                      MAIN NAVIGATION                          │
└──────────────────────────────────────────────────────────────┘

Home (/)
├── Owner Dashboard
│   ├── Metrics Cards
│   │   ├── Total Products
│   │   ├── Needs Update → /ai-stock
│   │   ├── Searches Today → Analytics View
│   │   └── Profile → Shop Settings
│   │
│   ├── Quick Actions
│   │   ├── Update Stock → /ai-stock
│   │   ├── Add Product → Add Product View
│   │   └── Customer Searches → Analytics View
│   │
│   └── Today's Activity
│       └── Real-time feed
│
├── Settings Menu (Top Right)
│   ├── Account Settings
│   ├── Shop Settings
│   └── Logout
│
└── Bottom Navigation
    ├── Home
    ├── Search
    ├── Cart
    └── Profile
```

---

## 🤖 AI Stock Update Flow

```
┌──────────────────────────────────────────────────────────────┐
│                   /ai-stock PAGE                              │
└──────────────────────────────────────────────────────────────┘

                    AI Stock Update
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   🎤 VOICE          📸 IMAGE          ✏️ MANUAL
```

### 1️⃣ Voice Update Flow

```
Click "🎤 Voice Update"
        ↓
Voice Update Modal Opens
        ↓
Click "Start Voice Call"
        ↓
┌─────────────────────────────────────┐
│  AI Assistant: "नमस्ते! मैं आपका    │
│  स्टॉक असिस्टेंट हूं..."           │
└─────────────────────────────────────┘
        ↓
Speak Command
"Maggie stock me add kro"
        ↓
┌─────────────────────────────────────┐
│  Speech Recognition                  │
│  (webkitSpeechRecognition)          │
└─────────────────────────────────────┘
        ↓
Send to OpenAI API
/api/openai/stock-update
        ↓
┌─────────────────────────────────────┐
│  AI Processing                       │
│  - Parse command                     │
│  - Extract product                   │
│  - Determine action                  │
└─────────────────────────────────────┘
        ↓
Update Supabase Database
        ↓
┌─────────────────────────────────────┐
│  AI Response: "हां भाई! Maggie का   │
│  stock add कर दिया। कुछ और?"       │
└─────────────────────────────────────┘
        ↓
Text-to-Speech Response
        ↓
Continue Conversation
   or End Call
```

### 2️⃣ Image Update Flow

```
Click "📸 Image Update"
        ↓
Image Update Modal Opens
        ↓
Choose Option:
├── "Choose Image" → File Picker
└── "Take Photo" → Camera Access
        ↓
Select/Capture Image
        ↓
Preview Image
        ↓
Click "Analyze & Update Stock"
        ↓
┌─────────────────────────────────────┐
│  Upload to Server                    │
│  FormData with image file            │
└─────────────────────────────────────┘
        ↓
Send to OpenAI Vision API
/api/openai/image-analysis
        ↓
┌─────────────────────────────────────┐
│  GPT-4 Vision Analysis               │
│  - Identify products                 │
│  - Extract names                     │
│  - Read prices                       │
│  - Detect quantities                 │
│  - Recognize brands                  │
└─────────────────────────────────────┘
        ↓
Parse AI Response
        ↓
┌─────────────────────────────────────┐
│  Extracted Data:                     │
│  - Product: Maggi Noodles            │
│  - Price: ₹12                        │
│  - Quantity: 50 packets              │
└─────────────────────────────────────┘
        ↓
Update Supabase Database
        ↓
Show Success Message
"✅ Products updated successfully!"
```

### 3️⃣ Manual Update Flow

```
Click "✏️ Manual Update"
        ↓
Manual Update Modal Opens
        ↓
Choose Mode:
├── "Select from List"
│   ↓
│   Search Products
│   ↓
│   Filter by Category
│   ↓
│   Browse Product Grid
│   ↓
│   Click Product Card
│   ↓
│   Product Selected
│
└── "Custom Product"
    ↓
    Enter Product Name *
    ↓
    Enter Price (₹) *
    ↓
    Add Image URL (optional)
        ↓
Choose Stock Status
├── 🟢 Available
├── 🟠 Low Stock
└── 🔴 Out of Stock
        ↓
Click "Update Stock"
        ↓
┌─────────────────────────────────────┐
│  Validate Input                      │
│  - Check required fields             │
│  - Verify shop exists                │
│  - Validate user auth                │
└─────────────────────────────────────┘
        ↓
Check if Product Exists
        ↓
    ┌───┴───┐
    │       │
    ▼       ▼
  EXISTS  NEW
    │       │
    ▼       ▼
 UPDATE  INSERT
    │       │
    └───┬───┘
        ↓
Supabase Database Operation
        ↓
Show Success Message
"✅ Product updated successfully!"
        ↓
Auto-close Modal (1.5s)
```

---

## 🗄️ Database Operations

### Product Update/Insert Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE FLOW                             │
└─────────────────────────────────────────────────────────────┘

User Action (Voice/Image/Manual)
        ↓
Get Current User
supabase.auth.getUser()
        ↓
Check User Logged In?
    ├── No → Show "Please login first"
    └── Yes → Continue
        ↓
Get Shop by Owner ID
supabase.from('shops')
  .select('id')
  .eq('owner_id', user.id)
        ↓
Shop Exists?
    ├── No → Show "Set up shop first"
    └── Yes → Continue
        ↓
Prepare Product Data
{
  name: "Product Name",
  price: 100,
  stock_status: "available",
  image_url: "/image.jpg",
  category: "Category"
}
        ↓
Check Product Exists
supabase.from('products')
  .select('id')
  .eq('shop_id', shop.id)
  .eq('name', productName)
        ↓
    ┌───┴───┐
    │       │
    ▼       ▼
 EXISTS   NEW
    │       │
    ▼       ▼
┌─────┐ ┌──────┐
│UPDATE│ │INSERT│
└─────┘ └──────┘
    │       │
    ▼       ▼
UPDATE:     INSERT:
.update({   .insert({
  price,      shop_id,
  stock,      name,
  image,      price,
  updated_at  stock,
})          image,
.eq('id')   category
            })
    │       │
    └───┬───┘
        ↓
Success/Error Handling
        ↓
Return Result to User
```

---

## 🎨 UI Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│                   COMPONENT HIERARCHY                        │
└─────────────────────────────────────────────────────────────┘

app/
├── page.tsx (Home/Dashboard Router)
│   └── components/home/owner-dashboard.tsx
│       ├── MobileHeader
│       ├── Stats Cards (4)
│       ├── Quick Actions
│       ├── Activity Feed
│       └── Views:
│           ├── dashboard (default)
│           ├── add-product
│           ├── analytics
│           ├── profile (shop settings)
│           └── account-settings
│
└── ai-stock/
    └── page.tsx (AI Stock Update)
        ├── MobileHeader
        ├── Update Method Cards (3)
        └── Modals:
            ├── components/stock/voice-update-modal.tsx
            ├── components/stock/image-update-modal.tsx
            └── components/stock/manual-update-modal.tsx
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   AUTH & ROLE DETECTION                      │
└─────────────────────────────────────────────────────────────┘

User Visits Site
        ↓
Check Auth Status
supabase.auth.getUser()
        ↓
    ┌───┴───┐
    │       │
    ▼       ▼
LOGGED IN  NOT LOGGED
    │       │
    │       └→ Redirect to /auth/login
    ↓
Get User Profile
supabase.from('profiles')
  .select('role')
  .eq('id', user.id)
        ↓
Check Role
    ┌───┴───┐
    │       │
    ▼       ▼
  OWNER  CUSTOMER
    │       │
    │       └→ Show Customer Home
    ↓
Show Owner Dashboard
```

---

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SYSTEM ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Frontend   │ (Next.js 14 + React)
│   (Browser)  │
└──────┬───────┘
       │
       ├─── Voice Input → Web Speech API
       ├─── Image Input → File Upload
       └─── Manual Input → Form Data
       │
       ▼
┌──────────────┐
│  API Routes  │ (Next.js API)
│   /api/*     │
└──────┬───────┘
       │
       ├─── /api/openai/stock-update
       ├─── /api/openai/image-analysis
       └─── /api/openai/whisper
       │
       ▼
┌──────────────┐
│   OpenAI     │ (AI Processing)
│     API      │
└──────┬───────┘
       │
       ├─── GPT-4: Text understanding
       ├─── GPT-4 Vision: Image analysis
       └─── Whisper: Speech-to-text
       │
       ▼
┌──────────────┐
│  Supabase    │ (Database + Auth)
│   Database   │
└──────┬───────┘
       │
       ├─── shops table
       ├─── products table
       └─── profiles table
       │
       ▼
┌──────────────┐
│   Response   │
│  to Frontend │
└──────────────┘
```

---

## 🎯 Feature Comparison

```
┌─────────────────────────────────────────────────────────────┐
│              UPDATE METHOD COMPARISON                        │
└─────────────────────────────────────────────────────────────┘

Feature          │ Voice  │ Image  │ Manual
─────────────────┼────────┼────────┼────────
Speed            │ ⚡⚡⚡  │ ⚡⚡    │ ⚡
Accuracy         │ ⚡⚡    │ ⚡⚡⚡  │ ⚡⚡⚡
Bulk Updates     │ ❌     │ ✅     │ ❌
Hands-free       │ ✅     │ ❌     │ ❌
Custom Products  │ ⚡     │ ⚡⚡    │ ✅
Learning Curve   │ Easy   │ Easy   │ Easy
Best For         │ Quick  │ Bulk   │ Precise
Internet Needed  │ ✅     │ ✅     │ ✅
AI Powered       │ ✅     │ ✅     │ ❌
```

---

## 📱 Mobile Experience

```
┌─────────────────────────────────────────────────────────────┐
│                   MOBILE INTERFACE                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────┐
│  ☰  My Shop      🔔 ⚙️  │ ← Header
├─────────────────────────┤
│                         │
│  📊 Dashboard Stats     │
│  ┌────┐ ┌────┐         │
│  │ 45 │ │ 8  │         │
│  └────┘ └────┘         │
│  ┌────┐ ┌────┐         │
│  │127 │ │75% │         │
│  └────┘ └────┘         │
│                         │
│  🎯 Quick Actions       │
│  ┌──────────┐          │
│  │ Update   │          │
│  │  Stock   │          │
│  └──────────┘          │
│  ┌────┐ ┌────┐         │
│  │Add │ │View│         │
│  └────┘ └────┘         │
│                         │
│  📈 Today's Activity    │
│  • 15 searches          │
│  • 8 need update        │
│  • 23% increase         │
│                         │
├─────────────────────────┤
│  🏠  🔍  🛒  👤        │ ← Bottom Nav
└─────────────────────────┘
```

---

## 🚀 Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                   OPTIMIZATION STRATEGY                      │
└─────────────────────────────────────────────────────────────┘

1. CLIENT-SIDE
   ├── React State Management
   ├── Debounced Search
   ├── Lazy Loading
   └── Image Optimization

2. API LAYER
   ├── Request Caching
   ├── Error Handling
   ├── Retry Logic
   └── Timeout Management

3. DATABASE
   ├── Indexed Queries
   ├── Connection Pooling
   ├── Batch Operations
   └── Real-time Subscriptions

4. AI SERVICES
   ├── Fallback Responses
   ├── Local Processing
   ├── Queue Management
   └── Rate Limiting
```

---

## 🎓 Learning Path

```
┌─────────────────────────────────────────────────────────────┐
│              SHOP OWNER LEARNING JOURNEY                     │
└─────────────────────────────────────────────────────────────┘

Week 1: BASICS
├── Day 1: Account setup & profile
├── Day 2: Add first 10 products
├── Day 3: Try manual updates
├── Day 4: Explore dashboard
└── Day 5: Review analytics

Week 2: AI FEATURES
├── Day 1: Voice update practice
├── Day 2: Image upload testing
├── Day 3: Bulk updates via image
├── Day 4: Voice commands mastery
└── Day 5: Optimize workflow

Week 3: OPTIMIZATION
├── Day 1: Complete profile 100%
├── Day 2: Add location & hours
├── Day 3: Upload shop images
├── Day 4: Monitor search trends
└── Day 5: Add trending products

Week 4: MASTERY
├── Daily routine established
├── All features utilized
├── Analytics-driven decisions
├── Customer satisfaction high
└── Business growing
```

---

## 📞 Quick Reference

### Essential URLs
- Dashboard: `/`
- AI Stock Update: `/ai-stock`
- Login: `/auth/login`
- Sign Up: `/auth/sign-up`

### Key Components
- Owner Dashboard: `components/home/owner-dashboard.tsx`
- Voice Modal: `components/stock/voice-update-modal.tsx`
- Image Modal: `components/stock/image-update-modal.tsx`
- Manual Modal: `components/stock/manual-update-modal.tsx`

### API Endpoints
- Stock Update: `/api/openai/stock-update`
- Image Analysis: `/api/openai/image-analysis`
- Whisper: `/api/openai/whisper`

### Database Tables
- `shops`: Shop information
- `products`: Product inventory
- `profiles`: User profiles

---

**🎉 You're ready to manage your shop with AI! 🚀**
