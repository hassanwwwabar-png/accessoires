"use client"; // 👈 هذا السطر هو الحل السحري

import { deleteClient } from "@/app/actions";
import { Trash2 } from "lucide-react";
import { FormEvent } from "react";

export function DeleteClientButton({ id }: { id: string }) {
  
  const handleSubmit = (e: FormEvent) => {
    // 🛑 نافذة تأكيد قبل الحذف
    if (!confirm("⚠️ هل أنت متأكد تماماً؟ سيتم حذف الطبيب وكل بياناته نهائياً!")) {
      e.preventDefault(); // إلغاء العملية إذا ضغط Cancel
    }
  };

  return (
    <form action={deleteClient} onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={id} />
      <button className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm hover:shadow-red-200">
        <Trash2 className="w-4 h-4" /> Delete Account
      </button>
    </form>
  );
}