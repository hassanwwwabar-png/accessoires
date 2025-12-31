import { getClientId } from "@/app/actions";
import { redirect } from "next/navigation";
import { SupportView } from "@/components/dashboard/support-view"; // ✅ استيراد المكون الجديد

export default async function SupportPage() {
  const clientId = await getClientId();
  if (!clientId) redirect("/login");

  return <SupportView />;
}