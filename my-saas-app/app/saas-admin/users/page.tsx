import { db } from "@/lib/db";
import { User, Mail, Calendar, CheckCircle, XCircle } from "lucide-react";

export default async function AdminUsersPage() {
  // ✅ جلب العملاء فقط بدون "include: payments" التي تسبب المشكلة
  const clients = await db.client.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Users List</h1>
           <p className="text-slate-500">Manage all registered accounts.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold">
           Total: {clients.length}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.length === 0 ? (
               <tr>
                 <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">
                   No users found.
                 </td>
               </tr>
            ) : (
               clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                       <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                          <User className="w-4 h-4" />
                       </div>
                       {client.doctorName}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                       <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" /> {client.email}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                          client.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                       }`}>
                          {client.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {client.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                       <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(client.createdAt).toLocaleDateString()}
                       </div>
                    </td>
                  </tr>
               ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}