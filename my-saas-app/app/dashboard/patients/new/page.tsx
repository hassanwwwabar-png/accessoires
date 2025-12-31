"use client";

import { createPatient } from "@/app/actions";
import { User, Phone, Calendar, Droplets, ShieldAlert, MapPin, HeartPulse, Pill, Contact } from "lucide-react";
import { useLanguage } from "@/components/language-context";

export default function NewPatientPage() {
  const { t, isRTL } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-black text-slate-800 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
            <User className="w-6 h-6" />
          </div>
          {t.newPatientTitle}
        </h2>
        <p className={`text-slate-500 text-sm font-bold mt-2 ${isRTL ? 'text-right' : ''}`}>
          Fill in the basic info. You can add more details later.
        </p>
      </div>

      <form action={createPatient} className="space-y-8">
        
        {/* 1️⃣ SECTION: IDENTITY (Essential) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className={`text-lg font-black text-slate-800 mb-6 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <User className="w-5 h-5 text-blue-600" /> {t.sectionIdentity}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={`text-xs font-black text-slate-500 uppercase ml-1 block ${isRTL ? 'text-right' : ''}`}>{t.firstName} <span className="text-red-500">*</span></label>
              <input name="firstName" required className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-600/20" />
            </div>
            <div className="space-y-1">
              <label className={`text-xs font-black text-slate-500 uppercase ml-1 block ${isRTL ? 'text-right' : ''}`}>{t.lastName} <span className="text-red-500">*</span></label>
              <input name="lastName" required className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-600/20" />
            </div>
            <div className="space-y-1">
              <label className={`text-xs font-black text-slate-500 uppercase ml-1 block ${isRTL ? 'text-right' : ''}`}>{t.cin}</label>
              <input name="cin" placeholder="AB123456" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-600/20" />
            </div>
            <div className="space-y-1">
              <label className={`text-xs font-black text-slate-500 uppercase ml-1 block ${isRTL ? 'text-right' : ''}`}>{t.birthDate}</label>
              <input name="birthDate" type="date" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-600/20" />
            </div>
            <div className="space-y-1">
              <label className={`text-xs font-black text-slate-500 uppercase ml-1 block ${isRTL ? 'text-right' : ''}`}>{t.gender}</label>
              <select name="gender" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-600/20">
                <option value="Male">{t.male}</option>
                <option value="Female">{t.female}</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2️⃣ SECTION: CONTACT (Includes Emergency) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className={`text-lg font-black text-slate-800 mb-6 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MapPin className="w-5 h-5 text-indigo-600" /> {t.sectionContact}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={`text-xs font-black text-slate-500 uppercase ml-1 block ${isRTL ? 'text-right' : ''}`}>{t.phone} <span className="text-red-500">*</span></label>
              <input name="phone" required placeholder="+212..." className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600/20" />
            </div>
            <div className="space-y-1">
              <label className={`text-xs font-black text-slate-500 uppercase ml-1 block ${isRTL ? 'text-right' : ''}`}>{t.email}</label>
              <input name="email" type="email" placeholder="email@example.com" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600/20" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className={`text-xs font-black text-slate-500 uppercase ml-1 block ${isRTL ? 'text-right' : ''}`}>{t.address}</label>
              <input name="address" placeholder={t.addressPlaceholder} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-600/20" />
            </div>
          </div>

          {/* Emergency Sub-section */}
          <div className="mt-6 pt-6 border-t border-slate-100">
             <h4 className={`text-xs font-black text-slate-400 uppercase mb-4 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
               <Contact className="w-4 h-4"/> {t.emergencyContact} (Optional)
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="emergencyName" placeholder={t.emergencyName} className="w-full px-4 py-3 bg-red-50/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-200" />
                <input name="emergencyPhone" placeholder={t.emergencyPhone} className="w-full px-4 py-3 bg-red-50/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-200" />
             </div>
          </div>
        </div>

        {/* 3️⃣ SECTION: MEDICAL PROFILE (Advanced) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className={`text-lg font-black text-slate-800 mb-6 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <HeartPulse className="w-5 h-5 text-rose-600" /> {t.sectionMedical}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-1">
              <label className={`text-xs font-black text-slate-500 uppercase ml-1 block ${isRTL ? 'text-right' : ''}`}>{t.bloodType}</label>
              <select name="bloodType" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600/20">
                <option value="">- Unknown -</option>
                <option value="A+">A+</option> <option value="A-">A-</option>
                <option value="B+">B+</option> <option value="B-">B-</option>
                <option value="O+">O+</option> <option value="O-">O-</option>
                <option value="AB+">AB+</option> <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <label className={`text-xs font-black text-slate-500 uppercase ml-1 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <ShieldAlert className="w-3 h-3 text-red-500" /> {t.allergies}
              </label>
              <textarea name="allergies" rows={2} placeholder={t.allergiesPlaceholder} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600/20" />
            </div>

            <div className="space-y-1">
              <label className={`text-xs font-black text-slate-500 uppercase ml-1 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <HeartPulse className="w-3 h-3 text-orange-500" /> {t.chronicDiseases}
              </label>
              <textarea name="chronicDiseases" rows={2} placeholder={t.chronicPlaceholder} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600/20" />
            </div>

            <div className="space-y-1">
              <label className={`text-xs font-black text-slate-500 uppercase ml-1 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Pill className="w-3 h-3 text-blue-500" /> {t.currentMedications}
              </label>
              <textarea name="currentMedications" rows={2} placeholder={t.medicationsPlaceholder} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-600/20" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 pb-10">
          <button type="button" className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all">
            {t.cancel}
          </button>
          <button type="submit" className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-300 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all">
            {t.save}
          </button>
        </div>

      </form>
    </div>
  );
}