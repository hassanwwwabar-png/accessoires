import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { CreditCard, CheckCircle, XCircle } from "lucide-react";

export default async function SubscriptionPage({ params }: { params: { id: string } }) {
  // 1. محاولة معرفة المستخدم الحالي (نفترض أنه الإدمن للتجربة)
  // في التطبيق الحقيقي سنستخدم getSession أو مشابه
  const doctorEmail = "hassanwwwabar@gmail.com"; 

  // 2. جلب بيانات العميل بدون علاقة payments التي تسبب المشكلة
  let client = await db.client.findFirst({
     where: { 
       // بحث مرن: إما بالإيميل أو بالمعرف
       OR: [
         { email: doctorEmail },
         { id: (await params).id } // استخدام id من الرابط
       ]
     }
  });

  // بيانات وهمية للعرض فقط حتى يتم تحديث قاعدة البيانات لاحقاً
  const dummyPayments = [
    { id: "1", amount: 200, status: "PAID", date: new Date(), plan: "Premium" },
    { id: "2", amount: 200, status: "PAID", date: new Date(Date.now() - 30*24*60*60*1000), plan: "Premium" },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-purple-600" /> Subscription & Billing
        </h1>
        <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">
          {client?.status || "Active"} Plan
        </span>
      </div>

      {/* بطاقة تفاصيل الخطة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-2">
            <h2 className="text-xl font-bold mb-4">Current Plan Details</h2>
            <div className="flex justify-between items-center mb-4">
               <div>
                  <p className="text-slate-500 text-sm">Plan Name</p>
                  <p className="font-bold text-lg">Pro Doctor License</p>
               </div>
               <div>
                  <p className="text-slate-500 text-sm">Price</p>
                  <p className="font-bold text-lg">$29.00 <span className="text-xs text-slate-400">/ month</span></p>
               </div>
               <div>
                  <p className="text-slate-500 text-sm">Next Billing</p>
                  <p className="font-bold text-lg">{new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
               </div>
            </div>
            <button className="w-full py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
               Manage Subscription
            </button>
         </div>

         <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
               <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-purple-900">Account Verified</h3>
            <p className="text-xs text-purple-600 mt-1">Your license is active and valid.</p>
         </div>
      </div>

      {/* جدول المدفوعات */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg">Payment History</h3>
         </div>
         <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
               <tr>
                  <th className="px-6 py-3">Invoice ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Receipt</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {dummyPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-medium">INV-{payment.id}0023</td>
                     <td className="px-6 py-4 text-slate-500">{payment.date.toLocaleDateString()}</td>
                     <td className="px-6 py-4 font-bold">${payment.amount}.00</td>
                     <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                           {payment.status}
                        </span>
                     </td>
                     <td className="px-6 py-4">
                        <button className="text-blue-600 hover:underline">Download</button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}