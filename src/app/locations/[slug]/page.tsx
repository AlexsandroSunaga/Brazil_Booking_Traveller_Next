import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { AIRPORTS, DESTINATIONS } from "@/lib/constants";
import { buildBookingUrlFromLabels } from "@/lib/booking-url";
import { getAirportImage } from "@/lib/images";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { AppImage } from "@/components/ui/AppImage";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return AIRPORTS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const airport = AIRPORTS.find((a) => a.slug === slug);
  if (!airport) return { title: "Location Not Found" };

  return {
    title: `${airport.fullName} Taxi & Transfer | Fixed Prices`,
    description: `Book fixed-price ${airport.name} airport transfers 24/7. Door-to-door service, free flight monitoring, no surge pricing.`,
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const airport = AIRPORTS.find((a) => a.slug === slug);
  if (!airport) notFound();

  return (
    <>
      <section className="gradient-hero relative text-white">
        <div className="gradient-hero-bg">
          <AppImage src={getAirportImage(airport.code)} alt={airport.fullName} fill priority sizes="100vw" />
          <div className="gradient-hero-overlay" />
        </div>
        <div className="gradient-hero-content page-container py-10 sm:py-14">
          <div className="mb-8 lg:hidden">
            <BookingWidget defaultPickup={`${airport.fullName}`} />
          </div>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="max-w-xl">
              <span className="badge-brand">{airport.code}</span>
              <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
                {airport.fullName} Transfers
              </h1>
              <p className="mt-4 text-base text-slate-300 sm:text-lg">
                Fixed price door-to-door transfers. No surge, free flight monitoring, 24/7 dispatch.
              </p>
              <ul className="mt-6 space-y-2">
                {["Instant fixed-price quotes", "Free cancellation", "Meet & greet available", "All Brazil destinations"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-200">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden lg:block">
              <BookingWidget defaultPickup={`${airport.fullName}`} />
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="page-container">
          <SectionHeader title={`Popular destinations from ${airport.name}`} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DESTINATIONS.map((loc) => {
              const quoteHref =
                buildBookingUrlFromLabels(airport.fullName, loc.name) ?? "/book";

              return (
              <Link
                key={loc.slug}
                href={quoteHref}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:shadow-md"
              >
                <span className="font-semibold text-slate-900">{airport.name} → {loc.name}</span>
                <ArrowRight className="h-4 w-4 text-emerald-600" />
              </Link>
              );
            })}
          </div>

          <div className="mt-12">
            <SectionHeader title="Other airports we serve" />
            <div className="mt-6 flex flex-wrap gap-2">
              {AIRPORTS.filter((a) => a.slug !== slug).map((a) => (
                <Link
                  key={a.slug}
                  href={`/locations/${a.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
                >
                  {a.name} ({a.code})
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
