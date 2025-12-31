"use client";

import { useLanguage } from "@/components/language-context";
import { X, Printer, Trash2 } from "lucide-react";
import { deletePrescription } from "@/app/actions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  prescription: any;
  client: any; // بيانات الطبيب
  patient: any; // بيانات المريض
}

export function PrescriptionModal({ isOpen, onClose, prescription, client, patient }: Props) {
  const { isRTL } = useLanguage();

  if (!isOpen || !prescription) return null;

  // تحويل النص المخزن في قاعدة البيانات إلى مصفوفة
  const medications = JSON.parse(prescription.medications || "[]");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in print:p-0 print:bg-white print:absolute print:inset-0 print:z-[9999] print:items-start" onClick={onClose}>
      
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none print:w-full print:max-w-none print:overflow-visible" onClick={e => e.stopPropagation()}>
        
        {/* Actions Header (Hidden on Print) */}
        <div className="p-4 flex justify-between items-center border-b border-slate-100 bg-slate-50 print:hidden">
          <h3 className="font-bold text-slate-800">Prescription Details</h3>
          <div className="flex gap-2">
             <form action={deletePrescription} onSubmit={(e) => !confirm("Delete this prescription?") && e.preventDefault()}>
                <input type="hidden" name="id" value={prescription.id} />
                <input type="hidden" name="patientId" value={patient.id} />
                <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors" title="Delete">
                  <Trash2 className="w-5 h-5" />
                </button>
             </form>
             <button onClick={() => window.print()} className="p-2 hover:bg-white text-slate-600 rounded-lg transition-colors" title="Print">
                <Printer className="w-5 h-5" />
             </button>
             <button onClick={onClose} className="p-2 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors">
                <X className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* 📄 Rx Paper Design */}
        <div className="p-10 bg-white overflow-y-auto print:overflow-visible min-h-[600px] relative">
          
          {/* Header (Clinic Info) */}
          <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-start">
             <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest">{client.clinicName || "My Clinic"}</h1>
                <p className="font-bold text-slate-600 mt-1">Dr. {client.doctorName}</p>
                <p className="text-sm text-slate-500">{client.specialty}</p>
             </div>
             <div className="text-right text-sm text-slate-500">
                <p>{client.address}</p>
                <p>{client.phone}</p>
                <p>{client.email}</p>
             </div>
          </div>

          {/* Patient Info */}
          <div className="flex justify-between items-end mb-10 text-sm">
             <div className="w-2/3">
                <p className="text-slate-400 font-bold uppercase text-xs mb-1">Patient Name</p>
                <p className="text-xl font-black text-slate-800 border-b border-slate-200 pb-1 w-full">
                  {patient.firstName} {patient.lastName}
                </p>
             </div>
             <div className="w-1/4 text-right">
                <p className="text-slate-400 font-bold uppercase text-xs mb-1">Date</p>
                <p className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-1">
                   {new Date(prescription.createdAt).toLocaleDateString()}
                </p>
             </div>
          </div>

          {/* RX Symbol */}
          <div className="mb-6">
             <h1 className="text-6xl font-serif italic font-black text-slate-900">Rx</h1>
          </div>

          {/* Medications List */}
          <div className="space-y-6 ml-4 mb-12">
             {medications.map((med: any, i: number) => (
                <div key={i} className="relative pl-6 border-l-2 border-slate-200">
                   <h3 className="text-lg font-black text-slate-900">{med.name}</h3>
                   <p className="text-slate-600 font-medium">
                      {med.dose} <span className="mx-2 text-slate-300">|</span> {med.freq}
                   </p>
                </div>
             ))}
          </div>

          {/* Notes */}
          {prescription.notes && (
             <div className="mb-12 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase mb-1">Notes</p>
                <p className="text-slate-700 font-medium text-sm">{prescription.notes}</p>
             </div>
          )}

          {/* Signature */}
          <div className="absolute bottom-10 right-10 w-64 text-center">
             <div className="border-b-2 border-slate-800 mb-2"></div>
             <p className="text-xs font-bold text-slate-400 uppercase">Doctor's Signature</p>
          </div>

        </div>
      </div>
    </div>
  );
}