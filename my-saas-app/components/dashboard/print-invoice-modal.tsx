"use client";

import { useLanguage } from "@/components/language-context";
import { X, Printer, MapPin, Phone } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
}

export function PrintInvoiceModal({ isOpen, onClose, invoice }: Props) {
  const { t, isRTL } = useLanguage();

  if (!isOpen || !invoice) return null;

  // تجاوز فحص TypeScript للترجمات المفقودة
  const trans = t as any;

  // 1️⃣ Extract Dynamic Data
  const client = invoice.client || {};
  const clinicName = client.clinicName || client.doctorName || "Medical Clinic";
  const doctorName = client.doctorName || "Doctor";
  const specialty = client.specialty || "General Medicine";
  const address = client.address || "";
  const phone = client.phone || "";
  
  // ✅ Get Currency from settings
  const currency = client.currency || "MAD"; 

  const patient = invoice.patient || {};
  const patientName = patient.firstName 
    ? `${patient.firstName} ${patient.lastName}` 
    : patient.name || "Unknown Patient";
    
  const patientId = patient.id ? patient.id.slice(0, 6).toUpperCase() : "---";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in print:p-0 print:bg-white print:absolute print:inset-0 print:z-[9999] print:items-start" 
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none print:w-full print:max-w-none print:overflow-visible" 
        onClick={e => e.stopPropagation()}
      >
        
        {/* --- Header (Hidden in Print) --- */}
        <div className="p-4 flex justify-between items-center border-b border-slate-100 bg-slate-50 print:hidden">
          <h3 className="font-bold text-slate-800">Invoice #{invoice.id.slice(0, 8)}</h3>
          <div className="flex gap-2">
            <button 
                onClick={() => window.print()} 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-sm"
            >
               <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={onClose} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
               <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- Printable Content --- */}
        <div className="p-10 overflow-y-auto bg-white print:overflow-visible text-slate-900" id="printable-invoice">
          
          {/* Clinic Header */}
          <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black print:text-black print:border print:border-black">
                {clinicName[0]}
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{clinicName}</h1> 
                <p className="text-sm font-bold text-slate-500">Dr. {doctorName}</p>
                <p className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-wider">Medical Invoice</p>
              </div>
            </div>
            <div className={`text-${isRTL ? 'left' : 'right'}`}>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{trans.date || "Date"}</p>
              <p className="text-xl font-black text-slate-800">{new Date(invoice.date || invoice.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            
            {/* From (Doctor) */}
            <div>
              <p className="text-xs font-black text-slate-400 uppercase mb-3 tracking-wider">{trans.from || "From"}</p>
              <h3 className="text-lg font-black text-slate-800">{doctorName}</h3>
              <p className="text-sm font-bold text-slate-500 mb-2">{specialty}</p>
              
              <div className="space-y-1">
                 {address && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {address}
                    </p>
                 )}
                 {phone && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {phone}
                    </p>
                 )}
              </div>
            </div>

            {/* To (Patient) */}
            <div className={`text-${isRTL ? 'left' : 'right'}`}>
              <p className="text-xs font-black text-slate-400 uppercase mb-3 tracking-wider">{trans.billTo || "Bill To"}</p>
              <h3 className="text-xl font-black text-slate-800">{patientName}</h3>
              <p className="text-sm font-bold text-slate-500 bg-slate-100 inline-block px-2 py-1 rounded-md mt-1">
                ID: {patientId}
              </p>
            </div>
          </div>

          {/* Service Details */}
          <table className="w-full mb-8">
            <thead>
                <tr className="border-b-2 border-slate-900">
                    <th className="text-left py-3 font-black uppercase text-xs tracking-wider">Description</th>
                    <th className="text-right py-3 font-black uppercase text-xs tracking-wider">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-b border-slate-100">
                    <td className="py-6 text-sm font-bold text-slate-700">Medical Consultation</td>
                    <td className="py-6 text-right font-black text-slate-900">
                        {invoice.amount} <span className="text-xs text-slate-400">{currency}</span>
                    </td>
                </tr>
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-end mb-12">
             <div className="w-1/2">
                <div className="flex justify-between items-center py-4 border-t border-slate-100">
                   {/* ✅ تم التصحيح هنا: استخدام trans.total بدلاً من t.total لتفادي الخطأ */}
                   <p className="text-sm font-black text-slate-400 uppercase tracking-wider">{trans.total || "Total"}</p>
                   <p className="text-4xl font-black text-blue-600">
                      {invoice.amount} <span className="text-lg text-blue-300">{currency}</span>
                   </p>
                </div>
             </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t-2 border-slate-100 border-dashed">
             <p className="text-slate-800 font-black text-sm">{trans.thankYou || "Thank you for your trust."}</p>
             <p className="text-slate-400 text-xs mt-1">If you have questions, contact us at {phone}</p>
          </div>

        </div>
      </div>
    </div>
  );
}