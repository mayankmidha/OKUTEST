'use client'

import { useState, useEffect } from 'react'
import { 
  CreditCard, Download, ExternalLink, 
  Loader2, Receipt, CheckCircle2, AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/currency'

interface Payment {
  id: string
  amount: number
  status: string
  processor: string
  createdAt: string
  appointment: {
    startTime: string
    service: {
      name: string
    }
  }
}

export function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/user/payments')
      if (res.ok) setPayments(await res.json())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-oku-dark tracking-tight">Financial Records</h2>
        <p className="text-[10px] uppercase tracking-widest font-black text-oku-taupe/60 mt-1">Invoices & Payment History</p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-oku-purple" /></div>
      ) : payments.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-oku-taupe/20">
           <Receipt size={40} className="mx-auto text-oku-taupe/20 mb-4" strokeWidth={1} />
           <p className="text-oku-taupe font-display italic">No payment records found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map(payment => (
            <motion.div 
              key={payment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[2.5rem] border border-oku-taupe/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${payment.status === 'COMPLETED' ? 'bg-oku-mint text-oku-mint-dark' : 'bg-oku-peach/30 text-oku-peach-dark'}`}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-oku-dark">{payment.appointment.service.name}</h3>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${payment.status === 'COMPLETED' ? 'bg-oku-mint text-oku-darkgrey/60' : 'bg-oku-peach text-oku-darkgrey/60'}`}>
                        {payment.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-oku-taupe uppercase tracking-widest font-black opacity-40 mt-1">
                    Session on {new Date(payment.appointment.startTime).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 md:border-l border-oku-taupe/5 pt-6 md:pt-0 md:pl-10">
                 <div className="text-right">
                    <p className="text-xl font-display font-bold text-oku-dark">{formatCurrency(payment.amount, 'INR')}</p>
                    <p className="text-[9px] text-oku-taupe uppercase tracking-widest font-black opacity-40">{payment.processor}</p>
                 </div>
                 <button 
                   onClick={() => window.alert("Downloading Invoice...")}
                   className="p-4 bg-oku-dark text-white rounded-full hover:bg-oku-purple transition-all shadow-xl"
                 >
                   <Download size={18} />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
