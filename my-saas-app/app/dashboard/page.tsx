import { getClientId } from "@/app/actions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default async function DashboardPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  // 1. التحقق من العميل
  const client = await db.client.findUnique({ where: { id: clientId } });
  if (!client) redirect("/login");
  
  const currency = client.currency || "MAD"; 

  // ---------------------------------------------------------
  // 📊 الإحصائيات (Stats)
  // ---------------------------------------------------------
  const totalPatients = await db.patient.count({ where: { clientId } });
  const totalAppointments = await db.appointment.count({ where: { clientId } });
  
  const revenueData = await db.invoice.aggregate({
    where: { clientId, status: "PAID" },
    _sum: { amount: true }
  });
  const totalRevenue = revenueData._sum.amount || 0;

  // ---------------------------------------------------------
  // 📈 الرسم البياني (Billing Chart)
  // ---------------------------------------------------------
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setDate(today.getDate() - 30);

  const monthlyInvoices = await db.invoice.findMany({
    where: {
      clientId,
      status: "PAID",
      date: { gte: lastMonth }
    }
  });

  const billingChartData = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
    
    const dailySum = monthlyInvoices
      .filter(inv => new Date(inv.date).toDateString() === d.toDateString())
      .reduce((sum, inv) => sum + inv.amount, 0);

    billingChartData.push({ name: dateStr, amount: dailySum });
  }

  // ---------------------------------------------------------
  // 🍩 الرسم الدائري (Pie Chart)
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
  // 📅 جدول المواعيد (هنا كان مكان الخطأ)
  // ---------------------------------------------------------
  const recentAppointments = await db.appointment.findMany({
    where: { clientId },
    take: 5,
    orderBy: { date: 'desc' },
    // 👇 هذا الجزء (include) هو الذي يحل مشكلة "property patient does not exist"
    include: { 
      patient: true, // ✅ ضروري جداً لجلب اسم المريض
      invoices: true // ✅ ضروري لجلب السعر من الفاتورة
    }
  });

  const formattedAppointments = recentAppointments.map(apt => {
    // التعامل مع الفاتورة (لأنها مصفوفة invoices)
    const linkedInvoice = (apt.invoices && apt.invoices.length > 0) ? apt.invoices[0] : null;

    return {
      ...apt,
      // بما أننا وضعنا include: { patient: true }، فالآن apt.patient موجودة
      patient: {
        ...apt.patient,
        firstName: apt.patient.firstName || "Unknown",
        lastName: apt.patient.lastName || "",
      },
      
      // السعر من الفاتورة
      fees: linkedInvoice ? linkedInvoice.amount : 0,
      
      // الحالة من الفاتورة
      billingStatus: linkedInvoice ? linkedInvoice.status : "Unbilled"
    };
  });

  return (
    <DashboardView 
      doctorName={client.doctorName || "Doctor"}
      stats={{
        patients: totalPatients,
        appointments: totalAppointments,
        revenue: totalRevenue
      }}
      recentAppointments={formattedAppointments}
      billingData={billingChartData}
      capacityData={capacityChartData}
      currency={currency} 
    />
  );
}