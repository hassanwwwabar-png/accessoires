import { db } from "@/lib/db";
import { 
  CreditCard, Eye, CheckCircle, XCircle, 
  Trash2, Check, X, Clock, User 
} from "lucide-react";
import { approvePayment, rejectPayment, deletePayment } from "@/app/actions";

export default async function PaymentsPage() {
  
  // جلب كل الطلبات (الأحدث أولاً)
  const payments = await db.paymentRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true } // لجلب اسم الطبيب
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-xl text-green-600">
            <CreditCard className="w-8 h-8" />
          </div>
          Payment Requests
        </h1>
        <p className="text-slate-500 font-bold mt-2 ml-14">
          Review subscription payments and activate doctor accounts.
        </p>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        
        {payments.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-black">
              <tr>
                <th className="p-5">Doctor</th>
                <th className="p-5">Amount</th>
                <th className="p-5">Receipt (Screenshot)</th>
                <th className="p-5">Status</th>
                <th className="p-5">Date</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((pay) => (
                <tr key={pay.id} className={`hover:bg-slate-50/50 transition-colors ${pay.status === 'PENDING' ? 'bg-amber-50/30' : ''}`}>
                  
                  {/* Doctor Info */}
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                         <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{pay.client.doctorName}</p>
                        <p className="text-xs text-slate-400 font-bold">{pay.client.clinicName}</p>
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="p-5 font-black text-slate-800 text-lg">
                    {pay.amount} <span className="text-xs text-slate-400 font-medium">MAD</span>
                  </td>

                  {/* 🖼️ Receipt (Screenshot) */}
                  <td className="p-5">
                    {pay.receiptUrl ? (
                       <a 
                         href={pay.receiptUrl} 
                         target="_blank" 
                         className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 w-fit"
                       >
                         <Eye className="w-4 h-4" /> 
                         <span className="text-xs font-bold">View Receipt</span>
                       </a>
                    ) : (
                       <span className="text-slate-400 text-xs font-bold">No Image</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
                      pay.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      pay.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700 animate-pulse'
                    }`}>
                      {pay.status === 'APPROVED' && <CheckCircle className="w-3 h-3"/>}
                      {pay.status === 'REJECTED' && <XCircle className="w-3 h-3"/>}
                      {pay.status === 'PENDING' && <Clock className="w-3 h-3"/>}
                      {pay.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="p-5 text-xs font-bold text-slate-400">
                    {new Date(pay.createdAt).toLocaleDateString()}
                  </td>

                  {/* ⚡ Actions (Approve / Reject) */}
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      
                      {/* أزرار الموافقة والرفض تظهر فقط إذا كان الطلب معلقاً */}
                      {pay.status === 'PENDING' && (
                        <>
                          {/* ✅ Approve */}
                          <form action={approvePayment}>
                            <input type="hidden" name="id" value={pay.id} />
                            <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200" title="Approve & Activate">
                              <Check className="w-4 h-4" /> <span className="text-xs font-bold">Approve</span>
                            </button>
                          </form>

                          {/* ❌ Reject */}
                          <form action={rejectPayment}>
                            <input type="hidden" name="id" value={pay.id} />
                            <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100" title="Reject">
                              <X className="w-4 h-4" />
                            </button>
                          </form>
                        </>
                      )}

                      {/* 🗑️ Delete (Always visible) */}
                      <form action={deletePayment}>
                        <input type="hidden" name="id" value={pay.id} />
                        <button className="p-2 bg-white text-slate-400 rounded-lg hover:bg-slate-50 hover:text-red-500 transition-colors" title="Delete Record">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
               <CreditCard className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-black text-slate-800">No payment requests yet.</h3>
            <p className="text-slate-400 text-sm font-bold max-w-xs mt-2">
              When doctors upload receipts, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}