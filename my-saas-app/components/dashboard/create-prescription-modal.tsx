"use client";

import { useLanguage } from "@/components/language-context";
import { useState } from "react";
import { X, Plus, Pill, Trash2, Save } from "lucide-react";
import { createPrescription } from "@/app/actions";

interface Props {
  patientId: string;
}

export function CreatePrescriptionModal({ patientId }: Props) {
  const { isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  // حالة لتخزين قائمة الأدوية
  const [meds, setMeds] = useState([{ name: "", dose: "", freq: "" }]);

  // إضافة سطر جديد
  const addRow = () => {
    setMeds([...meds, { name: "", dose: "", freq: "" }]);
  };

  // حذف سطر
  const removeRow = (index: number) => {
    const newMeds = [...meds];
    newMeds.splice(index, 1);
    setMeds(newMeds);
  };

  // تحديث البيانات عند الكتابة
  const updateMed = (index: number, field: string, value: string) => {
    const newMeds = [...meds] as any;
    newMeds[index][field] = value;
    setMeds(newMeds);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
      >
        <Plus className="w-4 h-4"/> New Prescription
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-slate-50 p-5 flex justify-between items-center border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Pill className="w-5 h-5 text-indigo-600" /> Write Prescription
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <form action={async (fd) => { await createPrescription(fd); setIsOpen(false); setMeds([{name:"", dose:"", freq:""}]); }} className="p-6 overflow-y-auto">
              
              <input type="hidden" name="patientId" value={patientId} />
              <input type="hidden" name="medications" value={JSON.stringify(meds)} />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-slate-400 uppercase">Medications List</label>
                   <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                      {meds.length} Items
                   </span>
                </div>
                
                {meds.map((med, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    {/* ✅ تم إضافة text-slate-900 لضمان ظهور النص باللون الأسود */}
                    <input 
                      placeholder="Medicine Name (e.g. Panadol)" 
                      value={med.name}
                      onChange={(e) => updateMed(index, "name", e.target.value)}
                      required
                      className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                    <input 
                      placeholder="Dose" 
                      value={med.dose}
                      onChange={(e) => updateMed(index, "dose", e.target.value)}
                      className="w-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                    <input 
                      placeholder="Freq" 
                      value={med.freq}
                      onChange={(e) => updateMed(index, "freq", e.target.value)}
                      className="w-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                    {index > 0 && (
                      <button type="button" onClick={() => removeRow(index)} className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                <button type="button" onClick={addRow} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-bold text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 mt-2">
                  <Plus className="w-4 h-4" /> Add another medicine
                </button>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Notes / Instructions</label>
                {/* ✅ تم إضافة text-slate-900 هنا أيضاً */}
                <textarea 
                  name="notes" 
                  rows={3} 
                  placeholder="Additional instructions for the patient..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                ></textarea>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-100 mt-6">
                <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl transition-all flex items-center gap-2 transform active:scale-95">
                   <Save className="w-4 h-4" /> Save Prescription
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}