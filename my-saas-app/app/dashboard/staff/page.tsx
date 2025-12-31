import { Users } from "lucide-react";

export default function StaffPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><Users className="w-8 h-8"/> Staff Management</h1>
      <div className="bg-blue-50 text-blue-800 p-6 rounded-xl border border-blue-200">
        <h3 className="font-bold">Coming Soon</h3>
        <p>You will be able to add nurses and secretaries here.</p>
      </div>
    </div>
  );
}