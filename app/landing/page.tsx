import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nearby Stores & Shops Near Me | Find Local Stores Open Now - Locana',
  description: 'Find nearby stores, shops near me, local stores open now. Search products in real-time from nearby shops, pharmacies, grocery stores.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Locana",
            "description": "Find nearby stores, shops near me, local stores open now.",
            "url": "https://locaana.vercel.app",
            "applicationCategory": "Shopping",
          })
        }}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Find Nearby Stores & Shops Near Me
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover local stores open now. Search products in real-time from nearby shops, pharmacies, and grocery stores.
          </p>
          <Link href="/auth/login" className="inline-block bg-[#E23744] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#E23744]/90">
            Get Started
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold mb-2">Nearby Stores</h3>
            <p className="text-gray-600">Find stores near me with GPS location</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">Real-Time Search</h3>
            <p className="text-gray-600">Search products from local shops instantly</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Stores Open Now</h3>
            <p className="text-gray-600">Check which local stores are open</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Popular Searches</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded">📍 Nearby pharmacy</div>
            <div className="p-4 border rounded">🏪 Grocery stores near me</div>
            <div className="p-4 border rounded">💊 Medical stores near me</div>
            <div className="p-4 border rounded">🛒 Local kirana stores</div>
          </div>
        </div>
      </div>
    </div>
  )
}
