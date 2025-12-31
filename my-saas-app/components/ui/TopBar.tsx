"use client";

import { useState, useEffect } from "react";
import { Search, Bell, X, FileText, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
// سنحتاج لاستدعاء الـ actions بطريقة Client (يمكنك استخدام مكتبة أو fetch، هنا سنستخدم خدعة بسيطة)
// ملاحظة: في المشاريع الحقيقية نستخدم React Query أو useTransition
import { searchGlobal, getNotifications, markNotificationRead } from "@/app/actions";

export default function TopBar() {
  const pathname = usePathname();
  const pageName = pathname.split("/").pop() || "Dashboard";
  const formattedTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  // Search State
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Live Search Handler
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length > 2) {
        setIsSearching(true);
        const data = await searchGlobal(query);
        setResults(data);
        setIsSearching(false);
      } else {
        setResults(null);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Load Notifications
  useEffect(() => {
    getNotifications().then(setNotifications);
  }, [pathname]); // Reload on page change

  return (
    <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 h-16 px-8 flex items-center justify-between sticky top-0 z-40">
      
      <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize hidden md:block">{formattedTitle}</h2>

      <div className="flex items-center gap-6 ml-auto">
        
        {/* 🔍 Active Search Bar */}
        <div className="relative">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-full px-4 py-2 w-48 md:w-64 border border-transparent focus-within:border-blue-500 transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 dark:text-slate-200"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
            {query && <X className="w-3 h-3 cursor-pointer text-slate-400" onClick={() => {setQuery(""); setResults(null)}} />}
          </div>

          {/* Search Dropdown Results */}
          {results && (
            <div className="absolute top-12 right-0 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 flex flex-col gap-1 z-50">
              {results.patients.length === 0 && results.files.length === 0 && <p className="p-3 text-sm text-slate-500 text-center">No results found.</p>}
              
              {results.patients.map((p: any) => (
                <Link key={p.id} href={`/dashboard/patients/${p.id}`} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><User className="w-4 h-4"/></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{p.firstName} {p.lastName}</p>
                    <p className="text-xs text-slate-500">{p.phone}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 🔔 Active Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
          </button>
          
          {showNotifs && (
            <div className="absolute top-12 right-0 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
               <div className="p-3 border-b border-slate-100 dark:border-slate-800 font-bold text-sm">Notifications</div>
               <div className="max-h-64 overflow-y-auto">
                 {notifications.length === 0 ? (
                   <p className="p-4 text-xs text-slate-500 text-center">No notifications.</p>
                 ) : (
                   notifications.map((n) => (
                     <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`p-3 border-b border-slate-50 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 ${!n.isRead ? 'bg-blue-50/50' : ''}`}>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                     </div>
                   ))
                 )}
               </div>
            </div>
          )}
        </div>

        <ThemeToggle />
        
        {/* Profile */}
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">Dr</div>
      </div>
    </div>
  );
}