"use client";

import { MessageCircle } from "lucide-react";

export function WhatsappButton() {
  // 📞 ضع رقم هاتفك هنا (رقم الأدمن)
  const phoneNumber = "212600000000"; 
  
  // 💬 الرسالة الافتراضية
  const message = "السلام عليكم، أحتاج مساعدة في المنصة.";

  const whatsappLink = `https://wa.me/${212660571862}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#128C7E] hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 group"
    >
      {/* أيقونة واتساب */}
      <MessageCircle className="w-6 h-6 fill-current" />
      
      {/* النص (يظهر عند تمرير الماوس أو دائماً حسب الرغبة) */}
      <span className="font-bold text-sm hidden md:group-hover:inline-block transition-all">
        Support WhatsApp
      </span>
      
      {/* نقطة تنبيه حمراء صغيرة (اختياري: لتبدو وكأنها إشعار) */}
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
    </a>
  );
}