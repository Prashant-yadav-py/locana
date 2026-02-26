import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/contexts/cart-context"
import { VersionCheck } from "@/components/version-check"
import "./globals.css"

export const metadata: Metadata = {
  title: "Locana - Nearby Stores & Shops Near Me | Find Local Stores Open Now",
  description: "Locana helps you find nearby stores, shops near me, local stores open now. Search products in real-time from nearby shops, pharmacies, grocery stores with Locana app. Check stock availability instantly.",
  keywords: "locana, locana app, locana nearby stores, nearby stores, shops near me, stores near me, local stores, nearby shops, find stores near me, shops open now, nearby pharmacy, grocery stores near me, local shopping, nearby kirana store, medical stores near me, stores open near me, local businesses near me,local kirana near me , kirana near me , stores ,locana vercel app , locana app",
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#d7262f",
  manifest: "/manifest.json",
  authors: [{ name: "Locana" }],
  creator: "Prashant Yadav",
  publisher: "Prashant Yadav",
  robots: "index, follow",
  alternates: {
    canonical: "https://locaana.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://locaana.vercel.app",
    title: "Locana - Nearby Stores & Shops Near Me | Find Local Stores",
    description: "Locana helps you find nearby stores, shops near me, local stores open now. Real-time product search from nearby shops, pharmacies, grocery stores with Locana.",
    siteName: "Locana",
  },
  twitter: {
    card: "summary_large_image",
    title: "Locana - Nearby Stores & Shops Near Me",
    description: "Locana: Find nearby stores and shops near me. Real-time local shopping.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Locana - Nearby Stores",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#d7262f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Locana" />
        <meta name="application-name" content="Locana" />
        <meta property="og:site_name" content="Locana" />
        <meta name="twitter:site" content="@Locana" />
        <link rel="canonical" href="https://locaana.vercel.app" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Locana",
            "alternateName": ["Locana App", "Locana Nearby Stores"],
            "url": "https://locaana.vercel.app",
            "description": "Find nearby stores, shops near me, local stores open now. Search products in real-time from nearby shops, pharmacies, grocery stores.",
            "applicationCategory": "Shopping",
            "operatingSystem": "Web, iOS, Android",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            }
          })
        }} />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {/* Added mobile app container styling and Suspense boundary */}
        <VersionCheck />
        <CartProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="max-w-md mx-auto bg-background min-h-screen relative overflow-x-hidden">{children}</div>
          </Suspense>
        </CartProvider>
        <Analytics />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `
        }} />
      </body>
    </html>
  )
}
