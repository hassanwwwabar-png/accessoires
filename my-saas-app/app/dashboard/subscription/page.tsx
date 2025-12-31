import { getClientId, getBankDetails } from "@/app/actions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SubscriptionView } from "@/components/dashboard/subscription-view";
import { SubscriptionTimer } from "@/components/dashboard/subscription-timer";

export default async function SubscriptionPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  // 1. جلب بيانات العميل وآخر طلب دفع
  const client = await db.client.findUnique({
    where: { id: clientId },
    include: { 
      paymentRequests: { 
        orderBy: { createdAt: 'desc' }, 
        take: 1 
      } 
    }
  });

  if (!client) redirect("/login");

  // 2. جلب تفاصيل البنك والسعر من إعدادات النظام
  const bankDetails = await getBankDetails();

  // 3. تحديد الحالة الدقيقة
  let status = client.subscriptionStatus; // 'ACTIVE' or 'INACTIVE'
  const lastRequest = client.paymentRequests[0];
  
  // إذا كان الحساب متوقفاً، ولكن هناك طلب "قيد المراجعة"، نغير الحالة للعرض
  if (status !== 'ACTIVE' && lastRequest?.status === 'PENDING') {
    status = 'PENDING';
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* ✅ العداد الذكي:
         يظهر فقط إذا كان هناك تاريخ انتهاء AND الحساب نشط (ACTIVE).
         بمجرد أن ينتهي الوقت (ويتحول الحساب لـ INACTIVE)، يختفي العداد 
         ليظهر مكانه نموذج الدفع وتنبيه "Access Suspended" الموجود في SubscriptionView.
      */}
      {client.subscriptionEndsAt && status === 'ACTIVE' && (
         <SubscriptionTimer endDate={client.subscriptionEndsAt} />
      )}

      {/* واجهة الاشتراك والدفع */}
      <SubscriptionView 
        bankDetails={bankDetails} 
        clientStatus={status} 
      />
    </div>
  );
}