"use client";

import { useLanguage } from "@/components/language-context";
import { useState } from "react"; // ✅ استيراد useState
import { 
  Phone, Mail, Calendar, CreditCard, ShieldAlert, 
  Droplets, Clock, FileText, Upload, Plus, MapPin, Contact, 
  HeartPulse, Pill, Trash2, Image as ImageIcon, X, Eye 
} from "lucide-react";
import { createAppointment, deletePatient, deleteDocument, uploadDocument } from "@/app/actions";

interface PatientProfileProps {
  patient: any;
}

export function PatientProfile({ patient }: PatientProfileProps) {
  const { t } = useLanguage();
  
  // ✅ حالة لتخزين الملف المراد عرضه
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const appointments = patient.appointments || [];
  const documents = patient.documents || [];

  return (
    <div className="space-y-6">
      
      {/* 🟢 1. Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-200">
              {patient.firstName[0]}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">{patient.firstName} {patient.lastName}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-sm font-bold text-slate-500">
                 <span className="flex items-center gap-1"><Phone className="w-4 h-4"/> {patient.phone || "N/A"}</span>
                 <span className="flex items-center gap-1"><CreditCard className="w-4 h-4"/> {patient.cin || "No ID"}</span>
                 <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString() : "N/A"}</span>
              </div>
            </div>
         </div>
         
         <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-black uppercase tracking-wide">Active</span>
            <form action={deletePatient} onSubmit={(e) => { if (!confirm(t.deleteConfirmation)) e.preventDefault(); }}>
              <input type="hidden" name="patientId" value={patient.id} />
              <button className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"><Trash2 className="w-5 h-5" /></button>
            </form>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="space-y-6">
           {/* Contact */}
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <h3 className="font-black text-lg text-slate-800 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-indigo-600" /> {t.sectionContact}</h3>
             <div className="space-y-3">
               <div className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl"><Mail className="w-4 h-4 text-slate-400 mt-1" /><div><p className="text-[10px] font-black text-slate-400 uppercase">{t.email}</p><p className="text-sm font-bold text-slate-700 break-all">{patient.email || "N/A"}</p></div></div>
               <div className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl"><MapPin className="w-4 h-4 text-slate-400 mt-1" /><div><p className="text-[10px] font-black text-slate-400 uppercase">{t.address}</p><p className="text-sm font-bold text-slate-700">{patient.address || "N/A"}</p></div></div>
             </div>
           </div>
           
           {/* Medical */}
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <h3 className="font-black text-lg text-slate-800 mb-4 flex items-center gap-2"><HeartPulse className="w-5 h-5 text-rose-600" /> {t.medicalSummary}</h3>
             <div className="space-y-4">
               <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl"><span className="text-xs font-bold text-slate-500 flex items-center gap-2"><Droplets className="w-4 h-4 text-slate-400"/> {t.bloodType}</span><span className="text-rose-600 font-black text-sm bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">{patient.bloodType || '-'}</span></div>
               <div className="space-y-1"><p className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase"><ShieldAlert className="w-3 h-3 text-red-400"/> {t.allergies}</p><p className={`text-sm font-bold p-3 rounded-xl ${patient.allergies ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-400 italic'}`}>{patient.allergies || "No allergies."}</p></div>
             </div>
           </div>
        </div>

        {/* Center & Right */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* Add Appointment */}
           <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
             <h4 className="font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5"/> {t.appointments}</h4>
             <form action={createAppointment} className="flex flex-col md:flex-row gap-3 items-end">
               <input type="hidden" name="patientId" value={patient.id} />
               <div className="w-full md:w-auto flex-1"><label className="text-[10px] text-slate-400 font-bold uppercase ml-1">Date</label><input type="datetime-local" name="date" required className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white outline-none" /></div>
               <div className="w-full md:w-32"><label className="text-[10px] text-slate-400 font-bold uppercase ml-1">Type</label><input type="text" name="type" placeholder="Visit" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white outline-none" /></div>
               <div className="w-full md:w-24"><label className="text-[10px] text-slate-400 font-bold uppercase ml-1">{t.fee}</label><input type="number" name="price" placeholder="0.00" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white outline-none" /></div>
               <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-black text-sm transition-colors mb-[1px]">{t.save}</button>
             </form>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* Appointments History */}
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-black text-lg text-slate-800 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600" /> {t.appointmentsHistory}</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {appointments.length === 0 ? <p className="text-slate-400 text-xs font-bold">{t.noAppointments}</p> : 
                    appointments.map((apt: any) => (
                      <div key={apt.id} className="relative pl-4 border-l-2 border-slate-100 group hover:border-blue-200 transition-colors">
                        <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-600 group-hover:scale-125 transition-transform"></div>
                        <p className="text-xs font-black text-slate-800">{new Date(apt.date).toLocaleDateString()}</p>
                        <div className="mt-1 flex justify-between items-center bg-slate-50 p-2 rounded-lg group-hover:bg-blue-50 transition-colors"><span className="text-xs font-bold text-slate-700">{apt.type}</span><span className={`text-[10px] font-black px-2 py-0.5 rounded ${apt.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{apt.status}</span></div>
                      </div>
                    ))
                  }
                </div>
             </div>

             {/* 📂 Documents Section */}
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                <h3 className="font-black text-lg text-slate-800 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-600" /> {t.documents}</h3>
                
                {/* Upload Form */}
                <form action={uploadDocument} className="mb-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex flex-col gap-3">
                  <input type="hidden" name="patientId" value={patient.id} />
                  <input name="name" placeholder="Name (Optional)..." className="w-full p-2 bg-white text-xs font-bold rounded-lg border-none focus:ring-1 focus:ring-indigo-200 outline-none" />
                  <input type="file" name="file" required className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer" />
                  <button className="w-full bg-indigo-600 text-white py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1 hover:bg-indigo-700 transition-all shadow-sm"><Upload className="w-3 h-3"/> {t.upload || "Add Document"}</button>
                </form>

                {/* Documents List */}
                <div className="space-y-2 flex-1 overflow-y-auto max-h-[200px]">
                  {documents.length === 0 ? <p className="text-slate-400 text-xs font-bold">{t.noDocuments}</p> : 
                    documents.map((doc: any) => (
                      <div key={doc.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md transition-all group border border-transparent hover:border-slate-100">
                         
                         {/* ✅ زر فتح المعاينة (Preview) */}
                         <button 
                           onClick={() => setPreviewDoc(doc)}
                           className="flex gap-3 items-center overflow-hidden flex-1 cursor-pointer text-left"
                         >
                            <div className={`p-2 rounded-lg shrink-0 ${doc.type === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                {doc.type === 'PDF' ? <FileText className="w-4 h-4"/> : <ImageIcon className="w-4 h-4"/>}
                            </div>
                            <div className="min-w-0">
                               <p className="text-xs font-black text-slate-700 truncate group-hover:text-indigo-600 transition-colors">{doc.name}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase">{doc.type}</p>
                            </div>
                         </button>
                         
                         {/* زر الحذف */}
                         <form action={deleteDocument} onSubmit={(e) => { if(!confirm(t.deleteDocConfirm)) e.preventDefault(); }}>
                            <input type="hidden" name="id" value={doc.id} />
                            <button className="p-2 bg-white text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors shadow-sm opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4"/></button>
                         </form>
                      </div>
                    ))
                  }
                </div>
             </div>

           </div>
        </div>
      </div>

      {/* ✅✅✅ PREVIEW MODAL (النافذة المنبثقة للعرض) */}
      {previewDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setPreviewDoc(null)}>
          <div className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 relative" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                 <Eye className="w-5 h-5 text-indigo-600" /> {previewDoc.name}
              </h3>
              <button onClick={() => setPreviewDoc(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5"/></button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 bg-slate-900 flex items-center justify-center overflow-auto p-4">
               {previewDoc.type === 'PDF' ? (
                  <iframe src={previewDoc.url} className="w-full h-full min-h-[500px] rounded-lg bg-white" />
               ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewDoc.url} alt="Document Preview" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
               )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}