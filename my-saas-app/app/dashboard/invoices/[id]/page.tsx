import { db } from "@/lib/db";
import { getClientId } from "@/app/actions";
import { redirect } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { PrintButton } from "@/components/print-button"; // ✅ بدون امتداد// 👈 لا تكتب .tsx هنا
export default async function InvoiceDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  const invoice = await db.invoice.findUnique({
    where: { id },
    include: { 
      patient: true,
      client: true 
    }
  });

  if (!invoice) return <div>Invoice not found</div>;

  // ✅✅ تصحيح الخطأ 1: التحايل على TypeScript لقراءة العملة إذا كانت موجودة، أو استخدام MAD
  const clientData = invoice.client as any;
  const currency = clientData.currency || "MAD";

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      
      {/* Navigation & Print Button */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Link href="/dashboard/invoices" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to List
        </Link>
        <PrintButton />
      </div>

      {/* Invoice Paper */}
      <div className="bg-white p-10 rounded-xl shadow-xl border border-slate-200 text-slate-900 min-h-[800px] relative">
        
        {/* 1. Header Section */}
        <div className="flex justify-between items-start border-b pb-8 mb-8">
           <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black print:text-black print:border print:border-black">
               {(invoice.client.clinicName || "C")[0]}
             </div>
             <div>
               <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                 {invoice.client.clinicName || invoice.client.doctorName}
               </h1>
               <p className="text-sm font-bold text-slate-500">Dr. {invoice.client.doctorName}</p>
             </div>
           </div>
           
           <div className="text-right">
             <h2 className="text-4xl font-black text-slate-200/50 uppercase tracking-widest">INVOICE</h2>
             <p className="font-mono font-bold text-slate-600 mt-1">#{invoice.id.slice(0, 8).toUpperCase()}</p>
             <p className="text-sm font-bold text-slate-400 mt-1">
                {new Date(invoice.date).toLocaleDateString()}
             </p>
           </div>
        </div>

        {/* 2. Info Grid (From / To) */}
        <div className="grid grid-cols-2 gap-12 mb-12">
            
            {/* From (Doctor) */}
            <div>
              <p className="text-xs font-black text-slate-400 uppercase mb-3 tracking-wider">From</p>
              <h3 className="text-lg font-black text-slate-800">{invoice.client.doctorName}</h3>
              <p className="text-sm font-bold text-slate-500 mb-2">{invoice.client.specialty || "General Medicine"}</p>
              
              <div className="space-y-1">
                 {invoice.client.address && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {invoice.client.address}
                    </p>
                 )}
                 {invoice.client.phone && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {invoice.client.phone}
                    </p>
                 )}
              </div>
            </div>

            {/* To (Patient) */}
            <div className="text-right">
              <p className="text-xs font-black text-slate-400 uppercase mb-3 tracking-wider">Bill To</p>
              <h3 className="text-xl font-black text-slate-800">
                {invoice.patient.firstName} {invoice.patient.lastName}
              </h3>
              <div className="text-sm text-slate-500 mt-2 space-y-1 flex flex-col items-end">
                {invoice.patient.email && (
                    <p className="flex items-center gap-2 font-medium"><Mail className="w-3 h-3"/> {invoice.patient.email}</p>
                )}
                {invoice.patient.phone && (
                    <p className="flex items-center gap-2 font-medium"><Phone className="w-3 h-3"/> {invoice.patient.phone}</p>
                )}
              </div>
            </div>
        </div>

        {/* 3. Details Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="text-left py-3 font-black uppercase text-xs tracking-wider">Description</th>
              <th className="text-right py-3 font-black uppercase text-xs tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              {/* ✅✅ تصحيح الخطأ 2: استبدال invoice.service بنص ثابت */}
              <td className="py-6 text-sm font-bold text-slate-700">
                 Medical Consultation
              </td>
              <td className="py-6 text-right font-black text-slate-800">
                 {invoice.amount.toFixed(2)} <span className="text-xs text-slate-400">{currency}</span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 4. Total & Signature */}
        <div className="flex justify-end mt-10">
           <div className="w-1/2 md:w-1/3">
              <div className="flex justify-between py-2 border-b border-slate-100">
                 <span className="text-slate-500 font-bold text-sm">Subtotal</span>
                 <span className="font-bold text-slate-800">{currency} {invoice.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-4 items-center">
                 <span className="text-xl font-black text-slate-900">Total</span>
                 <span className="text-2xl font-black text-blue-600">
                    {currency} {invoice.amount.toFixed(2)}
                 </span>
              </div>
              
              {/* Status Badge */}
              <div className="mt-4 text-right">
                 <span className={`px-3 py-1 rounded text-xs font-black uppercase border ${
                    invoice.status === 'PAID' 
                    ? 'bg-green-50 text-green-600 border-green-200' 
                    : 'bg-amber-50 text-amber-600 border-amber-200'
                 }`}>
                    {invoice.status}
                 </span>
              </div>
           </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-10 left-10 right-10 text-center border-t border-slate-100 pt-8">
           <p className="text-slate-400 font-bold text-sm">Thank you for your trust.</p>
           <p className="text-slate-300 text-xs mt-1">
              If you have any questions, please contact {invoice.client.phone}
           </p>
        </div>

      </div>
    </div>
  );
}