"use client";

import { useLanguage } from "@/components/language-context";
import { Users, Calendar, DollarSign, Activity } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    patients: number;
    appointments: number;
    todayAppointments: number;
    revenue: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const { t } = useLanguage();

  const cards = [
    {
      title: t.totalPatients,
      value: stats.patients,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: t.appointmentsToday,
      value: stats.todayAppointments,
      icon: Activity,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: t.upcomingAppointments,
      value: stats.appointments,
      icon: Calendar,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: t.totalRevenue,
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">{t.dashboardOverview}</h1>
        <p className="text-slate-500 font-bold text-sm">{t.welcomeBack}</p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className={`p-4 rounded-2xl ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase">{card.title}</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}