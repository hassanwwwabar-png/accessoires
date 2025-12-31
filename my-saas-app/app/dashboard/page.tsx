import { getClientId, getSettings } from "@/app/actions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default async function DashboardPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  // 1. التحقق من العميل
  const client = await db.client.findUnique({ where: { id: clientId } });
  if (!client) redirect("/login");
  
  const currency = "MAD";

  // ---------------------------------------------------------
  // 📊 2. الإحصائيات العلوية
  // ---------------------------------------------------------
  const totalPatients = await db.patient.count({ where: { clientId } });
  const totalAppointments = await db.appointment.count({ where: { clientId } });
  
  const revenueData = await db.invoice.aggregate({
    where: { clientId, status: "PAID" },
    _sum: { amount: true }
  });
  const totalRevenue = revenueData._sum.amount || 0;


  // ---------------------------------------------------------
  // 📈 3. بيانات الرسم البياني (Billing Summary) - آخر 30 يوم
  // ---------------------------------------------------------
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setDate(today.getDate() - 30); // ✅ نعود 30 يوماً للوراء

  // جلب الفواتير المدفوعة في آخر شهر
  const monthlyInvoices = await db.invoice.findMany({
    where: {
      clientId,
      status: "PAID",
      date: { gte: lastMonth } // ✅ نستخدم date كما صححنا سابقاً
    }
  });

  // تجميع البيانات حسب التاريخ
  const billingChartData = [];

  // حلقة تكرار لمدة 30 يوماً
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i)); // نبدأ من قبل 29 يوماً وصولاً لليوم
    
    // ✅ تنسيق التاريخ ليظهر هكذا: 25/12
    const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
    
    // حساب مجموع فواتير هذا اليوم بالتحديد
    const dailySum = monthlyInvoices
      .filter(inv => new Date(inv.date).toDateString() === d.toDateString())
      .reduce((sum, inv) => sum + inv.amount, 0);

    billingChartData.push({ name: dateStr, amount: dailySum });
  }


  // ---------------------------------------------------------
  // 🍩 4. بيانات الرسم الدائري (Appointment Status)
  // ---------------------------------------------------------
  const scheduledCount = await db.appointment.count({ where: { clientId, status: "SCHEDULED" } });
  const completedCount = await db.appointment.count({ where: { clientId, status: "COMPLETED" } });
  const cancelledCount = await db.appointment.count({ where: { clientId, status: "CANCELLED" } });
  
  const hasData = scheduledCount + completedCount + cancelledCount > 0;
  
  const capacityChartData = hasData ? [
    { name: 'Scheduled', value: scheduledCount, color: '#3B82F6' },
    { name: 'Completed', value: completedCount, color: '#22C55E' },
    { name: 'Cancelled', value: cancelledCount, color: '#EF4444' },
  ] : [
    { name: 'No Data', value: 100, color: '#E2E8F0' }
  ];


  // ---------------------------------------------------------
  // 📅 5. جدول المواعيد الأخيرة
  // ---------------------------------------------------------
  const recentAppointments = await db.appointment.findMany({
    where: { clientId },
    take: 5,
    orderBy: { date: 'desc' },
    include: { patient: true }
  });

  const formattedAppointments = recentAppointments.map(apt => ({
    ...apt,
    patient: {
      ...apt.patient,
      firstName: apt.patient.firstName || "Unknown",
      lastName: apt.patient.lastName || "",
    }
  }));

  return (
    <DashboardView 
      doctorName={client.doctorName || "Doctor"}
      stats={{
        patients: totalPatients,
        appointments: totalAppointments,
        revenue: totalRevenue
      }}
      recentAppointments={formattedAppointments}
      billingData={billingChartData} // ✅ يعرض الآن 30 نقطة بيانية بتواريخ
      capacityData={capacityChartData}
      currency={currency}
    />
  );
}