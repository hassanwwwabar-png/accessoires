"use client";

import { useLanguage } from "@/components/language-context";
import { useState } from "react";
import { X, Plus, FileText, User, DollarSign } from "lucide-react";
import { createInvoice } from "@/app/actions";

interface NewInvoiceModalProps {
  patients: any[];
}

export function NewInvoiceModal({ patients }: NewInvoiceModalProps) {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
      >
        <Plus className="w-4 h-4"/> New Invoice
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Header */}
            <div className="bg-slate-50 p-5 flex justify-between items-center border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> Create Invoice
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <form action={async (fd) => { await createInvoice(fd); setIsOpen(false); }} className="p-6 space-y-4">
              
              {/* Select Patient */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Select Patient</label>
                <div className="relative">
                  <User className={`absolute top-3.5 w-4 h-4 text-slate-400 ${isRTL ? 'left-auto right-3' : 'left-3'}`}/>
                  <select name="patientId" required className={`w-full py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}>
                    <option value="">-- Choose Patient --</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Amount ($)</label>
                <div className="relative">
                    <DollarSign className={`absolute top-3.5 w-4 h-4 text-slate-400 ${isRTL ? 'left-auto right-3' : 'left-3'}`}/>
                    <input type="number" step="0.01" name="amount" required placeholder="0.00" className={`w-full py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'}`} />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Date</label>
                <input type="date" name="date" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" />
              </div>

               {/* Status */}
               <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Status</label>
                <select name="status" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none">
                    <option value="Paid">Paid (Green)</option>
                    <option value="Pending">Pending (Orange)</option>
                    <option value="Cancelled">Cancelled (Red)</option>
                </select>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg mt-2">
                Save Invoice
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
}