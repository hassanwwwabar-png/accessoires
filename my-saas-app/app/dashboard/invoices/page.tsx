import { getClientId, getInvoices } from "@/app/actions";
import { db } from "@/lib/db"; 
import { redirect } from "next/navigation";

// ✅✅✅ لاحظ الأقواس حول { InvoicesView }
// إذا كانت بدون أقواس، سيحدث الخطأ الذي يظهر لك
import { InvoicesView } from "@/components/dashboard/invoices-view"; 

export default async function InvoicesPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  const invoices = await getInvoices();
  
  // جلب المرضى لتمريرهم للمودال الجديد
  const patients = await db.patient.findMany({
    where: { clientId },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-in fade-in duration-500">
      <InvoicesView invoices={invoices} patients={patients} />
    </div>
  );
}