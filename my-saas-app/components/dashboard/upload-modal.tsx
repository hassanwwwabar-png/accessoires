"use client";

import { useLanguage } from "@/components/language-context";
import { useState } from "react";
import { X, UploadCloud, FileText, Image as ImageIcon, User } from "lucide-react";
import { uploadDocument } from "@/app/actions";

// ✅ نستقبل قائمة المرضى
interface UploadModalProps {
  patients: any[];
}

export function UploadModal({ patients }: UploadModalProps) {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
      >
        <UploadCloud className="w-4 h-4"/> {t.uploadFile}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            <div className="bg-slate-50 p-5 flex justify-between items-center border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-600" /> {t.uploadFile}
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form 
              action={async (formData) => {
                await uploadDocument(formData);
                setIsOpen(false);
                setFileName("");
              }} 
              className="p-6 space-y-4"
            >
              
              {/* Patient Select (New ✅) */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">{t.selectPatientForDoc}</label>
                <div className="relative">
                  <User className={`absolute top-3.5 w-4 h-4 text-slate-400 ${isRTL ? 'left-auto right-3' : 'left-3'}`}/>
                  <select 
                    name="patientId" 
                    required 
                    className={`w-full py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 appearance-none ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
                  >
                    <option value="">-- {t.selectPatient} --</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">{t.documentName}</label>
                <input 
                  name="name" 
                  required
                  placeholder="e.g. Blood Test Result..."
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* File Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">{t.fileType}</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="cursor-pointer">
                    <input type="radio" name="type" value="PDF" className="peer sr-only" defaultChecked />
                    <div className="p-3 rounded-xl border border-slate-200 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 flex items-center justify-center gap-2 font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all">
                      <FileText className="w-4 h-4"/> PDF
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="type" value="Image" className="peer sr-only" />
                    <div className="p-3 rounded-xl border border-slate-200 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 flex items-center justify-center gap-2 font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all">
                      <ImageIcon className="w-4 h-4"/> Image
                    </div>
                  </label>
                </div>
              </div>

              {/* Fake File Input */}
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  name="file"
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                />
                <UploadCloud className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-indigo-600">{fileName || t.uploadFile}</p>
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all mt-2">
                {t.saveDocument}
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
}