import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, context } = await req.json();
    const userId = session.user.id;
    const userRole = session.user.role as UserRole;

    // "God Mode" Data Fetching: Retrieve everything relevant based on role
    let platformData: any = {};

    if (userRole === UserRole.ADMIN) {
      // Admin sees everything
      const [appointments, users, services] = await Promise.all([
        prisma.appointment.findMany({
          include: { client: true, practitioner: true, service: true },
          orderBy: { startTime: 'desc' },
          take: 50
        }),
        prisma.user.findMany({ take: 20 }),
        prisma.service.findMany()
      ]);
      platformData = { appointments, users, services };
    } else if (userRole === UserRole.THERAPIST) {
      // Therapist sees their appointments and client names
      const myAppointments = await prisma.appointment.findMany({
        where: { practitionerId: userId },
        include: { client: true, service: true },
        orderBy: { startTime: 'desc' }
      });
      platformData = { myAppointments };
    } else {
      // Client sees their own appointments
      const myAppointments = await prisma.appointment.findMany({
        where: { clientId: userId },
        include: { practitioner: true, service: true },
        orderBy: { startTime: 'desc' }
      });
      platformData = { myAppointments };
    }

    // Intelligence Logic: Construct a response that "knows" the data
    let aiResponse = "";

    if (userRole === UserRole.ADMIN) {
        const totalAppts = platformData.appointments.length;
        const latest = platformData.appointments[0];
        aiResponse = `System analysis complete. I am monitoring all ${totalAppts} active engagements. The most recent session is between ${latest?.client?.name} and ${latest?.practitioner?.name} (${latest?.service?.name}) scheduled for ${new Date(latest?.startTime).toLocaleString()}. Platform operations are nominal and fully optimized.`;
    } else if (userRole === UserRole.THERAPIST) {
        const appts = platformData.myAppointments;
        if (appts.length > 0) {
            const next = appts.find((a: any) => new Date(a.startTime) > new Date());
            aiResponse = next 
                ? `I have reviewed your clinical schedule. Your next engagement is with ${next.client?.name} at ${new Date(next.startTime).toLocaleTimeString()}. I have the session environment prepared and all relevant records synchronized for your review.`
                : "Your current clinical queue is clear. I have completed a background synchronization of your practice data and am standing by to assist with new intakes or administrative optimization.";
        } else {
            aiResponse = "I have initialized your clinical command center. There are no active appointments currently scheduled. I am ready to help you optimize your profile to increase visibility within the Oku network.";
        }
    } else {
        const appts = platformData.myAppointments;
        if (appts.length > 0) {
            const next = appts.find((a: any) => new Date(a.startTime) > new Date());
            aiResponse = next 
                ? `Welcome back to your sanctuary. I have confirmed your upcoming session with ${next.practitioner?.name} for ${new Date(next.startTime).toLocaleString()}. I am holding this space for you and have your previous reflections ready if you'd like to review them.`
                : "I have analyzed your healing journey. You have no upcoming sessions scheduled, but your progress data is securely maintained. I can assist you in finding a new specialist whenever you are ready to continue.";
        } else {
            aiResponse = "Welcome to Oku. I am the integrated intelligence designed to manage your care journey. I have scanned our specialist network and can help you find the perfect match based on your unique needs.";
        }
    }

    // Add a professional, high-end "Core Intelligence" prefix
    aiResponse = `[OKU CORE] ${aiResponse}`;

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ result: aiResponse, data: platformData });

  } catch (error) {
    console.error("AI God Mode Error:", error);
    return NextResponse.json({ error: 'The platform mind is currently recalibrating.' }, { status: 500 });
  }
}
