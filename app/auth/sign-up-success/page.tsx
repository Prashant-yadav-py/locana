import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">Welcome to Locana!</CardTitle>
          <p className="text-gray-300 mt-2">Check your email to verify your account</p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-300">
            We've sent you a verification email. Please check your inbox and click the verification link to activate
            your account.
          </p>
          <Link href="/auth/login">
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Back to Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
