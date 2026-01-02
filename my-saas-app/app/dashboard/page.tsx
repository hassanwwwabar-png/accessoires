import { getClientId } from "@/app/actions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default async function DashboardPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  // 1. التحقق من العميل وجلب العملة
  const client = await db.client.findUnique({ where: { id: clientId } });
  if (!client) redirect("/login");
  
  // ✅ جلب العملة (ستظهر $ أو USD إذا قمت بتغييرها في الداتابيس)
  const currency = client.currency || "MAD"; 

  // ---------------------------------------------------------
  // 📊 2. الإحصائيات العلوية (Stats)
  // ---------------------------------------------------------
  const totalPatients = await db.patient.count({ where: { clientId } });
  const totalAppointments = await db.appointment.count({ where: { clientId } });
  
  // حساب المداخيل فقط من الفواتير المدفوعة (PAID)
  const revenueData = await db.invoice.aggregate({
    where: { clientId, status: "PAID" },
    _sum: { amount: true }
  });
  const totalRevenue = revenueData._sum.amount || 0;

  // ---------------------------------------------------------
  // 📈 3. بيانات الرسم البياني (Billing Summary - Last 30 Days)
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
    
    // تنسيق التاريخ يوم/شهر
    const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
    
    // جمع فواتير هذا اليوم
    const dailySum = monthlyInvoices
      .filter(inv => new Date(inv.date).toDateString() === d.toDateString())
      .reduce((sum, inv) => sum + inv.amount, 0);

    billingChartData.push({ name: dateStr, amount: dailySum });
  }

  // ---------------------------------------------------------
  // 🍩 4. بيانات الرسم الدائري (Capacity Status)
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
  // 📅 5. المواعيد الأخيرة (الحل النهائي للسعر) 🕵️‍♂️
  // ---------------------------------------------------------
  const recentAppointments = await db.appointment.findMany({
    where: { clientId },
    take: 5,
    orderBy: { date: 'desc' },
    include: { 
      // ✅ 1. نجلب بيانات المريض
      patient: true, 
      
      // ✅ 2. نجلب الفواتير (invoices) بصيغة الجمع كما هي في الـ Schema
      invoices: true 
    }
  });

  const formattedAppointments = recentAppointments.map(apt => {
    // 👇 المنطق الجديد:
    // الموعد لديه قائمة فواتير (invoices)، نأخذ أول واحدة منها
    const linkedInvoice = (apt.invoices && apt.invoices.length > 0) ? apt.invoices[0] : null;

    return {
      ...apt,
      patient: {
        ...apt.patient,
        firstName: apt.patient.firstName || "Unknown",
        lastName: apt.patient.lastName || "",
      },
      
      // ✅ السعر يأتي من الفاتورة حصراً (وإلا فهو 0)
      fees: linkedInvoice ? linkedInvoice.amount : 0,
      
      // ✅ الحالة تأتي من الفاتورة حصراً
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