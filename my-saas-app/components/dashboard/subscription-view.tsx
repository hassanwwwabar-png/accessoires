"use client";

import { useLanguage } from "@/components/language-context";
import { useState } from "react";
import { Copy, Upload, CheckCircle, CreditCard, MessageCircle, ShieldCheck, Clock, AlertTriangle } from "lucide-react";
import { submitPayment } from "@/app/actions";

interface Props {
  bankDetails: {
    rib: string;
    bankName: string;
    accountName: string;
    price: number;
    currency: string;
    extraMethodName?: string;
    extraMethodNumber?: string;
    extraMethodOwner?: string;
  };
  clientStatus: string; // 'ACTIVE' | 'INACTIVE' | 'PENDING'
}

export function SubscriptionView({ bankDetails, clientStatus }: Props) {
  const { t, isRTL } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // تصحيح الترجمة (Fallback)
  const trans = t as any;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bankDetails.rib);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 🟡 1. حالة المراجعة (PENDING)
  // يظهر هذا عندما يرفع الوصل وينتظر موافقتك
  if (clientStatus === "PENDING") {
    return (
      <div className="max-w-xl mx-auto text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 animate-in zoom-in">
        <div className="w-20 h-20 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">{trans.paymentReview || "Payment Under Review"}</h2>
        <p className="text-slate-500 mt-2 max-w-sm mx-auto">{trans.paymentReviewDesc || "We are reviewing your receipt. Please wait for approval."}</p>
      </div>
    );
  }

  // 🟢 2. حالة الاشتراك المفعل (ACTIVE)
  // يظهر هذا ما دام في الفترة التجريبية (20 يوم) أو دفع الاشتراك
  if (clientStatus === "ACTIVE") {
    return (
      <div className="max-w-xl mx-auto text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 animate-in zoom-in">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">{trans.activeSubscription || "Subscription Active"}</h2>
        <p className="text-slate-500 mt-2">{trans.activeSubscriptionDesc || "Your account is fully active. Enjoy using the platform!"}</p>
      </div>
    );
  }

  // 🔴 3. حالة الانتهاء أو الإيقاف (INACTIVE)
  // يظهر هذا الكود (نموذج الدفع) في حالتين:
  // أ) انتهت الـ 20 يوماً التجريبية.
  // ب) قام الأدمن بإيقاف الحساب يدوياً.
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in pb-10">
      
      {/* تنبيه خاص إذا كان الحساب متوقفاً */}
      <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-700 animate-pulse">
         <AlertTriangle className="w-6 h-6 shrink-0" />
         <div>
            <p className="font-black text-sm uppercase">Access Suspended</p>
            <p className="text-sm">Your free trial has ended or your subscription expired. Please pay to continue.</p>
         </div>
      </div>

      {/* 1. Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-800">{trans.completeSubscription || "Complete Subscription"}</h1>
        <p className="text-slate-500 font-bold mt-2">{trans.securePayment || "Secure Payment Process"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 2. Plan Details */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 bg-white/5 rounded-full -mr-10 -mt-10"></div>
           <h3 className="text-lg font-bold text-slate-300 uppercase tracking-widest mb-1">{trans.selectedPlan || "Selected Plan"}</h3>
           <h2 className="text-3xl font-black mb-4">Pro Clinic Plan</h2>
           
           <div className="text-4xl font-black mb-6">
             {bankDetails.price} 
             <span className="text-lg font-medium text-slate-400 ml-1">{bankDetails.currency} / {trans.month || "Month"}</span>
           </div>
           
           <ul className="space-y-3 text-sm font-medium text-slate-300">
             <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400"/> {trans.unlimitedPatients || "Unlimited Patients"}</li>
             <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400"/> {trans.advancedAnalytics || "Advanced Analytics"}</li>
             <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400"/> {trans.prioritySupport || "Priority Support"}</li>
           </ul>
        </div>

        {/* 3. Bank Details */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
           <h3 className={`font-black text-slate-800 mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
             <CreditCard className="w-5 h-5 text-blue-600"/> {trans.bankTransferDetails || "Bank Details"}
           </h3>
           <div className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase">{trans.bankName || "Bank Name"}</p>
               <p className="font-black text-slate-800 text-lg">{bankDetails.bankName}</p>
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase">{trans.accountName || "Account Name"}</p>
               <p className="font-bold text-slate-700">{bankDetails.accountName}</p>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
               <p className="text-xs font-bold text-slate-400 uppercase mb-1">{trans.ribNumber || "RIB Number"}</p>
               <p className="font-mono font-black text-slate-800 tracking-wider text-sm sm:text-base break-all" dir="ltr">{bankDetails.rib}</p>
               <button 
                 onClick={copyToClipboard}
                 className={`absolute top-2 p-2 bg-white rounded-lg shadow-sm text-slate-500 hover:text-blue-600 transition-all ${isRTL ? 'left-2' : 'right-2'}`}
                 title={trans.copyRib || "Copy"}
               >
                 {copied ? <CheckCircle className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4"/>}
               </button>
             </div>
           </div>
        </div>

      </div>

{/* ... كارت البنك القديم ... */}
        
        {/* ✅✅ كارت الطريقة الإضافية (يظهر فقط إذا أدخلت بياناته) */}
        {bankDetails.extraMethodName && bankDetails.extraMethodName !== "" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mt-4">
               <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-50">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                     <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800 text-lg">Alternative: {bankDetails.extraMethodName}</h3>
               </div>
               
               <div className="space-y-3">
                  <div className="flex justify-between items-center bg-orange-50 p-3 rounded-xl">
                     <span className="text-xs font-bold text-slate-500 uppercase">Send to Number</span>
                     <span className="font-mono font-black text-slate-800 text-lg">{bankDetails.extraMethodNumber}</span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                     <span className="text-xs font-bold text-slate-400 uppercase">Receiver</span>
                     <span className="font-bold text-slate-700">{bankDetails.extraMethodOwner}</span>
                  </div>
               </div>
            </div>
        )} 
      {/* 4. Upload & Submit Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
         <h3 className={`font-black text-slate-800 mb-2 ${isRTL ? 'text-right' : ''}`}>{trans.confirmPayment || "Confirm Payment"}</h3>
         <p className={`text-sm text-slate-500 font-bold mb-6 ${isRTL ? 'text-right' : ''}`}>{trans.uploadDesc || "Please upload the payment receipt to activate your account."}</p>

         <form action={async (fd) => { setIsSubmitting(true); await submitPayment(fd); }} className="space-y-6">
            
            {/* Upload Box */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer relative group">
               <input 
                 type="file" 
                 name="receipt" 
                 accept="image/*,application/pdf"
                 required
                 onChange={(e) => setFile(e.target.files?.[0] || null)}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                     <Upload className="w-6 h-6"/>
                  </div>
                  {file ? (
                    <div>
                       <p className="font-bold text-slate-800">{file.name}</p>
                       <p className="text-xs text-green-600 font-bold">Ready to upload</p>
                    </div>
                  ) : (
                    <div>
                       <p className="font-bold text-slate-600">{trans.clickToUpload || "Click to upload receipt"}</p>
                       <p className="text-xs text-slate-400 font-bold mt-1">JPG, PNG or PDF</p>
                    </div>
                  )}
               </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={!file || isSubmitting}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isSubmitting ? (trans.sending || "Sending...") : (trans.confirmAndActivate || "Confirm & Activate")}
            </button>
         </form>
      </div>

      {/* 5. Alternative Method */}
      <div className="text-center pt-6">
         <button 
            type="button"
            onClick={() => window.open('https://wa.me/212660571862', '_blank')}
            className={`text-slate-500 font-bold text-sm hover:text-blue-600 flex items-center justify-center gap-2 mx-auto transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
         >
            <MessageCircle className="w-4 h-4"/>
            {trans.otherPaymentMethod || "Contact us for other payment methods"}
         </button>
      </div>

    </div>
  );
}