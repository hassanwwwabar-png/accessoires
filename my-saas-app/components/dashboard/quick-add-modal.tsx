"use client";

import { useLanguage } from "@/components/language-context";
import { useState } from "react";
import { Zap, X, User, Stethoscope, DollarSign, CheckCircle } from "lucide-react";
import { createQuickVisit } from "@/app/actions";

export function QuickAddModal() {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* الزر السحري في الهيدر */}
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all animate-in fade-in"
      >
        <Zap className="w-4 h-4 fill-white" />
        <span className="hidden md:inline">{t.quickAdd}</span>
      </button>

      {/* النافذة المنبثقة (Modal) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Zap className="w-6 h-6 fill-white/20" /> {t.quickAddTitle}
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form action={async (formData) => {
              await createQuickVisit(formData);
              setIsOpen(false);
            }} className="p-8 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* 1. Patient Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" /> {t.firstName} & {t.lastName}
                  </h4>
                  <div className="space-y-3">
                    <input name="firstName" placeholder={t.firstName} required className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none" />
                    <input name="lastName" placeholder={t.lastName} required className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none" />
                    <input name="phone" placeholder={t.phone} className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none" />
                  </div>
                </div>

                {/* 2. Visit & Payment */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" /> {t.visitDetails}
                  </h4>
                  <div className="space-y-3">
                    <select name="type" className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 outline-none">
                      <option value="Consultation">Consultation</option>
                      <option value="Checkup">Checkup</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                    
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <DollarSign className={`absolute top-3.5 w-4 h-4 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`}/>
                        <input name="amount" type="number" placeholder="0.00" required className={`w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none ${isRTL ? 'pr-9' : 'pl-9'}`} />
                      </div>
                      <select name="paymentStatus" className="w-1/2 p-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 outline-none">
                        <option value="Paid">✅ {t.paid}</option>
                        <option value="Pending">⏳ {t.pending}</option>
                        <option value="Cancelled">❌ {t.cancelled}</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit */}
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 transition-transform active:scale-95">
                <CheckCircle className="w-6 h-6" /> {t.createAll}
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
}