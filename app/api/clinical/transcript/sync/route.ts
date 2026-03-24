import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { GoogleGenerativeAI } from '../../../../../node_modules/@google/generative-ai'


export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || (session.user.role !== UserRole.THERAPIST && session.user.role !== UserRole.ADMIN)) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { appointmentId, rawTranscript } = await req.json()

    if (!appointmentId || !rawTranscript) {
      return new NextResponse("Missing data", { status: 400 })
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { client: true, service: true }
    })

    if (!appointment) return new NextResponse("Appointment not found", { status: 404 })

    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: "OCI OFFLINE: Gemini API key not configured." })
    }

    // 1. Consult OKU CORE AI (Gemini)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const systemPrompt = `You are OKU CORE AI, the central intelligence of a trauma-informed psychotherapy collective. 
    Your task is to analyze clinical session transcripts.
    Provide a JSON response with the following keys:
    - summary: A 3-sentence trauma-informed summary of the session.
    - sentiment: One word (POSITIVE, NEUTRAL, or NEGATIVE) representing the patient's state.
    - keyInsights: A list of 3-5 clinical observations (e.g., "High anxiety regarding work", "Positive progress on boundary setting").
    - riskLevel: (LOW, MEDIUM, HIGH) based on clinical markers.`

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt
    });

    const fullPrompt = `
      Analyze the following session transcript for a ${appointment.service.name} with ${appointment.client.name}:
      
      TRANSCRIPT:
      ${rawTranscript}

      Respond ONLY with valid JSON.
    `

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Attempt to parse JSON from response (handling potential markdown blocks)
    const jsonStr = responseText.replace(/```json|```/g, "").trim();
    const aiAnalysis = JSON.parse(jsonStr);

    // 2. Save to Transcript model
    const transcript = await prisma.transcript.upsert({
      where: { appointmentId: appointment.id },
      update: {
        content: rawTranscript,
        summary: aiAnalysis.summary,
        sentiment: aiAnalysis.sentiment,
        keyInsights: aiAnalysis.keyInsights,
      },
      create: {
        appointmentId: appointment.id,
        content: rawTranscript,
        summary: aiAnalysis.summary,
        sentiment: aiAnalysis.sentiment,
        keyInsights: aiAnalysis.keyInsights,
      }
    })

    return NextResponse.json({ 
        success: true, 
        transcriptId: transcript.id,
        analysis: aiAnalysis 
    })

  } catch (error) {
    console.error("[OKU_CORE_AI_SYNC_ERROR]", error)
    return new NextResponse("Internal AI Sync Error", { status: 500 })
  }
}
