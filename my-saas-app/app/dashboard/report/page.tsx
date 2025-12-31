import { getClientId } from "@/app/actions";
import { redirect } from "next/navigation";
import { SupportView } from "@/components/dashboard/support-view"; // ✅ On utilise la vue Support ici

export default async function ReportsPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  return (
    <div className="animate-in fade-in duration-500">
      {/* Cette vue permet de parler à l'Admin */}
      <SupportView />
    </div>
  );
}