"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { PhoneLink } from "@/components/ui/PhoneLink";

export function MobileCallButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <PhoneLink
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-700 active:scale-95 md:hidden"
    >
      <Phone className="h-6 w-6" />
    </PhoneLink>
  );
}
