import { prisma } from "@/lib/prisma";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { VehicleCard } from "@/components/ui/VehicleCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppImage } from "@/components/ui/AppImage";
import { IMAGES } from "@/lib/images";
import type { VehicleRecord } from "@/lib/types";

export const metadata = {
  title: "Our Fleet",
  description: "Choose from saloon, estate, MPV, business class and 8-seater vehicles for your airport transfer.",
};

export default async function FleetPage() {
  const vehicles = await prisma.vehicleType.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <section className="gradient-hero relative text-white">
        <div className="gradient-hero-bg">
          <AppImage src={IMAGES.driver} alt="Professional transfer fleet" fill priority sizes="100vw" />
          <div className="gradient-hero-overlay" />
        </div>
        <div className="gradient-hero-content page-container py-10 sm:py-14">
          <span className="badge-brand">Our fleet</span>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Choose the right vehicle</h1>
          <p className="mt-3 max-w-xl text-slate-300">
            Five vehicle types, fixed prices, vetted drivers - pick what fits your group and luggage.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="page-container">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionHeader
                title="All vehicles"
                subtitle="Every vehicle includes a licensed driver, flight monitoring, and all-inclusive pricing."
              />
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {vehicles.map((v: VehicleRecord, i: number) => (
                  <VehicleCard key={v.id} vehicle={v} featured={i === 0} />
                ))}
              </div>
            </div>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <BookingWidget compact />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
