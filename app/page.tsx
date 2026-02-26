import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HomeScreen } from "@/components/home/home-screen"
import { getUserRole } from "@/lib/auth/roles"

export default async function App() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()
  const userRole = profile?.user_type === 'shop_owner' ? 'owner' : 'customer'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Locana",
            "description": "Find nearby stores, shops near me, local stores open now. Real-time product search from nearby shops.",
            "url": "https://locaana.vercel.app",
            "applicationCategory": "Shopping",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1250"
            }
          })
        }}
      />
      <div className="min-h-screen bg-background">
        <HomeScreen userRole={userRole as "customer" | "owner"} />
      </div>
    </>
  )
}
