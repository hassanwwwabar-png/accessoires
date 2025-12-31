import { getClientId, getPatient } from "@/app/actions";
import { notFound, redirect } from "next/navigation";
import { PatientView } from "@/components/dashboard/patient-view"; // ✅ استدعاء تصميم التبويبات الجديد

interface PageProps {
  params: { id: string };
}

export default async function PatientProfilePage({ params }: PageProps) {
  // 1. التحقق من تسجيل الدخول
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  // 2. جلب بيانات المريض (شاملة الفواتير، الوصفات، المواعيد...)
  const patient = await getPatient(params.id);

  // 3. إذا لم يتم العثور على المريض، اعرض صفحة 404
  if (!patient) {
    return notFound();
  }

  // 4. عرض التصميم وتمرير البيانات له
  return (
    <div className="animate-in fade-in duration-500">
       <PatientView patient={patient} />
    </div>
  );
}