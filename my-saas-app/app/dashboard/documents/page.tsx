import { getClientId, getDocuments } from "@/app/actions";
import { db } from "@/lib/db"; // ✅ نحتاج لاستيراد db
import { redirect } from "next/navigation";
import { DocumentsView } from "@/components/dashboard/documents-view";

export default async function DocumentsPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  // 1. جلب المستندات
  const documents = await getDocuments();

  // 2. جلب المرضى (ليتمكن الطبيب من الاختيار في المودال)
  const patients = await db.patient.findMany({
    where: { clientId },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-in fade-in duration-500">
      <DocumentsView documents={documents} patients={patients} />
    </div>
  );
}