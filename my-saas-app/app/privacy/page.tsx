import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-green-500" /> Privacy Policy
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Last Updated: December 2025</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold mb-2">1. Introduction</h2>
            <p>Welcome to MyClinic.pro. We value your privacy and are committed to protecting your personal data and your patients' data. This policy explains how we handle information.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">2. Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li><strong>Account Info:</strong> Name, email, phone number, and clinic details.</li>
              <li><strong>Patient Data:</strong> Information you input regarding your patients (encrypted and secure).</li>
              <li><strong>Usage Data:</strong> Logs of how you access our services for security purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">3. How We Use Data</h2>
            <p>We use your data solely to provide the SaaS service, process payments, and improve platform security. We do <strong>not</strong> sell patient data to third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">4. Data Security</h2>
            <p>We use industry-standard encryption (SSL) and secure servers to protect sensitive health information. Access is restricted to authorized personnel only.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">5. Contact Us</h2>
            <p>If you have questions about this policy, please contact us at <a href="mailto:legal@myclinic.pro" className="text-blue-500 hover:underline">legal@myclinic.pro</a>.</p>
          </section>
        </div>

      </div>
    </div>
  );
}