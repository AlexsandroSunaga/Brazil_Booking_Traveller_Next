import type { AnchorHTMLAttributes, ReactNode } from "react";
import { SITE } from "@/lib/constants";
import { cn, getWhatsAppHref } from "@/lib/utils";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

export function PhoneLink({ children, className, href, target, rel, ...props }: Props) {
  return (
    <a
      href={href ?? getWhatsAppHref(SITE.phoneWhatsApp, SITE.whatsappMessage)}
      target={target ?? "_blank"}
      rel={rel ?? "noopener noreferrer"}
      className={cn(className)}
      aria-label={`WhatsApp ${SITE.phone}`}
      {...props}
    >
      {children}
    </a>
  );
}
