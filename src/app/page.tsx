import Link from "next/link";
import {
  Shield,
  Clock,
  Plane,
  Star,
  CheckCircle2,
  Phone,
  ArrowRight,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { AppImage } from "@/components/ui/AppImage";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { AirportCard } from "@/components/ui/AirportCard";
import { VehicleCard, TestimonialCard } from "@/components/ui/VehicleCard";
import {
  SITE,
  AIRPORTS,
  FAQ_ITEMS,
  HOW_IT_WORKS,
  POPULAR_ROUTES,
  STATS,
  TESTIMONIALS,
} from "@/lib/constants";
import { buildBookingUrlFromLabels } from "@/lib/booking-url";
import { IMAGES } from "@/lib/images";
import { prisma } from "@/lib/prisma";
import type { VehicleRecord } from "@/lib/types";

async function getVehicles() {
  return prisma.vehicleType.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export default async function HomePage() {
  const vehicles = await getVehicles();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: SITE.name,
    description: "Fixed price airport transfers across Brazil",
    telephone: SITE.phone,
    email: SITE.email,
    areaServed: "Brazil",
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE.rating,
      reviewCount: SITE.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero with background image */}
      <section className="gradient-hero relative min-h-[520px] overflow-hidden text-white sm:min-h-[560px]">
        <div className="gradient-hero-bg">
          <AppImage src={IMAGES.hero} alt={IMAGES.heroAlt} fill priority sizes="100vw" />
          <div className="gradient-hero-overlay" />
        </div>

        <div className="gradient-hero-content page-container py-10 sm:py-14 lg:py-16">
          {/* Mobile: booking widget first */}
          <div className="mb-8 lg:hidden">
            <BookingWidget />
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="max-w-xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="badge-brand">Trusted since {SITE.founded}</span>
                <span className="badge-gold inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {SITE.rating} · {SITE.reviewCount.toLocaleString()}+ reviews
                </span>
              </div>

              <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Fixed price airport transfers,{" "}
                <span className="text-emerald-400">24/7</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
                Door-to-door to every major Brazilian airport. One clear price - no surge, no surprises.
              </p>

              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {[
                  "Instant fixed-price quotes",
                  "No surge - ever",
                  "24/7 human dispatch",
                  "Free flight monitoring",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-200">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>

              <PhoneLink className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20">
                <Phone className="h-4 w-4" />
                Call {SITE.phone}
              </PhoneLink>
            </div>

            {/* Desktop booking widget */}
            <div className="hidden lg:block">
              <BookingWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="page-container -mt-5 pb-2 sm:-mt-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 shadow-lg sm:grid-cols-4 sm:rounded-2xl">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-white px-3 py-4 text-center sm:px-6 sm:py-5">
              <p className="font-display text-xl font-bold text-emerald-600 sm:text-2xl">{stat.value}</p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-500 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="page-container">
          <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-8">
            {[
              { icon: Shield, text: "Licensed & insured" },
              { icon: Clock, text: "Free cancellation" },
              { icon: Plane, text: "Flight monitoring" },
              { icon: CheckCircle2, text: "All-inclusive price" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:text-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <Icon className="h-4 w-4 text-emerald-600" />
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="page-section bg-white">
        <div className="page-container">
          <SectionHeader
            label="Simple process"
            title="Four steps. Zero stress."
            subtitle="From quote to pickup - we've refined every step over nine years."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 font-display text-sm font-bold text-white">
                  {item.step}
                </div>
                <h3 className="font-display font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Airports */}
      <section className="page-section bg-slate-900">
        <div className="page-container">
          <SectionHeader
            label="Coverage"
            title="Every airport. Every doorstep."
            subtitle="Door-to-door transfers to all major Brazilian airports."
            dark
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AIRPORTS.map((airport) => (
              <AirportCard key={airport.slug} {...airport} dark />
            ))}
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section className="page-section">
        <div className="page-container">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              label="Our fleet"
              title="Pick the right vehicle"
              subtitle="Same vetted drivers - choose what fits your group and luggage."
            />
            <Link href="/fleet" className="btn-secondary shrink-0 self-start sm:self-auto">
              View all
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.slice(0, 3).map((v: VehicleRecord, i: number) => (
              <VehicleCard key={v.id} vehicle={v} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Why us + image */}
      <section className="page-section bg-emerald-50/60">
        <div className="page-container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <AppImage
                src={IMAGES.driver}
                alt="Professional airport transfer driver"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <SectionHeader
                label="Our promise"
                title="No surge pricing. Ever."
                subtitle="The price you see when you book is the price you pay - rain, rush hour, or bank holidays."
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: TrendingUp, title: "Fixed price", desc: "Locked at booking" },
                  { icon: Shield, title: "No surge", desc: "Same fare 24/7" },
                  { icon: CheckCircle2, title: "All-inclusive", desc: "Tolls & waiting included" },
                  { icon: Star, title: "Price match", desc: "Beat us by 5% - we match" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-xl bg-white p-4 shadow-sm">
                    <item.icon className="h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="page-section bg-white">
        <div className="page-container">
          <SectionHeader
            label="Reviews"
            title="Trusted by Brazil travellers"
            align="center"
            className="text-center"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* Routes table */}
      <section className="page-section border-t border-slate-200">
        <div className="page-container">
          <SectionHeader label="Popular routes" title="Where our customers go most" />
          <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">From</th>
                    <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">To</th>
                    <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Distance</th>
                    <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Time</th>
                    <th className="px-4 py-3 sm:px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {POPULAR_ROUTES.map((route) => {
                    const quoteHref =
                      buildBookingUrlFromLabels(route.from, route.to) ?? "/book";

                    return (
                    <tr key={`${route.from}-${route.to}`} className="hover:bg-emerald-50/40">
                      <td className="px-4 py-3.5 font-medium sm:px-6">{route.from}</td>
                      <td className="px-4 py-3.5 text-slate-600 sm:px-6">{route.to}</td>
                      <td className="px-4 py-3.5 text-slate-600 sm:px-6">{route.km} km</td>
                      <td className="px-4 py-3.5 text-slate-600 sm:px-6">~{route.minutes} min</td>
                      <td className="px-4 py-3.5 sm:px-6">
                        <Link href={quoteHref} className="font-semibold text-emerald-600 hover:text-emerald-700">
                          Quote →
                        </Link>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="page-section bg-white">
        <div className="page-container max-w-3xl">
          <SectionHeader label="FAQ" title="Common questions" align="center" className="text-center" />
          <div className="mt-8">
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero relative py-14 sm:py-16">
        <div className="gradient-hero-bg">
          <AppImage src={IMAGES.airport} alt="" fill sizes="100vw" className="opacity-30" />
          <div className="gradient-hero-overlay" />
        </div>
        <div className="gradient-hero-content page-container text-center">
          <MapPin className="mx-auto h-10 w-10 text-emerald-400" />
          <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
            Got a flight to catch?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-slate-300">
            Fixed-price quote in 60 seconds, or call our 24/7 dispatch team.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/book" className="btn-primary w-full max-w-xs bg-white text-emerald-800 hover:bg-slate-50 sm:w-auto">
              Get a quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <PhoneLink className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white sm:w-auto">
              <Phone className="h-4 w-4" />
              {SITE.phone}
            </PhoneLink>
          </div>
        </div>
      </section>
    </>
  );
}
