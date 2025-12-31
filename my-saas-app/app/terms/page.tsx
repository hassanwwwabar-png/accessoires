import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-500" /> Terms of Service
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Effective Date: December 2025</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold mb-2">1. Agreement to Terms</h2>
            <p>By registering and using MyClinic.pro, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">2. Subscription & Payments</h2>
            <p>Services are billed on a subscription basis (Monthly or Yearly). You agree to pay the fees associated with your chosen plan. Failure to pay may result in account suspension.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">3. User Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You are also responsible for all activities that occur under your account.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">4. Medical Disclaimer</h2>
            <p>MyClinic.pro is a management tool, not a medical device. We do not provide medical advice. You are solely responsible for patient diagnosis and treatment.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">5. Termination</h2>
            <p>We reserve the right to terminate or suspend your account immediately, without prior notice, for any breach of these Terms.</p>
          </section>
        </div>

      </div>
    </div>
  );
}