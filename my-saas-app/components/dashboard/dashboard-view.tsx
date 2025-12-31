"use client";

import { useLanguage } from "@/components/language-context";
import { Users, Calendar, DollarSign, BedDouble, Stethoscope, Trash2 } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { AppointmentStatusSelect } from "@/components/dashboard/appointment-status-select"; // 👈 زر الحالة
import { deleteAppointment } from "@/app/actions"; // 👈 دالة الحذف

interface DashboardViewProps {
  doctorName: string;
  stats: { patients: number; appointments: number; revenue: number };
  recentAppointments: any[];
  billingData: any[];
  capacityData: any[];
  currency: string;
}

export function DashboardView({ 
  doctorName, stats, recentAppointments, billingData, capacityData, currency 
}: DashboardViewProps) {
  
  const { t, isRTL } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 1️⃣ Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-slate-500 text-xs font-bold mb-1">{t.clinicalConsultations}</p>
             <h3 className="text-2xl font-black text-slate-800">{stats.appointments}</h3>
           </div>
           <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
             <Stethoscope className="w-6 h-6" />
           </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-slate-500 text-xs font-bold mb-1">{t.patientsAdmitted}</p>
             <h3 className="text-2xl font-black text-slate-800">{stats.patients}</h3>
           </div>
           <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
             <BedDouble className="w-6 h-6" />
           </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-slate-500 text-xs font-bold mb-1">{t.scheduledAppointments}</p>
             <h3 className="text-2xl font-black text-slate-800">{stats.appointments}</h3>
           </div>
           <div className="p-3 bg-red-50 text-red-500 rounded-xl">
             <Calendar className="w-6 h-6" />
           </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-slate-500 text-xs font-bold mb-1">{t.totalRevenue}</p>
             <h3 className="text-2xl font-black text-slate-800">{currency} {stats.revenue}</h3>
           </div>
           <div className="p-3 bg-green-50 text-green-600 rounded-xl">
             <DollarSign className="w-6 h-6" />
           </div>
        </div>
      </div>

      {/* 2️⃣ Middle Section: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Billing Summary */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">{t.billingSummary}</h3>
            <select className="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-lg p-2 outline-none">
              <option>Monthly</option>
            </select>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={billingData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11 } as any} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11 } as any} 
                />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Capacity Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-4">{t.capacityStatus}</h3>
          <div className="h-[250px] w-full flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={capacityData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {capacityData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-2xl font-black text-slate-800">{stats.appointments}</span>
               <span className="text-[10px] text-slate-400 font-bold uppercase">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3️⃣ Bottom Section: Appointment Details Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
           <h3 className="font-bold text-lg text-slate-800">{t.appointmentDetails}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : ''}`}>{t.patients}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : ''}`}>{t.dateTime}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : ''}`}>{t.contact}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : ''}`}>{t.fee}</th>
                <th className="px-6 py-4 text-center">{t.billingStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentAppointments.length === 0 ? (
                 <tr><td colSpan={5} className="text-center py-10 text-slate-400 text-xs font-bold">No appointments found.</td></tr>
              ) : recentAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-600">
                        {apt.patient.firstName[0]}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{apt.patient.firstName} {apt.patient.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">
                    {new Date(apt.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500 font-mono">
                    {apt.patient.phone || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-700">
                    {currency}{apt.price || 0}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* 👇 هنا تم دمج الأزرار التفاعلية */}
                    <div className="flex items-center justify-center gap-2">
                        <AppointmentStatusSelect 
                            id={apt.id} 
                            currentStatus={apt.status} 
                        />
                        <form 
                            action={deleteAppointment}
                            onSubmit={(e) => {
                                if (!confirm(t.deleteAppointmentConfirm)) {
                                e.preventDefault();
                                }
                            }}
                        >
                            <input type="hidden" name="id" value={apt.id} />
                            <button 
                                className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                                title={t.delete}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}