import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { appointmentId, transcriptContent } = await req.json();

    // 1. Save the raw transcript first
    const transcript = await prisma.transcript.upsert({
      where: { appointmentId },
      update: { content: transcriptContent },
      create: { 
        appointmentId, 
        content: transcriptContent 
      },
    });

    // 2. Use Oku Core (Gemini) to generate the Clinical Summary & SOAP Draft
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are the Oku Clinical Intelligence engine. Your goal is to transform raw therapy transcripts into professional, HIPPA-compliant SOAP notes and clinical summaries."
    });

    const prompt = `
      RAW TRANSCRIPT:
      ${transcriptContent}

      TASK:
      1. Provide a 'Clinical Summary' (2-3 paragraphs).
      2. Detect 'Sentiment' (Stable, Improving, or At Risk).
      3. Extract 'Key Insights' as a JSON array of strings.
      4. Draft a 'SOAP NOTE' with sections: SUBJECTIVE, OBJECTIVE, ASSESSMENT, PLAN.

      OUTPUT FORMAT: Return ONLY a JSON object with keys: summary, sentiment, keyInsights (array), soapNote (object with S, O, A, P keys).
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = JSON.parse(result.response.text().replace(/```json|```/g, ""));

    // 3. Update the Transcript with AI insights
    await prisma.transcript.update({
      where: { id: transcript.id },
      data: {
        summary: aiResponse.summary,
        sentiment: aiResponse.sentiment,
        keyInsights: aiResponse.keyInsights,
      }
    });

    // 4. Upsert the SOAP Note draft
    await prisma.soapNote.upsert({
      where: { appointmentId },
      update: {
        subjective: aiResponse.soapNote.S,
        objective: aiResponse.soapNote.O,
        assessment: aiResponse.soapNote.A,
        plan: aiResponse.soapNote.P,
      },
      create: {
        appointmentId,
        subjective: aiResponse.soapNote.S,
        objective: aiResponse.soapNote.O,
        assessment: aiResponse.soapNote.A,
        plan: aiResponse.soapNote.P,
      }
    });

    return NextResponse.json({ success: true, message: "Clinical intelligence processed." });

  } catch (error) {
    console.error("[TRANSCRIPT_PROCESS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
