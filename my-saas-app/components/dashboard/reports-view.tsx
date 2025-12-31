"use client";

import { useLanguage } from "@/components/language-context";
import { TrendingUp, Users, Calendar, DollarSign, Activity } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface ReportsViewProps {
  totalRevenue: number;
  appointmentsCount: number;
  patientsCount: number;
  avgApptPerPatient: string;
  currency: string;
  monthlyRevenueData: any[];
  statusData: any[];
}

export function ReportsView({ 
  totalRevenue, 
  appointmentsCount, 
  patientsCount, 
  avgApptPerPatient,
  currency,
  monthlyRevenueData,
  statusData
}: ReportsViewProps) {
  
  const { t, isRTL } = useLanguage();

  const COLORS = {
    'Scheduled': '#3B82F6',
    'Completed': '#10B981',
    'Cancelled': '#EF4444',
    'Pending': '#F59E0B',
    'No Data': '#E5E7EB'
  };

  return (
    <div className="space-y-6">
      
      {/* Header (مترجم) */}
      <div className={isRTL ? "text-right" : "text-left"}>
        <h1 className={`text-2xl font-black text-slate-800 flex items-center gap-2 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
          <Activity className="w-6 h-6 text-blue-600" /> {t.reportsTitle}
        </h1>
        <p className="text-slate-500 text-sm font-bold">{t.reportsSubtitle}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className={`flex justify-between items-start ${isRTL ? "flex-row-reverse" : ""}`}>
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><DollarSign className="w-6 h-6" /></div>
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
             <h3 className="text-2xl font-black text-slate-800">{currency} {totalRevenue}</h3>
             <p className="text-slate-400 text-xs font-bold uppercase">{t.totalRevenue}</p>
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className={`flex justify-between items-start ${isRTL ? "flex-row-reverse" : ""}`}>
             <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Calendar className="w-6 h-6" /></div>
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
             <h3 className="text-2xl font-black text-slate-800">{appointmentsCount}</h3>
             <p className="text-slate-400 text-xs font-bold uppercase">{t.appointments}</p>
          </div>
        </div>

        {/* Patients */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className={`flex justify-between items-start ${isRTL ? "flex-row-reverse" : ""}`}>
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Users className="w-6 h-6" /></div>
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
             <h3 className="text-2xl font-black text-slate-800">{patientsCount}</h3>
             <p className="text-slate-400 text-xs font-bold uppercase">{t.patients}</p>
          </div>
        </div>

        {/* Visits Avg */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className={`flex justify-between items-start ${isRTL ? "flex-row-reverse" : ""}`}>
             <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><TrendingUp className="w-6 h-6" /></div>
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
             <h3 className="text-2xl font-black text-slate-800">{avgApptPerPatient}</h3>
             <p className="text-slate-400 text-xs font-bold uppercase">{t.visitsPerPatient}</p>
          </div>
        </div>
      </div>

      {/* 📈 Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Monthly Revenue */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          {/* ✅ هنا تم استخدام الترجمة */}
          <h3 className={`font-bold text-lg text-slate-800 mb-6 ${isRTL ? "text-right" : "text-left"}`}>
            {t.monthlyRevenue}
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis orientation={isRTL ? "right" : "left"} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Appointment Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          {/* ✅ هنا تم استخدام الترجمة */}
          <h3 className={`font-bold text-lg text-slate-800 mb-6 ${isRTL ? "text-right" : "text-left"}`}>
            {t.appointmentsBreakdown}
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#9CA3AF'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}