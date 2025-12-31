"use client";

import { useLanguage } from "@/components/language-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Activity, // Pour les métriques
  MessageCircle, // Pour le rapport/chat admin
  Settings, 
  LogOut 
} from "lucide-react";

export function Sidebar() {
  const { t, isRTL } = useLanguage();
  const pathname = usePathname();

  const menuItems = [
    { name: t.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { name: t.patients, href: "/dashboard/patients", icon: Users },
    { name: t.appointments, href: "/dashboard/appointments", icon: Calendar },
    { name: t.invoices, href: "/dashboard/invoices", icon: FileText },
    
    // 📊 Ici se trouvent vos graphiques
    { name: t.metrics, href: "/dashboard/metrics", icon: Activity }, 
  ];

  const bottomItems = [
    // 🎧 Ici se trouve le chat avec l'Admin (anciennement Support, maintenant Reports)
    { name: "Report to Admin", href: "/dashboard/reports", icon: MessageCircle }, 
    { name: t.settings, href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className={`w-64 bg-white border-r border-slate-100 hidden md:flex flex-col h-screen sticky top-0 ${isRTL ? 'border-l border-r-0' : ''}`}>
      {/* ... (Le reste du code reste identique, Logo, etc.) ... */}
      
      <div className="h-20 flex items-center px-8 border-b border-slate-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl mr-2">M</div>
        <span className="text-xl font-black text-slate-800 tracking-tight">MediMetrics</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 mt-2">Menu</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
              <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
              <span className="font-bold text-sm">{item.name}</span>
            </Link>
          );
        })}

        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 mt-6">System</p>
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
              <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
              <span className="font-bold text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-bold text-sm">{t.logout}</span>
        </button>
      </div>
    </aside>
  );
}