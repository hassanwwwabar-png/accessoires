"use client";

import { useState } from "react";
import { X, Edit, Save } from "lucide-react";
import { updatePatientNotes } from "@/app/actions";

interface Props {
  patientId: string;
  currentNotes: string;
}

export function EditNotesModal({ patientId, currentNotes }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* زر التعديل (القلم) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-lg transition-all shadow-sm group"
        title="Edit Notes"
      >
        <Edit className="w-4 h-4 group-hover:scale-110 transition-transform"/>
      </button>

      {/* النافذة المنبثقة */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            
            {/* الهيدر */}
            <div className="bg-slate-50 p-5 flex justify-between items-center border-b border-slate-100">
              <h3 className="font-black text-slate-800 flex items-center gap-2 text-lg">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Edit className="w-5 h-5" /></div>
                Edit Clinical Notes
              </h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* النموذج */}
            <form 
              action={async (fd) => { 
                await updatePatientNotes(fd); 
                setIsOpen(false); 
              }} 
              className="p-6"
            >
              <input type="hidden" name="patientId" value={patientId} />
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">
                  Doctor's Observations & Diagnosis
                </label>
                
                {/* منطقة الكتابة */}
                <textarea 
                  name="notes" 
                  defaultValue={currentNotes || ""}
                  rows={10}
                  placeholder="Write clinical notes, diagnosis, symptoms, or observations here..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all resize-none leading-relaxed"
                  autoFocus
                ></textarea>
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-50">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all flex items-center gap-2 transform active:scale-95">
                   <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}