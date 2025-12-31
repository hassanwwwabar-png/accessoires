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
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
        <p className={`text-xs font-medium mt-2 flex items-center gap-1 ${
          positive ? 'text-green-600' : 'text-red-500'
        }`}>
          {positive ? '↑' : '↓'} {trend}
        </p>
      </div>
      <div className={`p-3 rounded-lg ${
        positive ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}