"use client";

import { useLanguage } from "@/components/language-context";
import { useState } from "react";
import { Stethoscope, X, DollarSign, CheckCircle } from "lucide-react";
import { createVisitForPatient } from "@/app/actions";

interface Props {
  patientId: string;
  patientName: string;
}

export function AddVisitModal({ patientId, patientName }: Props) {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* الزر الصغير الذي يظهر في الجدول */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
        title={t.addVisit}
      >
        <Stethoscope className="w-4 h-4" />
      </button>

      {/* النافذة المنبثقة */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Header */}
            <div className="bg-indigo-600 p-5 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Stethoscope className="w-5 h-5" /> {patientName}
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form action={async (formData) => {
              await createVisitForPatient(formData);
              setIsOpen(false);
            }} className="p-6 space-y-4">
              
              <input type="hidden" name="patientId" value={patientId} />

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">{t.consultationType}</label>
                <select name="type" className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none">
                  <option value="Consultation">Consultation</option>
                  <option value="Checkup">Checkup</option>
                  <option value="Emergency">🚨 Emergency</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">{t.fee}</label>
                <div className="relative">
                   <DollarSign className={`absolute top-3.5 w-4 h-4 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`}/>
                   <input name="price" type="number" placeholder="0.00" className={`w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none ${isRTL ? 'pr-9' : 'pl-9'}`} />
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-2">
                <CheckCircle className="w-5 h-5" /> {t.save}
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
}