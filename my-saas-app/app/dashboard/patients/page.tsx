import { db } from "@/lib/db";
import { getClientId } from "@/app/actions";
import { redirect } from "next/navigation";

// ⚠️ CRITICAL: Must use curly braces { }
import { PatientList } from "@/components/dashboard/patient-list"; 

export default async function PatientsPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  const patients = await db.patient.findMany({
    where: { clientId },
    include: { appointments: { orderBy: { date: 'desc' }, take: 1 } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-in fade-in duration-500">
      <PatientList initialPatients={patients} />
    </div>
  );
}