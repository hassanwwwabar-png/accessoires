import { db } from "@/lib/db";
import { CreditCard, CheckCircle, Clock, Calendar, AlertTriangle, ShieldCheck } from "lucide-react";

export default async function SubscriptionPage() {
  // ⚠️ ملاحظة: هنا نورمالمون كنجيبو الإيميل من الكوكيز
  // للتجربة دابا، غنجيبو معلومات "Dr. Omar" أو "Admin"
  // (غير باش تبان ليك الصفحة عامرة)
  const doctorEmail = "admin@clinic.com"; // أو الإيميل باش داخل نتا

  let client = await db.client.findUnique({
    where: { email: doctorEmail },
    include: { payments: { orderBy: { date: 'desc' } } }
  });

  // إذا مالقيناش الطبيب فالداتابيز (حيت داخل بكونت Demo)، نعرضو بيانات وهمية
  if (!client) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-xl flex items-center gap-4">
          <AlertTriangle className="w-8 h-8" />
          <div>
            <h3 className="font-bold text-lg">Demo Account Mode</h3>
            <p>You are using a demo account. Real subscription data will appear for registered clients.</p>
          </div>
        </div>
      </div>
    );
  }

  const isActive = client.status === 'Active';
  const daysLeft = Math.ceil((new Date(client.nextPaymentDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  return (
    <div className="p-8 max-w-5xl mx-auto">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-600" /> My Subscription
        </h1>
        <p className="text-slate-500 mt-1">Manage your plan and billing history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        
        {/* --- Plan Card --- */}
        <div className="md:col-span-2 bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-blue-300 text-sm font-bold uppercase tracking-wider mb-2">Current Plan</p>
              <h2 className="text-4xl font-bold mb-4">Professional Plan</h2>
              <div className="flex items-center gap-2 mb-8">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${isActive ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                  {client.status}
                </span>
                <span className="text-slate-400 text-sm">{client.plan} Billing</span>
              </div>
            </div>
            <CreditCard className="w-12 h-12 text-blue-500 opacity-50" />
          </div>

          <div className="grid grid-cols-2 gap-8 border-t border-slate-700 pt-6">
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold mb-1">Expiration Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="font-mono text-lg">{client.nextPaymentDate.toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold mb-1">Days Remaining</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className={`font-mono text-lg ${daysLeft < 5 ? 'text-red-400' : 'text-white'}`}>
                  {daysLeft} Days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Support Card --- */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-center text-center shadow-sm">
           <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <CreditCard className="w-6 h-6 text-blue-600" />
           </div>
           <h3 className="font-bold text-slate-900 mb-2">Need to Renew?</h3>
           <p className="text-slate-500 text-sm mb-6">Contact support to renew your subscription or upgrade your plan.</p>
           <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all w-full">
             Contact Admin
           </button>
        </div>

      </div>

      {/* --- Payment History --- */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Payment History</h3>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Description</th>
              <th className="p-4">Period</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-center">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {client.payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No payment history available.</td>
              </tr>
            ) : (
              client.payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{pay.date.toLocaleDateString()}</td>
                  <td className="p-4 text-slate-600">SaaS Subscription Renewal</td>
                  <td className="p-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">{pay.period}</span></td>
                  <td className="p-4 text-right font-bold text-slate-900">${pay.amount}</td>
                  <td className="p-4 text-center">
                    <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded-full flex items-center justify-center gap-1 w-fit mx-auto">
                      <CheckCircle className="w-3 h-3" /> Paid
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}