"use client";

import { useState } from "react";
import { Bell, ChevronDown, Globe, Check, Menu } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { QuickAddModal } from "@/components/dashboard/quick-add-modal";

interface HeaderProps {
  doctorName?: string | null;
  clinicName?: string | null;
}

export function Header({ doctorName, clinicName }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang } = useLanguage();

  const languages = [
    { name: "English", code: "en" as const, flag: "🇺🇸" },
    { name: "Français", code: "fr" as const, flag: "🇫🇷" },
    { name: "العربية", code: "ar" as const, flag: "🇲🇦" },
  ];

  const currentLangName = languages.find(l => l.code === lang)?.name;
  
  const safeDoctorName = doctorName || "Doctor";
  const safeClinicName = clinicName || "My Clinic";

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm transition-all">
      
      {/* Left Side: Mobile Menu & Clinic Name */}
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        {/* عرض اسم العيادة في الموبايل بدلاً من البحث */}
        <div className="md:hidden font-black text-slate-800 text-lg">
          {safeClinicName}
        </div>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center gap-3 md:gap-6 ml-auto">
        
        {/* 1. ⚡ Quick Add Button */}
        <QuickAddModal />

        {/* 2. 🌍 Language Switcher */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-3 py-2 rounded-xl transition-all border border-transparent hover:border-slate-100"
          >
             <Globe className="w-4 h-4 text-blue-600" />
             <span className="text-sm font-bold text-slate-600 hidden md:block">{currentLangName}</span>
             <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
              <div className="absolute ltr:right-0 rtl:left-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-20 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-200">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                      lang === l.code ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{l.flag}</span> {l.name}
                    </span>
                    {lang === l.code && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 3. Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
          <Bell className="w-6 h-6 md:w-5 md:h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        {/* 4. User Profile */}
        <div className="hidden md:flex items-center gap-3 ltr:pl-6 rtl:pr-6 ltr:border-l rtl:border-r border-slate-100">
          <div className="text-right">
            <p className="text-sm font-black text-slate-800 leading-none mb-1">{safeDoctorName}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{safeClinicName}</p>
          </div>
          <div className="w-10 h-10 bg-slate-900 rounded-full text-white flex items-center justify-center font-black shadow-lg shadow-slate-200">
            {safeDoctorName[0]}
          </div>
        </div>

      </div>
    </header>
  );
}