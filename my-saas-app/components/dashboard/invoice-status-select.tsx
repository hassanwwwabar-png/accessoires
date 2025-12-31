"use client";

import { useLanguage } from "@/components/language-context";
import { updateInvoiceStatus } from "@/app/actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  id: string;
  currentStatus: string;
}

export function InvoiceStatusSelect({ id, currentStatus }: Props) {
  const { t } = useLanguage();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  // 🎨 ألوان حالات الدفع
  const getStatusColor = (s: string) => {
    switch (s) {
      case "Paid":      return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
      case "Pending":   return "bg-amber-100 text-amber-700 border-amber-200";
      default:          return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);
    await updateInvoiceStatus(id, newStatus);
    setLoading(false);
  };

  return (
    <div className="relative inline-block">
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={`appearance-none cursor-pointer px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border outline-none transition-all w-28 text-center ${getStatusColor(status)} ${loading ? 'opacity-50' : ''}`}
      >
        <option value="Paid">✅ {t.paid}</option>
        <option value="Pending">⏳ {t.pending}</option>
        <option value="Cancelled">❌ {t.cancelled}</option>
      </select>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="w-3 h-3 animate-spin text-slate-600" />
        </div>
      )}
    </div>
  );
}