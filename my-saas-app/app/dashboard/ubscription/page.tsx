import { db } from "@/lib/db";
import { getClientId, submitPaymentProof } from "@/app/actions";
import { redirect } from "next/navigation";
import { ShieldCheck, AlertTriangle, Clock, CreditCard, Upload } from "lucide-react";

export default async function SubscriptionPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  const client = await db.client.findUnique({
    where: { id: clientId },
    include: { payments: { orderBy: { date: 'desc' }, take: 1 } }
  });

  if (!client) redirect("/login");

  // 1. الحسابات
  const today = new Date();
  const nextPayment = new Date(client.nextPaymentDate);
  const diffTime = nextPayment.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // 2. المنطق الصارم: هل توقف الحساب؟
  const isExpired = daysRemaining <= 0 || client.status === "Suspended";
  
  // هل هناك طلب معلق؟
  const lastPayment = client.payments[0];
  const isPendingApproval = lastPayment?.status === "Pending";

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      
      {/* 🟢 الحالة 1: الحساب نشط (لا نريــه السعر أبداً) */}
      {!isExpired && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
           <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
             <ShieldCheck className="w-12 h-12" />
           </div>
           <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">System Active</h1>
           <p className="text-slate-500 text-lg max-w-md">
             Your clinic is fully operational. You don't need to do anything right now.
           </p>
           
           {/* العداد فقط */}
           <div className="mt-10 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-sm">
              <span className="block text-sm font-bold uppercase text-slate-400 mb-2 tracking-widest">Next Renewal In</span>
              <span className="text-6xl font-black text-slate-900 dark:text-white">{daysRemaining}</span>
              <span className="block text-slate-500 mt-2 font-medium">Days</span>
           </div>
        </div>
      )}

      {/* 🟡 الحالة 2: ينتظر التفعيل (أرسل المال وينتظر) */}
      {isExpired && isPendingApproval && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in duration-300">
           <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6">
             <Clock className="w-12 h-12 animate-pulse" />
           </div>
           <h1 className="text-3xl font-bold text-yellow-800 mb-2">Payment Under Review</h1>
           <p className="text-yellow-700 max-w-md">
             We have received your proof. Your account will be reactivated as soon as the admin confirms it.
           </p>
        </div>
      )}

      {/* 🔴 الحالة 3: الحساب توقف (الآن فقط نظهر السعر والدفع) */}
      {isExpired && !isPendingApproval && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          
          <div className="bg-red-50 p-6 rounded-2xl border border-red-200 flex items-center gap-4">
             <AlertTriangle className="w-10 h-10 text-red-600" />
             <div>
               <h2 className="text-xl font-bold text-red-700">Access Restricted</h2>
               <p className="text-red-600">Your subscription has ended. Please pay the due amount to continue.</p>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
             
             {/* 👇 هنا فقط يظهر السعر بوضوح تام */}
             <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Amount Due</h2>
                  <p className="text-slate-500">Monthly Subscription Fee</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-blue-600">$50.00</span>
                </div>
             </div>

             {/* معلومات البنك */}
             <div className="bg-slate-100 dark:bg-slate-950 p-6 rounded-xl font-mono text-sm space-y-3 mb-8">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank:</span>
                  <span className="font-bold">CIH Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account:</span>
                  <span className="font-bold">MY SAAS COMPANY</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="block text-slate-500 text-xs mb-1">RIB:</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white tracking-widest select-all">
                    230 780 1234567890001234 55
                  </span>
                </div>
             </div>

             {/* الدفع */}
             <form action={submitPaymentProof} className="space-y-4">
                 
                 {/* السعر مثبت هنا أيضاً */}
                 <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex justify-between items-center">
                    <span className="font-bold text-blue-800 dark:text-blue-300">Total to Pay</span>
                    <span className="font-bold text-blue-800 dark:text-blue-300">$50.00</span>
                 </div>

                 {/* نرسل القيم مخفية لأن السعر ثابت الآن */}
                 <input type="hidden" name="amount" value="50" />
                 <input type="hidden" name="period" value="Monthly" />

                 <div>
                   <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Upload Receipt (Reçu)</label>
                   <input 
                     name="proofUrl" 
                     required 
                     placeholder="Paste image link here..." 
                     className="w-full p-4 bg-slate-50 dark:bg-slate-950 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                   />
                 </div>
                 
                 <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02]">
                   <Upload className="w-5 h-5" /> Confirm Payment
                 </button>
             </form>
          </div>
        </div>
      )}

    </div>
  );
}