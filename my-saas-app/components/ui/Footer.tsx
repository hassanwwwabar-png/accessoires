import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-center">
      <div className="flex justify-center gap-6 mb-4 text-sm font-medium text-slate-600 dark:text-slate-400">
        <Link href="/privacy" className="hover:text-blue-600 hover:underline">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-blue-600 hover:underline">Terms of Service</Link>
        <Link href="/portal" className="hover:text-blue-600 hover:underline">Patient Portal</Link>
      </div>
      <p className="text-xs text-slate-400">
        &copy; {new Date().getFullYear()} MyClinic.pro. All rights reserved.
      </p>
    </footer>
  );
}