"use client";

import { submitPaymentProof } from "@/app/actions";
import { Upload, ImageIcon, ExternalLink, CreditCard, AlertTriangle, CheckCircle } from "lucide-react";

export default function PaymentScreen({ config }: { config: any }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in zoom-in duration-500 mt-10 p-4">
      
      <div className="bg-red-50 p-6 rounded-2xl border border-red-200 flex items-center gap-4 shadow-sm">
         <div className="p-3 bg-red-100 rounded-full text-red-600">
            <AlertTriangle className="w-8 h-8" />
         </div>
         <div>
           <h2 className="text-xl font-bold text-red-700">Account Suspended</h2>
           <p className="text-red-600">Your subscription has expired. Please verify your payment below.</p>
         </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
         
         <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Amount Due</h2>
              <p className="text-slate-500 font-medium">Monthly Subscription</p>
            </div>
            <div className="text-right">
              <span className="text-5xl font-black text-blue-600">${config.monthlyPrice}</span>
            </div>
         </div>

         <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
               <div className="flex justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Bank:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{config.bankName}</span>
               </div>
               <div className="flex justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Account:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{config.accountName}</span>
               </div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 text-center">
               <span className="block text-slate-400 text-[10px] uppercase mb-1">RIB / Account Number</span>
               <span className="text-xl md:text-2xl font-mono font-bold text-slate-900 dark:text-white tracking-widest select-all cursor-pointer">
                 {config.rib}
               </span>
            </div>
         </div>

         <form action={submitPaymentProof} className="space-y-6">
             <input type="hidden" name="amount" value={config.monthlyPrice.toString()} />
             <input type="hidden" name="period" value="Monthly" />

             <div className="space-y-3">
               <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <ImageIcon className="w-5 h-5 text-orange-500" /> 
                 Upload Payment Screenshot
               </label>
               
               <div className="border-2 border-dashed border-orange-300 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl p-8 text-center group hover:border-orange-500 transition-colors">
                  <div className="relative max-w-md mx-auto mt-2">
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        name="proofUrl" 
                        required 
                        type="url"
                        placeholder="Paste image link here (Google Drive / Dropbox)..." 
                        className="w-full pl-10 pr-4 py-4 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-3">Supported: Google Drive, Dropbox, or any image link.</p>
               </div>
             </div>
             
             <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl">
               <CheckCircle className="w-6 h-6" /> Submit Proof
             </button>
         </form>

      </div>
    </div>
  );
}