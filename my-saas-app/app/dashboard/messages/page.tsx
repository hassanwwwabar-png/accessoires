export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { getClientId, sendSupportMessage } from "@/app/actions";
import { redirect } from "next/navigation";
import { Send, User, ShieldCheck, MessageSquare, Clock } from "lucide-react";

export default async function SupportChatPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  // جلب الرسائل
  const messages = await db.message.findMany({
    where: { clientId },
    orderBy: { createdAt: 'asc' }
  });

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 dark:text-white">Support Chat</h1>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Direct Line to Admin
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 mt-20">
            <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No messages yet.</p>
            <p className="text-sm">Type below to contact support.</p>
          </div>
        ) : (
          messages.map((msg) => {
            // 👇 هنا الإصلاح: نستخدم role لتحديد من المرسل
            const isDoctor = msg.role === 'DOCTOR';
            
            return (
              <div 
                key={msg.id} 
                className={`flex w-full ${isDoctor ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${isDoctor ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
                    isDoctor 
                      ? 'bg-blue-100 text-blue-600 border-blue-200' 
                      : 'bg-slate-800 text-white border-slate-700'
                  }`}>
                    {isDoctor ? <User className="w-4 h-4"/> : <ShieldCheck className="w-4 h-4"/>}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col">
                    {/* 👇 اسم المرسل بناءً على الدور */}
                    <span className={`text-[10px] font-bold mb-1 ${isDoctor ? 'text-right text-slate-500' : 'text-left text-slate-500'}`}>
                      {isDoctor ? "You" : "Support Team"}
                    </span>

                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      isDoctor 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                    
                    {/* Time */}
                    <div className={`text-[10px] mt-1 flex items-center gap-1 opacity-60 ${isDoctor ? 'justify-end' : 'justify-start'}`}>
                       <Clock className="w-3 h-3" />
                       {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form action={sendSupportMessage} className="flex gap-3">
          <input 
            name="content" 
            required
            placeholder="Type your message here..." 
            className="flex-1 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white"
            autoComplete="off"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-all shadow-lg hover:scale-105 flex items-center justify-center">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
}