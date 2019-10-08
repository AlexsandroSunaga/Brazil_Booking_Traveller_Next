"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Mail, MapPin, Phone, ArrowRight, CreditCard } from "lucide-react";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { SITE, AIRPORTS } from "@/lib/constants";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#0c1222] text-slate-400">
      {/* CTA strip */}
      <div className="border-b border-white/10 bg-gradient-to-r from-emerald-900/40 to-transparent">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div>
            <p className="font-display text-lg font-bold text-white">Ready to book your transfer?</p>
            <p className="mt-1 text-sm text-slate-400">Fixed price quote in under 60 seconds</p>
          </div>
          <Link href="/book" className="btn-primary shrink-0 gap-2">
            Get instant quote
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Car className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display font-bold text-white">{SITE.name}</p>
                <p className="text-xs text-slate-500">Since {SITE.founded}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed">
              Fixed price airport transfers across Brazil. No surge pricing, free flight monitoring, 24/7 human support.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <CreditCard className="h-4 w-4" />
              Pay online, cash or card to driver
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Airports
            </h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {AIRPORTS.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/locations/${a.slug}`}
                    className="transition hover:text-emerald-400"
                  >
                    {a.fullName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li><Link href="/book" className="transition hover:text-emerald-400">Book Online</Link></li>
              <li><Link href="/fleet" className="transition hover:text-emerald-400">Our Fleet</Link></li>
              <li><Link href="/#how-it-works" className="transition hover:text-emerald-400">How It Works</Link></li>
              <li><Link href="/#faq" className="transition hover:text-emerald-400">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <PhoneLink className="flex items-center gap-3 transition hover:text-white">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                    <Phone className="h-4 w-4 text-emerald-400" />
                  </span>
                  <span>
                    <span className="block text-xs text-slate-500">24/7 Dispatch</span>
                    {SITE.phone}
                  </span>
                </PhoneLink>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-3 transition hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                    <Mail className="h-4 w-4 text-emerald-400" />
                  </span>
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                </span>
                {SITE.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Licensed transfer operator · Fully insured fleet</p>
        </div>
      </div>
    </footer>
  );
}
