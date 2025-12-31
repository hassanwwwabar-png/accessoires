"use client";

import { useState } from "react";
import { X, Phone, Lock, Mail, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { resetPassword } from "@/app/actions";

export function ForgotPasswordModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError("");
    
    // استدعاء السيرفر
    const result = await resetPassword(formData);

    setIsLoading(false);

    if (result.success) {
      setStep(2); // الانتقال لصفحة النجاح
    } else {
      setError(result.message);
    }
  }

  return (
    <>
      {/* زر فتح النافذة (يجب أن يكون type="button" لمنع إرسال الفورم الخارجي) */}
      <button 
        type="button" 
        onClick={() => setIsOpen(true)}
        className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
      >
        Forgot password?
      </button>

      {/* النافذة المنبثقة */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Header */}
            <div className="bg-slate-50 p-5 flex justify-between items-center border-b border-slate-100">
              <h3 className="font-black text-slate-800 text-lg">Reset Password</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 2 ? (
                // ✅ شاشة النجاح
                <div className="text-center py-6 animate-in zoom-in">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800">Password Updated!</h3>
                  <p className="text-slate-500 font-bold mt-2">You can now login with your new password.</p>
                  <button onClick={() => { setIsOpen(false); setStep(1); }} className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800">
                    Close & Login
                  </button>
                </div>
              ) : (
                // 📝 نموذج التغيير
                <form action={handleSubmit} className="space-y-4">
                  
                  <p className="text-sm text-slate-500 font-bold mb-4">
                    Verify your identity to reset your password.
                  </p>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg flex items-center gap-2">
                       <X className="w-4 h-4" /> {error}
                    </div>
                  )}

                  {/* 1. Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400"/>
                      <input name="email" type="email" required placeholder="doctor@example.com" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>

                  {/* 2. Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-400"/>
                      <input name="phone" type="tel" required placeholder="+212 6..." className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>

                  {/* 3. New Password */}
                  <div className="space-y-1 pt-2 border-t border-slate-50">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400"/>
                      <input name="newPassword" type="password" required placeholder="••••••••" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>

                  <button disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex justify-center items-center gap-2 mt-2 disabled:opacity-70">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <><ArrowRight className="w-4 h-4" /> Reset Password</>}
                  </button>

                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}