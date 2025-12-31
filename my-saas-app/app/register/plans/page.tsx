import Link from 'next/link';
import { Stethoscope, DollarSign, ArrowRight, XCircle, CheckCircle, Clock } from 'lucide-react';

export default function PlansPage() {
    
    // ملاحظة: لتبسيط الكود، زر "Go Premium" سيوجه الطبيب
    // إلى صفحة Subscription مع رسالة (تم الشرح في الخطوة 3)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Stethoscope className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Choose Your Starting Plan</h1>
                <p className="text-slate-500 text-lg">Select the best option to kickstart your clinic management.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                
                {/* --- 1. FREE PLAN --- */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-left-8 duration-500">
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                           <XCircle className="w-6 h-6 text-red-500" /> Free Trial
                        </h2>
                        <p className="text-slate-500 mt-1">Start now, upgrade later.</p>
                        <p className="text-4xl font-extrabold text-blue-600 mt-4">
                            $0<span className="text-xl font-medium text-slate-500">/mo</span>
                        </p>
                    </div>
                    
                    <ul className="space-y-3 flex-1 text-left mb-8">
                        <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><CheckCircle className="w-5 h-5 text-green-500"/> Patient List & Search</li>
                        <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><CheckCircle className="w-5 h-5 text-green-500"/> Appointment Scheduling</li>
                        <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><Clock className="w-5 h-5 text-red-500"/> Limited Patient Detail Views</li>
                        <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><DollarSign className="w-5 h-5 text-red-500"/> Financial Reports: Locked</li>
                    </ul>
                    
                    <Link href="/login" className="w-full bg-slate-900 hover:bg-slate-700 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-all">
                        Start Free Trial <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                {/* --- 2. PREMIUM PLAN --- */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border-4 border-blue-600 flex flex-col relative animate-in slide-in-from-right-8 duration-500">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">Recommended</div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <DollarSign className="w-6 h-6 text-blue-600" /> Premium Pro
                        </h2>
                        <p className="text-slate-500 mt-1">Unlock all advanced features for growth.</p>
                        <p className="text-4xl font-extrabold text-blue-600 mt-4">
                            $50<span className="text-xl font-medium text-slate-500">/mo</span>
                        </p>
                    </div>

                    <ul className="space-y-3 flex-1 text-left mb-8">
                        <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><CheckCircle className="w-5 h-5 text-green-500"/> Everything in Free</li>
                        <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><CheckCircle className="w-5 h-5 text-green-500"/> **Unlimited** Patient Details</li>
                        <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><CheckCircle className="w-5 h-5 text-green-500"/> Financial Dashboard & Reports</li>
                        <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><CheckCircle className="w-5 h-5 text-green-500"/> Staff Management & Alerts</li>
                    </ul>

                    {/* يرسله لصفحة الاشتراك مباشرة لإتمام الدفع */}
                    <Link href="/dashboard/subscription?plan=premium" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30">
                        Go Premium Now <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

            </div>
        </div>
    );
}