import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key_to_prevent_crash' });

    const { prompt, context } = await req.json();
    const userId = session.user.id;
    const userRole = session.user.role as UserRole;

    // Secure Data Fetching based on Role
    let platformData: any = {};
    let systemPrompt = "You are Oku Core, an advanced, trauma-informed clinical AI assistant for Oku Therapy. Respond professionally, calmly, and concisely using the provided platform data context. Start your response with a brief, helpful insight.";

    if (userRole === UserRole.ADMIN) {
      const [appointments, users, services] = await Promise.all([
        prisma.appointment.findMany({
          include: { client: true, practitioner: true, service: true },
          orderBy: { startTime: 'desc' },
          take: 10
        }),
        prisma.user.findMany({ take: 10 }),
        prisma.service.findMany()
      ]);
      platformData = { role: 'Admin', activeAppointments: appointments, systemUsers: users, activeServices: services };
      systemPrompt += " You are advising the CTO/Admin. Provide high-level system analysis and operational status based on the data.";
    } else if (userRole === UserRole.THERAPIST) {
      const myAppointments = await prisma.appointment.findMany({
        where: { practitionerId: userId },
        include: { client: true, service: true },
        orderBy: { startTime: 'asc' },
        take: 5
      });
      platformData = { role: 'Therapist', upcomingAppointments: myAppointments };
      systemPrompt += " You are advising a clinical practitioner. Help them prepare for upcoming sessions and manage their schedule. Maintain strict clinical professionalism.";
    } else {
      const myAppointments = await prisma.appointment.findMany({
        where: { clientId: userId },
        include: { practitioner: true, service: true },
        orderBy: { startTime: 'asc' },
        take: 5
      });
      platformData = { role: 'Client/Patient', upcomingAppointments: myAppointments };
      systemPrompt += " You are assisting a patient navigating their therapy journey. Be deeply empathetic, trauma-informed, and highly supportive. Help them understand their upcoming schedule.";
    }

    const fullPrompt = `
      User Prompt: ${prompt}
      Current Platform Context (JSON): ${JSON.stringify(platformData, null, 2)}
      
      Based strictly on the data above, answer the user's prompt.
    `;

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is missing. Falling back to static mock.");
      return NextResponse.json({ 
        result: `[OKU CORE - OFFLINE] I have analyzed the database. You are logged in as a ${userRole}. I see ${platformData.upcomingAppointments?.length || platformData.activeAppointments?.length || 0} recent/upcoming engagements. Please configure the GEMINI_API_KEY to fully activate my neural pathways.`,
        data: platformData 
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
      }
    });

    return NextResponse.json({ result: response.text, data: platformData });

  } catch (error) {
    console.error("AI Core Integration Error:", error);
    return NextResponse.json({ error: 'The platform mind encountered a localized disruption.' }, { status: 500 });
  }
}
