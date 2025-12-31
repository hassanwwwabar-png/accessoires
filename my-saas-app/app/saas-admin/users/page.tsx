import { db } from "@/lib/db";
import { renewSubscription, toggleClientStatus } from "@/app/actions";
import { MoreHorizontal, Calendar, CreditCard, Shield, AlertCircle, Search } from "lucide-react";

export default async function AdminUsersPage() {
  // جلب الزبناء مع مجموع الدفعات (Payments) باش نحسبو شحال مدخلين عليك
  const clients = await db.client.findMany({
    orderBy: { createdAt: 'desc' },
    include: { payments: true }
  });

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" /> Subscription Manager
          </h1>
          <p className="text-slate-400 mt-2">Monitor client status, plans, and lifetime value (LTV).</p>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-2 text-slate-300">
           <Search className="w-4 h-4" />
           <input placeholder="Search doctor..." className="bg-transparent outline-none text-sm placeholder:text-slate-600" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-black text-slate-500 uppercase font-bold text-xs">
            <tr>
              <th className="p-5">Doctor / Clinic</th>
              <th className="p-5">Plan Status</th>
              <th className="p-5">Renewal Date</th>
              <th className="p-5">Total Revenue (LTV)</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {clients.map((client) => {
              // حساب الأيام المتبقية
              const daysLeft = Math.ceil((new Date(client.nextPaymentDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              const isExpired = daysLeft < 0;
              
              // حساب مجموع ما دفعه هذا العميل (LTV)
              const totalPaid = client.payments.reduce((sum, p) => sum + p.amount, 0);

              return (
                <tr key={client.id} className="hover:bg-slate-800/50 transition-colors group">
                  
                  {/* 1. Doctor Info */}
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-500">
                        {client.doctorName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-white">{client.doctorName}</p>
                        <p className="text-xs text-slate-500">{client.clinicName}</p>
                        <p className="text-[10px] text-slate-600">{client.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* 2. Status */}
                  <td className="p-5">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        client.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {client.status}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> {client.plan} Plan
                      </span>
                    </div>
                  </td>

                  {/* 3. Renewal Date (Countdown) */}
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-slate-600" />
                       <span className="text-slate-300 font-mono">{new Date(client.nextPaymentDate).toLocaleDateString()}</span>
                    </div>
                    {isExpired && client.status === 'Active' ? (
                       <span className="text-red-500 text-xs font-bold flex items-center gap-1 mt-1">
                         <AlertCircle className="w-3 h-3" /> Overdue by {Math.abs(daysLeft)} days
                       </span>
                    ) : (
                       <span className={`text-xs font-bold mt-1 block ${daysLeft < 5 ? 'text-yellow-500' : 'text-slate-500'}`}>
                         {daysLeft} days remaining
                       </span>
                    )}
                  </td>

                  {/* 4. Revenue (LTV) */}
                  <td className="p-5">
                    <p className="text-lg font-bold text-green-400">${totalPaid}</p>
                    <p className="text-xs text-slate-500">{client.payments.length} transactions</p>
                  </td>

                  {/* 5. Actions */}
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      {/* زر التجديد السريع */}
                      <form action={renewSubscription}>
                        <input type="hidden" name="id" value={client.id} />
                        <button title="Add 1 Month" className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded">
                          Renew
                        </button>
                      </form>

                      {/* زر التعليق/التفعيل */}
                      <form action={toggleClientStatus}>
                        <input type="hidden" name="id" value={client.id} />
                        <input type="hidden" name="currentStatus" value={client.status} />
                        <button className={`px-3 py-1 text-xs font-bold rounded border ${
                          client.status === 'Active' 
                            ? 'border-red-900 text-red-500 hover:bg-red-900/20' 
                            : 'border-green-900 text-green-500 hover:bg-green-900/20'
                        }`}>
                          {client.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </form>

                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
        
        {clients.length === 0 && (
            <div className="p-12 text-center text-slate-500">
                <p>No clients found. Start by adding a doctor from the Dashboard.</p>
            </div>
        )}
      </div>
    </div>
  );
}
