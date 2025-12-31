import { createInvoice } from "@/app/actions";
import { db } from "@/lib/db";
import Link from "next/link";
import { Save, DollarSign } from "lucide-react";

export default async function NewInvoicePage() {
  const patients = await db.patient.findMany({
    orderBy: { firstName: 'asc' }
  });

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Create Invoice</h1>
        <Link href="/dashboard/invoices" className="text-slate-500 hover:text-slate-700">Cancel</Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
        <form action={createInvoice} className="space-y-6">
          
          {/* اختيار المريض */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Patient</label>
            <select name="patientId" required className="w-full px-4 py-2 border rounded-lg bg-white">
              <option value="">-- Select Patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
              ))}
            </select>
          </div>

          {/* المبلغ */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount ($)</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input name="amount" type="number" step="0.01" required className="w-full pl-10 pr-4 py-2 border rounded-lg" placeholder="0.00" />
            </div>
          </div>

          {/* الحالة */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select name="status" className="w-full px-4 py-2 border rounded-lg bg-white">
              <option value="Pending">Pending (Unpaid)</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* تاريخ الاستحقاق */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <input name="dueDate" type="date" required className="w-full px-4 py-2 border rounded-lg" />
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Invoice
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}