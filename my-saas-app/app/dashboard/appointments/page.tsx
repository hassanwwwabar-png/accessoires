import { getClientId, getAppointments } from "@/app/actions";
import { db } from "@/lib/db"; // ✅ استيراد db لجلب المرضى
import { redirect } from "next/navigation";
import { AppointmentsView } from "@/components/dashboard/appointments-view";

export default async function AppointmentsPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  // 1. جلب المواعيد
  const appointments = await getAppointments();

  // 2. جلب قائمة المرضى (لإضافتهم في المودال)
  const patients = await db.patient.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, firstName: true, lastName: true }
  });

  return (
    <div className="animate-in fade-in duration-500">
      <AppointmentsView appointments={appointments} patients={patients} />
    </div>
  );
}