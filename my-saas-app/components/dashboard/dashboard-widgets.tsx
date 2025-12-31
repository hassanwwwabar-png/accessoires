"use client";

import { useLanguage } from "@/components/language-context";
import { Users, Calendar, DollarSign, Activity, MoreHorizontal } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface DashboardWidgetsProps {
  stats: any;
}

export function DashboardWidgets({ stats }: DashboardWidgetsProps) {
  const { t, isRTL } = useLanguage();

  // ❌ حذفنا البيانات المزيفة (fake chartData) من هنا

  // ✅ استخدام البيانات الحقيقية من السيرفر مباشرة
  const chartData = stats.chartData; 

  const pieData = stats.statusDistribution.map((item: any) => ({
    name: item.status,
    value: item._count.status
  }));

  const cards = [
    { title: "Clinical Consultations", value: stats.todayAppointments, icon: Activity, color: "bg-yellow-50 text-yellow-600" },
    { title: "Patients Admitted", value: stats.patients, icon: Users, color: "bg-blue-50 text-blue-600" },
    { title: "Scheduled Appointments", value: stats.appointments, icon: Calendar, color: "bg-red-50 text-red-600" },
    { title: "Total Revenue", value: `$${stats.revenue}`, icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-bold mb-1">{card.title}</p>
              <h3 className="text-3xl font-black text-slate-800">{card.value}</h3>
            </div>
            <div className={`p-4 rounded-2xl ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Billing Summary (Real Data Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-slate-800">Billing Summary (Last 7 Days)</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* ✅ هنا نمرر البيانات الحقيقية */}
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  formatter={(value) => [`$${value}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Capacity Status */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Appointment Status</h3>
          <div className="h-[200px] w-full flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.length > 0 ? pieData : [{name: 'No Data', value: 1}]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  {pieData.length === 0 && <Cell fill="#e2e8f0" />}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className="text-2xl font-black text-slate-800">{stats.appointments}</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
             {pieData.map((entry: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                   <span className="text-xs font-bold text-slate-500 capitalize">{entry.name}</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* 3. Appointment Details Table */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Recent Appointments</h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                  <tr>
                     <th className="p-4 rounded-l-xl">Patient Name</th>
                     <th className="p-4">Date - Time</th>
                     <th className="p-4">Contact</th>
                     <th className="p-4 rounded-r-xl text-center">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {stats.recentAppointments.length === 0 ? (
                     <tr><td colSpan={4} className="text-center p-6 text-slate-400 text-sm">No recent appointments</td></tr>
                  ) : (
                     stats.recentAppointments.map((apt: any) => (
                        <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="p-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black">
                                    {apt.patient.firstName[0]}
                                 </div>
                                 <span className="font-bold text-slate-700 text-sm">{apt.patient.firstName} {apt.patient.lastName}</span>
                              </div>
                           </td>
                           <td className="p-4 text-xs font-bold text-slate-500">
                              {new Date(apt.date).toLocaleDateString()} - {new Date(apt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </td>
                           <td className="p-4 text-xs font-bold text-slate-500">
                              {apt.patient.phone}
                           </td>
                           <td className="p-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                 apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                 apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                                 'bg-yellow-100 text-yellow-700'
                              }`}>
                                 {apt.status}
                              </span>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}