"use client";
import { registerUser } from "@/app/actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Stethoscope, User, Building2, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-10 space-y-8">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-100">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-slate-500 font-medium">Start managing your clinic professionally.</p>
          </div>

          {/* عرض رسائل الخطأ بناءً على الـ URL */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in zoom-in duration-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>
                {error === "email_exists" && "This email is already registered. Try signing in."}
                {error === "missing_fields" && "Please fill in all the required fields."}
                {error === "unknown" && "Something went wrong. Please try again later."}
              </p>
            </div>
          )}

          <form 
            action={async (formData) => {
              setIsPending(true);
              await registerUser(formData);
              setIsPending(false);
            }} 
            className="space-y-4"
          >
            <div className="relative">
              <User className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              <input name="doctorName" type="text" placeholder="Full Name (Doctor)" className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all" required />
            </div>

            <div className="relative">
              <Building2 className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              <input name="clinicName" type="text" placeholder="Clinic / Center Name" className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all" required />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              <input name="email" type="email" placeholder="Email Address" className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all" required />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              <input name="password" type="password" placeholder="Create Password" className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all" required />
            </div>

            <button 
              disabled={isPending}
              type="submit" 
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-indigo-600 disabled:bg-slate-400 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Sign Up Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 font-bold text-sm">
            Already have an account? <Link href="/login" className="text-indigo-600 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}