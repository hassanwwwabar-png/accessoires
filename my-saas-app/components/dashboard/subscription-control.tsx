"use client";

import { useState } from "react";
import { updateSubscriptionDuration } from "@/app/actions";
import { Clock, Calendar, RefreshCw, Save } from "lucide-react";

interface Props {
  clientId: string;
  endsAt: Date | null;
}

export function SubscriptionControl({ clientId, endsAt }: Props) {
  // حساب الأيام المتبقية للعرض
  const calculateDaysLeft = () => {
    if (!endsAt) return 0;
    const now = new Date();
    const end = new Date(endsAt);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = calculateDaysLeft();
  const [inputDays, setInputDays] = useState("30"); // القيمة الافتراضية
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    await updateSubscriptionDuration(formData);
    setIsLoading(false);
    // تصفير أو إبقاء القيمة حسب الرغبة
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-700">
      
      <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
        <div className="p-2 bg-blue-600 rounded-lg">
           <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
           <h3 className="font-black text-lg">Subscription Control</h3>
           <p className="text-xs text-slate-400 font-bold">Manage client access duration</p>
        </div>
      </div>

      {/* ⏳ العداد التنازلي */}
      <div className="flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-2xl">
        <div>
           <p className="text-slate-400 text-xs font-black uppercase mb-1">Time Left</p>
           <h2 className={`text-4xl font-black ${daysLeft <= 3 ? "text-red-500" : "text-emerald-400"}`}>
             {daysLeft} <span className="text-sm text-white font-bold">Days</span>
           </h2>
        </div>
        <div className="text-right">
           <p className="text-slate-400 text-xs font-black uppercase mb-1">Expires On</p>
           <p className="font-bold text-sm text-white">
             {endsAt ? new Date(endsAt).toLocaleDateString() : "Not Set"}
           </p>
        </div>
      </div>

      {/* ⚙️ أدوات التحكم */}
      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="clientId" value={clientId} />
        
        <div>
          <label className="text-xs font-black text-slate-400 uppercase ml-1">Set Access Duration (Days)</label>
          <div className="flex gap-2 mt-1">
             <div className="relative flex-1">
                <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                <input 
                  type="number" 
                  name="days" 
                  value={inputDays}
                  onChange={(e) => setInputDays(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-xl font-bold text-white focus:border-blue-500 outline-none"
                  placeholder="e.g. 30"
                />
             </div>
             <button 
               disabled={isLoading}
               className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-bold transition-colors flex items-center gap-2"
             >
                {isLoading ? <RefreshCw className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5" />}
                Save
             </button>
          </div>
        </div>

        {/* أزرار سريعة */}
        <div className="flex gap-2">
           {[7, 30, 90, 365].map((d) => (
             <button
               key={d}
               type="button"
               onClick={() => setInputDays(d.toString())}
               className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
             >
               +{d} Days
             </button>
           ))}
        </div>

      </form>
    </div>
  );
}