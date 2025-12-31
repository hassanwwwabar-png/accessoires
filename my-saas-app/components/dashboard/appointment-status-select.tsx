"use client";

import { useLanguage } from "@/components/language-context";
import { updateAppointmentStatus } from "@/app/actions";
import { useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";

interface Props {
  id: string;
  currentStatus: string;
}

export function AppointmentStatusSelect({ id, currentStatus }: Props) {
  const { t } = useLanguage();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  // 🎨 ألوان لكل حالة
  const getStatusColor = (s: string) => {
    switch (s) {
      case "Completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
      case "Pending":   return "bg-amber-100 text-amber-700 border-amber-200";
      default:          return "bg-blue-100 text-blue-700 border-blue-200"; // Scheduled
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus); // تحديث الواجهة فوراً
    setLoading(true);
    
    try {
      await updateAppointmentStatus(id, newStatus); // استدعاء السيرفر
    } catch (error) {
      console.error("Failed to update status");
      setStatus(status); // التراجع في حالة الخطأ
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block w-fit">
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={`appearance-none cursor-pointer pl-3 pr-8 py-1.5 rounded-lg text-[10px] font-black uppercase border outline-none transition-all ${getStatusColor(status)} ${loading ? 'opacity-50' : ''}`}
      >
        <option value="Scheduled">🔵 {t.statusScheduled || "Scheduled"}</option>
        <option value="Completed">🟢 {t.statusCompleted || "Completed"}</option>
        <option value="Cancelled">🔴 {t.statusCancelled || "Cancelled"}</option>
        <option value="Pending">🟡 {t.statusPending || "Pending"}</option>
      </select>

      {/* أيقونة التحميل أو السهم */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
        ) : (
          <ChevronDown className={`w-3 h-3 opacity-50 ${
             status === 'Completed' ? 'text-emerald-700' :
             status === 'Cancelled' ? 'text-red-700' :
             status === 'Pending' ? 'text-amber-700' : 'text-blue-700'
          }`} />
        )}
      </div>
    </div>
  );
}