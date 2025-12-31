import { loginUser } from "@/app/actions";
import { Stethoscope, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ForgotPasswordModal } from "@/components/dashboard/forgot-password-modal"; 

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const error = params?.error;
  const success = params?.success;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 max-w-md w-full p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-xl mb-4">
             <Stethoscope className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-slate-500 font-bold">Sign in to manage your clinic.</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Invalid email or password.
          </div>
        )}
        {success === "registered" && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Account created! Please log in.
          </div>
        )}

        {/* ✅✅ الحل هنا: نضع المودال خارج الفورم الرئيسي */}
        <div className="relative">
            
            {/* Login Form */}
            <form action={loginUser} className="space-y-5">
               <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input name="email" type="email" required className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700" placeholder="doctor@example.com" />
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input name="password" type="password" required className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700" placeholder="••••••••" />
                  </div>
               </div>

               {/* مكان زر الدخول */}
               <button className="w-full bg-slate-900 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg mt-4">
                 Sign In <ArrowRight className="w-4 h-4" />
               </button>
            </form>

            {/* ✅✅ زر Forgot Password نضعه هنا بشكل منفصل */}
            <div className="flex justify-end mt-2 mb-4">
                <ForgotPasswordModal />
            </div>

        </div>

        <p className="mt-6 text-center text-sm text-slate-500 font-medium">
          Don't have an account? <Link href="/register" className="text-blue-600 font-black hover:underline">Register now</Link>
        </p>

      </div>
    </div>
  );
}