import { db } from "@/lib/db";
import Link from "next/link";
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  XCircle,
  Stethoscope 
} from "lucide-react";

export default async function AdminDashboard() {
  
  // 1️⃣ جلب الإحصائيات (Database Queries)
  
  // عدد الأطباء الكلي
  const totalDoctors = await db.client.count();

  // عدد طلبات الدفع المعلقة (التي تحتاج موافقة)
  const pendingPayments = await db.paymentRequest.count({
    where: { status: "PENDING" }
  });

  // مجموع الأرباح (المقبولة فقط)
  const revenueData = await db.paymentRequest.aggregate({
    where: { status: "APPROVED" },
    _sum: { amount: true }
  });
  const totalRevenue = revenueData._sum.amount || 0;

  // عدد تذاكر الدعم المفتوحة
  const openTickets = await db.supportMessage.count({
    where: { status: "OPEN_TICKET" }
  });

  // 2️⃣ جلب أحدث البيانات للعرض
  
  // آخر 5 طلبات دفع
  const recentPayments = await db.paymentRequest.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { client: true }
  });

  // آخر 5 أطباء مسجلين
  const newDoctors = await db.client.findMany({
    take: 5,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800">SaaS Overview</h1>
        <p className="text-slate-500 font-bold mt-1">Welcome back, Admin. Here is what's happening today.</p>
      </div>

      {/* 📊 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group">
           <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-24 h-24 text-emerald-600"/>
           </div>
           <div className="p-3 bg-emerald-50 text-emerald-600 w-fit rounded-xl">
              <CreditCard className="w-6 h-6"/>
           </div>
           <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-3xl font-black text-slate-800">{totalRevenue.toLocaleString()} <span className="text-sm font-medium text-slate-400">MAD</span></h3>
           </div>
        </div>

        {/* Card 2: Doctors */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group">
           <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <Users className="w-24 h-24 text-blue-600"/>
           </div>
           <div className="p-3 bg-blue-50 text-blue-600 w-fit rounded-xl">
              <Users className="w-6 h-6"/>
           </div>
           <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Total Doctors</p>
              <h3 className="text-3xl font-black text-slate-800">{totalDoctors}</h3>
           </div>
        </div>

        {/* Card 3: Pending Payments (Action Needed) */}
        <Link href="/saas-admin/payments" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-amber-200 transition-colors">
           <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <AlertCircle className="w-24 h-24 text-amber-600"/>
           </div>
           <div className="p-3 bg-amber-50 text-amber-600 w-fit rounded-xl">
              <AlertCircle className="w-6 h-6"/>
           </div>
           <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Pending Payments</p>
              <h3 className="text-3xl font-black text-slate-800">{pendingPayments}</h3>
           </div>
           {pendingPayments > 0 && <span className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>}
        </Link>

        {/* Card 4: Support Tickets */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group">
           <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-24 h-24 text-purple-600"/>
           </div>
           <div className="p-3 bg-purple-50 text-purple-600 w-fit rounded-xl">
              <Stethoscope className="w-6 h-6"/>
           </div>
           <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Open Support Tickets</p>
              <h3 className="text-3xl font-black text-slate-800">{openTickets}</h3>
           </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 📋 Left Column: Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-slate-800 text-lg">Recent Payment Requests</h3>
              <Link href="/saas-admin/payments" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3"/>
              </Link>
           </div>
           
           <div className="flex-1 overflow-auto">
             {recentPayments.length > 0 ? (
               <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-black">
                     <tr>
                        <th className="p-4">Doctor</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Date</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {recentPayments.map((pay) => (
                        <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="p-4">
                              <p className="font-bold text-slate-800 text-sm">{pay.client.doctorName}</p>
                              <p className="text-xs text-slate-400">{pay.client.email}</p>
                           </td>
                           <td className="p-4 font-black text-slate-800">{pay.amount} MAD</td>
                           <td className="p-4">
                              <span className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-full w-fit ${
                                 pay.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                 pay.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                 'bg-amber-100 text-amber-700'
                              }`}>
                                 {pay.status === 'APPROVED' && <CheckCircle className="w-3 h-3"/>}
                                 {pay.status === 'REJECTED' && <XCircle className="w-3 h-3"/>}
                                 {pay.status === 'PENDING' && <Clock className="w-3 h-3"/>}
                                 {pay.status}
                              </span>
                           </td>
                           <td className="p-4 text-xs font-bold text-slate-400">
                              {new Date(pay.createdAt).toLocaleDateString()}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             ) : (
                <div className="p-10 text-center text-slate-400 font-bold">No recent payments.</div>
             )}
           </div>
        </div>

        {/* 👤 Right Column: New Doctors */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full">
           <div className="p-6 border-b border-slate-100">
              <h3 className="font-black text-slate-800 text-lg">Newest Doctors</h3>
           </div>
           <div className="p-4 space-y-4">
              {newDoctors.length > 0 ? newDoctors.map((doc) => (
                 <Link key={doc.id} href={`/saas-admin/clients/${doc.id}`} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all group">
                    <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                       {doc.doctorName?.[0] || "D"}
                    </div>
                    <div className="flex-1 overflow-hidden">
                       <p className="font-bold text-slate-800 text-sm truncate">{doc.doctorName}</p>
                       <p className="text-xs text-slate-400 truncate">{doc.clinicName}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors"/>
                 </Link>
              )) : (
                 <div className="text-center text-slate-400 py-4 text-sm font-bold">No doctors yet.</div>
              )}
           </div>
           <div className="mt-auto p-4 border-t border-slate-100">
              <Link href="/saas-admin/clients" className="block w-full text-center py-3 bg-slate-50 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 uppercase tracking-wide">
                 View All Doctors
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}