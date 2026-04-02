import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { jsPDF } from 'jspdf'
import { formatCurrency } from '@/lib/currency'

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
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: true,
        appointment: {
          include: {
            service: true,
            practitioner: true
          }
        }
      }
    })

    if (!payment) {
      return new NextResponse('Invoice not found', { status: 404 })
    }

    // Security: Only the user who paid, their therapist, or an admin
    const isOwner = payment.userId === session.user.id
    const isTherapist = payment.appointment?.practitionerId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isOwner && !isTherapist && !isAdmin) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Generate PDF
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(22)
    doc.text('INVOICE', 105, 20, { align: 'center' })
    
    doc.setFontSize(10)
    doc.text('OKU Therapy Platform', 20, 40)
    doc.text('GSTIN: 07AABCM1234Z1Z', 20, 45)
    doc.text('support@okutherapy.com', 20, 50)

    doc.text(`Invoice ID: ${payment.id.toUpperCase()}`, 140, 40)
    doc.text(`Date: ${payment.createdAt.toLocaleDateString()}`, 140, 45)
    doc.text(`Status: ${payment.status}`, 140, 50)

    doc.line(20, 60, 190, 60)

    // Bill To
    doc.setFontSize(12)
    doc.text('Bill To:', 20, 75)
    doc.setFontSize(10)
    doc.text(`${payment.user.name}`, 20, 82)
    doc.text(`${payment.user.email}`, 20, 87)

    // Details Table
    doc.line(20, 100, 190, 100)
    doc.text('Description', 25, 107)
    doc.text('Amount', 160, 107)
    doc.line(20, 112, 190, 112)

    const serviceName = payment.appointment?.service?.name || 'Therapy Session'
    const practitionerName = payment.appointment?.practitioner?.name || 'OKU Specialist'
    
    doc.text(`${serviceName} with ${practitionerName}`, 25, 122)
    doc.text(`${formatCurrency(payment.amount, 'INR')}`, 160, 122)

    doc.line(20, 132, 190, 132)
    doc.setFontSize(14)
    doc.text('Total Paid:', 120, 145)
    doc.text(`${formatCurrency(payment.amount, 'INR')}`, 160, 145)

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Thank you for choosing OKU for your healing journey.', 105, 280, { align: 'center' })

    const pdfOutput = doc.output('arraybuffer')

    return new NextResponse(pdfOutput, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="oku-invoice-${id}.pdf"`
      }
    })

  } catch (error) {
    console.error('Invoice Generation Error:', error)
    return new NextResponse('Error generating invoice', { status: 500 })
  }
}
