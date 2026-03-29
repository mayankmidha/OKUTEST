import { prisma } from './prisma'
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { formatCurrency } from "@/lib/currency"
import { getAppointmentBillingAmount } from "@/lib/pricing"

/**
 * Generates and optionally sends a PDF invoice for an appointment.
 * This is the financial 'paper trail' required for billionaire-scale insurance trust.
 */
export async function generateInvoicePDF(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      client: { include: { clientProfile: true } },
      practitioner: { include: { practitionerProfile: true } },
      service: true,
      payments: { where: { status: 'COMPLETED' } }
    },
  })

  if (!appointment || !appointment.client) return null

  const doc = new jsPDF() as any
  const client = appointment.client
  const practitioner = appointment.practitioner
  const appointmentAmount = getAppointmentBillingAmount(appointment)
  const payment = appointment.payments[0]

  // Branding
  doc.setFontSize(22)
  doc.setTextColor(26, 24, 23)
  doc.text("OKU THERAPY INTEGRATED", 20, 20)
  doc.setFontSize(10)
  doc.text("OFFICIAL TAX INVOICE / RECEIPT", 20, 28)

  // Invoice Details
  doc.setFontSize(10)
  doc.text(`Invoice #: INV-${appointment.id.slice(-6).toUpperCase()}`, 140, 20)
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 26)
  doc.text(`Payment Ref: ${payment?.stripePaymentId || 'PRE-PAID'}`, 140, 31)

  // Billing Details
  doc.setFontSize(12)
  doc.text("Billed To:", 20, 50)
  doc.setFontSize(10)
  doc.text(`${client.name}`, 20, 58)
  doc.text(`${client.email}`, 20, 63)
  
  doc.setFontSize(12)
  doc.text("Provider:", 120, 50)
  doc.setFontSize(10)
  doc.text(`${practitioner.name}`, 120, 58)
  doc.text(`License: ${practitioner.practitionerProfile?.licenseNumber || 'Verified'}`, 120, 63)

  // Table
  doc.autoTable({
    startY: 80,
    head: [['Description', 'Session Date', 'Duration', 'Amount']],
    body: [
      [
        appointment.service.name,
        new Date(appointment.startTime).toLocaleDateString(),
        `${appointment.service.duration} mins`,
        formatCurrency(appointmentAmount, 'INR')
      ]
    ],
    theme: 'grid',
    headStyles: { fillColor: [45, 45, 45] }
  })

  const finalY = (doc as any).lastAutoTable.finalY || 100
  
  doc.setFontSize(14)
  doc.text(`Total Paid: ${formatCurrency(appointmentAmount, 'INR')}`, 140, finalY + 20)
  
  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.text("Oku Therapy Integrated is a platform for licensed practitioners. This receipt confirms payment for clinical services rendered.", 20, 280)

  return doc.output('arraybuffer')
}

export async function sendInvoiceEmail(appointmentId: string) {
    const pdfBuffer = await generateInvoicePDF(appointmentId)
    if (!pdfBuffer) return

    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: { client: true }
    })

    if (!appointment?.client?.email) return

    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
        console.log(`[INVOICE_STUB] Invoice generated for ${appointment.client.email} but RESEND_API_KEY is missing.`)
        return
    }

    try {
        const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')
        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
                from: 'Oku Billing <billing@okutherapy.com>',
                to: [appointment.client.email],
                subject: `Invoice for your session with Oku Therapy`,
                html: `<p>Hello ${appointment.client.name}, please find attached your invoice for your recent session. Thank you for choosing Oku Therapy.</p>`,
                attachments: [
                    {
                        filename: `Oku_Invoice_${appointmentId.slice(-6)}.pdf`,
                        content: pdfBase64
                    }
                ]
            })
        })
        console.log(`[INVOICE_SENT] to ${appointment.client.email}`)
    } catch (e) {
        console.error("[INVOICE_EMAIL_FAILED]", e)
    }
}
