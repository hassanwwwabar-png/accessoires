import { db } from "@/lib/db";
import { createPrescription } from "@/app/actions";
import { Pill, FileText, ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";

export default async function NewPrescriptionPage({ params }: { params: { id: string } }) {
  // انتظار قراءة ID المريض (Next.js 15)
  const { id } = await params;
  
  const patient = await db.patient.findUnique({ where: { id } });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      
      <Link href={`/dashboard/patients/${id}`} className="flex items-center gap-2 text-slate-500 mb-6 hover:text-blue-600">
        <ArrowLeft className="w-4 h-4" /> Back to Patient
      </Link>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-400" /> New Prescription
            </h1>
            <p className="text-slate-400 mt-2">Create a new prescription for <span className="text-white font-bold">{patient?.firstName} {patient?.lastName}</span></p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
             <Pill className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <form action={createPrescription} className="space-y-6">
            <input type="hidden" name="patientId" value={id} />

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Diagnosis (Optional)</label>
              <input name="diagnosis" placeholder="e.g. Acute Bronchitis" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Medications Area */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Medications (Rx)</label>
              <div className="relative">
                <textarea 
                  name="medications" 
                  required 
                  rows={8} 
                  placeholder="- Amoxicillin 500mg (1cp x 3 / day)&#10;- Paracetamol 1g (1cp if pain)&#10;- Vitamin C..." 
                  className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm leading-relaxed"
                ></textarea>
                <Pill className="absolute right-4 top-4 w-5 h-5 text-slate-300" />
              </div>
              <p className="text-xs text-slate-400 mt-2">Write each medication on a new line.</p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Additional Notes / Advice</label>
              <input name="notes" placeholder="Drink plenty of water, rest for 3 days..." className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Submit Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/10">
              <Printer className="w-5 h-5" /> Save & Generate PDF
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}