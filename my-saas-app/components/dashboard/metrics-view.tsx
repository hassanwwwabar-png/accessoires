"use client";

import { useLanguage } from "@/components/language-context";
import { Printer, TrendingUp, Users, Wallet, Activity } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';

interface MetricsProps {
  genderData: any[];
  ageData: any[];
  statusData: any[];
  revenueData: any[];
  growthData: any[];
  totalPatients: number;
  totalRevenue: number;
}

export function MetricsView({ 
  genderData, ageData, statusData, revenueData, growthData, totalPatients, totalRevenue 
}: MetricsProps) {
  
  const { t, isRTL } = useLanguage();

  const handlePrint = () => window.print();

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isRTL ? 'text-right' : ''}`}>
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" /> {t.metrics}
          </h1>
          <p className="text-slate-500 text-sm font-bold">{t.metricsSubtitle}</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all print:hidden"
        >
          <Printer className="w-4 h-4" /> {t.printReport}
        </button>
      </div>

      {/* 1️⃣ Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-200">
           <div className="flex justify-between items-center mb-4">
             <div className="p-3 bg-white/20 rounded-xl"><Users className="w-6 h-6"/></div>
             <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold">+12% this month</span>
           </div>
           <h3 className="text-4xl font-black mb-1">{totalPatients}</h3>
           <p className="text-blue-100 font-bold text-sm">{t.totalPatients}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl text-white shadow-xl shadow-emerald-200">
           <div className="flex justify-between items-center mb-4">
             <div className="p-3 bg-white/20 rounded-xl"><Wallet className="w-6 h-6"/></div>
             <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold">+5% this month</span>
           </div>
           <h3 className="text-4xl font-black mb-1">${totalRevenue.toLocaleString()}</h3>
           <p className="text-emerald-100 font-bold text-sm">{t.totalRevenue}</p>
        </div>
      </div>

      {/* 2️⃣ Detailed Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Patient Growth (Bar Chart) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500"/> {t.patientGrowth}
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12} as any} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12} as any} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="patients" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution (Pie Chart) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-6">{t.genderDistribution}</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointment Status (Pie Chart) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-6">{t.appointmentStatus}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  // ✅ FIX: Added (percent || 0) to prevent TypeScript error
                  label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={2} stroke="#fff" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend (Area Chart) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-6">{t.revenueTrend}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12} as any} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12} as any} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Area type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}