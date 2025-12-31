import { createClientByAdmin } from "@/app/actions";
import { UserPlus, Building2, Mail, Lock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddClientPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/saas-admin/clients" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Clients
      </Link>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Manually Add Doctor</h1>
          <p className="text-slate-500">Create a new account for a client.</p>
        </div>

        <form action={createClientByAdmin} className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase text-slate-500 ml-2">Doctor Name</label>
            <div className="relative mt-1">
               <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
               <input name="doctorName" type="text" placeholder="Dr. Full Name" className="w-full pl-12 p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-500 ml-2">Clinic Name</label>
            <div className="relative mt-1">
               <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
               <input name="clinicName" type="text" placeholder="Clinic Name" className="w-full pl-12 p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-500 ml-2">Email Address</label>
            <div className="relative mt-1">
               <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
               <input name="email" type="email" placeholder="email@example.com" className="w-full pl-12 p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-500 ml-2">Password</label>
            <div className="relative mt-1">
               <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
               <input name="password" type="text" placeholder="Set a temporary password" className="w-full pl-12 p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
          </div>

          <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-indigo-600 transition-all shadow-lg mt-4">
            Create Account Now
          </button>
        </form>
      </div>
    </div>
  );
}