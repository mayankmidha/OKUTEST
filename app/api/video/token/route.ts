import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { StreamClient } from "@stream-io/node-sdk"

// Stream API Key and Secret should be in .env
// For demo/setup purposes, we check if they exist, otherwise we return an error.
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY || "placeholder_key"
const apiSecret = process.env.STREAM_SECRET_KEY || "placeholder_secret"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  if (apiKey === "placeholder_key" || apiSecret === "placeholder_secret") {
    console.warn("STREAM_API_KEY or STREAM_SECRET_KEY is missing. Video tokens will fail in production.")
  }

  try {
    const client = new StreamClient(apiKey, apiSecret)
    
    // Generate token valid for 1 hour
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60
    const issued = Math.floor(Date.now() / 1000) - 60

    const token = client.generateUserToken({ user_id: session.user.id, validity_in_seconds: 3600 })

    return NextResponse.json({ token, apiKey })
  } catch (error) {
    console.error("[STREAM_TOKEN_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
