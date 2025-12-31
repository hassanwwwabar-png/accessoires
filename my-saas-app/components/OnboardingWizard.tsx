"use client";

import { saveSettings } from "@/app/actions";
import { useState } from "react";
import { Settings, Palette, LayoutTemplate, CheckCircle, ArrowRight } from "lucide-react";

export default function OnboardingWizard() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-blue-600 p-8 text-center">
           <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
             <Settings className="w-8 h-8 text-white" />
           </div>
           <h2 className="text-3xl font-bold text-white mb-2">Welcome, Doctor! 👨‍⚕️</h2>
           <p className="text-blue-100">Let's set up your clinic profile in 30 seconds.</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form 
            action={async (formData) => {
              setIsSubmitting(true);
              await saveSettings(formData);
              // الصفحة ستعيد التحميل تلقائياً وسيختفي المعالج
            }} 
            className="space-y-6"
          > 
             {/* 1. Clinic Name Header */}
             <div>
               <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 items-center gap-2">
                 <LayoutTemplate className="w-4 h-4 text-blue-500" /> Clinic Name (For Prints)
               </label>
               <input 
                 name="printHeader" 
                 placeholder="e.g. Dr. Smith Medical Center" 
                 className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                 required 
               />
             </div>

             {/* 2. Brand Color */}
             <div>
               <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 items-center gap-2">
                 <Palette className="w-4 h-4 text-purple-500" /> Brand Color
               </label>
               <div className="flex items-center gap-4">
                 <input 
                   type="color" 
                   name="color" 
                   defaultValue="#2563eb" 
                   className="h-12 w-20 rounded-lg cursor-pointer border border-slate-200 p-1" 
                 />
                 <span className="text-xs text-slate-500">Choose a color for your dashboard & invoices.</span>
               </div>
             </div>

             {/* Hidden Defaults */}
             <input type="hidden" name="language" value="en" />
             
             {/* Submit Button */}
             <button 
               type="submit" 
               disabled={isSubmitting}
               className="mt-4 w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isSubmitting ? (
                 "Setting up..."
               ) : (
                 <>Complete Setup <ArrowRight className="w-5 h-5" /></>
               )}
             </button>
          </form>
        </div>

      </div>
    </div>
  );
}