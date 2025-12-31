import { db } from "@/lib/db";
import { 
  MessageSquare, Phone, User, CheckCircle, 
  Trash2, Clock, Check, AlertCircle 
} from "lucide-react";
import { resolveMessage, deleteMessage } from "@/app/actions";

export default async function SystemLogsPage() {
  
  // 1. جلب الرسائل مرتبة من الأحدث للأقدم
  const messages = await db.supportMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true } // لجلب اسم الطبيب إذا كان مسجلاً
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
            <MessageSquare className="w-8 h-8" />
          </div>
          System Logs & Support
        </h1>
        <p className="text-slate-500 font-bold mt-2 ml-14">
          Monitor incoming support tickets and forgot password requests.
        </p>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        
        {messages.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-black">
              <tr>
                <th className="p-5">Sender</th>
                <th className="p-5">Message Content</th>
                <th className="p-5">Status</th>
                <th className="p-5">Date</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {messages.map((msg) => (
                <tr key={msg.id} className={`hover:bg-slate-50/50 transition-colors ${msg.status === 'PENDING' ? 'bg-blue-50/30' : ''}`}>
                  
                  {/* Sender Info */}
                  <td className="p-5 align-top">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${msg.client ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                         <User className="w-5 h-5" />
                      </div>
                      <div>
                        {msg.client ? (
                          <>
                            <p className="font-bold text-slate-800 text-sm">{msg.client.doctorName}</p>
                            <p className="text-xs text-slate-400 font-bold">{msg.client.clinicName}</p>
                          </>
                        ) : (
                          <p className="font-bold text-slate-800 text-sm">Unknown Visitor</p>
                        )}
                        
                        {/* Phone Number with WhatsApp Link */}
                        <a href={`https://wa.me/${msg.phone?.replace(/\s+/g, '')}`} target="_blank" className="flex items-center gap-1 text-xs font-bold text-green-600 mt-1 hover:underline">
                           <Phone className="w-3 h-3" /> {msg.phone || "No Phone"}
                        </a>
                      </div>
                    </div>
                  </td>

                  {/* Message Content */}
                  <td className="p-5 align-top">
                    <div className="max-w-md">
                       <p className="text-sm font-bold text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                         "{msg.message}"
                       </p>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-5 align-top">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
                      msg.status === 'RESOLVED' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {msg.status === 'RESOLVED' ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                      {msg.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="p-5 align-top">
                    <p className="text-xs font-bold text-slate-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-slate-300 font-bold">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="p-5 align-top text-right">
                    <div className="flex justify-end gap-2">
                      
                      {/* Mark as Resolved Button */}
                      {msg.status !== 'RESOLVED' && (
                        <form action={resolveMessage}>
                          <input type="hidden" name="id" value={msg.id} />
                          <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Mark as Resolved">
                            <Check className="w-4 h-4" />
                          </button>
                        </form>
                      )}

                      {/* Delete Button */}
                      <form action={deleteMessage}>
                        <input type="hidden" name="id" value={msg.id} />
                        <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete Log">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
               <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-black text-slate-800">No logs recorded yet.</h3>
            <p className="text-slate-400 text-sm font-bold max-w-xs mt-2">
              Messages from "Contact Support" and "Forgot Password" will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}