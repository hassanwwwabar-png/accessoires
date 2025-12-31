"use client";

import { useLanguage } from "@/components/language-context";
import { useState } from "react";
import { Search, FileText, Image as ImageIcon, Eye, Trash2, File, X, User } from "lucide-react";
import { UploadModal } from "@/components/dashboard/upload-modal";
import { deleteDocument } from "@/app/actions"; 

interface DocumentsViewProps {
  documents: any[];
  patients: any[];
}

export function DocumentsView({ documents, patients }: DocumentsViewProps) {
  const { t, isRTL } = useLanguage();
  const [query, setQuery] = useState("");
  
  // ✅ 1. حالة لتخزين الملف المراد عرضه
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(query.toLowerCase()) ||
    doc.patient.firstName.toLowerCase().includes(query.toLowerCase()) ||
    doc.patient.lastName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isRTL ? 'text-right' : ''}`}>
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><File className="w-5 h-5"/></div>
            {t.documents}
          </h1>
          <p className="text-slate-500 text-sm font-bold">Manage patient files and reports</p>
        </div>
        <UploadModal patients={patients} />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={`absolute top-3.5 w-4 h-4 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
        <input 
          placeholder={t.searchPlaceholder || "Search..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none shadow-sm ${isRTL ? 'pr-10' : 'pl-10'}`}
        />
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-400 font-bold">{t.noDocuments}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
              
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${doc.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                  {doc.type === 'PDF' ? <FileText className="w-6 h-6"/> : <ImageIcon className="w-6 h-6"/>}
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    
                    {/* ✅ زر المعاينة (يفتح النافذة) */}
                    <button 
                      onClick={() => setPreviewDoc(doc)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
                      title={t.view || "View"}
                    >
                      <Eye className="w-4 h-4"/>
                    </button>

                    {/* زر الحذف */}
                    <form 
                      action={deleteDocument}
                      onSubmit={(e) => {
                        if(!confirm(t.deleteDocConfirm)) e.preventDefault();
                      }}
                    >
                      <input type="hidden" name="id" value={doc.id} />
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 cursor-pointer">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </form>
                </div>
              </div>

              {/* ✅ جعل الاسم قابلاً للضغط أيضاً */}
              <button onClick={() => setPreviewDoc(doc)} className="text-left w-full">
                  <h3 className="font-bold text-slate-800 text-sm truncate hover:text-indigo-600 transition-colors">{doc.name}</h3>
              </button>

              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <User className="w-3 h-3"/> 
                <span className="text-indigo-600 font-bold">{doc.patient.firstName} {doc.patient.lastName}</span>
              </p>
              
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                <span>{doc.type}</span>
                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ✅✅✅ PREVIEW MODAL (نفس النافذة التي استخدمناها في البروفايل) */}
      {previewDoc && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" 
          onClick={() => setPreviewDoc(null)}
        >
          <div 
            className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 relative" 
            onClick={e => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                 <Eye className="w-5 h-5 text-indigo-600" /> {previewDoc.name}
              </h3>
              <button onClick={() => setPreviewDoc(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5"/>
              </button>
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