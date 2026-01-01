import { db } from "@/lib/db";
import { getClientId } from "@/app/actions";
import { redirect } from "next/navigation";
import { CreditCard, CheckCircle } from "lucide-react";

export default async function SubscriptionMainPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  // ✅ طلب البيانات بدون "include: payments" التي تسبب المشكلة
  const client = await db.client.findUnique({
    where: { id: clientId },
  });

  if (!client) redirect("/login");

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-purple-600" /> Subscription
        </h1>
        <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">
          {client.status || "Active"} Plan
        </span>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
         <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
         </div>
         <h2 className="text-2xl font-bold text-slate-900 mb-2">You are on the Pro Plan</h2>
         <p className="text-slate-500 mb-6">Your subscription is active and valid.</p>
         
         <div className="p-4 bg-slate-50 rounded-lg max-w-sm mx-auto mb-6">
            <p className="text-sm text-slate-600">Client ID:</p>
            <code className="text-xs font-mono bg-slate-200 px-2 py-1 rounded">{client.id}</code>
         </div>

         <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors">
            Manage Billing
         </button>
      </div>
    </div>
  );
}