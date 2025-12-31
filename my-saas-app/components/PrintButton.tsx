"use client"; // 👈 هذا هو السطر المهم جداً

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all hover:opacity-90 shadow-md"
    >
      <Printer className="w-4 h-4" /> Print
    </button>
  );
}