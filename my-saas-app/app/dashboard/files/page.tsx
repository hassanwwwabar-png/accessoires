import { db } from "@/lib/db";
import { getClientId, uploadFile } from "@/app/actions"; // تأكد أن uploadFile موجودة في actions
import { redirect } from "next/navigation";
import { Folder, FileText, ExternalLink, User } from "lucide-react";

export default async function FilesPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  // ✅ تم التصحيح: استخدام patientDocument بدلاً من clinicFile
  const files = await db.patientDocument.findMany({
    where: { 
      patient: { clientId: clientId } 
    },
    include: { patient: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Folder className="w-8 h-8 text-orange-500" /> Patient Files
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed">
             <p className="text-slate-400">No files uploaded yet.</p>
          </div>
        ) : (
          files.map((file) => (
            <div key={file.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
               <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">{file.type || 'DOC'}</span>
               </div>
               
               <h3 className="font-bold text-slate-900 truncate">{file.name}</h3>
               
               <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 mb-4">
                  <User className="w-3 h-3" /> 
                  {file.patient.firstName} {file.patient.lastName}
               </div>

               <a 
                 href={file.url} 
                 target="_blank" 
                 rel="noreferrer"
                 className="flex items-center justify-center gap-2 w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
               >
                 <ExternalLink className="w-4 h-4" /> Open File
               </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}