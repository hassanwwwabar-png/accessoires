"use client";

import { useLanguage } from "@/components/language-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Calendar, FileText, 
  Activity, Headphones, Settings, LogOut, 
  Folder, CreditCard, Lock 
} from "lucide-react";
import { logout } from "@/app/actions";
import { useEffect, useState } from "react";

export function Sidebar() {
  const { t, isRTL } = useLanguage();
  const pathname = usePathname();
  
  // حالة الاشتراك (سنقرأها من الكوكيز في المتصفح)
  const [status, setStatus] = useState("ACTIVE"); // نفترض أنه نشط حتى يثبت العكس

  useEffect(() => {
    // قراءة الكوكيز بطريقة بسيطة في الجافاسكربت
    const match = document.cookie.match(new RegExp('(^| )mysaas_status=([^;]+)'));
    if (match) {
      setStatus(match[2]);
    }
  }, []);

  // ✅ القائمة الكاملة (للحساب النشط)
  const fullMenu = [
    { name: t.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { name: t.patients, href: "/dashboard/patients", icon: Users },
    { name: t.appointments, href: "/dashboard/appointments", icon: Calendar },
    { name: t.invoices, href: "/dashboard/invoices", icon: FileText },
    { name: t.documents, href: "/dashboard/documents", icon: Folder },
    { name: t.metrics, href: "/dashboard/metrics", icon: Activity }, 
  ];

  // 🔒 القائمة المقيدة (للحساب الموقوف)
  const restrictedMenu = [
    { name: t.subscription || "Subscription (Pay Now)", href: "/dashboard/subscription", icon: CreditCard },
  ];

  // تحديد القائمة التي سنعرضها بناءً على الحالة
  const menuItems = status === 'ACTIVE' ? fullMenu : restrictedMenu;

  return (
    <aside className={`w-64 bg-white border-r border-slate-100 hidden md:flex flex-col h-screen sticky top-0 ${isRTL ? 'border-l border-r-0' : ''}`}>
      
      {/* Logo */}
      <div className="h-20 flex items-center px-8 border-b border-slate-100">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xl mr-2 ${status === 'ACTIVE' ? 'bg-blue-600' : 'bg-red-500'}`}>
          {status === 'ACTIVE' ? 'M' : <Lock className="w-4 h-4"/>}
        </div>
        <span className="text-xl font-black text-slate-800 tracking-tight">MediMetrics</span>
      </div>

      {/* تنبيه إذا كان الحساب موقوفاً */}
      {status !== 'ACTIVE' && (
        <div className="p-4 m-4 bg-red-50 border border-red-100 rounded-xl text-center">
          <p className="text-xs font-bold text-red-600">Account Suspended</p>
          <p className="text-[10px] text-red-400 mt-1">Please pay to restore access.</p>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 mt-2">Menu</p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-slate-900 text-white shadow-lg" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
              <span className="font-bold text-sm">{item.name}</span>
            </Link>
          );
        })}

        {/* System Links (Support & Settings are always visible) */}
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 mt-6">System</p>
        
        {/* رابط الاشتراك يظهر دائماً في الأسفل للحساب النشط أيضاً */}
        {status === 'ACTIVE' && (
             <Link href="/dashboard/subscription" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === '/dashboard/subscription' ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
                <CreditCard className="w-5 h-5" /> <span className="font-bold text-sm">{t.subscription || "Subscription"}</span>
             </Link>
        )}

        <Link href="/dashboard/support" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === '/dashboard/support' ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
            <Headphones className="w-5 h-5" /> <span className="font-bold text-sm">{t.support}</span>
        </Link>
        
        <Link href="/dashboard/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === '/dashboard/settings' ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
            <Settings className="w-5 h-5" /> <span className="font-bold text-sm">{t.settings}</span>
        </Link>

      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-100">
        <form action={logout}>
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm">{t.logout}</span>
            </button>
        </form>
      </div>

    </aside>
  );
}