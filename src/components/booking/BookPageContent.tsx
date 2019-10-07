"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { buildBookingUrlFromLabels, QUICK_BOOK_ROUTES } from "@/lib/booking-url";
import { useSearchParams } from "next/navigation";

export function BookPageContent() {
  const searchParams = useSearchParams();
  const hasJourney = Boolean(searchParams.get("pickup") && searchParams.get("dropoff"));

  if (hasJourney) {
    return <BookingFlow />;
  }

  return (
    <>
      <section className="gradient-hero relative text-white">
        <div className="gradient-hero-overlay absolute inset-0 bg-slate-900/80" />
        <div className="gradient-hero-content page-container relative py-10 sm:py-14">
          <span className="badge-brand">Instant quote</span>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
            Get your fixed-price airport transfer
          </h1>
          <p className="mt-3 max-w-xl text-slate-300">
            Enter your journey below or pick a popular route. No sign-up, no third-party checkout - live demo pricing in seconds.
          </p>
        </div>
      </section>

      <section className="page-container py-8 pb-12 sm:py-10 sm:pb-14">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-3">
            <BookingWidget
              defaultPickup="Guarulhos Airport"
              defaultDropoff="Centro de São Paulo"
            />
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                label="Quick routes"
                title="Popular journeys"
                subtitle="One click to see live vehicle prices."
              />
              <div className="mt-5 space-y-2">
                {QUICK_BOOK_ROUTES.map((route) => {
                  const href = buildBookingUrlFromLabels(route.pickup, route.dropoff);
                  if (!href) return null;

                  return (
                    <Link
                      key={route.label}
                      href={href}
                      className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      {route.label}
                      <ArrowRight className="h-4 w-4 shrink-0 text-emerald-600" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
