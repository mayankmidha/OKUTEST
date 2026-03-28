import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Printer, ArrowLeft } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import { getAppointmentBillingAmount } from '@/lib/pricing'

export default async function SuperbillPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params
  
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const appointment = await prisma.appointment.findUnique({
    where: { 
        id: id,
        clientId: session.user.id
    },
    include: {
      practitioner: {
          include: { practitionerProfile: true }
      },
      client: {
          include: { intakeForm: true }
      },
      service: true,
      payments: true
    }
  })

  if (!appointment || appointment.status !== 'COMPLETED' || !appointment.client) {
    return (
        <div className="min-h-screen bg-oku-cream flex items-center justify-center p-6">
            <div className="text-center">
                <p className="text-xl font-display text-oku-dark mb-4">Superbill unavailable.</p>
                <p className="text-oku-taupe italic">Patient data or completion record not found.</p>
                <Link href="/dashboard/client/book" className="mt-8 inline-block text-[10px] font-black uppercase tracking-widest text-oku-purple hover:underline">Return to History</Link>
            </div>
        </div>
    )
  }

  const payment = appointment.payments[0]
  const appointmentAmount = getAppointmentBillingAmount(appointment)
  const amountPaid = payment ? payment.amount : appointmentAmount
  const receiptNumber = payment ? payment.id.toUpperCase().slice(-8) : `SB-${appointment.id.toUpperCase().slice(-6)}`

  return (
    <div className="min-h-screen bg-oku-cream py-12 px-6 print:bg-white print:py-0 print:px-0">
      <div className="max-w-3xl mx-auto">
        
        {/* Web Only Controls */}
        <div className="mb-8 flex items-center justify-between print:hidden">
            <Link href="/dashboard/client/book" className="text-[10px] uppercase tracking-[0.4em] font-black text-oku-taupe hover:text-oku-dark flex items-center gap-2">
                <ArrowLeft size={12} /> Back to Sessions
            </Link>
            <button 
                // Note: Simple print trigger. In a complex app, we'd use a PDF generation library.
                className="btn-primary py-3 px-6 flex items-center gap-2 shadow-xl text-[10px]"
            >
                <Printer size={14} /> Print for Insurance
            </button>
        </div>

        {/* Superbill Document (Printable) */}
        <div className="bg-white p-12 md:p-16 rounded-[2.5rem] shadow-sm border border-oku-taupe/10 print:shadow-none print:border-none print:rounded-none">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-16 border-b border-oku-taupe/20 pb-8">
                <div>
                    <h1 className="text-4xl font-display font-bold text-oku-dark tracking-tight mb-2">Superbill / Receipt</h1>
                    <p className="text-xs uppercase tracking-widest font-black text-oku-taupe">Receipt #{receiptNumber}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-display font-bold text-oku-dark">Oku Therapy Collective</h2>
                    <p className="text-sm text-oku-taupe mt-1">support@okutherapy.com</p>
                    <p className="text-sm text-oku-taupe">www.okutherapy.com</p>
                </div>
            </div>

            {/* Provider & Patient Details */}
            <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-purple mb-4">Provider Details</h3>
                    <p className="font-bold text-oku-dark text-lg">{appointment.practitioner.name}</p>
                    <p className="text-sm text-oku-taupe mt-1">NPI: {appointment.practitioner.practitionerProfile?.npiNumber || 'Pending'}</p>
                    <p className="text-sm text-oku-taupe">License: {appointment.practitioner.practitionerProfile?.licenseNumber || 'Pending'}</p>
                </div>
                <div>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-purple mb-4">Patient Details</h3>
                    <p className="font-bold text-oku-dark text-lg">{appointment.client.intakeForm?.legalName || appointment.client.name}</p>
                    <p className="text-sm text-oku-taupe mt-1 whitespace-pre-wrap">{appointment.client.intakeForm?.currentAddress || 'Address not provided'}</p>
                </div>
            </div>

            {/* Service Details Table */}
            <div className="mb-16">
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-oku-dark mb-4">Service Information</h3>
                <table className="w-full text-left border-collapse">
                    <thead className="border-b border-t border-oku-taupe/20">
                        <tr>
                            <th className="py-4 text-xs font-black uppercase tracking-widest text-oku-taupe">Date of Service</th>
                            <th className="py-4 text-xs font-black uppercase tracking-widest text-oku-taupe">Service / CPT Code</th>
                            <th className="py-4 text-xs font-black uppercase tracking-widest text-oku-taupe">Diagnosis (ICD-10)</th>
                            <th className="py-4 text-xs font-black uppercase tracking-widest text-oku-taupe text-right">Fee</th>
                        </tr>
                    </thead>
                    <tbody className="border-b border-oku-taupe/20">
                        <tr>
                            <td className="py-6 font-medium">{new Date(appointment.startTime).toLocaleDateString()}</td>
                            <td className="py-6">
                                <p className="font-bold">{appointment.service.name}</p>
                                <p className="text-xs text-oku-taupe mt-1">CPT: 90837 (Psychotherapy, 60 mins)</p>
                            </td>
                            <td className="py-6 text-sm text-oku-taupe">Z65.8 (Other specified problems)</td>
                            <td className="py-6 font-bold text-right">{formatCurrency(appointmentAmount, 'INR')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Total */}
            <div className="flex justify-end">
                <div className="w-64">
                    <div className="flex justify-between py-2 text-sm text-oku-taupe">
                        <span>Total Billed:</span>
                        <span>{formatCurrency(appointmentAmount, 'INR')}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm text-oku-taupe">
                        <span>Patient Paid:</span>
                        <span>-{formatCurrency(amountPaid, 'INR')}</span>
                    </div>
                    <div className="flex justify-between py-4 border-t border-oku-dark mt-2 font-display font-bold text-xl text-oku-dark">
                        <span>Balance Due:</span>
                        <span>{formatCurrency(0, 'INR')}</span>
                    </div>
                </div>
            </div>

            {/* Footer Signature */}
            <div className="mt-24 pt-8 border-t border-oku-taupe/10 text-center text-xs text-oku-taupe">
                <p>This document serves as a receipt and superbill for services rendered.</p>
                <p>Provider Signature on File.</p>
            </div>
        </div>
      </div>
    </div>
  )
}
