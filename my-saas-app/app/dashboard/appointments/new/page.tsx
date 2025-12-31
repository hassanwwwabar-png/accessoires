import { createAppointment } from "@/app/actions";
import { db } from "@/lib/db";
import Link from "next/link";
import { Save } from "lucide-react";

export default async function NewAppointmentPage() {
  // نجلب قائمة المرضى لنعرضهم في القائمة المنسدلة
  const patients = await db.patient.findMany({
    orderBy: { firstName: 'asc' }
  });

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Book Appointment</h1>
        <Link href="/dashboard/appointments" className="text-slate-500 hover:text-slate-700">Cancel</Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
        <form action={createAppointment} className="space-y-6">
          
          {/* اختيار المريض */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Patient</label>
            <select name="patientId" required className="w-full px-4 py-2 border rounded-lg bg-white">
              <option value="">-- Choose a patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* نوع الزيارة */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Visit Type</label>
            <select name="type" className="w-full px-4 py-2 border rounded-lg bg-white">
              <option value="Consultation">General Consultation</option>
              <option value="Checkup">Regular Checkup</option>
              <option value="Emergency">Emergency</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>

          {/* التاريخ والوقت */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date & Time</label>
            <input name="date" type="datetime-local" required className="w-full px-4 py-2 border rounded-lg" />
          </div>

          {/* ملاحظات */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea name="notes" rows={3} className="w-full px-4 py-2 border rounded-lg"></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Confirm Booking
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
