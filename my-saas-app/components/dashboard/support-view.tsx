"use client";

import { sendReport } from "@/app/actions";
import { useState, useRef } from "react";
import { Headphones, Send, MessageSquare, CheckCircle, Loader2 } from "lucide-react";

export function SupportView() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null); // مرجع للفورم لتفريغه

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setShowSuccess(false);

    // استدعاء دالة السيرفر
    await sendReport(formData);

    setIsLoading(false);
    setShowSuccess(true);
    
    // تفريغ الفورم بعد الإرسال
    formRef.current?.reset();

    // إخفاء رسالة النجاح بعد 3 ثواني
    setTimeout(() => setShowSuccess(false), 3000);
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Headphones className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-800">Support Center</h1>
        <p className="text-slate-500 font-bold mt-2">Have an issue or a suggestion? Send us a message.</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-100 text-green-700 p-4 rounded-2xl font-bold flex items-center gap-2 animate-in zoom-in">
          <CheckCircle className="w-5 h-5" /> Message sent successfully! We'll reply soon.
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">Your Phone (Optional)</label>
            <input 
              name="phone" 
              placeholder="+212 6..." 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">How can we help?</label>
            <div className="relative">
               <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400"/>
               <textarea 
                 name="message" 
                 required 
                 rows={6}
                 placeholder="Describe your issue or suggestion..." 
                 className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 transition-all resize-none" 
               ></textarea>
            </div>
          </div>

          <button 
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:bg-slate-800 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" /> Send Report
              </>
            )}
          </button>

        </form>
      </div>

      <div className="mt-8 text-center">
         <p className="text-slate-400 text-sm font-bold">You can also email us directly at</p>
         <a href="mailto:hassanwwwabar@gmail.com" className="text-blue-600 font-black hover:underline">hassanwwwabar@gmail.com</a>
      </div>

    </div>
  );
}