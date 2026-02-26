# 🏪 Locana Shop Owner - Complete Guide

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Stock Update Methods](#stock-update-methods)
4. [Product Management](#product-management)
5. [Shop Settings](#shop-settings)
6. [Analytics & Insights](#analytics--insights)

---

## 🚀 Getting Started

### Initial Setup
1. **Sign Up**: Create account at `/auth/sign-up`
2. **Login**: Access at `/auth/login`
3. **Role**: System identifies you as shop owner
4. **Dashboard**: Automatically redirected to Owner Dashboard

### First Time Setup Checklist
- ✅ Complete shop profile (name, category, address)
- ✅ Add shop location (GPS coordinates)
- ✅ Upload shop image
- ✅ Set operating hours
- ✅ Add contact information
- ✅ Add your first products

---

## 📊 Dashboard Overview

### Main Dashboard (`/`)
**Location**: Owner Dashboard component

#### Key Metrics (4 Cards)
1. **Total Products** 📦
   - Shows total inventory count
   - Quick overview of catalog size

2. **Needs Update** ⚠️
   - Products requiring stock refresh
   - Click to go to AI Stock Update
   - Helps maintain accuracy

3. **Searches Today** 👥
   - Customer search count
   - Click to view analytics
   - Track demand trends

4. **Profile Completion** 🏪
   - Profile completion percentage
   - Click to complete setup
   - Improve visibility

#### Quick Actions
- **Update Stock** (Red Button) → AI Stock Update page
- **Add Product** → Add new product form
- **Customer Searches** → Analytics dashboard

#### Today's Activity Feed
- Real-time customer searches
- Stock update alerts
- Performance insights
- Trending products

---

## 🤖 Stock Update Methods

### Access: Dashboard → "Update Stock" → `/ai-stock`

### 1. 🎤 Voice Update (AI-Powered)

**Best For**: Quick updates while busy, hands-free operation

#### Features:
- **Voice Call Interface**: Phone-like experience
- **Bilingual Support**: Hindi + English
- **Real-time Recognition**: Instant speech-to-text
- **AI Processing**: Understands natural commands
- **Conversation History**: Track all updates

#### How to Use:
```
1. Click "🎤 Voice Update" card
2. Click "Start Voice Call" button
3. Speak your command:
   - "Maggie stock me add kro"
   - "Bread 10 pieces daal do"
   - "Dolo 650 available hai"
4. AI responds and updates stock
5. Continue conversation or end call
```

#### Example Commands:
- "Maggie stock me add kro" → Adds Maggi to inventory
- "Bread low stock hai" → Updates bread to low stock
- "Milk out of stock" → Marks milk as unavailable

#### Technical Details:
- Uses Web Speech API (webkitSpeechRecognition)
- OpenAI API for command processing
- Text-to-Speech for AI responses
- Continuous listening during call
- Fallback to local processing if API fails

---

### 2. 📸 Image Update (AI Vision)

**Best For**: Bulk updates, bill processing, new inventory

#### Features:
- **Image Upload**: Choose from gallery
- **Camera Capture**: Take photo directly
- **AI Analysis**: GPT-4 Vision extracts data
- **Bill Processing**: Reads receipts/invoices
- **Batch Updates**: Multiple products at once

#### How to Use:
```
1. Click "📸 Image Update" card
2. Choose option:
   - "Choose Image" → Upload from device
   - "Take Photo" → Use camera
3. Select/capture image
4. Click "Analyze & Update Stock"
5. AI extracts product details
6. Review and confirm updates
```

#### Supported Images:
- ✅ Product photos (single/multiple)
- ✅ Bills/Receipts (itemized lists)
- ✅ Invoices (supplier documents)
- ✅ Product lists (handwritten/printed)
- ✅ Packaging labels

#### AI Capabilities:
- Product name recognition
- Price extraction
- Quantity detection
- Category identification
- Brand recognition

---

### 3. ✏️ Manual Update (Traditional)

**Best For**: Precise control, custom products, detailed entry

#### Features:
- **Product Catalog**: Pre-loaded common items
- **Search Function**: Find products quickly
- **Category Filter**: Browse by type
- **Custom Products**: Add unique items
- **Stock Status**: Available/Low/Out of Stock
- **Direct Database**: Instant updates

#### How to Use:

**Option A: Select from Catalog**
```
1. Click "✏️ Manual Update" card
2. Stay on "Select from List" tab
3. Search product by name
4. Filter by category (All/Medicine/Grocery/etc.)
5. Click product card to select
6. Choose stock status
7. Click "Update Stock"
```

**Option B: Custom Product**
```
1. Click "✏️ Manual Update" card
2. Switch to "Custom Product" tab
3. Enter product name *
4. Enter price (₹) *
5. Add image URL (optional)
6. Choose stock status
7. Click "Update Stock"
```

#### Product Catalog Categories:
- All
- Medicine
- Grocery
- Hygiene
- Snacks
- Beverages
- Personal Care

#### Stock Status Options:
- 🟢 **Available**: In stock, ready to sell
- 🟠 **Low Stock**: Running low, needs reorder
- 🔴 **Out of Stock**: Not available

---

## 📦 Product Management

### Add Product (`Dashboard → Add Product`)

#### Quick Add (AI-Powered)
- **Camera Upload**: Take product photo
- **AI Extraction**: Auto-fills details
- **Review & Save**: Confirm and add

#### Manual Entry
**Required Fields:**
- Product Name *
- Price (₹) *
- Stock Status *

**Optional Fields:**
- Category
- Description
- Image URL

#### Process:
```
1. Dashboard → "Add Product" button
2. Choose method:
   - Take Photo → AI extracts details
   - Manual Entry → Fill form
3. Set stock status (Available/Low/Out)
4. Click "Add Product"
5. Product added to inventory
```

### Edit Product
- View in product list
- Click edit icon
- Update details
- Save changes

### Delete Product
- View in product list
- Click delete icon
- Confirm deletion
- Product removed

---

## ⚙️ Shop Settings

### Access: Dashboard → Settings Icon → "Shop Settings"

### Shop Profile Setup

#### 1. Shop Image
- Upload shop photo
- Paste image URL
- Remove/replace anytime
- Improves customer trust

#### 2. Basic Information
- **Shop Name**: Your business name
- **Category**: Type of shop (Kirana, Medical, etc.)
- **Contact Number**: Customer contact
- **Shop Address**: Complete address

#### 3. Location Setup
**Manual Entry:**
- Type complete address
- Include landmarks

**Auto-Detect:**
```
1. Click "Detect My Location"
2. Allow browser location access
3. GPS coordinates captured
4. Address auto-filled
5. Verify and save
```

**Why Location Matters:**
- Customers find you on map
- Distance-based search results
- Delivery radius calculation
- Nearby shop recommendations

#### 4. Operating Hours
- Opening time
- Closing time
- Displayed to customers
- Helps manage expectations

#### 5. Save Changes
- Click "Save Changes" button
- Updates reflected immediately
- Customers see updated info

### Profile Completion Checklist
- ✅ Basic Information
- ⬜ Shop Photos
- ⬜ Verification Documents

---

## 📈 Analytics & Insights

### Access: Dashboard → "Customer Searches" or Analytics Card

### Popular Searches Today
**Shows:**
- Product name
- Number of searches
- Stock availability status
- In Stock / Not Available badge

**Use Cases:**
- Identify high-demand products
- Stock popular items
- Understand customer needs
- Plan inventory

### Revenue Opportunities
**AI Suggestions:**
- Products customers searched but you don't have
- Potential revenue from adding items
- Demand-based recommendations

**Example:**
```
"Add Vicks Vaporub"
12 customers searched for this today
→ Opportunity to capture sales
```

### Search Analytics Benefits:
1. **Demand Forecasting**: Know what to stock
2. **Revenue Growth**: Add high-demand items
3. **Customer Satisfaction**: Stock what they need
4. **Competitive Edge**: Stay ahead of demand

---

## 🔐 Account Settings

### Access: Dashboard → Settings Icon → "Account Settings"

### Profile Information
- Owner Name
- Email (cannot be changed)
- Phone Number
- Save Profile button

### Security
- Change Password
- Two-Factor Authentication
- Account protection

### Preferences
- **Notifications**: Order updates toggle
- **Email Alerts**: Daily summary toggle
- Customize experience

### Logout
- Secure logout option
- Clears session
- Returns to login

---

## 🎯 Best Practices

### Daily Routine
1. **Morning**: Check dashboard metrics
2. **Update Stock**: Use voice/image for quick updates
3. **Review Searches**: See what customers want
4. **Add Products**: Stock high-demand items
5. **Evening**: Review day's activity

### Stock Management
- Update stock daily
- Use voice update while working
- Process bills with image update
- Keep popular items in stock
- Mark out-of-stock items promptly

### Profile Optimization
- Complete all profile fields
- Add clear shop photo
- Enable location services
- Set accurate operating hours
- Keep contact info updated

### Customer Visibility
- Regular stock updates = higher visibility
- Complete profile = more trust
- Quick response to searches = more sales
- Accurate stock status = better experience

---

## 🛠️ Technical Architecture

### Database (Supabase)
**Tables:**
- `shops`: Shop information
- `products`: Product inventory
- `profiles`: User profiles

**Key Fields:**
```sql
shops:
  - id, owner_id, name, category
  - phone, address, image_url
  - latitude, longitude
  - created_at, updated_at

products:
  - id, shop_id, name, price
  - stock_status, category, image_url
  - created_at, updated_at
```

### AI Integration (OpenAI)
- **Voice**: Speech recognition + GPT processing
- **Image**: GPT-4 Vision for image analysis
- **Text**: Natural language understanding

### Real-time Features
- Live stock updates
- Instant search results
- Real-time analytics
- Automatic sync

---

## 📱 Mobile-First Design

### Responsive Interface
- Optimized for mobile screens
- Touch-friendly buttons
- Swipe gestures
- Bottom navigation

### Progressive Web App (PWA)
- Install on home screen
- Offline capabilities
- Push notifications
- App-like experience

---

## 🆘 Troubleshooting

### Voice Update Not Working
- ✅ Check browser permissions (microphone)
- ✅ Use Chrome/Edge (best support)
- ✅ Verify OpenAI API key
- ✅ Check internet connection

### Image Upload Issues
- ✅ Check file size (< 5MB recommended)
- ✅ Use supported formats (JPG, PNG)
- ✅ Verify camera permissions
- ✅ Check OpenAI API quota

### Location Not Detecting
- ✅ Enable browser location access
- ✅ Check device GPS settings
- ✅ Try manual address entry
- ✅ Verify HTTPS connection

### Products Not Saving
- ✅ Check Supabase connection
- ✅ Verify shop profile exists
- ✅ Ensure required fields filled
- ✅ Check browser console for errors

---

## 🚀 Quick Start Checklist

### Day 1: Setup
- [ ] Create account and login
- [ ] Complete shop profile
- [ ] Add shop location
- [ ] Upload shop image
- [ ] Set operating hours

### Day 2: Inventory
- [ ] Add first 10 products
- [ ] Test voice update
- [ ] Try image update
- [ ] Practice manual update

### Day 3: Optimize
- [ ] Review customer searches
- [ ] Add high-demand products
- [ ] Update stock status
- [ ] Complete profile to 100%

### Ongoing
- [ ] Daily stock updates
- [ ] Monitor analytics
- [ ] Respond to demand
- [ ] Keep profile current

---

## 📞 Support

### Resources
- README.md - Project overview
- STOCK_UPDATE_GUIDE.md - Detailed stock features
- SHOP_OWNER_GUIDE.md - This guide

### Configuration
- `.env.local` - Environment variables
- Supabase dashboard - Database management
- OpenAI dashboard - API usage

---

## 🎉 Success Tips

1. **Update Daily**: Keep stock current for visibility
2. **Use AI Features**: Save time with voice/image
3. **Monitor Analytics**: Stock what customers want
4. **Complete Profile**: Build trust and credibility
5. **Stay Active**: Regular updates = more customers

---

**Welcome to Locana! 🎊**

Your AI-powered shop management platform that makes inventory management effortless and helps you grow your business.
