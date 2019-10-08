"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, Phone, X, Car, Shield } from "lucide-react";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/fleet", label: "Our Fleet" },
  { href: "/locations/guarulhos-airport", label: "Airports" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <>
      {/* Trust bar */}
      <div className="hidden border-b border-slate-800 bg-[#0c1222] py-2 text-xs text-slate-400 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              Licensed Transfer Operator · Brazil
            </span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Trusted since {SITE.founded}</span>
          </div>
          <PhoneLink className="flex items-center gap-1.5 font-medium text-white transition hover:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            24/7 Dispatch · {SITE.phone}
          </PhoneLink>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-lg"
            : "border-b border-transparent bg-white"
        )}
      >
        <div className="page-container flex items-center justify-between py-3 sm:py-3.5">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition group-hover:shadow-emerald-600/40">
              <Car className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-sm font-bold leading-tight text-slate-900">
                {SITE.name}
              </p>
              <p className="text-[11px] font-medium text-emerald-600">Fixed prices · No surge</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <PhoneLink className="btn-ghost hidden lg:inline-flex">
              <Phone className="h-4 w-4 text-emerald-600" />
              {SITE.phone}
            </PhoneLink>
            <Link href="/book" className="btn-primary px-5 py-2.5">
              Get a Quote
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <PhoneLink
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
              aria-label={`WhatsApp ${SITE.phone}`}
            >
              <Phone className="h-4 w-4" />
            </PhoneLink>
            <Link href="/book" className="btn-primary px-4 py-2 text-xs">
              Quote
            </Link>
            <button
              type="button"
              className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 lg:hidden",
            open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0 border-transparent"
          )}
        >
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <PhoneLink className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900">
              <Phone className="h-4 w-4 text-emerald-600" />
              Call {SITE.phone}
            </PhoneLink>
            <Link
              href="/book"
              className="btn-primary mt-2 w-full"
              onClick={() => setOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
