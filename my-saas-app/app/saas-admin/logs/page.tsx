import { db } from "@/lib/db";
import { FileText, Clock, User, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SystemLogsPage() {
  
  // جلب آخر 50 حدث
  const logs = await db.systemLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-slate-900 text-white rounded-xl">
          <FileText className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Logs</h1>
          <p className="text-slate-500">Audit trail of all administrative actions.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {logs.length === 0 ? (
          <div className="text-center py-20">
            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">System is quiet.</p>
            <p className="text-xs text-slate-400">No actions recorded yet.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-950">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Timestamp</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Action</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Detail</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Actor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  
                  {/* Timestamp */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                    <div className="flex items-center gap-2">
                       <Clock className="w-3 h-3" />
                       {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </td>

                  {/* Action Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        log.action.includes("PAYMENT") ? "bg-green-100 text-green-700" :
                        log.action.includes("SETTINGS") ? "bg-blue-100 text-blue-700" :
                        "bg-slate-100 text-slate-700"
                    }`}>
                      {log.action}
                    </span>
                  </td>

                  {/* Details */}
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    {log.details}
                  </td>

                  {/* Actor */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                       <User className="w-3 h-3" /> {log.actor}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}