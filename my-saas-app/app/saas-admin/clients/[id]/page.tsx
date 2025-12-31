import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { 
  Mail, Phone, MapPin, Calendar, CreditCard, 
  CheckCircle, XCircle, Clock, Building, Stethoscope, 
  Ban, Power, ShieldCheck 
} from "lucide-react";
import { toggleClientStatus } from "@/app/actions";
// ✅ استيراد زر الحذف التفاعلي
import { DeleteClientButton } from "@/components/dashboard/delete-client-button";
import { SubscriptionControl } from "@/components/dashboard/subscription-control";
export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // جلب بيانات العميل كاملة
  const client = await db.client.findUnique({
    where: { id },
    include: {
      paymentRequests: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!client) return notFound();

  // حساب مجموع المدفوعات
  const totalPaid = client.paymentRequests
    .filter(p => p.status === 'APPROVED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 🟢 Header Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-blue-200">
            {client.doctorName?.[0] || "D"}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">
               {client.doctorName}
               {client.subscriptionStatus === 'ACTIVE' && <CheckCircle className="w-6 h-6 text-green-500" />}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-slate-500 font-bold text-sm mt-1">
               <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {client.clinicName}</span>
               <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
               <span className="flex items-center gap-1"><Stethoscope className="w-4 h-4" /> {client.specialty || "General"}</span>
               <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
               <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase ${client.subscriptionStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {client.subscriptionStatus || "Inactive"}
               </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
           <p className="text-xs font-black text-slate-400 uppercase">Client ID</p>
           <p className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{client.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 📋 Left Column: Info & Actions */}
        <div className="space-y-6">
           
           {/* 1. Contact Info */}
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-indigo-600" /> Account Details
              </h3>
              <div className="space-y-5">
                 <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors"><Mail className="w-5 h-5"/></div>
                    <div className="overflow-hidden">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email Address</p>
                       <p className="font-bold text-slate-800 text-sm truncate">{client.email}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors"><Phone className="w-5 h-5"/></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phone Number</p>
                       <p className="font-bold text-slate-800 text-sm">{client.phone || "N/A"}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors"><MapPin className="w-5 h-5"/></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Location</p>
                       <p className="font-bold text-slate-800 text-sm">{client.city || "Unknown City"}, {client.address || ""}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors"><Calendar className="w-5 h-5"/></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Joined Date</p>
                       <p className="font-bold text-slate-800 text-sm">{new Date(client.createdAt).toLocaleDateString()}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* 🛑 2. Admin Actions (Control Panel) */}
           <div className="bg-white p-6 rounded-3xl border border-red-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
              <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 relative z-10">
                 <Power className="w-5 h-5 text-red-600" /> Admin Actions
              </h3>
              
              <div className="space-y-3 relative z-10">
                 
                 {/* Toggle Status Button */}
                 {client.subscriptionStatus === 'ACTIVE' ? (
                    <form action={toggleClientStatus} className="w-full">
                       <input type="hidden" name="clientId" value={client.id} />
                       <input type="hidden" name="newStatus" value="INACTIVE" />
                       <button className="w-full flex items-center justify-center gap-2 p-3 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl font-bold text-sm transition-all">
                          <Ban className="w-4 h-4" /> Stop Account (Suspend)
                       </button>
                    </form>
                 ) : (
                    <form action={toggleClientStatus} className="w-full">
                       <input type="hidden" name="clientId" value={client.id} />
                       <input type="hidden" name="newStatus" value="ACTIVE" />
                       <button className="w-full flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-xl font-bold text-sm transition-all">
                          <CheckCircle className="w-4 h-4" /> Activate Account (Manual Pay)
                       </button>
                    </form>
                 )}

                 {/* ✅✅✅ استبدال الفورم القديم بالمكون الجديد هنا */}
                 <DeleteClientButton clientId={client.id} />

              </div>
           </div>

        </div>

        {/* 📊 Right Column: Payment History & Stats */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* 📊 Right Column: Payment History & Stats */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* ✅✅✅ 2. استخدام المكون هنا */}
           <SubscriptionControl clientId={client.id} endsAt={client.subscriptionEndsAt} />

           {/* Payments Table (الجدول القديم يبقى كما هو) */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
              {/* ... كود الجدول ... */}
           </div>

        </div>



           {/* Payments Table */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
              <div className="p-6 border-b border-slate-100">
                 <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600"/> Payment History
                 </h3>
              </div>
              
              {client.paymentRequests.length > 0 ? (
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-black">
                          <tr>
                             <th className="p-4">Date</th>
                             <th className="p-4">Amount</th>
                             <th className="p-4">Receipt</th>
                             <th className="p-4">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {client.paymentRequests.map((pay: any) => (
                             <tr key={pay.id} className="hover:bg-slate-50/50">
                                <td className="p-4 text-sm font-bold text-slate-600">
                                   {new Date(pay.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 font-black text-slate-800">
                                   {pay.amount} MAD
                                </td>
                                <td className="p-4">
                                   {pay.receiptUrl ? (
                                      <a href={pay.receiptUrl} target="_blank" className="text-blue-600 text-xs font-bold hover:underline bg-blue-50 px-3 py-1.5 rounded-lg">View Receipt</a>
                                   ) : <span className="text-slate-400 text-xs">-</span>}
                                </td>
                                <td className="p-4">
                                   <span className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-full w-fit ${
                                      pay.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                      pay.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                      'bg-yellow-100 text-yellow-700'
                                   }`}>
                                      {pay.status === 'APPROVED' && <CheckCircle className="w-3 h-3"/>}
                                      {pay.status === 'REJECTED' && <XCircle className="w-3 h-3"/>}
                                      {pay.status === 'PENDING' && <Clock className="w-3 h-3"/>}
                                      {pay.status}
                                   </span>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              ) : (
                 <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                       <CreditCard className="w-8 h-8 text-slate-300"/>
                    </div>
                    <p className="font-bold">No payment history found.</p>
                 </div>
              )}
           </div>

        </div>

      </div>
    </div>
  );
}