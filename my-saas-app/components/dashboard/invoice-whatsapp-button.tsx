"use client";

import { MessageCircle } from "lucide-react";

interface Props {
  patientPhone: string | null;
  patientName: string;
  invoiceId: string;
  amount: number;
  currency: string;
  clinicName: string;
}

export function InvoiceWhatsappButton({ 
  patientPhone, patientName, invoiceId, amount, currency, clinicName 
}: Props) {

  const handleSend = () => {
    if (!patientPhone) {
      alert("No phone number found for this patient.");
      return;
    }

    // 1. تنظيف رقم الهاتف (حذف المسافات والرموز)
    const cleanPhone = patientPhone.replace(/\D/g, ''); 

    // 2. تجهيز الرسالة (يمكنك تعديل النص هنا)
    // \n تعني سطر جديد
    const message = `Hello ${patientName},\n\nHere is your invoice #${invoiceId} from ${clinicName}.\nAmount: ${amount} ${currency}.\n\nThank you for your trust!`;

    // 3. فتح رابط واتساب
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (!patientPhone) return null; // لا تظهر الزر إذا لم يكن هناك رقم

  return (
    <button 
      onClick={handleSend}
      className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full font-bold text-xs hover:bg-[#128C7E] transition-colors print:hidden shadow-sm"
    >
      <MessageCircle className="w-4 h-4" /> Send via WhatsApp
    </button>
  );
}