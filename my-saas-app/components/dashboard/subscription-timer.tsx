"use client";

import { Clock } from "lucide-react";

interface Props {
  endDate: Date;
}

export function SubscriptionTimer({ endDate }: Props) {
  // حساب الفرق بين اليوم وتاريخ الانتهاء
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // إذا كان الفرق 0 أو أقل (رغم أن الصفحة الرئيسية تخفيه، لكن للحماية)
  if (diffDays <= 0) return null;

  // تحديد اللون حسب الأيام المتبقية
  // أحمر إذا بقي أقل من 3 أيام، أصفر أقل من 7، أزرق للباقي
  const colorClass = diffDays <= 3 ? "bg-red-50 text-red-600 border-red-200" 
                   : diffDays <= 7 ? "bg-amber-50 text-amber-600 border-amber-200" 
                   : "bg-blue-50 text-blue-600 border-blue-200";

  const progressColor = diffDays <= 3 ? "bg-red-500" 
                      : diffDays <= 7 ? "bg-amber-500" 
                      : "bg-blue-500";

  return (
    <div className={`p-4 rounded-2xl border ${colorClass} mb-4 transition-all animate-in slide-in-from-top-2`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
           <Clock className="w-4 h-4" />
           <span className="text-xs font-black uppercase tracking-wider">Time Left</span>
        </div>
        <div className="flex items-end gap-1">
           <span className="text-2xl font-black leading-none">{diffDays}</span>
           <span className="text-xs font-bold mb-0.5 opacity-80">Days</span>
        </div>
      </div>
      
      {/* شريط التقدم */}
      <div className="w-full bg-white/60 h-2.5 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${progressColor}`} 
          // الشريط يمثل نسبة الأيام المتبقية من أصل 30 يوماً
          style={{ width: `${Math.min((diffDays / 30) * 100, 100)}%` }}
        ></div>
      </div>
      
      <p className="text-[10px] font-bold mt-2 opacity-80 text-right">
        Renew before functionality stops.
      </p>
    </div>
  );
}