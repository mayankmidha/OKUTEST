import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { StreamClient } from "@stream-io/node-sdk"
import { env, validateEnv } from "@/lib/env"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { isValid, missing } = validateEnv();

  if (!isValid) {
    console.error("[STREAM_CONFIG_CRITICAL]", { missing });
    return NextResponse.json({ 
        error: `Deployment Incomplete. Vercel environment missing: ${missing.join(', ')}. Please ensure they are added to the 'Production' environment in Vercel settings and redeploy.`,
        apiKey: "missing" 
    }, { status: 500 })
  }

  try {
    const client = new StreamClient(env.NEXT_PUBLIC_STREAM_API_KEY!, env.STREAM_SECRET_KEY!)
    const token = client.generateUserToken({ user_id: session.user.id, validity_in_seconds: 3600 })

    return NextResponse.json({ token, apiKey: env.NEXT_PUBLIC_STREAM_API_KEY })
  } catch (error) {
    console.error("[STREAM_TOKEN_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
