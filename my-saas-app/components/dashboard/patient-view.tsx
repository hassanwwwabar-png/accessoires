"use client";

import { useLanguage } from "@/components/language-context";
import { useState } from "react";
import { 
  User, Phone, MapPin, Calendar, FileText, Activity, 
  Clock, Trash2, Eye, Pill, Mail, DollarSign, AlertCircle, CheckCircle 
} from "lucide-react";

import { InvoiceModal } from "@/components/dashboard/invoice-modal"; 
import { UploadModal } from "@/components/dashboard/upload-modal"; 
import { CreatePrescriptionModal } from "@/components/dashboard/create-prescription-modal"; 
import { PrescriptionModal } from "@/components/dashboard/prescription-modal"; 
import { NewInvoiceModal } from "@/components/dashboard/new-invoice-modal";
import { NewAppointmentModal } from "@/components/dashboard/new-appointment-modal";
import { EditNotesModal } from "@/components/dashboard/edit-notes-modal"; // ✅ استدعاء زر تعديل الملاحظات
import { deleteDocument } from "@/app/actions";

interface PatientViewProps {
  patient: any;
}

export function PatientView({ patient }: PatientViewProps) {
  const { t, isRTL } = useLanguage(); 
  
  // ✅✅✅ التصحيح هنا: أضفنا <string> لحل مشكلة TypeScript
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
  const completedAppts = patient.appointments?.filter((a: any) => a.status === 'Completed').length || 0;
  const totalPrescriptions = patient.prescriptions?.length || 0;
  const unpaidInvoices = patient.invoices?.filter((i: any) => i.status === 'Pending').length || 0;
  const nextAppointment = patient.appointments?.find((a: any) => new Date(a.date) > new Date() && a.status === 'Scheduled');

  return (
    <div className="animate-in fade-in space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 🟢 LEFT COLUMN: Patient Profile */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-24 bg-slate-900 opacity-5"></div>
            <div className="relative z-10 flex flex-col items-center mt-4">
              <div className="w-28 h-28 bg-white p-1 rounded-full shadow-lg mb-4">
                <div className="w-full h-full bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl font-black">
                  {patient.firstName[0]}
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-800">{patient.firstName} {patient.lastName}</h2>
              <p className="text-sm font-bold text-slate-400 mb-2">{(t as any).patientId || "ID"}: #{patient.id.slice(0,6)}</p>
              
              <div className="flex gap-2 mt-2 justify-center">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black uppercase">{(t as any).active || "Active"}</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black uppercase">{age} {(t as any).years}</span>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-left">
              <div className={`flex items-center gap-3 p-3 bg-slate-50 rounded-xl ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <Phone className="w-4 h-4 text-slate-400"/>
                <p className="text-sm font-bold text-slate-700">{patient.phone}</p>
              </div>
              <div className={`flex items-center gap-3 p-3 bg-slate-50 rounded-xl ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <MapPin className="w-4 h-4 text-slate-400"/>
                <p className="text-sm font-bold text-slate-700 truncate">{patient.address || "No Address"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className={`font-black text-slate-800 mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Activity className="w-5 h-5 text-red-500"/> {(t as any).vitals || "Vital Signs"}
            </h3>
            <div className="grid grid-cols-2 gap-3">
               <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase">{(t as any).blood || "Blood"}</p>
                  <p className="text-lg font-black text-slate-800">{patient.bloodType || "-"}</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase">{(t as any).weight || "Weight"}</p>
                  <p className="text-lg font-black text-slate-800">{patient.weight ? `${patient.weight}kg` : "-"}</p>
               </div>
            </div>
          </div>

        </div>

        {/* 🔵 RIGHT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tabs */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm flex overflow-x-auto scrollbar-hide">
            {['overview', 'appointments', 'prescriptions', 'invoices', 'documents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  activeTab === tab 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {(t as any)[tab] || tab}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            
            {/* 🏠 OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-2">
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Calendar className="w-6 h-6"/></div>
                      <div className={isRTL ? 'text-right' : ''}>
                         <p className="text-slate-400 text-xs font-black uppercase">{(t as any).visits || "Visits"}</p>
                         <h3 className="text-2xl font-black text-slate-800">{completedAppts}</h3>
                      </div>
                   </div>
                   <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Pill className="w-6 h-6"/></div>
                      <div className={isRTL ? 'text-right' : ''}>
                         <p className="text-slate-400 text-xs font-black uppercase">{(t as any).prescriptions || "Rx"}</p>
                         <h3 className="text-2xl font-black text-slate-800">{totalPrescriptions}</h3>
                      </div>
                   </div>
                   <div className={`p-5 rounded-2xl border shadow-sm flex items-center gap-4 ${unpaidInvoices > 0 ? 'bg-orange-50 border-orange-100' : 'bg-white border-slate-100'}`}>
                      <div className={`p-3 rounded-xl ${unpaidInvoices > 0 ? 'bg-white text-orange-600' : 'bg-green-50 text-green-600'}`}>
                         <DollarSign className="w-6 h-6"/>
                      </div>
                      <div className={isRTL ? 'text-right' : ''}>
                         <p className={`text-xs font-black uppercase ${unpaidInvoices > 0 ? 'text-orange-400' : 'text-slate-400'}`}>{(t as any).pendingBills || "Pending Bills"}</p>
                         <h3 className={`text-2xl font-black ${unpaidInvoices > 0 ? 'text-orange-700' : 'text-slate-800'}`}>{unpaidInvoices}</h3>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   
                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <h3 className={`font-bold text-slate-800 mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                         <AlertCircle className="w-5 h-5 text-red-500" /> {(t as any).medicalAlerts || "Medical Alerts"}
                      </h3>
                      {patient.allergies ? (
                         <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 font-bold text-sm">
                            {patient.allergies}
                         </div>
                      ) : (
                         <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 font-bold text-sm flex items-center gap-2">
                            <CheckCircle className="w-4 h-4"/> {(t as any).noAllergies || "No known allergies."}
                         </div>
                      )}
                   </div>

                   <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
                      <div className={`absolute top-0 p-6 opacity-10 ${isRTL ? 'left-0' : 'right-0'}`}><Clock className="w-24 h-24"/></div>
                      <h3 className="font-bold text-lg mb-1 relative z-10">{(t as any).nextAppointment || "Next Appointment"}</h3>
                      {nextAppointment ? (
                         <div className="mt-4 relative z-10">
                            <p className="text-4xl font-black mb-1">{new Date(nextAppointment.date).getDate()}</p>
                            <p className="text-xl font-medium text-slate-400 mb-4">{new Date(nextAppointment.date).toLocaleString(isRTL ? 'ar-EG' : 'default', { month: 'long', year: 'numeric' })}</p>
                            <span className="bg-blue-600 px-4 py-2 rounded-lg font-bold text-sm">
                               {new Date(nextAppointment.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                         </div>
                      ) : (
                         <div className="mt-4 relative z-10">
                            <p className="text-slate-400 font-medium">{(t as any).noUpcomingApps || "No upcoming appointments."}</p>
                            <button onClick={() => setActiveTab('appointments')} className="mt-4 bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-50 transition">{(t as any).bookNow || "Book Now"}</button>
                         </div>
                      )}
                   </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                   <div className={`flex justify-between items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <h3 className={`font-bold text-slate-800 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <FileText className="w-5 h-5 text-indigo-600" /> {(t as any).clinicalNotes || "Clinical Notes"}
                      </h3>
                      {/* ✅ زر تعديل الملاحظات */}
                      <EditNotesModal patientId={patient.id} currentNotes={patient.notes} />
                   </div>
                   <div className={`p-5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 font-medium leading-relaxed min-h-[100px] whitespace-pre-wrap ${isRTL ? 'text-right' : ''}`}>
                      {patient.notes || (t as any).noNotes || "No clinical notes added."}
                   </div>
                </div>

              </div>
            )}

            {/* 📅 APPOINTMENTS */}
            {activeTab === 'appointments' && (
               <div className="space-y-4 animate-in slide-in-from-bottom-2">
                  <div className={`flex justify-between items-center bg-purple-50 p-4 rounded-2xl border border-purple-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                     <h3 className="font-black text-purple-800 flex items-center gap-2"><Clock className="w-5 h-5"/> {(t as any).appointments || "History"}</h3>
                     <NewAppointmentModal patients={[patient]} />
                  </div>

                  {patient.appointments && patient.appointments.length > 0 ? (
                     patient.appointments.map((apt: any) => (
                        <div key={apt.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Clock className="w-5 h-5"/></div>
                              <div>
                                 <h4 className="font-black text-slate-800">{new Date(apt.date).toLocaleDateString()}</h4>
                                 <p className="text-xs font-bold text-slate-400">{new Date(apt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                              </div>
                           </div>
                           <span className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-black uppercase text-slate-600">{apt.status}</span>
                        </div>
                     ))
                  ) : <div className="text-center py-10 text-slate-400 font-bold bg-white rounded-2xl border border-dashed border-slate-200">{(t as any).noAppointments || "No appointments."}</div>}
               </div>
            )}

            {/* 💊 PRESCRIPTIONS */}
            {activeTab === 'prescriptions' && (
               <div className="space-y-4 animate-in slide-in-from-bottom-2">
                  <div className={`flex justify-between items-center bg-indigo-600 text-white p-4 rounded-2xl shadow-md ${isRTL ? 'flex-row-reverse' : ''}`}>
                     <h3 className="font-black flex items-center gap-2"><Pill className="w-5 h-5"/> {(t as any).prescriptions || "Prescriptions"}</h3>
                     <CreatePrescriptionModal patientId={patient.id} />
                  </div>
                  {patient.prescriptions && patient.prescriptions.length > 0 ? (
                     patient.prescriptions.map((pres: any) => (
                        <div key={pres.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center cursor-pointer" onClick={() => setSelectedPrescription(pres)}>
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-serif font-black text-xl italic">Rx</div>
                              <div>
                                 <h4 className="font-black text-slate-800">{(t as any).prescriptions || "Prescription"} #{pres.id.slice(0, 6)}</h4>
                                 <p className="text-xs font-bold text-slate-400 uppercase mt-1">{new Date(pres.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <button className="text-xs font-bold bg-slate-50 px-4 py-2 rounded-xl text-slate-500">{(t as any).view || "View"}</button>
                        </div>
                     ))
                  ) : <div className="text-center py-10 text-slate-400 font-bold bg-white rounded-2xl border border-dashed border-slate-200">{(t as any).noPrescriptions || "No prescriptions yet."}</div>}
               </div>
            )}

            {/* 💳 INVOICES */}
            {activeTab === 'invoices' && (
               <div className="space-y-4 animate-in slide-in-from-bottom-2">
                  <div className={`flex justify-between items-center bg-blue-50 p-4 rounded-2xl border border-blue-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                     <h3 className="font-black text-blue-800 flex items-center gap-2"><DollarSign className="w-5 h-5"/> {(t as any).invoices || "Invoices"}</h3>
                     <NewInvoiceModal patients={[patient]} />
                  </div>

                  {patient.invoices && patient.invoices.length > 0 ? (
                     patient.invoices.map((inv: any) => (
                        <div key={inv.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText className="w-5 h-5" /></div>
                              <div>
                                 <p className="font-black text-slate-800">${inv.amount}</p>
                                 <p className="text-xs text-slate-400">{new Date(inv.date).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{inv.status}</span>
                              <button onClick={() => setSelectedInvoice({...inv, patient, client: patient.client})} className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg"><Eye className="w-4 h-4"/></button>
                           </div>
                        </div>
                     ))
                  ) : <div className="text-center py-10 text-slate-400 font-bold bg-white rounded-2xl border border-dashed border-slate-200">{(t as any).noInvoices || "No invoices found."}</div>}
               </div>
            )}

            {/* 📂 DOCUMENTS */}
            {activeTab === 'documents' && (
               <div className="space-y-4 animate-in slide-in-from-bottom-2">
                  <div className="flex justify-end"><UploadModal patients={[patient]} /></div>
                  {patient.documents && patient.documents.length > 0 ? (
                     <div className="grid grid-cols-2 gap-4">
                        {patient.documents.map((doc: any) => (
                           <div key={doc.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative group">
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                 <button onClick={() => setPreviewDoc(doc)} className="p-1.5 bg-white text-blue-600 rounded-lg shadow-sm"><Eye className="w-3 h-3"/></button>
                                 <form action={deleteDocument} onSubmit={(e) => !confirm("Delete?") && e.preventDefault()}><input type="hidden" name="id" value={doc.id} /><button className="p-1.5 bg-white text-red-500 rounded-lg shadow-sm"><Trash2 className="w-3 h-3"/></button></form>
                              </div>
                              <div className="aspect-square bg-slate-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                                 {doc.type === 'Image' ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
                                 ) : <FileText className="w-10 h-10 text-slate-300" />}
                              </div>
                              <p className="font-bold text-slate-800 text-xs truncate">{doc.name}</p>
                           </div>
                        ))}
                     </div>
                  ) : <div className="text-center py-10 text-slate-400 font-bold bg-white rounded-2xl border border-dashed border-slate-200">{(t as any).noDocuments || "No documents."}</div>}
               </div>
            )}

          </div>
        </div>
      </div>

      {/* Modals */}
      <InvoiceModal isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} invoice={selectedInvoice} />
      <PrescriptionModal isOpen={!!selectedPrescription} onClose={() => setSelectedPrescription(null)} prescription={selectedPrescription} client={patient.client || {}} patient={patient} />
      {previewDoc && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewDoc(null)}><img src={previewDoc.url} className="max-w-full max-h-[90vh] rounded-lg" alt="Preview"/></div>)}

    </div>
  );
}