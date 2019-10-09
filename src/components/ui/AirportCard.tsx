import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppImage } from "@/components/ui/AppImage";
import { getAirportImage } from "@/lib/images";
import { buildBookingUrlFromLabels } from "@/lib/booking-url";
import { cn } from "@/lib/utils";

type Props = {
  code: string;
  name: string;
  fullName: string;
  slug: string;
  dark?: boolean;
};

export function AirportCard({ code, name, fullName, slug, dark = false }: Props) {
  const quoteHref =
    buildBookingUrlFromLabels(fullName, "Centro de São Paulo") ?? `/locations/${slug}`;

  return (
    <Link
      href={quoteHref}
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-all duration-300",
        dark
          ? "border-white/10 bg-white/5 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
          : "border-slate-200 bg-white hover:border-emerald-200 hover:shadow-lg"
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <AppImage
          src={getAirportImage(code)}
          alt={fullName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <span className="absolute left-4 top-4 rounded-lg bg-emerald-600 px-2.5 py-1 font-display text-xs font-bold text-white">
          {code}
        </span>
      </div>
      <div className={cn("p-5", dark && "text-white")}>
        <h3 className={cn("font-display text-lg font-bold", !dark && "text-slate-900 group-hover:text-emerald-700")}>
          {name}
        </h3>
        <p className={cn("mt-1 text-sm", dark ? "text-slate-400" : "text-slate-500")}>{fullName}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-500 group-hover:gap-2 transition-all">
          Get a quote <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
