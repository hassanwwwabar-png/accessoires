import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Users, CreditCard, Settings, LogOut, LayoutDashboard, MessageSquare } from "lucide-react";
// ✅ التصحيح 1: استيراد logout بدلاً من logoutUser
import { logout } from "@/app/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("mysaas_userId")?.value;
  const userRole = cookieStore.get("mysaas_role")?.value;

  // ✅ التصحيح 2: التحقق من جميع احتمالات الأدمن
  const isAdmin = userRole === "super_admin" || userRole === "admin" || userRole === "superadmin";

  // حماية الصفحة
  if (!userId || !isAdmin) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full flex flex-col shadow-2xl z-50">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter">SAAS PANEL</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/saas-admin" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition-all text-sm font-bold text-slate-400 hover:text-white">
            <LayoutDashboard className="w-5 h-5" /> Overview
          </Link>
          <Link href="/saas-admin/clients" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition-all text-sm font-bold text-slate-400 hover:text-white">
            <Users className="w-5 h-5" /> Clients (Doctors)
          </Link>
          <Link href="/saas-admin/payments" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition-all text-sm font-bold text-slate-400 hover:text-white">
            <CreditCard className="w-5 h-5" /> Subscriptions
          </Link>
          
          <Link href="/saas-admin/messages" className="flex items-center gap-3 p-3 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl transition-all text-sm font-bold hover:bg-indigo-600/20">
            <MessageSquare className="w-5 h-5" /> System Logs & Messages
          </Link>

          <Link href="/saas-admin/settings" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition-all text-sm font-bold text-slate-400 hover:text-white">
            <Settings className="w-5 h-5" /> SaaS Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          {/* ✅ التصحيح 3: استخدام دالة logout الصحيحة */}
          <form action={logout}>
            <button className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-950/30 rounded-xl transition-colors font-black text-xs uppercase tracking-widest">
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}