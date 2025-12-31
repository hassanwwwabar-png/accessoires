"use client";

import { useLanguage } from "@/components/language-context";
import { useState } from "react";
import { X, Plus, Calendar, User } from "lucide-react";
import { createAppointment } from "@/app/actions";

interface NewAppointmentModalProps {
  patients: any[]; // نحتاج قائمة المرضى للاختيار منها
}

export function NewAppointmentModal({ patients }: NewAppointmentModalProps) {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
      >
        <Plus className="w-4 h-4"/> New Appointment
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Header */}
            <div className="bg-slate-50 p-5 flex justify-between items-center border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" /> New Appointment
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <form action={async (fd) => { await createAppointment(fd); setIsOpen(false); }} className="p-6 space-y-4">
              
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

              {/* Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Date & Time</label>
                <input type="datetime-local" name="date" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" />
              </div>

              {/* Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Type (e.g. Visit)</label>
                <input name="type" placeholder="Consultation" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" />
              </div>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg mt-2">
                Save Appointment
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
}