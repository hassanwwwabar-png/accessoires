import { getClientId } from "@/app/actions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingsView } from "@/components/dashboard/settings-view";

export default async function SettingsPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  // جلب بيانات الطبيب الحالية
  const client = await db.client.findUnique({
    where: { id: clientId }
  });

  if (!client) redirect("/login");

  return (
    <div className="animate-in fade-in duration-500">
      <SettingsView client={client} />
    </div>
  );
}