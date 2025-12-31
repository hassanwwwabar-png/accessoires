"use client";

import { useLanguage } from "@/components/language-context";
import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
  const { lang, setLang, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇲🇦' },
  ];

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <div className="relative">
      {/* Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-bold text-slate-700 hidden md:block">{currentLang.label}</span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          <div className={`absolute top-full mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden ${isRTL ? 'left-0' : 'right-0'}`}>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code as 'en' | 'ar' | 'fr');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-slate-50 transition-colors ${
                  lang === l.code ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                } ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
              >
                <span className="text-lg">{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}