"use client";

import { useLanguage } from "@/components/language-context";
import { X, Printer } from "lucide-react";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
}

// ✅ هذا الملف يجب أن يحتوي على InvoiceModal فقط
export function InvoiceModal({ isOpen, onClose, invoice }: InvoiceModalProps) {
  const { t, isRTL } = useLanguage();

  if (!isOpen || !invoice) return null;

  // التعامل مع البيانات
  const client = invoice.client || {};
  const clinicName = client.clinicName || "My Clinic";
  const doctorName = client.doctorName || "Doctor";
  const specialty = client.specialty || "General Medicine";
  const address = client.address || "";
  const phone = client.phone || "";

  const patient = invoice.patient || {};
  const patientName = `${patient.firstName} ${patient.lastName}`;
  const patientId = patient.id ? patient.id.slice(0, 6) : "---";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in print:p-0 print:bg-white print:absolute print:inset-0 print:z-[9999] print:items-start" 
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none print:w-full print:max-w-none print:overflow-visible" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-slate-100 bg-slate-50 print:hidden">
          <h3 className="font-bold text-slate-800">Invoice #{invoice.id.slice(0, 8)}</h3>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors">
               <Printer className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
               <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Content */}
        <div className="p-8 overflow-y-auto bg-white print:overflow-visible" id="printable-invoice">
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-2xl font-black print:text-black print:border print:border-black">
                {clinicName[0]}
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900">{clinicName}</h1> 
                <p className="text-xs font-bold text-slate-400">Medical Invoice</p>
              </div>
            </div>
            <div className={`text-${isRTL ? 'left' : 'right'}`}>
              <p className="text-xs font-bold text-slate-400 uppercase">{t.invoiceDate}</p>
              <p className="text-lg font-black text-slate-800">{new Date(invoice.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase mb-2">{t.from}</p>
              <h3 className="text-lg font-black text-slate-800">{doctorName}</h3>
              <p className="text-sm font-bold text-slate-500">{specialty}</p>
              <p className="text-xs text-slate-400 mt-1">{address}</p>
              <p className="text-xs text-slate-400">{phone}</p>
            </div>
            <div className={`text-${isRTL ? 'left' : 'right'}`}>
              <p className="text-xs font-black text-slate-400 uppercase mb-2">{t.billTo}</p>
              <h3 className="text-lg font-black text-slate-800">{patientName}</h3>
              <p className="text-sm font-bold text-slate-500">ID: {patientId}</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 print:bg-transparent print:border print:border-slate-200">
             <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">Medical Consultation</span>
                <span className="font-black text-slate-900 text-lg">${invoice.amount}</span>
             </div>
          </div>
          <div className="flex justify-end mb-8">
             <div className={`text-${isRTL ? 'left' : 'right'}`}>
                <p className="text-xs font-black text-slate-400 uppercase">{t.totalRevenue}</p>
                <p className="text-4xl font-black text-blue-600">${invoice.amount}</p>
             </div>
          </div>
          <div className="text-center pt-8 border-t border-slate-100">
             <p className="text-slate-400 text-xs font-bold mt-3">{t.thankYou}</p>
          </div>
        </div>
      </div>
    </div>
  );
}