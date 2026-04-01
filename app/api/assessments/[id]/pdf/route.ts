import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { jsPDF } from 'jspdf'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id } = await params

  try {
    const response = await prisma.assessmentAnswer.findUnique({
      where: { id },
      include: {
        assessment: true,
        user: true,
      }
    })

    if (!response) {
      return new NextResponse('Assessment not found', { status: 404 })
    }

    // Security: Only the client who took it, or their therapist, or an admin can download
    const isOwner = response.userId === session.user.id
    const isTherapist = session.user.role === 'THERAPIST' || session.user.role === 'ADMIN'

    if (!isOwner && !isTherapist) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Generate PDF
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(22)
    doc.setTextColor(30, 30, 30)
    doc.text('Oku Therapy Clinical Report', 20, 20)
    
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(`Assessment: ${response.assessment.title}`, 20, 30)
    doc.text(`Date Completed: ${response.completedAt?.toLocaleDateString()}`, 20, 38)
    doc.text(`Patient: ${response.user.name || 'Unknown'}`, 20, 46)

    doc.setDrawColor(200, 200, 200)
    doc.line(20, 50, 190, 50)

    // Score & Interpretation
    doc.setFontSize(16)
    doc.setTextColor(50, 50, 50)
    doc.text('Results', 20, 65)

    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Total Score: ${response.score}`, 20, 75)
    
    if (response.result) {
      doc.setFontSize(11)
      doc.setTextColor(80, 80, 80)
      const splitText = doc.splitTextToSize(`Clinical Interpretation: ${response.result}`, 170)
      doc.text(splitText, 20, 85)
    }

    // Footer
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.text('This report is system-generated and constitutes part of the secure electronic health record.', 20, 280)

    // Output PDF as a buffer
    const pdfOutput = doc.output('arraybuffer')

    return new NextResponse(pdfOutput, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="oku-assessment-${id}.pdf"`
      }
    })

  } catch (error) {
    console.error('PDF Generation Error:', error)
    return new NextResponse('Error generating report', { status: 500 })
  }
}
