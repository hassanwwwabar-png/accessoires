import { db } from "@/lib/db";
import { getClientId } from "@/app/actions";
import { redirect } from "next/navigation";
import { FileText, ExternalLink } from "lucide-react";

export default async function PrescriptionsPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  // ✅ patientDocument
  const docs = await db.patientDocument.findMany({
    where: { 
      patient: { clientId },
      tags: { contains: "Prescription" } 
    },
    include: { patient: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><FileText className="w-8 h-8 text-indigo-600"/> Prescriptions</h1>
      <div className="grid gap-4">
         {docs.length === 0 ? <p className="text-slate-500">No prescriptions found.</p> : docs.map(doc => (
            <div key={doc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
               <div>
                  <h3 className="font-bold">{doc.name}</h3>
                  <p className="text-xs text-slate-500">Patient: {doc.patient.firstName} {doc.patient.lastName}</p>
               </div>
               <a href={doc.url} target="_blank" className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">
                  View <ExternalLink className="w-3 h-3"/>
               </a>
            </div>
         ))}
      </div>
    </div>
  );
}