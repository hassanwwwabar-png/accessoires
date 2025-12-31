import { db } from "@/lib/db";
import { getClientId } from "@/app/actions";
import { redirect } from "next/navigation";
import { Calendar as CalendarIcon } from "lucide-react";

export default async function CalendarPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  const appointments = await db.appointment.findMany({
    where: { clientId },
    include: { patient: true },
    // ✅ FIX 1: Use 'date' to sort
    orderBy: { date: 'asc' } 
  });

  // Group by Day
  const grouped = appointments.reduce((acc, apt) => {
    // ✅ FIX 2: Use 'date' here too
    const day = new Date(apt.date).toLocaleDateString();
    if (!acc[day]) acc[day] = [];
    acc[day].push(apt);
    return acc;
  }, {} as Record<string, typeof appointments>);

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <h1 className="text-3xl font-black mb-8 flex items-center gap-2 text-slate-800">
        <CalendarIcon className="w-8 h-8 text-indigo-600"/> Appointment Calendar
      </h1>
      
      <div className="space-y-8">
        {Object.keys(grouped).length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                <p className="text-slate-400 font-bold">No upcoming appointments found.</p>
            </div>
        ) : (
            Object.entries(grouped).map(([day, apts]) => (
            <div key={day}>
                <h3 className="font-bold text-slate-500 mb-3 sticky top-0 bg-slate-50 py-2 z-10 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span> {day}
                </h3>
                <div className="space-y-3">
                {apts.map(apt => (
                    <div key={apt.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                        <div className="flex items-center gap-6">
                            <div className="text-center min-w-[80px]">
                                <p className="text-lg font-black text-indigo-600">
                                    {new Date(apt.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                </p>
                            </div>
                            
                            <div className="h-10 w-px bg-slate-100"></div>

                            <div>
                                <h4 className="font-bold text-slate-800 text-lg">
                                    {apt.patient.firstName} {apt.patient.lastName}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold uppercase bg-slate-100 px-2 py-1 rounded text-slate-500 tracking-wider">
                                        {apt.type || "General"}
                                    </span>
                                </div>
                                {/* ✅ FIX 3: Use 'notes' (not fullNote) */}
                                {apt.notes && (
                                    <p className="text-xs text-slate-400 mt-2 italic bg-slate-50 p-2 rounded-lg inline-block">
                                        "{apt.notes}"
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        <span className={`text-xs font-black px-3 py-2 rounded-xl uppercase tracking-wide ${
                            apt.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                            apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-blue-50 text-blue-600'
                        }`}>
                            {apt.status}
                        </span>
                    </div>
                ))}
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
}