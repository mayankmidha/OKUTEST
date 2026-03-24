import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { StreamClient } from "@stream-io/node-sdk"

// Stream API Key and Secret should be in .env
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
const apiSecret = process.env.STREAM_SECRET_KEY

export async function POST(req: Request) {
  const session = await auth()
  
  // Re-read env vars inside handler to ensure fresh runtime access
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
  const apiSecret = process.env.STREAM_SECRET_KEY

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  if (!apiKey || !apiSecret) {
    console.error("[STREAM_CONFIG_MISSING]", { 
        hasApiKey: !!apiKey, 
        hasApiSecret: !!apiSecret 
    });
    return NextResponse.json({ 
        error: `Stream configuration incomplete. Missing: ${!apiKey ? 'API_KEY' : ''} ${!apiSecret ? 'SECRET_KEY' : ''}`,
        apiKey: "missing" 
    }, { status: 500 })
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
