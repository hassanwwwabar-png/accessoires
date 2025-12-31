"use client";

import { usePathname } from "next/navigation";
import PaymentScreen from "./PaymentScreen";

export default function SuspensionGuard({ 
  isSuspended, 
  config, 
  children 
}: { 
  isSuspended: boolean;
  config: any;
  children: React.ReactNode; 
}) {
  const pathname = usePathname();

  // الصفحات المسموح بها للموقوفين
  const isAllowed = pathname.includes("/subscription") || pathname.includes("/messages");

  if (isSuspended && !isAllowed) {
    return <PaymentScreen config={config} />;
  }

  return <>{children}</>;
}