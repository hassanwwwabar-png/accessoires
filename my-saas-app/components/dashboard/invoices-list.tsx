"use client";

import { useLanguage } from "@/components/language-context";
import { useState } from "react";
import { Search, FileText, Trash2, Eye, Plus, X, User, DollarSign, Calendar } from "lucide-react";
import { InvoiceStatusSelect } from "@/components/dashboard/invoice-status-select";
import { deleteInvoice, createInvoice } from "@/app/actions";
// ✅ Correct Import: Import the Modal itself, not a wrapper
import { InvoiceModal } from "@/components/dashboard/invoice-modal";

interface InvoicesListProps {
  invoices: any[];
  patients: any[];
}

export function InvoicesList({ invoices, patients }: InvoicesListProps) {
  const { t, isRTL } = useLanguage();
  const [query, setQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // ✅ New State: To control which invoice is being viewed
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const searchLower = query.toLowerCase();
    const patientName = `${inv.patient.firstName} ${inv.patient.lastName}`.toLowerCase();
    return patientName.includes(searchLower);
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isRTL ? 'text-right' : ''}`}>
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" /> {t.invoices}
          </h1>
          <p className="text-slate-500 text-sm font-bold">Manage patient payments</p>
        </div>

        {/* New Invoice Button */}
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
        >
          {isFormOpen ? <X className="w-4 h-4"/> : <Plus className="w-4 h-4"/>} 
          {t.newInvoice}
        </button>
      </div>

      {/* 🟢 Add Invoice Form */}
      {isFormOpen && (
        <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg"><Plus className="w-4 h-4"/></div>
            {t.createInvoice}
          </h3>
          
          <form action={async (formData) => {
              await createInvoice(formData);
              setIsFormOpen(false);
            }} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Patient */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">{t.selectPatient}</label>
              <div className="relative">
                <User className={`absolute top-3.5 w-4 h-4 text-slate-500 ${isRTL ? 'left-auto right-4' : 'left-4'}`}/>
                <select name="patientId" required className={`w-full py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold focus:border-blue-500 outline-none appearance-none ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}>
                  <option value="">-- {t.selectPatient} --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">{t.invoiceDate}</label>
              <div className="relative">
                  <Calendar className={`absolute top-3.5 w-4 h-4 text-slate-500 ${isRTL ? 'left-auto right-4' : 'left-4'}`}/>
                  <input type="date" name="date" required className={`w-full py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:border-blue-500 outline-none ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`} />
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">{t.amount}</label>
              <div className="relative">
                  <DollarSign className={`absolute top-3.5 w-4 h-4 text-slate-500 ${isRTL ? 'left-auto right-4' : 'left-4'}`}/>
                  <input type="number" name="amount" placeholder="0.00" required className={`w-full py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:border-blue-500 outline-none ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`} />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">{t.paymentStatus}</label>
              <select name="status" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold focus:border-blue-500 outline-none appearance-none text-white">
                  <option value="Paid">{t.paid}</option>
                  <option value="Pending">{t.pending}</option>
                  <option value="Cancelled">{t.cancelled}</option>
              </select>
            </div>

            {/* Submit */}
            <div className="md:col-span-2 lg:col-span-4 flex justify-end pt-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg shadow-blue-900/50 transition-all">
                {t.save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className={`absolute top-3.5 w-4 h-4 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
          <input 
            placeholder={t.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none ${isRTL ? 'pr-10' : 'pl-10'}`}
          />
        </div>
      </div>

      {/* 🧾 Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : ''}`}>{t.patients}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : ''}`}>{t.invoiceDate}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : ''}`}>{t.amount}</th>
                <th className="px-6 py-4 text-center">{t.billingStatus}</th>
                <th className="px-6 py-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400 text-xs font-bold">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                    
                    {/* Patient Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-black">
                          {inv.patient.firstName[0]}
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                          {inv.patient.firstName} {inv.patient.lastName}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                      {new Date(inv.date).toLocaleDateString()}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-sm font-black text-slate-800">
                      ${inv.amount}
                    </td>

                    {/* Status Select */}
                    <td className="px-6 py-4 text-center">
                      <InvoiceStatusSelect id={inv.id} currentStatus={inv.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">

                        {/* Delete Button */}
                        <form 
                          action={deleteInvoice}
                          onSubmit={(e) => {
                            if (!confirm(t.deleteConfirmation)) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={inv.id} />
                          <button className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors" title={t.delete}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>

                        {/* ✅ Eye Button (Triggers State) */}
                        <button 
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title={t.view}
                        >
                           <Eye className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ The Modal Component (Outside Loop) */}
      <InvoiceModal 
        isOpen={!!selectedInvoice} 
        onClose={() => setSelectedInvoice(null)} 
        invoice={selectedInvoice} 
      />

    </div>
  );
}