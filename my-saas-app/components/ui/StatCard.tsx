import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  positive?: boolean;
}

export default function StatCard({ title, value, icon: Icon, trend, positive }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${positive ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : "bg-orange-50 text-orange-600"}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${positive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700"}`}>
          {positive ? "↗" : "↘"} Analysis
        </span>
        <span className="text-xs text-slate-400 font-medium">{trend}</span>
      </div>
    </div>
  );
}