import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar"; // ✅ الاستيراد الصحيح الآن
import { Header } from "@/components/dashboard/header";    
import { LanguageProvider } from "@/components/language-context"; 

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("mysaas_userId")?.value;

  if (!userId) return redirect("/login");

  const client = await db.client.findUnique({
    where: { id: userId },
    select: { id: true, doctorName: true, clinicName: true, onboardingCompleted: true }
  });

  if (!client) return redirect("/login");
  if (!client.onboardingCompleted) return redirect("/onboarding");

  return (
    <LanguageProvider>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        
        {/* ✅ القائمة الجانبية (Sidebar) */}
        <Sidebar />

        {/* المحتوى الرئيسي */}
        <div className="flex-1 transition-all duration-300 flex flex-col min-w-0">
          <Header 
            doctorName={client.doctorName} 
            clinicName={client.clinicName || "My Clinic"} 
          />
          
          <main className="p-4 md:p-8">
            {children}
          </main>
        </div>

      </div>
    </LanguageProvider>
  );
}