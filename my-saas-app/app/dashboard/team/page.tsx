import { UserPlus, Shield, User } from "lucide-react";

export default function TeamPage() {
  // بيانات وهمية (Mock Data) لأننا لم نقم بنظام Auth كامل بعد
  const teamMembers = [
    { id: 1, name: "Dr. Ahmed Benali", role: "Doctor (Owner)", email: "doctor@clinic.com", status: "Active" },
    { id: 2, name: "Fatima Zahra", role: "Secretary", email: "sec@clinic.com", status: "Active" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
          <p className="text-slate-500 text-sm">Manage access for your staff.</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800">
          <UserPlus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {member.name[0]}
                  </div>
                  <span className="font-medium text-slate-900">{member.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                  {member.role.includes("Doctor") ? <Shield className="w-3 h-3 text-blue-500" /> : <User className="w-3 h-3 text-slate-400" />}
                  {member.role}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{member.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}