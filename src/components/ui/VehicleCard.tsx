import Link from "next/link";
import { Users, Briefcase, Star, ArrowRight } from "lucide-react";
import { AppImage } from "@/components/ui/AppImage";
import { getVehicleImage } from "@/lib/images";
import { DEFAULT_BOOKING_URL } from "@/lib/booking-url";
import type { VehicleRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  vehicle: VehicleRecord;
  featured?: boolean;
  className?: string;
};

export function VehicleCard({ vehicle, featured, className }: Props) {
  const imageSrc = vehicle.imageUrl || getVehicleImage(vehicle.slug);

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300",
        featured
          ? "border-emerald-200 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/20"
          : "border-slate-200 shadow-sm hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5",
        className
      )}
    >
      {featured && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
          Most popular
        </div>
      )}

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <AppImage
          src={imageSrc}
          alt={`${vehicle.name} - ${vehicle.example}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-slate-900">{vehicle.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{vehicle.example}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
            <Users className="h-3.5 w-3.5 text-emerald-600" />
            {vehicle.passengers} passengers
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
            <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
            {vehicle.luggage} bags
          </span>
        </div>

        <Link href={DEFAULT_BOOKING_URL} className="btn-primary mt-5 w-full gap-2">
          Get a quote
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export function TestimonialCard({
  name,
  route,
  text,
  rating,
}: {
  name: string;
  route: string;
  text: string;
  rating: number;
}) {
  return (
    <div className="card-hover flex h-full flex-col">
      <div className="flex gap-0.5">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">&ldquo;{text}&rdquo;</p>
      <div className="mt-6 border-t border-slate-100 pt-4">
        <p className="font-semibold text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">{route}</p>
      </div>
    </div>
  );
}
