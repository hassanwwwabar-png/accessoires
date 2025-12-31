"use client";

import { useLanguage } from "@/components/language-context";
import { useState } from "react";
import { Search, FileText, Trash2, Printer, CheckCircle, Clock, XCircle } from "lucide-react";
import { deleteInvoice } from "@/app/actions";
import { PrintInvoiceModal } from "@/components/dashboard/print-invoice-modal"; 
import { NewInvoiceModal } from "@/components/dashboard/new-invoice-modal"; 

interface InvoicesViewProps {
  invoices: any[];
  patients: any[];
}

export function InvoicesView({ invoices, patients }: InvoicesViewProps) {
  const { t, isRTL } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // ✅ استخدام trans لتجنب أخطاء TypeScript في الترجمة
  const trans = t as any;

  const filteredInvoices = invoices.filter((inv) => {
    const searchLower = query.toLowerCase();
    const patientName = `${inv.patient.firstName} ${inv.patient.lastName}`.toLowerCase();
    const invoiceId = inv.id.toLowerCase();
    return patientName.includes(searchLower) || invoiceId.includes(searchLower);
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isRTL ? 'text-right' : ''}`}>
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><FileText className="w-5 h-5"/></div>
            {trans.invoices || "Invoices"}
          </h1>
          <p className="text-slate-500 text-sm font-bold">Manage billing and payments</p>
        </div>
        
        <NewInvoiceModal patients={patients} />
      </div>

      {/* Search Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
        <div className="relative flex-1">
          <Search className={`absolute top-3.5 w-4 h-4 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
          <input 
            placeholder={trans.searchPlaceholder || "Search..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full py-3 bg-transparent text-sm font-bold outline-none ${isRTL ? 'pr-10' : 'pl-10'}`}
          />
        </div>
      </div>

      {/* 🧾 Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : ''}`}>ID</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : ''}`}>{trans.patients || "Patient"}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : ''}`}>{trans.invoiceDate || "Date"}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : ''}`}>{trans.amount || "Amount"}</th>
                <th className="px-6 py-4 text-center">{trans.status || "Status"}</th>
                <th className="px-6 py-4 text-center">{trans.actions || "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 text-xs font-bold">
                    {trans.noInvoices || "No invoices found."}
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                    
                    {/* ID */}
                    <td className={`px-6 py-4 text-xs font-bold text-slate-400 font-mono ${isRTL ? 'text-right' : ''}`}>
                      #{inv.id.slice(0, 6)}
                    </td>

                    {/* Patient Name */}
                    <td className={`px-6 py-4 ${isRTL ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-sm font-bold text-slate-700">
                          {inv.patient.firstName} {inv.patient.lastName}
                        </span>
                      </div>
                    </td>

                    {/* ✅✅✅ Date (تم التصحيح هنا) */}
                    <td className={`px-6 py-4 text-xs font-bold text-slate-500 ${isRTL ? 'text-right' : ''}`}>
                      {new Date(inv.date).toLocaleDateString()}
                    </td>

                    {/* Amount & Currency */}
                    <td className={`px-6 py-4 text-sm font-black text-slate-800 ${isRTL ? 'text-right' : ''}`}>
                       {inv.amount} <span className="text-[10px] text-slate-400">{inv.client?.currency || "MAD"}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase ${
                         inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                         inv.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                         'bg-amber-100 text-amber-700'
                       }`}>
                          {inv.status === 'Paid' && <CheckCircle className="w-3 h-3"/>}
                          {inv.status === 'Pending' && <Clock className="w-3 h-3"/>}
                          {inv.status === 'Cancelled' && <XCircle className="w-3 h-3"/>}
                          {inv.status}
                       </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">

                        {/* ✅ Print Button */}
                        <button 
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title={trans.print || "Print"}
                        >
                           <Printer className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <form 
                          action={deleteInvoice}
                          onSubmit={(e) => {
                            if (!confirm(trans.deleteConfirmation || "Delete invoice?")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={inv.id} />
                          <button 
                            className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors" 
                            title={trans.delete || "Delete"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Print Modal */}
      <PrintInvoiceModal 
        isOpen={!!selectedInvoice} 
        onClose={() => setSelectedInvoice(null)} 
        invoice={selectedInvoice} 
      />

    </div>
  );
}