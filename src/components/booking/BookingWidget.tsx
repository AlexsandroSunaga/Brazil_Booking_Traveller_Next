"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  Clock,
  ArrowDownUp,
  Zap,
  Shield,
  BadgeCheck,
  Car,
  Loader2,
} from "lucide-react";
import { LocationSearch } from "./LocationSearch";
import { resolvePlaceFromText } from "@/lib/google-maps";
import { navigateToQuote } from "@/lib/booking-url";
import type { PlaceResult } from "@/lib/google-maps";

type Props = {
  compact?: boolean;
  defaultPickup?: string;
  defaultDropoff?: string;
};

export function BookingWidget({ compact = false, defaultPickup = "", defaultDropoff = "" }: Props) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [pickup, setPickup] = useState(defaultPickup);
  const [dropoff, setDropoff] = useState(defaultDropoff);
  const [pickupPlace, setPickupPlace] = useState<PlaceResult | null>(null);
  const [dropoffPlace, setDropoffPlace] = useState<PlaceResult | null>(null);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("12:00");
  const [isReturn, setIsReturn] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (defaultPickup && !pickupPlace) {
      const place = resolvePlaceFromText(defaultPickup);
      if (place) {
        setPickupPlace(place);
        setPickup(place.address);
      }
    }
    if (defaultDropoff && !dropoffPlace) {
      const place = resolvePlaceFromText(defaultDropoff);
      if (place) {
        setDropoffPlace(place);
        setDropoff(place.address);
      }
    }
  }, [defaultPickup, defaultDropoff, pickupPlace, dropoffPlace]);

  function swapLocations() {
    setPickup(dropoff);
    setDropoff(pickup);
    setPickupPlace(dropoffPlace);
    setDropoffPlace(pickupPlace);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const resolvedPickup = pickupPlace ?? resolvePlaceFromText(pickup);
    const resolvedDropoff = dropoffPlace ?? resolvePlaceFromText(dropoff);

    if (!pickup.trim() || !dropoff.trim()) {
      setError("Please enter both pickup and drop-off locations.");
      return;
    }

    if (!resolvedPickup || !resolvedDropoff) {
      setError("We couldn't match those locations. Try a suggestion like Guarulhos Airport or Centro de São Paulo.");
      return;
    }

    if (resolvedPickup.address === resolvedDropoff.address) {
      setError("Pickup and drop-off must be different locations.");
      return;
    }

    setSubmitting(true);
    router.push(
      navigateToQuote(resolvedPickup, resolvedDropoff, {
        date,
        time,
        isReturn,
      })
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full rounded-2xl border border-white/20 bg-white shadow-2xl ${compact ? "p-4 sm:p-5" : "p-5 sm:p-6"}`}
    >
      {!compact && (
        <div className="mb-5">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Zap className="h-3.5 w-3.5" />
            Instant quote
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
            Get your fixed price
          </h2>
          <p className="mt-1 text-sm text-slate-500">Takes 20 seconds · No card required</p>
        </div>
      )}

      <div className="space-y-1">
        <LocationSearch
          label="Pickup location"
          value={pickup}
          onChange={(v) => {
            setPickup(v);
            if (!v) setPickupPlace(null);
          }}
          onSelect={setPickupPlace}
          icon="pickup"
          placeholder="Airport, address or neighbourhood"
        />

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-gradient-to-r from-emerald-300 to-slate-200" />
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
              A
            </span>
            <Car className="h-4 w-4 text-slate-500" aria-hidden />
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
              B
            </span>
          </div>
          <button
            type="button"
            onClick={swapLocations}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-emerald-300 hover:text-emerald-600"
            aria-label="Swap pickup and drop-off"
          >
            <ArrowDownUp className="h-3.5 w-3.5" />
          </button>
          <div className="h-px flex-1 bg-gradient-to-l from-amber-300 to-slate-200" />
        </div>

        <LocationSearch
          label="Drop-off location"
          value={dropoff}
          onChange={(v) => {
            setDropoff(v);
            if (!v) setDropoffPlace(null);
          }}
          onSelect={setDropoffPlace}
          icon="dropoff"
          placeholder="Destination address"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <Calendar className="h-4 w-4 text-slate-400" />
            Date
          </label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <Clock className="h-4 w-4 text-slate-400" />
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="input-field"
            required
          />
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 sm:px-4">
        <input
          type="checkbox"
          checked={isReturn}
          onChange={(e) => setIsReturn(e.target.checked)}
          className="h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600"
        />
        <span className="text-sm font-medium text-slate-800">Return journey</span>
        <span className="ml-auto shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
          Save 15%
        </span>
      </label>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary mt-4 w-full py-3.5 text-base">
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Calculating fare…
          </>
        ) : (
          <>
            Get instant fare
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      <div className="mt-4 grid grid-cols-3 gap-1 border-t border-slate-100 pt-4">
        {[
          { icon: Zap, text: "Fixed price" },
          { icon: Shield, text: "Free cancel" },
          { icon: BadgeCheck, text: "No surge" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex flex-col items-center gap-1 text-center">
            <Icon className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-[10px] font-medium text-slate-500 sm:text-[11px]">{text}</span>
          </div>
        ))}
      </div>
    </form>
  );
}
